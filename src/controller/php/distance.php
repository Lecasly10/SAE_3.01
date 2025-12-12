<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

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

$cities = [
    'metz' => ['latMin'=>48.9, 'latMax'=>49.2, 'lonMin'=>6.1, 'lonMax'=>6.3],
    'londre' => ['latMin'=>51.4, 'latMax'=>51.7, 'lonMin'=>-0.3, 'lonMax'=>0.2]
];

function detectCity(float $lat, float $lon): ?string {
    global $cities;
    foreach ($cities as $name => $bounds) {
        if ($lat >= $bounds['latMin'] && $lat <= $bounds['latMax'] &&
            $lon >= $bounds['lonMin'] && $lon <= $bounds['lonMax']) {
            return $name;
        }
    }
    return null;
}
