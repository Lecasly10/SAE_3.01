<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../../conf/conf.inc.php';
include __DIR__ . '/metzApi.php';
include __DIR__ . '/LondreApi.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$apis = [
    "metz" => new MetzAPI($API['metzUrl']),
    "londre" => new LondreAPI($API)
];


function placeLibre(string $city, float $lat, float $lon) {
    global $apis;
    
    if (!isset($apis[$city])) {
        throw new Exception("API inconnue : " . $city);
    }

    return $apis[$city]->getFreePlaces($lat, $lon);
}

// function data() {
//     $data = fetch($API["metzUrl"]);

//     

// }

// function placeLibre(string $id, float $lat, float $lon) {
//     $data = data();
//     foreach ($data['features'] as $feature) {
//         $featureLat = $feature['geometry']['coordinates'][1];
//         $featureLon = $feature['geometry']['coordinates'][0];

//         if (distanceGPS($lat, $lon, $featureLat, $featureLon) < 20) {
//             return $feature['properties']['place_libre'];
//         }
//     }
//     return null;
// }