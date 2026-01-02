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

require_once __DIR__ . '/../api/dataAPI.php';
require_once __DIR__ . '/../distance.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];
$parkingId = $data['id'] ?? null;
$lat = $data['lat'] ?? null;
$lng = $data['lng'] ?? null;

if (!$parkingId || !$lat || !$lng) {
    echo json_encode([
        'status' => 'erreur',
        'message' => 'Paramètre manquant'
    ]);
    exit;
}

try {
    $data = getApiData();

    $pLibre = 0;
    $city = detectCity($lat, $lng);

    try {
        if (isset($city)) {
            $pLibre = placeLibre($data[$city], $city, $lat, $lng);
        }
    } catch (Exception $e) {
        $pLibre = null;
    }

    echo json_encode([
        'status' => 'ok',
        'libre' => $pLibre
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'erreur',
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
