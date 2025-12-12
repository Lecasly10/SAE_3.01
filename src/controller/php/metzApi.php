<?php

require_once __DIR__ . '/parkingApi.php';
require_once __DIR__ . '/dataAPI.php';

class MetzAPI implements ParkingAPI
{
    private string $url;

    public function __construct(string $url)
    {
        $this->url = $url;
    }

    public function fetchData(): ?array
    {
        $data = fetch($this->url);

        if ($data === null) {
            return null;
        }

        return $data;
    }

    public function getFreePlaces(float $lat, float $lon): ?int
    {
        $data = $this->fetchData();

        if (!isset($data))
            return null;

        foreach ($data['features'] as $feature) {
            $fLat = $feature['geometry']['coordinates'][1];
            $fLon = $feature['geometry']['coordinates'][0];

            if (distanceGPS($lat, $lon, $fLat, $fLon) < 20) {
                return $feature['properties']['place_libre'];
            }
        }

        return null;
    }
}
