<?php

require_once __DIR__ . '/../../modele/parkingCapacityDAO.class.php';
require_once __DIR__ . '/../../modele/parkingTarifDAO.class.php';
require_once __DIR__ . '/./distance.php';
require_once __DIR__ . '/./dataAPI.php';

function createTable(array $lesParkings): array {
    $parkingCapacityDAO = new ParkingCapacityDAO();
    $parkingTarifDAO = new ParkingTarifDAO();
    $res = [];

    foreach ($lesParkings as $parking) {

        $id = $parking->getId();
        $placesObj = $parkingCapacityDAO->getById($id);
        $tarifObj = $parkingTarifDAO->getById($id);
        

        //Parking Info
        $lat  = $parking->getLat();
        $lng = $parking->getLong();
        $name = $parking->getName();
        $url = $parking->getUrl();
        $address = $parking->getAdresse();
        $insee = $parking->getInsee();
        $siret = $parking->getSiret();
        $structure = $parking->getStructure();
        $info = $parking->getInfo();
        $user = $parking->getUserType();
        $maxHeight = $parking->getMaxHeight();

        //Parking Places Info
        $places = $placesObj->getTotal();
        $pmr = $placesObj->getPmr();
        $e2w = $placesObj->getElectric2W();
        $eCar = $placesObj->getElectricCar();
        $moto = $placesObj->getMotorCycle();
        $carpool = $placesObj->getCarPool();
        $bicycle = $placesObj->getBicycle();
        $pr = $placesObj->getPr();
        
        //tarifs
        $isFree = $tarifObj->getFree();
        $pmrRate = $tarifObj->getPmrRate();
        $rate1h = $tarifObj->getRate1h();
        $rate2h = $tarifObj->getRate2h();
        $rate3h = $tarifObj->getRate3h();
        $rate4h = $tarifObj->getRate4h();
        $rate24h = $tarifObj->getRate24h();
        $residentSub = $tarifObj->getResidentSub();
        $nonResidentSub = $tarifObj->getNonResidentSub();

        $pLibre = null;
        try {
            $pLibre = placeLibre($lat, $lng);
        } catch(Exception $e) {
            $pLibre = null;
        }

        $res[] = [
            "id" => $id,
            "nom" => $name,
            "lat" => $lat,
            "lng" => $lng,
            "address" => $address,
            "url" => $url,
            "insee" => $insee,
            "siret" => $siret,
            "structure" => $structure,
            "info" => $info,
            "user" => $user,
            "max_height" => $maxHeight,

            "places" => $places,
            "places_libres" => $pLibre,
            "pmr" => $pmr,
            "e2w" => $e2w,
            "eCar" => $eCar,
            "moto" => $moto,
            "carpool" => $carpool,
            "bicycle" => $bicycle,
            "pr" => $pr,

            "free" => $isFree,
            "pmr_rate" =>$pmrRate,
            "rate_1h" => $rate1h, 
            "rate_2h" => $rate2h,
            "rate_3h" => $rate3h,
            "rate_4h" => $rate4h,
            "rate_24h" => $rate24h,
            "resident_sub" => $residentSub,
            "nonresident_sub" => $nonResidentSub
        ];

    }

    return $res;
}