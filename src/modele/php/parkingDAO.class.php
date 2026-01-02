<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/parking.class.php';
require_once __DIR__ . '/parkingCapacityDAO.class.php';
require_once __DIR__ . '/parkingTarifDAO.class.php';
require_once __DIR__ . '/../../controller/php/distance.php';
require_once __DIR__ . '/../../controller/php/api/dataAPI.php';

class ParkingDAO
{
    private $bd;
    private $select;
    private $fullSelect;

    public function __construct()
    {
        require_once __DIR__ . '/connexion.php';
        $this->bd = new Connexion();
        $this->select = 'SELECT * FROM parkings';
        $this->fullSelect = 'SELECT DISTINCT * FROM parkings
                JOIN parking_rates ON parkings.parking_id=parking_rates.parking_id
                JOIN parking_capacity ON parkings.parking_id=parking_capacity.parking_id';
    }

    private function loadQuery(array $result): array
    {
        $parkings = [];
        foreach ($result as $row) {
            $parking = new Parking();
            $parking->setId($row['parking_id']);
            $parking->setName($row['name']);
            $parking->setInsee($row['insee_code']);
            $parking->setAdresse($row['address']);
            $parking->setUrl($row['url']);
            $parking->setUserType($row['user_type']);
            $parking->setMaxHeight($row['max_height']);
            $parking->setSiret($row['siret_number'] ?? 0);
            $parking->setLong($row['longitude']);
            $parking->setLat($row['latitude']);
            $parking->setStructure($row['structure_type']);
            $parking->setInfo($row['info']);
            $parkings[] = $parking;
        }
        return $parkings;
    }

    function getAll(): array
    {
        return ($this->loadQuery($this->bd->execSQL($this->select)));
    }

    function getAllData(): array
    {
        return $this->createTab($this->bd->execSQL($this->select));
    }

    function getAllDataById(string $id): ?array
    {
        $p = $this->createTab($this->bd->execSQL($this->fullSelect . ' WHERE parking_id=:id', [':id' => $id]), true);
        if (count($p) > 0) {
            return $p[0];
        }
        return null;
    }

    function getById(string $id): ?Parking
    {
        $lesParkings = $this->loadQuery($this->bd->execSQL($this->select . ' WHERE
        parking_id=:id', [':id' => $id]));
        if (count($lesParkings) > 0) {
            return $lesParkings[0];
        }
        return null;
    }

    function getSearch(string $search): ?array
    {
        $mots = array_filter(explode(' ', trim($search)));
        if (empty($mots))
            return null;

        $conditions = [];
        $params = [];

        foreach ($mots as $index => $mot) {
            $conditions[] = "name LIKE :mot$index";
            $params[":mot$index"] = "%$mot%";
        }

        $where = implode(' AND ', $conditions);
        $sql = $this->select . " WHERE $where";

        return $this->createTab(
            $this->bd->execSQL($sql, $params)
        );
    }

    public function getNearbyWithFilters(
        float $userLat,
        float $userLng,
        array $options = [],
        int $limit = 4,
    ): array {
        $parkingTarifDAO = new ParkingTarifDAO();
        $parkingCapDAO = new ParkingCapacityDAO();

        $params = [];
        $where = ' WHERE 1=1';

        $sql = $this->select;

        if (!empty($options['preferCovered'])) {
            $where .= ' AND structure_type = :structure';
            $params[':structure'] = 'enclos_en_surface';
        }

        $results = $this->bd->execSQL($sql . $where, $params);
        $parkings = $this->loadQuery($results);

        $maxDistanceKm = $options['maxDistanceKm'] ?? null;

        if ($maxDistanceKm) {
            $latRange = $maxDistanceKm / 111;
            $lngRange = $maxDistanceKm / (111 * cos(deg2rad($userLat)));
            $parkings = array_filter($parkings, function ($p) use ($userLat, $userLng, $latRange, $lngRange) {
                return ($p->getLat() >= $userLat - $latRange && $p->getLat() <= $userLat + $latRange) &&
                    ($p->getLong() >= $userLng - $lngRange && $p->getLong() <= $userLng + $lngRange);
            });
        }

        $parkings = array_filter($parkings, function ($p) use ($options, $parkingTarifDAO, $parkingCapDAO) {
            $tarif = $parkingTarifDAO->getById($p->getId());
            $cap = $parkingCapDAO->getById($p->getId());

            if (!empty($options['preferFree']) && !$tarif->getFree())
                return false;

            if (!empty($options['isPmr']) && $cap->getPmr() < 1)
                return false;

            if (!empty($options['maxHourlyBudget'])) {
                $maxH = (float) $options['maxHourlyBudget'];
                $prices = [
                    1 => $tarif->getRate1h(),
                    2 => $tarif->getRate2h(),
                    3 => $tarif->getRate3h(),
                    4 => $tarif->getRate4h(),
                    24 => $tarif->getRate24h()
                ];
                $valid = false;
                foreach ($prices as $h => $price) {
                    if ($price !== null && $price <= $maxH * $h) {
                        $valid = true;
                        break;
                    }
                }
                if (!$valid)
                    return false;
            }

            return true;
        });

        usort($parkings, function ($a) use ($userLat, $userLng) {
            return distanceGPS($a->getLat(), $a->getLong(), $userLat, $userLng) <=> distanceGPS($a->getLat(), $a->getLong(), $userLat, $userLng);
        });

        return array_slice($parkings, 0, $limit);
    }

    function createTab($lesParkings, bool $all = false): ?array
    {
        $res = null;
        $data = getApiData();
        foreach ($lesParkings as $parking) {
            if (!$parking)
                continue;

            $id = $parking['parking_id'];
            $lat = $parking['latitude'];
            $lng = $parking['longitude'];

            $pLibre = 0;
            $city = detectCity($lat, $lng);

            try {
                if (isset($city)) {
                    $pLibre = placeLibre($data[$city], $city, $lat, $lng);
                }
            } catch (Exception $e) {
                $pLibre = null;
            }

            $res[] = [
                'id' => $id,
                'nom' => $parking['name'],
                'lat' => $lat,
                'lng' => $lng,
                'address' => $parking['address'],
                'url' => $parking['url'],
                'insee' => $parking['insee_code'],
                'siret' => $parking['siret_number'] ?? 0,
                'structure' => $parking['structure_type'],
                'info' => $parking['info'],
                'user' => $parking['user_type'],
                'places_libres' => $pLibre ?? -1,
            ];

            if ($all) {
                $res[] = [
                    'max_height' => floatval($parking['max_height']),
                    'places' => intval($parking['total_spaces']),
                    'pmr' => intval($parking['pmr_spaces']),
                    'e2w' => intval($parking['electric_2w_spaces']),
                    'eCar' => intval($parking['electric_car_spaces']),
                    'moto' => intval($parking['motorcycle_spaces']),
                    'carpool' => intval($parking['carpool_spaces']),
                    'bicycle' => intval($parking['bicycle_spaces']),
                    'pr' => intval($parking['pr_spaces']),
                    'free' => boolval($parking['is_free']),
                    'pmr_rate' => floatval($parking['pmr_rate']),
                    'rate_1h' => floatval($parking['rate_1h']),
                    'rate_2h' => floatval($parking['rate_2h']),
                    'rate_3h' => floatval($parking['rate_3h']),
                    'rate_4h' => floatval($parking['rate_4h']),
                    'rate_24h' => floatval($parking['rate_24h']),
                    'resident_sub' => floatval($parking['resident_subscription']),
                    'nonresident_sub' => floatval($parking['non_resident_subscription']),
                ];
            }
        }

        return $res;
    }
}
