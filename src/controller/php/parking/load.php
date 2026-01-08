<?php
require_once __DIR__ . '/../utils/response.php';
require_once __DIR__ . '/../../../modele/php/parkingDAO.class.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];
$parkingId = $data['id'] ?? null;

if (!$parkingId) {
    sendError('Paramètre manquant', ErrorCode::MISSING_ARGUMENTS);
}

try {
    $parking = (new ParkingDAO())->getAllDataById($parkingId);
    if (!$parking || empty($parking)) {
        sendError('Parking introuvable', ErrorCode::NOT_FOUND);
    }

    $res = $parking;
    sendSucces($res);
} catch (Exception $e) {
    sendError($e->getMessage());
}
