<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

require_once __DIR__ . '/../../../modele/php/vehiculeDAO.class.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];
$userId = $data['id'] ?? null;

if (!$userId) {
    echo json_encode([
        'status' => 'erreur',
        'message' => "Paramètre 'id' manquant"
    ]);
    exit;
}

try {
    $vehDAO = new VehiculeDAO();
    $vehs = $vehDAO->getByUserId($userId);
    $vehs = $vehs ?? [];

    $type = null;
    $motor = null;
    $plate = null;
    $height = null;

    $vehicules = [];

    foreach ($vehs as $v) {
        $vehicules[] = [
            'id' => $v->getId(),
            'type' => $v->getType(),
            'motor' => $v->getMotor(),
            'height' => $v->getVehiculeHeight(),
            'plate' => $v->getPlate()
        ];
    }

    echo json_encode([
        'status' => 'success',
        'vehicules' => empty($vehicules) ? null : $vehicules,
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'erreur',
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
