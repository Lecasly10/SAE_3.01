<?php
require_once __DIR__ . '/../utils/response.php';
require_once __DIR__ . '/../../../modele/php/parkingDAO.class.php';
require_once __DIR__ . '/../../../modele/php/userDAO.class.php';
require_once __DIR__ . '/../../../modele/php/userPrefDAO.class.php';
require_once __DIR__ . '/../distance.php';
require_once __DIR__ . '/../api/dataAPI.php';

session_start();
$user_id = $_SESSION['user_id'] ?? null;

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$lat = isset($data['lat']) ? floatval($data['lat']) : null;
$lng = isset($data['lng']) ? floatval($data['lng']) : null;

if ($lat === null || $lng === null) {
    sendError('Paramètre manquant', ErrorCode::MISSING_ARGUMENTS);
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
        $resp = [
            'id' => $parking->getId(),
            'lat' => $parking->getLat(),
            'lng' => $parking->getLong(),
            'name' => $parking->getName()
        ];

        sendSuccess($resp);
    } else {
        sendError('Parking introuvable', ErrorCode::NOT_FOUND);
    }
} catch (Exception $e) {
    sendError($e->getMessage());
}
