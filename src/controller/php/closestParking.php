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
    $userDAO = new UserPrefDAO();
    $user = $user_id ? $userDAO->getById($user_id) : null;

    $options = [];
    if ($user) {
        $options = [
            'preferCovered' => $user->getPreferCovered(),
            'preferFree' => $user->getPreferFree(),
            'isPmr' => $user->getIsPmr(),
            'maxHourlyBudget' => $user->getMaxHourlyBudget(),
            'maxDistanceKm' => $user->getMaxDistance()
        ];
    }

    $parkingDAO = new ParkingDAO();
    $closestParkings = $parkingDAO->getNearbyWithFilters($lat, $lng, $options, 1);

    if (count($closestParkings) > 0) {
        $parking = $closestParkings[0];
        echo json_encode([
            'status' => 'success',
            'message' => 'Parking le plus proche trouvé',
            'id' => $parking->getId(),
            'lat' => $parking->getLat(),
            'lng' => $parking->getLong(),
            'name' => $parking->getName()
        ]);
    } else {
        echo json_encode([
            'status' => 'not_found',
            'message' => 'Aucun parking disponible à proximité'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'fail',
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
