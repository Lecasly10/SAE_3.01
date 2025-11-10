<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../../modele/parkingDAO.class.php';
require_once __DIR__ . '/../../modele/parkingCapacityDAO.class.php';
require_once __DIR__ . '/distance.php';
require_once __DIR__ . '/dataAPI.php';
 
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$search = $data['search'] ?? null;


function search(string $search): array {
    $parkingDAO = new ParkingDAO();
    $mots = explode(" ", trim($search));
    $resultats = [];
    foreach($mots as $mot) {
        $res = $parkingDAO->getSearch($mot);
        if(!empty($res)) $resultats = array_merge($resultats, $res);
    }
    return array_unique($resultats, SORT_REGULAR);
}

function createTable(array $lesParkings): array {
    $parkingCapacityDAO = new ParkingCapacityDAO();
    $res = [];

    foreach ($lesParkings as $parking) {

        $id = $parking->getId();
        $placesObj = $parkingCapacityDAO->getById($id);
        $places = $placesObj ? $placesObj->getTotal() : 0;

        $lat  = $parking->getLat();
        $lng = $parking->getLong();
        $name = $parking->getName();
       
        $pLibre = null;
        try {
            $pLibre = placeLibre($lat, $lng);
        } catch(Exception $e) {
            $pLibre = null;
        }

        $res[] = [
            "id" => $id,
            "nom" => $name,
            "lat" => $lat,
            "lng" => $lng,
            "places" => $places,
            "places_libres" => $pLibre
        ];

    }

    return $res;
}

if (!isset($search)) {
    $parkings= new ParkingDAO()->getAll();
    $res=createTable($parkings);
    echo json_encode([
        "status" => "ok",
        "message" => "envoie de tout les parkings",
        "parkings"=> $res
    ]);
    exit;
}


try {
    $res = createTable(search($search));
    if(!empty($res)) {
        echo json_encode([
            "status" => "ok",
            "message" => "Recherche effectuée",
            "parkings" => $res
        ]);
        exit;
    } else {
        echo json_encode([
            "status" => "erreur",
            "message" => "Parkings non trouvés",
            "parkings" => false,
        ]);
        exit;
    }
    
} catch (Exception $e) {
    echo json_encode([
        "status" => "erreur",
        "message" => "Erreur serveur: " . $e->getMessage()
    ]);
    exit;
}
