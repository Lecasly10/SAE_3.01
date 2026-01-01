<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

require_once __DIR__ . '/../../../modele/php/userDAO.class.php';
require_once __DIR__ . '/../../../modele/php/userPrefDAO.class.php';
require_once __DIR__ . '/../../../modele/php/vehiculeDAO.class.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];
$userId = $data['id'] ?? null;

if (!$userId) {
    echo json_encode([
        'status' => 'erreur',
        'message' => "Paramètre 'id' manquant"
    ]);
    exit;
}

try {
    $user = (new UserDAO())->getById(intval($userId));
    $prefDAO = new UserPrefDAO();
    $vehDAO = new VehiculeDAO();
    if (!$user) {
        echo json_encode([
            'status' => 'erreur',
            'message' => 'Aucun user trouvé'
        ]);
        exit;
    } else {
        $pref = $prefDAO->getById(intval($userId));
        $veh = $vehDAO->getByUserId(intval($userId));

        $name = $user->getLastName();
        $surname = $user->getFirstName();
        $tel = $user->getPhone();

        $pmr = null;
        $maxDistance = null;
        $maxHourly = null;
        $free = null;
        $covered = null;

        $type = null;
        $motor = null;
        $plate = null;
        $height = null;

        if ($pref) {
            $pmr = $pref->getIsPmr();
            $maxDistance = $pref->getMaxDistance();
            $maxHourly = $pref->getMaxHourlyBudget();
            $free = $pref->getPreferFree();
            $covered = $pref->getPreferCovered();
        }

        $vehicules = [];
        if ($veh) {
            foreach ($veh as $v) {
                $vehicules[] = [
                    'id' => $v->getId(),
                    'type' => $v->getType(),
                    'motor' => $v->getMotor(),
                    'height' => $v->getVehiculeHeight(),
                    'plate' => $v->getPlate()
                ];
            }
        }

        echo json_encode([
            'status' => 'success',
            'name' => $name,
            'surname' => $surname,
            'tel' => $tel,
            'pmr' => $pmr,
            'maxDistance' => $maxDistance,
            'maxHourly' => $maxHourly,
            'free' => $free,
            'covered' => $covered,
            'vehicules' => empty($vehicules) ? null : $vehicules,
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'erreur',
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
