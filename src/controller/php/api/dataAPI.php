<?php
include __DIR__ . '/../../../conf/conf.inc.php';
include __DIR__ . '/metzApi.php';
include __DIR__ . '/londreApi.php';

$apis = [
    'metz' => new MetzAPI($API['metzUrl']),
    'londre' => new LondreAPI($API)
];

function getApiData(): ?array
{
    global $apis;
    $res = [];
    foreach ($apis as $city => $obj) {
        $res[$city] = $obj->fetchData();
    }

    return $res;
}

function placeLibre(array $data, string $city, float $lat, float $lon): ?int
{
    global $apis;

    if (!isset($apis[$city])) {
        return null;
    }

    return $apis[$city]->getFreePlaces($data, $lat, $lon);
}
