<?php
require_once __DIR__ . '/../utils/response.php';
require_once __DIR__ . '/../../../modele/php/parkingDAO.class.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];
$search = $data['search'] ?? null;

try {
    $parkingDAO = new ParkingDAO();
    if (!$search) {
        $parkings = $parkingDAO->getAllData();
        if (!$parkings || empty($parkings)) {
            sendError('Parkings introuvables', ErrorCode::NOT_FOUND);
        }
    } else {
        $parkings = $parkingDAO->getSearch($search);
        if (!$parkings || empty($parkings)) {
            sendError('Parkings introuvables', ErrorCode::NOT_FOUND);
        }
    }

    $res = $parkings;
    sendSuccess($res);
} catch (Exception $e) {
    sendError($e->getMessage());
}
