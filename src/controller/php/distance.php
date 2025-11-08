<?php

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

function approxDistance(float $lat1, float $lon1, float $lat2, float $lon2): float {
    $dLat = $lat2 - $lat1;
    $dLon = $lon2 - $lon1;
    return $dLat * $dLat + $dLon * $dLon;
}
