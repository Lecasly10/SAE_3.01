<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class CacheManager {
    private string $cacheDir;

    public function __construct(string $cacheDir) {
        $this->cacheDir = rtrim($cacheDir, '/') . '/';
        if (!is_dir($this->cacheDir)) {
            mkdir($this->cacheDir, 0777, true);
        }
    }

    public function get(string $key, int $maxAge): mixed {
        $file = $this->cacheDir . $key . ".json";
        if (!file_exists($file)) {
            return null;
        }
        if (time() - filemtime($file) > $maxAge) {
            return null;
        }
        return json_decode(file_get_contents($file), true);
    }

    public function set(string $key, mixed $data): void {
        $file = $this->cacheDir . $key . ".json";
        file_put_contents($file, json_encode($data));
    }
}
