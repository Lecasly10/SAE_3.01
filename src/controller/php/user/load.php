<?php
require_once __DIR__ . '/../utils/response.php';
require_once __DIR__ . '/../../../modele/php/userDAO.class.php';
require_once __DIR__ . '/../../../modele/php/userPrefDAO.class.php';
require_once __DIR__ . '/../../../modele/php/vehiculeDAO.class.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];
$userId = $data['id'] ?? null;

if (!$userId) {
    sendError('Paramètre(s) manquant', ErrorCode::MISSING_ARGUMENTS);
}

try {
    $user = (new UserDAO())->getById(intval($userId));
    $prefDAO = new UserPrefDAO();
    $vehDAO = new VehiculeDAO();
    if (!$user) {
        sendError('Utilisateur introuvable', ErrorCode::USER_NOT_FOUND, 401);
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

        if ($pref) {
            $pmr = $pref->getIsPmr();
            $maxDistance = $pref->getMaxDistance();
            $maxHourly = $pref->getMaxHourlyBudget();
            $free = $pref->getPreferFree();
            $covered = $pref->getPreferCovered();
        }

        $resp = [
            'name' => $name,
            'surname' => $surname,
            'tel' => $tel,
            'pmr' => $pmr,
            'maxDistance' => $maxDistance,
            'maxHourly' => $maxHourly,
            'free' => $free,
            'covered' => $covered,
        ];

        sendSuccess($resp);
    }
} catch (Exception $e) {
    sendError($e->getMessage());
}
