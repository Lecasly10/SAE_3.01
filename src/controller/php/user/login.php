<?php
require_once __DIR__ . '/../utils/response.php';
require_once __DIR__ . '/../../../modele/php/userDAO.class.php';

session_start();

$data = json_decode(file_get_contents('php://input'), true);

$mail = $data['mail'] ?? null;
$password = $data['password'] ?? null;

if (!$mail || !$password) {
    sendError('Paramètre manquant', ErrorCode::MISSING_ARGUMENTS);
}

try {
    $user = (new userDAO())->getByMail($mail);

    if (!$user) {
        sendError('Cette email ne correspond à aucun compte ', ErrorCode::USER_NOT_FOUND);
    }

    if ($user && password_verify($password, $user->getPasswordHash())) {
        session_regenerate_id(true);

        $_SESSION['user_id'] = $user->getId();
        $_SESSION['mail'] = $mail;

        $resp = [
            'user_id' => $_SESSION['user_id'],
            'mail' => $_SESSION['mail']
        ];

        sendSuccess($resp);
    } else {
        sendError('Identifiants incorrect !', ErrorCode::INVALID_CREDENTIALS);
    }
} catch (Exception $e) {
    sendError($e->getMessage());
}
