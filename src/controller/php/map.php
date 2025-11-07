<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once '../../modele/parking.class.php';
require_once '../../modele/parkingDAO.class.php';

$search = (isset($_GET['search']) ? $_GET['search'] : null);

$parkingDAO = new ParkingDAO();

$lignes = [];

if (isset($_GET[$search])) {
    $lesParkings = $parkingDAO->getSearch($search);

    foreach ($lesParkings as $parking) {
        $str = '<td>' . $parking->getName() . '</td>';
        $str .= '<td>'. $parking->getId() . '</td>';
        $lignes[] = "<tr>".$str."</tr>";
    }
}




include "../../vue/map.view.php";