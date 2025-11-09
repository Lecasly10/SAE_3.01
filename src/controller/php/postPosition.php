<?php

require_once '../../modele/parkingDAO.class.php';
require_once './distance.php';
require_once './dataAPI.php';

$lat = floatval($_POST['lat']) ?? null;
$lng = floatval($_POST['lng']) ?? null;

if (isset($lat) && isset($lng)) {

    $closeParking=null;
    $minDist = PHP_INT_MAX; 

    $parkings = new ParkingDAO()->getAll(); 

    foreach ($parkings as $parking) {
        $nextLat = $parking->getLat();
        $nextLng = $parking->getLong();

           
        $places = placeLibre($nextLat, $nextLng); 

        if ($places > 0) { 
            $dist = distanceGPS($nextLat, $nextLng, $lat, $lng);

            if ($dist < $minDist) {
                $minDist = $dist;
                $closeParking=$parking;
            }
        }
    }

    header('Content-Type: application/json');

    if (isset($closeParking)) {
        echo json_encode([
            "status" => "ok",
            "message" => "Parking le plus proche trouvé",
            "lat" => $closeParking->getLat(),
            "lng" => $closeParking->getLong(),
            "name" => $closeParking->getName()
        ]);
    } else {
        echo json_encode([
            "status" => "erreur",
            "message" => "Aucun parking disponible à proximité"
        ]);
    }

} 
