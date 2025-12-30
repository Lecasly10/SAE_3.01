<?php

require_once __DIR__ . '/parking.class.php';
require_once __DIR__ . '/parkingCapacityDAO.class.php';
require_once __DIR__ . '/parkingTarifDAO.class.php';
require_once __DIR__ . '/../../controller/php/distance.php';

class ParkingDAO
{
    private $bd;
    private $select;

    public function __construct()
    {
        require_once __DIR__ . '/connexion.php';
        $this->bd = new Connexion();
        $this->select = 'SELECT * FROM parkings';
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

    function getById(string $id): Parking
    {
        $unParking = new Parking();
        $lesParkings = $this->loadQuery($this->bd->execSQL($this->select . ' WHERE
        parking_id=:id', [':id' => $id]));
        if (count($lesParkings) > 0) {
            $unParking = $lesParkings[0];
        }
        return $unParking;
    }

    function getSearch(string $search): array
    {
        $r = $this->select . ' WHERE name LIKE :search';
        return $this->loadQuery(
            $this->bd->execSQL($r, [':search' => "%$search%"])
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
}
