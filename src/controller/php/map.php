<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once '../../modele/parkingDAO.class.php';
require_once '../../modele/parkingCapacityDAO.class.php';
require_once './distance.php';
require_once './dataAPI.php';

$search = (isset($_POST['search']) ? $_POST['search'] : null);
$list = (isset($_POST['list']) ? $_POST['list'] : null);
$info = (isset($_POST['info']) ? $_POST['info'] : null);
$lignes = [];
$lignesList = [];
$lignesInfo = [];
$parkingName = "Nom du parking";

function search(string $search) : array {
    $parkingDAO = new ParkingDAO();
    $search = trim($search);
    $mots = explode(" ", $search);
    $lesParkings = []; 

    foreach ($mots as $mot) {
        $resultats = $parkingDAO->getSearch($mot);
        if (!empty($resultats)) {
            $lesParkings = array_merge($lesParkings, $resultats);
        }
    }
    return array_unique($lesParkings, SORT_REGULAR);
}

function createTable($lesParkings) {
    $parkingCapacityDAO = new ParkingCapacityDAO();
    $res = [];

    foreach ($lesParkings as $parking) {
        $id = $parking->getId();
        $places=$parkingCapacityDAO->getById($id)->getTotal();
        $lat=$parking->getLat();
        $long=$parking->getLong();
        $name=$parking->getName();
        $pLibre = placeLibre($lat, $long);
        $str = "";
        $str .= $name . " | " . "$places places";

        if(isset($pLibre) && $pLibre === 0) $str .= " - " . "Complet";
        elseif(isset($pLibre)) $str .= " - " . $pLibre . " Libres";
        else $str .= "";

        $button = 
        "<button class='button' id='infoButton' type='submit' name='info' value='$id'>
          <i class='fa fa-info' aria-hidden='true'>NFO</i>
        </button>";
        $data = 
        "data-lat=" . "'$lat'" . 
        "data-lng=" . "'$long'" .
        "data-name=" . "'$name'" ;

        $res [] = 
        "<div id='linkbox'><form method='post' action='map.php'>" 
        . $button . 
        "<a class='parking item'" 
        . $data . 
        "href='#'>$str</a><from></div>";
    }

    return $res;
}

if (!empty($search) && isset($search)) {
    $lignes = createTable(search($search));    
}

if(isset($list)) {
    $lignesList = createTable(new ParkingDAO()->getAll());
}

if(isset($info)) {
    $id=$info;
    $parking= new ParkingDAO()->getById($id);
    $places= new ParkingCapacityDAO()->getById($id);
    $parkingName = $parking->getName();
    $pLibre = placeLibre($parking->getLat(), $parking->getLong());
    $pLibre = $pLibre ? $pLibre . "/" .  $places->getTotal() :   $places->getTotal();
    $structure = ($parking->getStructure() === "ouvrage") ? "Souterrain" : "Extérieur";
    $pInfo = $parking->getInfo() ?? "";

    $lignesInfo[] = "<div>
    <p class='item'><b>Adresse</b> : " . $parking->getAdresse() . "</p>"
    . "<p class='item'><b>Coordonnées</b> : ". $parking->getLat() . " - " . $parking->getLong() . "</p>"
    . "<p class='item'><b>URL</b> : " . $parking->getUrl(). "</p>"
    . "<p class='item'><b>Insee Code</b> : " . $parking->getInsee() . "</p>"
    . "<p class='item'><b>Type</b> : " . $structure . "</p>"
    . "<p class='item'><b>Type utilisateur</b> : " . $parking->getUserType() . "</p>"
    . "<p class='item'><b>Hauteur max.</b> : " . $parking->getMaxHeight() . "cm</p></div>";

    $lignesInfo[] = "<hr class='inner'><div>
    <p class='item'><b>Places</b> : " . $pLibre . "</p>"
    . "<p class='item'><b>PMR</b> : ". $places->getPmr() . "</p>"
    . "<p class='item'><b>Voitures électriques</b> : " . $places->getElectricCar(). "</p>"
    . "<p class='item'><b>Moto</b> : " . $places->getMotorCycle(). "</p>"
    . "<p class='item'><b>Moto électriques</b> : " . $places->getElectric2W(). "</p>"
    . "<p class='item'><b>Places Familiales</b> : " . $places->getCarPool() . "</p></div>";

    
    if(!empty($pInfo)) {
        $lignesInfo[] = "<hr class='inner'><div class='text'>"
    . "<p class='item'>" . $pInfo . "</p></div>";
    }

}



include "../../vue/map.view.php";