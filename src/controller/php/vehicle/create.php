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
    $veh = new Vehicule();
    if (!$veh) {
        sendError('La création du véhicule à échoué');
    } else {
        $veh->setUserId($id);
        $veh->setPlate($plate);
        $veh->setVehiculeHeight($height);
        $veh->setType($type);
        $veh->setMotor($motor);

        $req = $vehDAO->create($veh);

        if (!$req) {
            sendError('La création du véhicule à échoué');
        }

        sendSuccess();
    }
} catch (Exception $e) {
    sendError($e->getMessage());
}
