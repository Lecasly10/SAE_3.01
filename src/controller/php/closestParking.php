<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');
session_start();

$user_id = $_SESSION['user_id'] ?? null;

require_once __DIR__ . '/../../modele/php/parkingDAO.class.php';
require_once __DIR__ . '/../../modele/php/userDAO.class.php';
require_once __DIR__ . '/../../modele/php/userPrefDAO.class.php';
require_once __DIR__ . '/../../modele/php/parkingCapacityDAO.class.php';
require_once __DIR__ . '/../../modele/php/parkingTarifDAO.class.php';
require_once __DIR__ . '/./distance.php';
require_once __DIR__ . '/./dataAPI.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$lat = isset($data['lat']) ? floatval($data['lat']) : null;
$lng = isset($data['lng']) ? floatval($data['lng']) : null;
$test = 0;

if ($lat === null || $lng === null) {
    echo json_encode([
        'status' => 'erreur',
        'message' => 'Paramètres manquants'
    ]);
    exit;
}

try {
    $closeParking = null;
    $parkings = null;
    $minDist = PHP_INT_MAX;
    $userDAO = new UserPrefDAO();
    $parkingCapDAO = new ParkingCapacityDAO();
    $parkingTarifDAO = new ParkingTarifDAO();
    if ($user_id)
        $user = $userDAO->getById($user_id);

    $pfilters = [];

    if ($user) {
        if ($user->getPreferCovered()) {
            $pfilters['structure_type'] = 'enclos_en_surface';
        }
    }

    $parkings = (new ParkingDAO())->getBy($pfilters);

    if (!$parkings) {
        echo json_encode([
            'status' => 'fail',
            'message' => 'Aucun parking trouvé'
        ]);
        exit;
    }

    foreach ($parkings as $parking) {
        $nextLat = $parking->getLat();
        $nextLng = $parking->getLong();

        $cap = $parkingCapDAO->getById($parking->getId());
        $tarif = $parkingTarifDAO->getById($parking->getId());

        if ($user) {
            if ($user->getPreferFree() && !$tarif->getFree())
                continue;

            if ($user->getIsPmr() && !$cap->getPmr() < 1)
                continue;

            $hour = $tarif->getRate1h();
            $maxHour = $user->getMaxHourlyBudget();
            $maxHour = $maxHour == 0 ? null : $maxHour;

            if ($maxHour && $hour < $maxHour)
                continue;
        }

        $city = detectCity($nextLat, $nextLng);
        if (!$city)
            continue;

        $places = null;
        try {
            $places = placeLibre($city, $nextLat, $nextLng);
        } catch (Exception $e) {
            $places = null;
        }

        $places = $places ?? -1;

        if ($places > 0 || $places == -1) {
            $dist = distanceGPS($nextLat, $nextLng, $lat, $lng);
            if ($user) {
                $maxD = $user->getMaxDistance();
                $maxD = $maxD == 0 ? null : $maxD;

                if ($maxD && $dist > $maxD)
                    continue;
            }

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
            'status' => 'fail',
            'message' => 'Aucun parking disponible à proximité',
            'places' => $test
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'fail',
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
