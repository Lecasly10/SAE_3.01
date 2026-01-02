<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

require_once __DIR__ . '/../../../modele/php/parkingDAO.class.php';
require_once __DIR__ . '/../../../modele/php/parkingCapacityDAO.class.php';
require_once __DIR__ . '/../distance.php';
require_once __DIR__ . '/../api/dataAPI.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];
$parkingId = $data['id'] ?? null;

if (!$parkingId) {
    echo json_encode([
        'status' => 'erreur',
        'message' => "Paramètre 'id' manquant"
    ]);
    exit;
}

try {
    $parking = (new ParkingDAO())->getAllDataById($parkingId);
    if (!$parking) {
        echo json_encode([
            'status' => 'erreur',
            'message' => 'Aucun parking trouvé'
        ]);
        exit;
    }

    $res = $parking[0];
    echo json_encode([
        'status' => 'ok',
        'message' => 'Parking trouvé',
        'parking' => $res
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'erreur',
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
