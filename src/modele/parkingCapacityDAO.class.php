<?php


require_once __DIR__ . "/parkingCapacity.class.php";

class ParkingCapacityDAO
{
    private $bd;
    private $select;

    public function __construct()
    {
        require_once "../../modele/connexion.php";
        $this->bd = new Connexion();
        $this->select = "SELECT * FROM parking_capacity";
    }

    private function loadQuery(array $result): array
    {
        $capacities = [];
        foreach ($result as $row) {
            $capacity = new ParkingCapacity();
            $capacity->setId($row['parking_id']);
            $capacity->setTotal($row['total_spaces']);
            $capacity->setPmr($row['pmr_spaces']);
            $capacity->setElectric2W($row['electric_2w_spaces']);
            $capacity->setElectricCar($row['electric_car_spaces']);
            $capacity->setBicycle($row['bicycle_spaces']);
            $capacity->setMotorCycle($row['motorcycle_spaces']);
            $capacity->setCarPool($row['carpool_spaces']);
            $capacity->setPr($row['pr_spaces']);
            $capacities[] = $capacity;
        }
        return $capacities;
    }

    function getAll(): array
    {
        return ($this->loadQuery($this->bd->execSQL($this->select)));
    }

    function getById(string $id): ParkingCapacity
    {
        $capacity = new ParkingCapacity();
        $capacities = $this->loadQuery($this->bd->execSQL($this->select . " WHERE
        parking_id=:id", [':id' => $id]));
        if (count($capacities) > 0) {
            $capacity = $capacities[0];
        }
        return $capacity;
    }

}