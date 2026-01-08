<?php
require_once __DIR__ . '/../utils/response.php';
require_once __DIR__ . '/../../../modele/php/vehiculeDAO.class.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];
$id = $data['id'] ?? null;

if (!$id) {
    sendError('Paramètre manquant', ErrorCode::MISSING_ARGUMENTS);
}

try {
    $vehDAO = new VehiculeDAO();
    $veh = $vehDAO->getById($id);

    if (!$veh) {
        sendError('Véhicule introuvable', ErrorCode::NOT_FOUND);
    }

    $resp = [
        'id' => $veh->getId(),
        'type' => $veh->getType(),
        'motor' => $veh->getMotor(),
        'height' => $veh->getVehiculeHeight(),
        'plate' => $veh->getPlate()
    ];

    sendSuccess($resp);
} catch (Exception $e) {
    sendError($e->getMessage());
}
