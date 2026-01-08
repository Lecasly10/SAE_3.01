<?php
require_once __DIR__ . '/../utils/response.php';
require_once __DIR__ . '/../../../modele/php/vehiculeDAO.class.php';
require_once __DIR__ . '/../../../modele/php/vehicule.class.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];
$id = $data['id'] ?? null;
$plate = $data['plate'] ?? null;
$height = $data['height'] ?? null;
$type = $data['type'] ?? null;
$motor = $data['motor'] ?? null;

if (!$id ||
        !$plate ||
        !isset($height) ||
        !$type ||
        !$motor) {
    sendError('Paramètre manquant', ErrorCode::MISSING_ARGUMENTS);
}

try {
    $vehDAO = new VehiculeDAO();
    $veh = $vehDAO->getById($id);
    if (!$veh) {
        sendError('Véhicule introuvable', ErrorCode::NOT_FOUND);
    } else {
        $veh->setPlate($plate);
        $veh->setVehiculeHeight($height);
        $veh->setType($type);
        $veh->setMotor($motor);

        $req = $vehDAO->update($veh);

        if (!$req) {
            sendError('Erreur dans la suppression du véhicule');
        }
        sendSuccess();
    }
} catch (Exception $e) {
    sendError($e->getMessage());
}
