<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../../modele/php/parkingCapacityDAO.class.php';
require_once __DIR__ . '/../../modele/php/parkingTarifDAO.class.php';
require_once __DIR__ . '/distance.php';
require_once __DIR__ . '/api/dataAPI.php';

function createTable(array $lesParkings): array
{
    $parkingCapacityDAO = new ParkingCapacityDAO();
    $parkingTarifDAO = new ParkingTarifDAO();
    $res = [];

    foreach ($lesParkings as $parking) {
        if (!$parking)
            continue;

        $id = $parking->getId();
        $placesObj = $parkingCapacityDAO->getById($id);
        $tarifObj = $parkingTarifDAO->getById($id);

        if (!$placesObj || !$tarifObj)
            continue;

        $pLibre = 0;
        $city = detectCity($parking->getLat(), $parking->getLong());
        try {
            if (isset($city)) {
                $pLibre = placeLibre($city, $parking->getLat(), $parking->getLong());
            }
        } catch (Exception $e) {
            $pLibre = null;
        }

        $res[] = [
            'id' => $id,
            'nom' => $parking->getName(),
            'lat' => $parking->getLat(),
            'lng' => $parking->getLong(),
            'address' => $parking->getAdresse(),
            'url' => $parking->getUrl(),
            'insee' => $parking->getInsee(),
            'siret' => $parking->getSiret(),
            'structure' => $parking->getStructure(),
            'info' => $parking->getInfo(),
            'user' => $parking->getUserType(),
            'max_height' => $parking->getMaxHeight(),
            'places' => $placesObj->getTotal(),
            'places_libres' => $pLibre ?? -1,
            'pmr' => $placesObj->getPmr(),
            'e2w' => $placesObj->getElectric2W(),
            'eCar' => $placesObj->getElectricCar(),
            'moto' => $placesObj->getMotorCycle(),
            'carpool' => $placesObj->getCarPool(),
            'bicycle' => $placesObj->getBicycle(),
            'pr' => $placesObj->getPr(),
            'free' => $tarifObj->getFree(),
            'pmr_rate' => $tarifObj->getPmrRate(),
            'rate_1h' => $tarifObj->getRate1h(),
            'rate_2h' => $tarifObj->getRate2h(),
            'rate_3h' => $tarifObj->getRate3h(),
            'rate_4h' => $tarifObj->getRate4h(),
            'rate_24h' => $tarifObj->getRate24h(),
            'resident_sub' => $tarifObj->getResidentSub(),
            'nonresident_sub' => $tarifObj->getNonResidentSub()
        ];
    }

    return $res;
}
