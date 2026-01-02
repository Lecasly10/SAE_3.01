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
require_once __DIR__ . '/../../../modele/php/vehicule.class.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];
$id = $data['id'] ?? null;
$plate = $data['plate'] ?? null;
$height = $data['height'] ?? null;
$type = $data['type'] ?? null;
$motor = $data['motor'] ?? null;

if (!$id ||
        !$plate ||
        !isset($height) ||
        !$type ||
        !$motor) {
    echo json_encode([
        'status' => 'erreur',
        'message' => 'Paramètres manquant'
    ]);
    exit;
}

try {
    $vehDAO = new VehiculeDAO();
    $veh = $vehDAO->getById($id);
    if (!$veh) {
        echo json_encode([
            'status' => 'erreur',
            'message' => 'Aucun véhicule trouvé'
        ]);
        exit;
    } else {
        $veh->setPlate($plate);
        $veh->setVehiculeHeight($height);
        $veh->setType($type);
        $veh->setMotor($motor);

        $req = $vehDAO->update($veh);

        if (!$req) {
            echo json_encode([
                'status' => 'erreur',
                'message' => 'Erreur serveur'
            ]);
            exit;
        }
        echo json_encode([
            'status' => 'success',
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'erreur',
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
