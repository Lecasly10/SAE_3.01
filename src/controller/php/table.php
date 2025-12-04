<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../modele/php/parkingCapacityDAO.class.php';
require_once __DIR__ . '/../../modele/php/parkingTarifDAO.class.php';
require_once __DIR__ . '/distance.php';
require_once __DIR__ . '/dataAPI.php';

$cities = [
    'metz' => ['latMin'=>48.9, 'latMax'=>49.2, 'lonMin'=>6.1, 'lonMax'=>6.3],
    'londre' => ['latMin'=>51.4, 'latMax'=>51.7, 'lonMin'=>-0.3, 'lonMax'=>0.2]
];

function detectCity(float $lat, float $lon): ?string {
    global $cities;
    foreach ($cities as $name => $bounds) {
        if ($lat >= $bounds['latMin'] && $lat <= $bounds['latMax'] &&
            $lon >= $bounds['lonMin'] && $lon <= $bounds['lonMax']) {
            return $name;
        }
    }
    return null;
}



function createTable(array $lesParkings): array {

    $parkingCapacityDAO = new ParkingCapacityDAO();
    $parkingTarifDAO = new ParkingTarifDAO();
    $res = [];

    foreach ($lesParkings as $parking) {

        if (!$parking) continue;

        $id = $parking->getId();
        $placesObj = $parkingCapacityDAO->getById($id);
        $tarifObj = $parkingTarifDAO->getById($id);

        if (!$placesObj || !$tarifObj) continue;

        $pLibre = null;
        $city= detectCity($parking->getLat(), $parking->getLong());
        try {
            if($city) {
                 $pLibre = placeLibre($city, $parking->getLat(), $parking->getLong());
            }  
        } catch (Exception $e) {
            $pLibre = null;
        }

        $res[] = [
            "id" => $id,
            "nom" => $parking->getName(),
            "lat" => $parking->getLat(),
            "lng" => $parking->getLong(),
            "address" => $parking->getAdresse(),
            "url" => $parking->getUrl(),
            "insee" => $parking->getInsee(),
            "siret" => $parking->getSiret(),
            "structure" => $parking->getStructure(),
            "info" => $parking->getInfo(),
            "user" => $parking->getUserType(),
            "max_height" => $parking->getMaxHeight(),
            "places" => $placesObj->getTotal(),
            "places_libres" => $pLibre,
            "pmr" => $placesObj->getPmr(),
            "e2w" => $placesObj->getElectric2W(),
            "eCar" => $placesObj->getElectricCar(),
            "moto" => $placesObj->getMotorCycle(),
            "carpool" => $placesObj->getCarPool(),
            "bicycle" => $placesObj->getBicycle(),
            "pr" => $placesObj->getPr(),
            "free" => $tarifObj->getFree(),
            "pmr_rate" => $tarifObj->getPmrRate(),
            "rate_1h" => $tarifObj->getRate1h(),
            "rate_2h" => $tarifObj->getRate2h(),
            "rate_3h" => $tarifObj->getRate3h(),
            "rate_4h" => $tarifObj->getRate4h(),
            "rate_24h" => $tarifObj->getRate24h(),
            "resident_sub" => $tarifObj->getResidentSub(),
            "nonresident_sub" => $tarifObj->getNonResidentSub()
        ];
    }

    return $res;
}
