<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

require_once __DIR__ . '/../../modele/php/parkingDAO.class.php';
require_once __DIR__ . '/./distance.php';
require_once __DIR__ . '/./dataAPI.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$lat = isset($data['lat']) ? floatval($data['lat']) : null;
$lng = isset($data['lng']) ? floatval($data['lng']) : null;

if ($lat === null || $lng === null) {
    echo json_encode([
        'status' => 'erreur',
        'message' => 'Paramètres manquants'
    ]);
    exit;
}

try {
    $closeParking = null;
    $minDist = PHP_INT_MAX;

    $parkings = (new ParkingDAO())->getAll();

    if (!$parkings) {
        echo json_encode([
            'status' => 'erreur',
            'message' => 'Aucun parking trouvé'
        ]);
        exit;
    }

    foreach ($parkings as $parking) {
        $nextLat = $parking->getLat();
        $nextLng = $parking->getLong();

        $city = detectCity($nextLat, $nextLng);
        if (!$city)
            continue;

        $places = -1;
        try {
            $places = placeLibre($city, $nextLat, $nextLng);
        } catch (Exception $e) {
            $places = -1;
        }

        if (isset($places) && ($places > 0 || $paces === -1)) {
            $dist = distanceGPS($nextLat, $nextLng, $lat, $lng);

            if ($dist < $minDist) {
                $minDist = $dist;
                $closeParking = $parking;
            }
        }
    }

    if ($closeParking !== null) {
        echo json_encode([
            'status' => 'ok',
            'message' => 'Parking le plus proche trouvé',
            'id' => $closeParking->getId(),
            'lat' => $closeParking->getLat(),
            'lng' => $closeParking->getLong(),
            'name' => $closeParking->getName()
        ]);
    } else {
        echo json_encode([
            'status' => 'erreur',
            'message' => 'Aucun parking disponible à proximité'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'erreur',
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
