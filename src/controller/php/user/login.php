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

require_once __DIR__ . '/../../../modele/php/userDAO.class.php';

session_start();
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$mail = $data['mail'] ?? null;
$password = $data['password'] ?? null;

if (!$mail || !$password) {
    echo json_encode([
        'status' => 'fail',
        'message' => 'Paramètre manquants !'
    ]);
    exit;
}

try {
    $user = (new userDAO())->getByMail($mail);

    if (!$user) {
        echo json_encode([
            'status' => 'fail',
            'message' => 'Ce mail ne correspond a aucun compte'
        ]);
        exit;
    }

    if ($user && password_verify($password, $user->getPasswordHash())) {
        session_regenerate_id(true);

        $_SESSION['user_id'] = $user->getId();
        $_SESSION['mail'] = $mail;
        echo json_encode([
            'status' => 'success',
            'user_id' => $_SESSION['user_id'],
            'mail' => $_SESSION['mail']
        ]);
    } else {
        echo json_encode([
            'status' => 'fail',
            'message' => 'Identifants incorrect !'
        ]);
        exit;
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'fail',
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
