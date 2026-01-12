<?php
require_once __DIR__ . '/../utils/response.php';

require_once __DIR__ . '/../../../modele/php/userDAO.class.php';
require_once __DIR__ . '/../../../modele/php/user.class.php';
require_once __DIR__ . '/../../../modele/php/userPrefDAO.class.php';
require_once __DIR__ . '/../../../modele/php/userPref.class.php';

$data = json_decode(file_get_contents('php://input'), true);

$mail = $data['mail'] ?? null;
$password = $data['password'] ?? null;
$tel = $data['tel'] ?? null;
$name = $data['name'] ?? null;
$surname = $data['surname'] ?? null;

if (!$mail || !$password || !$tel || !$name || !$surname) {
    sendError('Paramètre manquant', ErrorCode::MISSING_ARGUMENTS);
}

$hash = password_hash($password, PASSWORD_DEFAULT);

try {
    $DAO = new UserDAO();
    $PrefDAO = new UserPrefDAO();
    $userMail = $DAO->getByMail($mail);

    if ($userMail !== null) {
        sendError('Cette email est déjà utilisé', ErrorCode::EMAIL_ALREADY_EXISTS);
    }

    $user = new User();
    $user->setLastName($name);
    $user->setFirstName($surname);
    $user->setPhone($tel);
    $user->setMail($mail);
    $user->setPasswordHash($hash);

    $insert = $DAO->create($user);

    if (!isset($insert)) {
        sendError('Erreur de création');
    }
    if ($insert) {
        $userPref = $PrefDAO->getById($user->getId());
        if (!$userPref) {
            $userPref = new UserPref($user->getId());
            $r = $PrefDAO->create($userPref);
            if (!$r) {
                sendError('Compte créé mais erreur dans la création des préférences');
            }
        }
        sendSuccess();
    }
} catch (Exception $e) {
    sendError($e->getMessage());
}
