<?php

require_once __DIR__ . '/parkingApi.php';
require_once __DIR__ . '/dataAPI.php';
require_once __DIR__ . '/../distance.php';

class LondreAPI implements ParkingAPI
{
    private string $urlAll;
    private string $urlPark;
    private string $urlLoc;
    private string $key;
    private int $radius;

    public function __construct(array $config)
    {
        $this->urlAll = $config['londreUrlAll'];
        $this->urlLoc = $config['londreUrlLoc'];
        $this->key = $config['londreKey'];
        $this->radius = $config['radius'] ?? 200;
    }

    private function call(string $url): ?array
    {
        $data = fetch($url);

        if ($data === null) {
            return null;
        }

        return $data;
    }

    public function fetchData(): ?array
    {
        return $this->call($this->urlAll . $this->key);
    }

    private function getNearestParkingId(array $data, float $lat, float $lon): ?string
    {
        $res = '';
        foreach ($data as $parking) {
            $pLat = $parking['lat'];
            $pLng = $parking['lon'];

            if (distanceGPS($lat, $lon, $pLat, $pLng) < 20) {
                $res = $parking['id'];
            }
        }

        if (!isset($res) || empty($res)) {
            return null;
        } else {
            return $res;
        }
    }

    public function getFreePlaces(array $data, float $lat, float $lon): ?int
    {
        $id = $this->getNearestParkingId($data, $lat, $lon);
        if (!$id)
            return null;

        $url = $this->urlPark . $id . $this->key;
        $data = $this->call($url);

        if (!isset($data[0]['bays']))
            return null;

        foreach ($data[0]['bays'] as $bay) {
            if ($bay['bayType'] === 'General') {
                return $bay['free'] ?? null;
            }
        }

        return null;
    }
}
