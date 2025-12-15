<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../../modele/php/userDAO.class.php';
require_once __DIR__ . '/../../modele/php/user.class.php';

session_start();
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$mail = $data['mail'] ?? null;
$password = $data['password'] ?? null;
$tel = intval($data['tel']) ?? null;
$name = $data['name'] ?? null;
$surname = $data['surname'] ?? null;

if (!$mail || !$password || !$tel || !$name || !$surname) {
    echo json_encode([
        'status' => 'fail',
        'message' => 'Paramètre manquants !'
    ]);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);

try {
    $DAO = new userDAO();
    $userMail = $DAO->getByMail($mail);

    if (isset($userMail)) {
        echo json_encode([
            'status' => 'fail',
            'message' => "L'adresse est déjà utilisé !"
        ]);
        exit;
    }

    $user = new User();
    $user->setLastName($name);
    $user->setFirstName($surname);
    $user->setPhone($tel);
    $user->setMail($mail);
    $user->setPasswordHash($hash);

    $insert = $DAO->create($user);

    if (!isset($insert)) {
        echo json_encode([
            'status' => 'fail',
            'message' => 'Erreur de création !'
        ]);
        exit;
    }
    if ($insert) {
        echo json_encode([
            'status' => 'success',
        ]);
        exit;
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'fail',
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
