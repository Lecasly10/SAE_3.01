<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

require_once __DIR__ . '/../../modele/parkingDAO.class.php';
require_once __DIR__ . '/table.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];
$search = $data['search'] ?? null;

function searchParkings(string $search): array {
    $parkingDAO = new ParkingDAO();
    $mots = array_filter(explode(" ", trim($search)));
    $resultats = [];

    foreach ($mots as $mot) {
        $res = $parkingDAO->getSearch($mot);
        if (!empty($res)) {
            $resultats = array_merge($resultats, $res);
        }
    }
    return array_unique($resultats, SORT_REGULAR);
}

try {
    if (!$search) {
       
        $parkings = (new ParkingDAO())->getAll();
        if (!$parkings) {
            echo json_encode([
                "status" => "erreur",
                "message" => "Aucun parking trouvé"
            ]);
            exit;
        }
    } else {
        $parkings = searchParkings($search);
        if (!$parkings) {
            echo json_encode([
                "status" => "erreur",
                "message" => "Aucun parking trouvé"
            ]);
            exit;
        }
    }

    $res = createTable($parkings);
    echo json_encode([
        "status" => !empty($res) ? "ok" : "erreur",
        "message" => !empty($res) ? ($search ? "Recherche effectuée" : "Tous les parkings envoyés") : "Parkings non trouvés",
        "parkings" => $res ?? false
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "erreur",
        "message" => "Erreur serveur: " . $e->getMessage()
    ]);
}
