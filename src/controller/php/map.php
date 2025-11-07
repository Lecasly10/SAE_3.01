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
        $str='';
        $str .= $parking->getName();
        $str .= " | " . $parking->getId();
        $lignes .= "<a href='test'>$str</a>";
    }
}

include "../../vue/map.view.php";