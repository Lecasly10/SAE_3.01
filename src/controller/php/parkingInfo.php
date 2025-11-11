<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../../modele/parkingDAO.class.php';
require_once __DIR__ . '/../../modele/parkingCapacityDAO.class.php';
require_once __DIR__ . '/distance.php';
require_once __DIR__ . '/dataAPI.php';
require_once __DIR__ . '/table.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];
$parkingId = $data['id'] ?? null;

if (!$parkingId) {
    echo json_encode([
        "status" => "erreur",
        "message" => "Paramètre 'id' manquant"
    ]);
    exit;
}

try {
    $parking = (new ParkingDAO())->getById($parkingId);
    if (!$parking) {
        echo json_encode([
            "status" => "erreur",
            "message" => "Aucun parking trouvé"
        ]);
        exit;
    }

    $res = createTable([$parking]);
    echo json_encode([
        "status" => "ok",
        "message" => "Parking trouvé",
        "parking" => $res[0] ?? null
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "erreur",
        "message" => "Erreur serveur: " . $e->getMessage()
    ]);
}
