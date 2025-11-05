<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

$search = (isset($_GET['search']) ? $_GET['search'] : null);


include "../../vue/map.view.php";