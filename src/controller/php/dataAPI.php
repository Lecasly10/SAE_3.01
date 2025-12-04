<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include __DIR__ . '/../../conf/conf.inc.php';
include __DIR__ . '/metzApi.php';
include __DIR__ . '/londreApi.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$apis = [
    "metz"   => new MetzAPI($API['metzUrl']),
    "londre" => new LondreAPI($API)
];


function placeLibre(string $city, float $lat, float $lon): ?int {
    global $apis;

    if (!isset($apis[$city])) {
        return null;
    }

    return $apis[$city]->getFreePlaces($lat, $lon);
}
