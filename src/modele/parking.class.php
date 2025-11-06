<?php

class Parking
{
    private string $num;
    private string $libelle;

    function __construct(string $num = '', string $lib = '', string $etage = '')
    {
        $this->num = $num;
        $this->libelle = $lib;
    }

    public function getNum(): string
    {
        return $this->num;
    }

    public function setNum(string $num)
    {
        $this->num = $num;
    }

    public function getLib(): string
    {
        return $this->libelle;
    }

    public function setLib(string $lib)
    {
        $this->libelle = $lib;
    }

}
