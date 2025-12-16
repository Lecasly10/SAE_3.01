<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

require_once __DIR__ . '/../../modele/php/userDAO.class.php';
require_once __DIR__ . '/../../modele/php/userPrefDAO.class.php';

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: [];
$userId = $data['id'] ?? null;

if (!$userId) {
    echo json_encode([
        'status' => 'erreur',
        'message' => "Paramètre 'id' manquant"
    ]);
    exit;
}

try {
    $user = (new UserDAO())->getById($userId);
    if (!$user) {
        echo json_encode([
            'status' => 'erreur',
            'message' => 'Aucun user trouvé'
        ]);
        exit;
    } else {
        echo json_encode([
            'status' => 'success',
            'name' => $user->getLastName(),
            'surname' => $user->getFirstName(),
            'tel' => $user->getPhone()
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'erreur',
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
