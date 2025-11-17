<?php 

class ParkingCapacity
{
    private string $id;
    private int $total;
    private int $pmr;
    private int $electricCar;
    private int $bicycle;
    private int $electric2W;
    private int $motorCycle;
    private int $carPool;
    private int $pr;

    function __construct(
        string $id = '',
        int $total = 0,
        int $pmr= 0,
        int $electricCar= 0,
        int $bicycle= 0,
        int $electric2W= 0,
        int $motorCycle= 0,
        int $carPool= 0,
        int $pr= 0
    ) {
        $this->id = $id;
        $this->pmr = $pmr;
        $this->electricCar = $electricCar;
        $this->total = $total;
        $this->carPool = $carPool;
        $this->pr = $pr;
        $this->electric2W = $electric2W;
        $this->bicycle = $bicycle;
        $this->motorCycle = $motorCycle;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id)
    {
        $this->id = $id;
    }

    public function getTotal() : int {
        return $this->total;
    }

    public function setTotal(int $total) {
        $this->total = $total;
    }

    public function getPmr() : int {
        return $this->pmr;
    }

    public function setPmr(int $pmr) {
        $this->pmr = $pmr;
    }

    public function getElectric2W() : int {
        return $this->electric2W;
    }

    public function setElectric2W(int $electric2W) {
        $this->electric2W = $electric2W;
    }
    
    public function getElectricCar() : int {
        return $this->electricCar;
    }

    public function setElectricCar(int $electricCar) {
        $this->electricCar = $electricCar;
    }

    public function getPr() : int {
        return $this->pr;
    }

    public function setPr(int $pr) {
        $this->pr = $pr;
    }

    public function getBicycle() : int {
        return $this->bicycle;
    }

    public function setBicycle(int $bicycle) {
        $this->bicycle = $bicycle;
    }

    public function getCarPool() : int {
        return $this->carPool;
    }

    public function setCarPool(int $carPool) {
        $this->carPool = $carPool;
    }

    public function getMotorCycle() : int {
        return $this->motorCycle;
    }

    public function setMotorCycle(int $motorCycle) {
        $this->motorCycle = $motorCycle;
    }

  
}


?>