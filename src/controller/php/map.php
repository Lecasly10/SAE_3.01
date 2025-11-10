<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);


require_once '../../modele/parkingDAO.class.php';
require_once '../../modele/parkingCapacityDAO.class.php';
require_once './distance.php';
require_once './dataAPI.php';

$search = $_POST['search'] ?? null;
$list   = $_POST['list'] ?? null;
$info   = $_POST['info'] ?? null;

$parkingDAO = new ParkingDAO();
$parkingCapacityDAO = new ParkingCapacityDAO();
$parkingList = $parkingDAO->getAll();

$parkingName="TEST";

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
        $long = $parking->getLong();
        $name = $parking->getName();

       
        $pLibre = null;
        try {
            $pLibre = placeLibre($lat, $long);
        } catch(Exception $e) {
            $pLibre = null;
        }

        $str = "$name | $places places";
        if(isset($pLibre) && $pLibre === 0) $str .= " - Complet";
        elseif(isset($pLibre)) $str .= " - $pLibre Libres";

        $button = "<button class='button' id='infoButton' type='submit' name='info' value='$id'>
                      <i class='fa fa-info' aria-hidden='true'>NFO</i>
                   </button>";

        $data = " data-lat='$lat' data-lng='$long' data-name='$name' ";

        $res[] = "
        <div id='linkbox'>
            <form method='post' action='map.php'>
                $button
                <a class='parking item' $data href='#'>$str</a>
            </form>
        </div>";
    }

    return $res;
}

$lignes     = (!empty($search)) ? createTable(search($search)) : [];
if(!empty($list) && $list === "1") {
    $lignesList = createTable($parkingList);
} else {
    $lignesList = [];
}

$lignesInfo = [];
if(!empty($info)) {
    $id = $info;
    $parking = $parkingDAO->getById($id);
    $parkingName=$parking->getName();
    $placesObj = $parkingCapacityDAO->getById($id);
    $totalPlaces = $placesObj ? $placesObj->getTotal() : 0;

    $pLibre = null;
    try { $pLibre = placeLibre($parking->getLat(), $parking->getLong()); } catch(Exception $e){}

    $pLibreText = ($pLibre !== null) ? "$pLibre / $totalPlaces" : $totalPlaces;

    $structure = ($parking->getStructure() === "ouvrage") ? "Souterrain" : "Extérieur";
    $pInfo = $parking->getInfo() ?? "";

    $lignesInfo[] = "<div>
        <p class='item'><b>Adresse</b> : " . $parking->getAdresse() . "</p>
        <p class='item'><b>Coordonnées</b> : ". $parking->getLat() . " - " . $parking->getLong() . "</p>
        <p class='item'><b>URL</b> : " . $parking->getUrl(). "</p>
        <p class='item'><b>Type</b> : $structure</p>
        <p class='item'><b>Places</b> : $pLibreText</p>
    </div>";

    $lignesInfo[] = "<hr class='inner'><div>
    <p class='item'><b>Places</b> : " . $pLibre . "</p>"
    . "<p class='item'><b>PMR</b> : ". $placesObj->getPmr() . "</p>"
    . "<p class='item'><b>Voitures électriques</b> : " . $placesObj->getElectricCar(). "</p>"
    . "<p class='item'><b>Moto</b> : " . $placesObj->getMotorCycle(). "</p>"
    . "<p class='item'><b>Moto électriques</b> : " . $placesObj->getElectric2W(). "</p>"
    . "<p class='item'><b>Places Familiales</b> : " . $placesObj->getCarPool() . "</p></div>";

    if(!empty($pInfo)){
        $lignesInfo[] = "<hr class='inner'><div class='text'>
            <p class='item'>$pInfo</p>
        </div>";
    }
}

include "../../vue/map.view.php";
