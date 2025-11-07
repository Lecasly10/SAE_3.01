<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once '../../modele/parkingDAO.class.php';
require_once '../../modele/parkingCapacityDAO.class.php';
$search = (isset($_GET['search']) ? $_GET['search'] : null);

$parkingDAO = new ParkingDAO();
$parkingCapacityDAO = new ParkingCapacityDAO();

if ($search != " " && $search && isset($search)) {
    $lignes = "";
    $lesParkings = $parkingDAO->getSearch($search);
    foreach ($lesParkings as $parking) {
        $places=$parkingCapacityDAO->getById($parking->getId())->getTotal();
        $lat=$parking->getLat();
        $long=$parking->getLong();
        $name=$parking->getName();
        $str='';
        $str .= $name . " | " . "$places places";
        $lignes .= "<a class='parking' 
        data-lat=" . "'$lat'" . 
        "data-lng=" . "'$long'" .
        "data-name=" . "'$name'" . 
        "href='#'>$str</a>";
    }
}

include "../../vue/map.view.php";