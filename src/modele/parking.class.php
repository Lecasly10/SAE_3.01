<?php

class Parking
{
    private string $id;
    private string $name;
    private int $inseeCode;
    private string $adresse;
    private string $url;
    private string $userType;
    private int $maxHeight;
    private int $siretNumber;
    private int $long;
    private int $lat; 
    private string $structure;
    private string $info;

    function __construct(
        string $id = '',
        string $name = '', 
        int $inseeCode = 0,
        string $adresse = '',
        string $url = '',
        string $userType = '',
        int $maxHeight = 0,
        int $siretNumber = 0,
        int $long = 0,
        int $lat = 0,
        string $structure = '',
        string $info = '',
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->adresse = $adresse;
        $this->long = $long;
        $this->lat = $lat;
        $this->structure = $structure;
        $this->info = $info;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id)
    {
        $this->id = $id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name)
    {
        $this->name = $name;
    }

    public function getAdresse(): string
    {
        return $this->adresse;
    }

    public function setAdresse(string $adresse)
    {
        $this->adresse = $adresse;
    }

    public function getLong(): int
    {
        return $this->long;
    }

    public function setLong(int $long)
    {
        $this->long = $long;
    }

    public function getLat(): int
    {
        return $this->lat;
    }

    public function setLat(int $lat)
    {
        $this->lat = $lat;
    }

    public function getStructure(): string
    {
        return $this->structure;
    }

    public function setStructure(string $structure)
    {
        $this->structure = $structure;
    }

    public function getInfo(): string
    {
        return $this->info;
    }

    public function setInfo(string $info)
    {
        $this->info = $info;
    }

    public function getInsee(): int
    {
        return $this->inseeCode;
    }

    public function setInsee(int $inseeCode)
    {
        $this->inseeCode = $inseeCode;
    }

    public function getUrl(): string
    {
        return $this->url;
    }

    public function setUrl(string $url)
    {
        $this->url = $url;
    }

    public function getUserType(): string
    {
        return $this->userType;
    }

    public function setUserType(string $userType)
    {
        $this->userType = $userType;
    }    
    public function getMaxHeight(): int
    {
        return $this->maxHeight;
    }

    public function setMaxHeight(int $maxHeight)
    {
        $this->maxHeight = $maxHeight;
    }

    public function getSiret(): int
    {
        return $this->siretNumber;
    }

    public function setSiret(int $siretNumber)
    {
        $this->siretNumber = $siretNumber;
    }

}
