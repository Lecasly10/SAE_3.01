<?php
require_once __DIR__ . '/../utils/response.php';
require_once __DIR__ . '/../api/dataAPI.php';
require_once __DIR__ . '/../distance.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];
$parkingId = $data['id'] ?? null;
$lat = $data['lat'] ?? null;
$lng = $data['lng'] ?? null;

if (!$parkingId || !$lat || !$lng) {
    sendError('Paramètre manquant', ErrorCode::MISSING_ARGUMENTS);
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

    sendSuccess([
        'libre' => $pLibre
    ]);
} catch (Exception $e) {
    sendError($e->getMessage());
}
