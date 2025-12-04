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

class MetzAPI implements ParkingAPI {

    private string $url;
    private CacheManager $cache;

    public function __construct(string $url) {
        $this->url = $url;
        $this->cache = new CacheManager(__DIR__ . "/cache_metz");
    }

    public function fetchData(): array {

        $cached = $this->cache->get("metz_data", 30);

        if ($cached !== null) {
            return $cached;
        }

        $data = fetch($this->url);
        if ($data === null) {
            die("Erreur JSON Metz");
        }

        $this->cache->set("metz_data", $data);
        return $data;
    }

    public function getFreePlaces(float $lat, float $lon): ?int {

        $data = $this->fetchData();

        foreach ($data["features"] as $feature) {

            $fLat = $feature["geometry"]["coordinates"][1];
            $fLon = $feature["geometry"]["coordinates"][0];

            if (distanceGPS($lat, $lon, $fLat, $fLon) < 20) {
                return $feature["properties"]["place_libre"];
            }
        }

        return null;
    }
}
