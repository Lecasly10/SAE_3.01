<?php

require_once __DIR__ . '/parkingApi.php';
require_once __DIR__ . '/dataAPI.php'; 

class LondreAPI implements ParkingAPI {

    private string $urlAll;
    private string $urlPark;
    private string $urlLoc;
    private string $key;
    private int $radius;

    public function __construct(array $config) {

        $this->urlAll = $config["londreUrlAll"];
        $this->urlPark = $config["londreUrlPark"];
        $this->urlLoc  = $config["londreUrlLoc"];
        $this->key     = $config["londreKey"];
        $this->radius  = $config["radius"] ?? 200;
    }

    private function call(string $url): array {

        $ch = curl_init($url);

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 4,
            CURLOPT_CONNECTTIMEOUT => 2,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_SSL_VERIFYPEER => false,
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        if (!$response) return [];

        return json_decode($response, true) ?? [];
    }

    public function fetchData(): array { 
        return $this->call($this->urlAll . $this->key);
    }

    private function getNearestParkingId(float $lat, float $lon): ?string {

        $url = $this->urlLoc
            . "lat={$lat}&lon={$lon}&radius={$this->radius}&type=CarPark&"
            . $this->key;

        $data = $this->call($url);

        if (!isset($data["places"]) || empty($data["places"])) {
            return null;
        }

        if (isset($data["places"][0]["id"])) {
            return $data["places"][0]["id"];
        } else {
            return null;
        }

    }

    public function getFreePlaces(float $lat, float $lon): ?int {

        $id = $this->getNearestParkingId($lat, $lon);
        if (!$id) return null;

        $url = $this->urlPark . $id . $this->key;
        $data = $this->call($url);

        if (!isset($data[0]["bays"])) return null;

        foreach ($data[0]["bays"] as $bay) {
            if ($bay["bayType"] === "General") {
                return $bay["free"] ?? null;
            }
        }

        return null;
    }
}
