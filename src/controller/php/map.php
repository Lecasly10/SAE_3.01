<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once '../../modele/parkingDAO.class.php';
require_once '../../modele/parkingCapacityDAO.class.php';
require_once './distance.php';
require_once './dataAPI.php';

$search = (isset($_POST['search']) ? $_POST['search'] : null);
$autoSearch = (isset($_POST['autosearch']) ? $_POST['autosearch'] : null);

$parkingCapacityDAO = new ParkingCapacityDAO();

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

if (!empty($search) && isset($search)) {
    $lignes = "";
    $lesParkings = search($search);

    foreach ($lesParkings as $parking) {
        $places=$parkingCapacityDAO->getById($parking->getId())->getTotal();
        $lat=$parking->getLat();
        $long=$parking->getLong();
        $name=$parking->getName();
        $pLibre = placeLibre($lat, $long);
        $icon = '<i class="fa fa-car" aria-hidden="true"></i>';
        $str=$icon . " ";
        $str .= " " . $name . " | " . "$places places";

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