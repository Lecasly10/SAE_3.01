<?php
require_once __DIR__ . '/../utils/response.php';
require_once __DIR__ . '/../../../modele/php/parkingDAO.class.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];

try {
    $parkings = (new ParkingDAO())->getAllData();
    if (!$parkings || empty($parkings)) {
        sendError('Parking introuvable', ErrorCode::NOT_FOUND);
    }

    $res = $parkings;
    sendSuccess($res);
} catch (Exception $e) {
    sendError($e->getMessage());
}
