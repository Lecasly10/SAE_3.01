<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/parkingApi.php';
require_once __DIR__ . '/cache.php';

class LondonAPI implements ParkingAPI {

    private CacheManager $cache;

    private string $urlAll;
    private string $urlPark;
    private string $urlLoc;
    private string $key;
    private int $radius;

    public function __construct(array $config) {

        $this->cache = new CacheManager(__DIR__ . "/cache_london");

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

        $tile = "id_" . floor($lat*100) . "_" . floor($lon*100);

        $cached = $this->cache->get($tile, 86400);
        if ($cached !== null) {
            return $cached;
        }

        $url = $this->urlLoc
            . "lat={$lat}&lon={$lon}&radius={$this->radius}&type=CarPark"
            . $this->key;

        $data = $this->call($url);

        if (!isset($data["places"]) || empty($data["places"])) {
            return null;
        }

        $best = null;
        $bestDist = PHP_INT_MAX;

        foreach ($data["places"] as $p) {

            $dist = distanceGPS($lat, $lon, $p["lat"], $p["lon"]);

            if ($dist < $bestDist) {
                $bestDist = $dist;
                $best = $p["id"];
            }
        }

        if ($best !== null) {
            $this->cache->set($tile, $best);
        }

        return $best;
    }

    public function getFreePlaces(float $lat, float $lon): ?int {

        $id = $this->getNearestParkingId($lat, $lon);
        if (!$id) return null;

        $cacheKey = "occupancy_" . $id;
        $cached = $this->cache->get($cacheKey, 30);

        if ($cached !== null) {
            return $cached;
        }

        $url = $this->urlPark . $id . $this->key;
        $data = $this->call($url);

        if (!isset($data[0]["bays"])) return null;

        foreach ($data[0]["bays"] as $bay) {
            if ($bay["bayType"] === "General") {
                $free = $bay["free"] ?? null;

                $this->cache->set($cacheKey, $free);

                return $free;
            }
        }

        return null;
    }
}
