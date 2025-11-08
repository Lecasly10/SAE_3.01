<?php

function data() {
    $url = "https://maps.eurometropolemetz.eu/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:pub_tsp_sta&srsName=EPSG:4326&outputFormat=application/json&cql_filter=id%20is%20not%20null";

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); 
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        die("Erreur cURL : " . curl_error($ch));
    }

    curl_close($ch);

    $data = json_decode($response, true);

    if ($data === null) {
        die("Erreur JSON");
    } else {
        return $data;
    }

}

function placeLibre(float $lat, float $lon) {
    $data = data();
    foreach ($data['features'] as $feature) {
        $featureLat = $feature['geometry']['coordinates'][1];
        $featureLon = $feature['geometry']['coordinates'][0];

        if (distanceGPS($lat, $lon, $featureLat, $featureLon) < 20) {
            return $feature['properties']['place_libre'];
        }
    }
    return null;
}