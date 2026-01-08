<?php
require_once __DIR__ . '/../utils/response.php';

try {
    session_set_cookie_params([
        'secure' => true,
        'httponly' => true,
        'samesite' => 'None'
    ]);

    session_start();

    if (isset($_SESSION['user_id'])) {
        $resp = [
            'authenticated' => true,
            'user_id' => $_SESSION['user_id'],
            'mail' => $_SESSION['mail']
        ];
        sendSuccess($resp);
    } else {
        $resp = [
            'authenticated' => false,
        ];
        sendSucces($resp);
    }
} catch (Exception $e) {
    sendError($e->getMessage());
}
