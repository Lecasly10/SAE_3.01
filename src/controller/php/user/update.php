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

header('Content-Type: application/json');

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
    echo json_encode([
        'status' => 'erreur',
        'message' => 'Paramètres manquant'
    ]);
    exit;
}

try {
    $userDAO = new UserDAO();
    $user = $userDAO->getById($userId);
    $prefDAO = new UserPrefDAO();
    if (!$user) {
        echo json_encode([
            'status' => 'erreur',
            'message' => 'Aucun user trouvé'
        ]);
        exit;
    } else {
        $userPref = $prefDAO->getById($userId);
        if (!$userPref) {
            echo json_encode([
                'status' => 'fail',
                'message' => 'Aucun Param trouvé pour cette User'
            ]);
            exit;
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
            echo json_encode([
                'status' => 'fail',
                'message' => 'Erreur serveur'
            ]);
            exit;
        }
        echo json_encode([
            'status' => 'success',
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'erreur',
        'message' => 'Erreur serveur: ' . $e->getMessage()
    ]);
}
