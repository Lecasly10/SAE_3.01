<?php

class Vehicule
{
    private string $id;
    private string $type;
    private string $motor;
    private float $vehiculeHeight;
    private string $plate;
    private string $userId;

    public function __construct(
        string $id = '',
        string $type = '',
        string $motor = '',
        float $vehiculeHeight = 0,
        string $plate = '',
        string $userId = ''
    ) {
        $this->id = $id;
        $this->type = $type;
        $this->motor = $motor;
        $this->vehiculeHeight = $vehiculeHeight;
        $this->plate = $plate;
        $this->userId = $userId;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getMotor(): string
    {
        return $this->motor;
    }

    public function getVehiculeHeight(): int
    {
        return $this->vehiculeHeight;
    }

    public function getPlate(): string
    {
        return $this->plate;
    }

    public function getUserId(): string
    {
        return $this->userId;
    }

    public function setId(string $id): void
    {
        $this->id = $id;
    }

    public function setType(string $type): void
    {
        $this->type = $type;
    }

    public function setMotor(string $motor): void
    {
        $this->motor = $motor;
    }

    public function setVehiculeHeight(int $vehiculeHeight): void
    {
        $this->vehiculeHeight = $vehiculeHeight;
    }

    public function setPlate(string $plate): void
    {
        $this->plate = $plate;
    }

    public function setUserId(string $userId): void
    {
        $this->userId = $userId;
    }
}
