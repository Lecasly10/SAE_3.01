<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function distanceGPS(float $lat1, float $lon1, float $lat2, float $lon2): float {
    $earthRadius = 6371000; 
    $lat1Rad = deg2rad($lat1);
    $lat2Rad = deg2rad($lat2);
    $deltaLatRad = deg2rad($lat2 - $lat1);
    $deltaLonRad = deg2rad($lon2 - $lon1);

    $a = sin($deltaLatRad / 2) ** 2 + cos($lat1Rad) * cos($lat2Rad) * sin($deltaLonRad / 2) ** 2;
    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

    return $earthRadius * $c;
}

