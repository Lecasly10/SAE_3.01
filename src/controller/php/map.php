<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once '../../modele/parkingDAO.class.php';
require_once '../../modele/parkingCapacityDAO.class.php';

$search = (isset($_GET['search']) ? $_GET['search'] : null);
$search = trim($_GET['search']);
$mots = $mots = explode(" ", $search);

$parkingDAO = new ParkingDAO();
$parkingCapacityDAO = new ParkingCapacityDAO();

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
}


function distanceGPS(float $lat1, float $lon1, float $lat2, float $lon2): float {
    $earthRadius = 6371000; 
    $lat1 = deg2rad($lat1);
    $lat2 = deg2rad($lat2);
    $deltaLat = deg2rad($lat2 - $lat1);
    $deltaLon = deg2rad($lon2 - $lon1);

    $a = sin($deltaLat / 2) ** 2 + cos($lat1) * cos($lat2) * sin($deltaLon / 2) ** 2;
    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

    return $earthRadius * $c;
}


function placeLibre(array $data, float $lat, float $lon) {
    foreach ($data['features'] as $feature) {
        $featureLat = $feature['geometry']['coordinates'][1];
        $featureLon = $feature['geometry']['coordinates'][0];

        if (distanceGPS($lat, $lon, $featureLat, $featureLon) < 20) {
            return $feature['properties']['place_libre'];
        }
    }
    return null;
}

function search() : array {
    $lesParkings = []; 

    foreach ($mots as $mot) {
        $resultats = $parkingDAO->getSearch($mot);
        if (!empty($resultats)) {
            $lesParkings = array_merge($lesParkings, $resultats);
        }
    }
    return array_unique($lesParkings, SORT_REGULAR);
}


if ($search != " " && $search && isset($search)) {
    $lignes = "";
    $lesParkings = search();

    foreach ($lesParkings as $parking) {
        $places=$parkingCapacityDAO->getById($parking->getId())->getTotal();
        $lat=$parking->getLat();
        $long=$parking->getLong();
        $name=$parking->getName();
        $pLibre = placeLibre($data, $lat, $long);

        $str='';
        $str .= $name . " | " . "$places places";

        if(isset($pLibre) && $pLibre === 0) $str .= " - " . "Complet";
        elseif(isset($pLibre)) $str .= " - " . $pLibre . " Libres";
        else $str .= " - " . "Info indisponible";

        $lignes .= 
        "<a class='parking' 
        data-lat=" . "'$lat'" . 
        "data-lng=" . "'$long'" .
        "data-name=" . "'$name'" . 
        "href='#'>$str</a>";
    }
}

include "../../vue/map.view.php";