<?php
header('Content-Type: application/json');

require_once '../../modele/parkingDAO.class.php';
require_once './distance.php';
require_once './dataAPI.php';

$lat = isset($_POST['lat']) ? floatval($_POST['lat']) : null;
$lng = isset($_POST['lng']) ? floatval($_POST['lng']) : null;

if ($lat === null || $lng === null) {
    echo json_encode([
        "status" => "erreur",
        "message" => "Paramètres manquants"
    ]);
    exit;
}

try {
    $closeParking = null;
    $minDist = PHP_INT_MAX;

    $parkings = (new ParkingDAO())->getAll();

    if (!$parkings) {
        echo json_encode([
            "status" => "erreur",
            "message" => "Aucun parking trouvé"
        ]);
        exit;
    }

    foreach ($parkings as $parking) {
        $nextLat = $parking->getLat();
        $nextLng = $parking->getLong();

        $places = placeLibre($nextLat, $nextLng);

        if ($places > 0) {
            $dist = distanceGPS($nextLat, $nextLng, $lat, $lng);

            if ($dist < $minDist) {
                $minDist = $dist;
                $closeParking = $parking;
            }
        }
    }

    if ($closeParking !== null) {
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

} catch (Exception $e) {
    echo json_encode([
        "status" => "erreur",
        "message" => "Erreur serveur: " . $e->getMessage()
    ]);
}
