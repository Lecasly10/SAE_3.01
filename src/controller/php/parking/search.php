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
require_once __DIR__ . '/../table.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];
$search = $data['search'] ?? null;

$parkingDAO = new ParkingDAO();

function searchParkings(string $search): array
{
    return $parkingDAO->getSearch($mot);
}

try {
    if (!$search) {
        $parkings = $parkingDAO->getAll();
        if (!$parkings) {
            echo json_encode([
                'status' => 'erreur',
                'message' => 'Aucun parking trouvé'
            ]);
            exit;
        }
    } else {
        $parkings = searchParkings($search);
        if (!$parkings) {
            echo json_encode([
                'status' => 'not_found',
                'message' => 'Aucun parking trouvé'
            ]);
            exit;
        }
    }

    $res = createTable($parkings);
    echo json_encode([
        'status' => !empty($res) ? 'ok' : 'erreur',
        'message' => !empty($res) ? ($search ? 'Recherche effectuée' : 'Tous les parkings envoyés') : 'Parkings non trouvés',
        'parkings' => $res ?? false
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'erreur',
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
