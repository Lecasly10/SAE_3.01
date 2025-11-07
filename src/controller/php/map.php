<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once '../../modele/parkingDAO.class.php';

$search = (isset($_GET['search']) ? $_GET['search'] : null);

$parkingDAO = new ParkingDAO();

if ($search != " " && $search && isset($search)) {
    $lignes = "";
    $lesParkings = $parkingDAO->getSearch($search);
    foreach ($lesParkings as $parking) {
        $lat=$parking->getLat();
        $long=$parking->getLong();
        $name=$parking->getName();
        $str='';
        $str .= $name;
        $lignes .= "<a class='parking' 
        data-lat=" . "'$lat'" . 
        "data-lng=" . "'$long'" .
        "data-name=" . "'$name'" . 
        "href='#'>$str</a>";
    }
}

include "../../vue/map.view.php";