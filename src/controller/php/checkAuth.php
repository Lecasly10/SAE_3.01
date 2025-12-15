<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'authenticated' => true,
        'user_id' => $_SESSION['user_id'],
        'mail' => $_SESSION['mail']
    ]);
} else {
    echo json_encode([
        'authenticated' => false,
        'message' => 'Non identifier'
    ]);
}
