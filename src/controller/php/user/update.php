<?php
require_once __DIR__ . '/../utils/response.php';

require_once __DIR__ . '/../../../modele/php/userDAO.class.php';
require_once __DIR__ . '/../../../modele/php/userPrefDAO.class.php';
require_once __DIR__ . '/../../../modele/php/user.class.php';
require_once __DIR__ . '/../../../modele/php/userPref.class.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];
$userId = $data['id'] ?? null;
$name = $data['name'] ?? null;
$surname = $data['surname'] ?? null;
$tel = $data['tel'] ?? null;
$free = $data['free'];
$pmr = $data['pmr'];
$covered = $data['covered'];
$maxh = $data['maxHourly'] ?? null;
$maxd = $data['maxDist'] ?? null;

if (!$userId ||
        !$name ||
        !$surname ||
        !$tel ||
        !isset($free) ||
        !isset($pmr) ||
        !isset($covered) ||
        !isset($maxd) ||
        !isset($maxh)) {
    sendError('Paramètre manquant', ErrorCode::MISSING_ARGUMENTS);
}

try {
    $userDAO = new UserDAO();
    $user = $userDAO->getById($userId);
    $prefDAO = new UserPrefDAO();
    if (!$user) {
        sendError('Utilisateur introuvable', ErrorCode::USER_NOT_FOUND);
    } else {
        $userPref = $prefDAO->getById($userId);
        if (!$userPref) {
            sendError('Paramètre introuvables', ErrorCode::NOT_FOUND);
        }
        $user->setFirstName($surname);
        $user->setLastName($name);
        $user->setPhone($tel);

        $userPref->setIsPmr($pmr);
        $userPref->setPreferFree($free);
        $userPref->setPreferCovered($covered);
        $userPref->setMaxHourlyBudget($maxh);
        $userPref->setMaxDistance($maxd);

        $a = $userDAO->update($user);
        $b = $prefDAO->update($userPref);

        if (!$a || !$b) {
            sendError("Erreur dans la maj de l'utilisateur");
        }
        sendSuccess();
    }
} catch (Exception $e) {
    sendError($e->getMessage());
}
