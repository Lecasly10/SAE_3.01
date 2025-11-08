<?php

header('Content-Type: application/json');

require_once '../../modele/parkingDAO.class.php';
require_once './distance.php';
require_once './dataAPI.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (isset($data['lat']) && isset($data['lng'])) {
        $lat = floatval($data['lat']);
        $lng = floatval($data['lng']);

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

    } else {
        echo json_encode([
            "status" => "erreur",
            "message" => "JSON invalide"
        ]);
    }

} else {
    http_response_code(405);
    echo json_encode([
        "status" => "erreur",
        "message" => "Méthode non autorisée"
    ]);
}
