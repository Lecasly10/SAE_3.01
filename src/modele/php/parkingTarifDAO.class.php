<?php


require_once __DIR__ . "/parkingTarif.class.php";

class ParkingTarifDAO
{
    private $bd;
    private $select;

    public function __construct()
    {
        require_once "../../modele/php/connexion.php";
        $this->bd = new Connexion();
        $this->select = "SELECT * FROM parking_rates";
    }

    private function loadQuery(array $result): array
    {
        $parkings = [];
        foreach ($result as $row) {
            $parking = new ParkingTarif();
            $parking->setId($row['parking_id']);
            $parking->setFree(boolval($row['is_free']));
            $parking->setPmrRate($row['pmr_rate']);
            $parking->setRate1h($row['rate_1h']);
            $parking->setRate2h($row['rate_2h']);
            $parking->setRate3h($row['rate_3h']);
            $parking->setRate4h($row['rate_4h']);
            $parking->setRate24h($row['rate_24h']);
            $parking->setResidentSub($row['resident_subscription']);
            $parking->setNonResidentSub($row['non_resident_subscription']);
            $parkings[] = $parking;
        }
        return $parkings;
    }

    function getAll(): array
    {
        return ($this->loadQuery($this->bd->execSQL($this->select)));
    }

    function getById(string $id): ParkingTarif
    {
        $unParking = new ParkingTarif();
        $lesParkings = $this->loadQuery($this->bd->execSQL($this->select . " WHERE
        parking_id=:id", [':id' => $id]));
        if (count($lesParkings) > 0) {
            $unParking = $lesParkings[0];
        }
        return $unParking;
    }

}
