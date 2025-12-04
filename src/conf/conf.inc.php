<?php
$conf = [
    "SGBD" => 'mysql',
    "HOST" => 'devbdd.iutmetz.univ-lorraine.fr',
    "PASSWORD" => 'ekipafond',
    "USER" => 'e12577u_appli',
    "DB_NAME" => 'e12577u_301',
];

$API = [
    "metzUrl" => 'https://maps.eurometropolemetz.eu/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:pub_tsp_sta&srsName=EPSG:4326&outputFormat=application/json&cql_filter=id%20is%20not%20null',
    "londreUrlAll" => 'https://api.tfl.gov.uk/Place/Type/CarPark',
    "londreUrlPark" => 'https://api.tfl.gov.uk/Occupancy/CarPark/',
    "londreUrlLoc" => 'https://api.tfl.gov.uk/Place?',
    "londreKey" => '?app_key=7c9ac4bcd2aa4799a10bf840662095d2',
    "radius" => 300,
];

#CarParks_800484
#lat=$lat&lon=$long&radius=$radius&type=CarPark
#https://api.tfl.gov.uk/Place?lat=51.5750&lon=0.0897&radius=500&type=CarPark
#https://api.tfl.gov.uk/Occupancy/CarPark/CarParks_800484?app_key=7c9ac4bcd2aa4799a10bf840662095d2

