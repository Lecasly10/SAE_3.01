<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../../modele/php/userDAO.class.php';
require_once __DIR__ . '/../../../modele/php/user.class.php';
require_once __DIR__ . '/../../../modele/php/userPrefDAO.class.php';
require_once __DIR__ . '/../../../modele/php/userPref.class.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$mail = $data['mail'] ?? null;
$password = $data['password'] ?? null;
$tel = $data['tel'] ?? null;
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
    $DAO = new UserDAO();
    $PrefDAO = new UserPrefDAO();
    $userMail = $DAO->getByMail($mail);

    if ($userMail !== null) {
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
        $userPref = $PrefDAO->getById($user->getId());
        if (!$userPref) {
            $userPref = new UserPref($user->getId());
            $r = $PrefDAO->create($userPref);
            if (!$r) {
                echo json_encode([
                    'status' => 'fail',
                    'message' => 'Compte créer mais erreur a la creation des prefs'
                ]);
                exit;
            }
        }
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
