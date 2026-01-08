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

try {
    session_set_cookie_params([
        'secure' => true,
        'httponly' => true,
        'samesite' => 'None'
    ]);

    session_start();
    header('Content-Type: application/json');

    if (isset($_SESSION['user_id'])) {
        echo json_encode([
            'status' => 'success',
            'authenticated' => true,
            'user_id' => $_SESSION['user_id'],
            'mail' => $_SESSION['mail']
        ]);
    } else {
        echo json_encode([
            'status' => 'success',
            'authenticated' => false,
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'fail',
        'authenticated' => false,
        'message' => 'Erreur Serveur : ' . $e
    ]);
}
