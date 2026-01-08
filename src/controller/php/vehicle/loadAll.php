<?php
require_once __DIR__ . '/../utils/response.php';
require_once __DIR__ . '/../../../modele/php/vehiculeDAO.class.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];
$userId = $data['id'] ?? null;

if (!$userId) {
    sendError('Paramètre manquant', ErrorCode::MISSING_ARGUMENTS);
}

try {
    $vehDAO = new VehiculeDAO();
    $vehs = $vehDAO->getByUserId($userId);
    $vehs = $vehs ?? [];

    $type = null;
    $motor = null;
    $plate = null;
    $height = null;

    $vehicules = [];

    foreach ($vehs as $v) {
        $vehicules[] = [
            'id' => $v->getId(),
            'type' => $v->getType(),
            'motor' => $v->getMotor(),
            'height' => $v->getVehiculeHeight(),
            'plate' => $v->getPlate()
        ];
    }
    if (empty($vehicules)) {
        sendError('Véhicules introuvables', ErrorCode::NOT_FOUND);
    }

    sendSuccess($vehicules);
} catch (Exception $e) {
    sendError($e->getMessage());
}
