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
        $city=detectCity($parking->getLat(), $parking->getLong());
        try {
            if(isset($city)) {
                 $pLibre = placeLibre($city, $parking->getLat(), $parking->getLong());
            }  
        } catch (Exception $e) {
            $pLibre = null;
        }

        $res[] = [
            "id" => $id,
            "nom" => $parking->getName()?? "non renseigné",
            "lat" => $parking->getLat()?? "non renseigné",
            "lng" => $parking->getLong()?? "non renseigné",
            "address" => $parking->getAdresse()?? "non renseigné",
            "url" => $parking->getUrl()?? "non renseigné",
            "insee" => $parking->getInsee()?? "non renseigné",
            "siret" => $parking->getSiret()?? "non renseigné",
            "structure" => $parking->getStructure()?? "non renseigné",
            "info" => $parking->getInfo()?? "non renseigné",
            "user" => $parking->getUserType()?? "non renseigné",
            "max_height" => $parking->getMaxHeight()?? "non renseigné",
            "places" => $placesObj->getTotal()?? "non renseigné",
            "places_libres" => $pLibre?? "non renseigné",
            "pmr" => $placesObj->getPmr()?? "non renseigné",
            "e2w" => $placesObj->getElectric2W()?? "non renseigné",
            "eCar" => $placesObj->getElectricCar()?? "non renseigné",
            "moto" => $placesObj->getMotorCycle()?? "non renseigné",
            "carpool" => $placesObj->getCarPool()?? "non renseigné",
            "bicycle" => $placesObj->getBicycle()?? "non renseigné",
            "pr" => $placesObj->getPr()?? "non renseigné",
            "free" => $tarifObj->getFree()?? "non renseigné",
            "pmr_rate" => $tarifObj->getPmrRate()?? "non renseigné",
            "rate_1h" => $tarifObj->getRate1h()?? "non renseigné",
            "rate_2h" => $tarifObj->getRate2h()?? "non renseigné",
            "rate_3h" => $tarifObj->getRate3h()?? "non renseigné",
            "rate_4h" => $tarifObj->getRate4h()?? "non renseigné",
            "rate_24h" => $tarifObj->getRate24h()?? "non renseigné",
            "resident_sub" => $tarifObj->getResidentSub()?? "non renseigné",
            "nonresident_sub" => $tarifObj->getNonResidentSub()?? "non renseigné"
        ];
    }

    return $res;
}
