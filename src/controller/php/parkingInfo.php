<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../../modele/parkingDAO.class.php';
require_once __DIR__ . '/../../modele/parkingCapacityDAO.class.php';
require_once __DIR__ . '/distance.php';
require_once __DIR__ . '/dataAPI.php';
require_once __DIR__ . '/table.php';
 
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$parkingId = $data['id'] ?? null;

if (isset($parkingId)) {
    try {
        $parking= new ParkingDAO()->getById($parkingId);
        $res=createTable([$parking]);
        if(!empty($res)) {
            echo json_encode([
            "status" => "ok",
            "message" => "envoie de tout les parkings",
            "parking"=> $res[0]
            ]);
        } 
    exit;
    } catch (e) {
        echo json_encode([
        "status" => "erreur",
        "message" => "Erreur serveur: " . $e->getMessage()
        ]);
        exit;
    }
    
}
