<?php


require_once "../../modele/parking.class.php";

class ParkingDAO
{
    private $bd;
    private $select;

    public function __construct()
    {
        require_once "../../modele/connexion.php";
        $this->bd = new Connexion();
        $this->select = "SELECT * FROM parkings";
    }

    private function loadQuery(array $result): array
    {
        $parkings = [];
        foreach ($result as $row) {
            $parking = new Parking();
            $parking->setId($row['parking_id']);
            $parking->setName($row['name']);
            $parking->setInsee($row['insee_code']);
            $parking->setAdresse($row['address']);
            $parking->setUrl($row['url']);
            $parking->setUserType($row['user_type']);
            $parking->setMaxHeight($row['max_height']);
            $parking->setSiret($row['siret_number']);
            $parking->setLong($row['longitude']);
            $parking->setLat($row['latitude']);
            $parking->setStructure($row['structure_type']);
            $parking->setInfo($row['info']);
            $parkings[] = $parking;
        }
        return $parkings;
    }

    function getAll(): array
    {
        return ($this->loadQuery($this->bd->execSQL($this->select)));
    }

    function getById(string $id): Parking
    {
        $unParking = new Parking();
        $lesParkings = $this->loadQuery($this->bd->execSQL($this->select . " WHERE
        parking_id=:id", [':id' => $id]));
        if (count($lesParkings) > 0) {
            $unParking = $lesParkings[0];
        }
        return $unParking;
    }

    function getSearch(string $search) : array {
        $r = $this->select . " WHERE name LIKE :search";
        return $this->loadQuery(
            $this->bd->execSQL($r, [':search' => "%$search%"])
        );
    }

}