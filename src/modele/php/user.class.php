<?php

class User
{
    private string $id;
    private string $lastName;
    private string $firstName;
    private string $mail;
    private string $passwordHash;
    private int $phone;
    private DateTime $registrationDate;

    function __construct(
        string $id = '',
        string $lastName = '',
        string $firstName ='',
        string $mail='',
        string $passwordHash='',
        int $phone=0,
        ?DateTime $registrationDate=null,
    ) {
        $this->id = $id;
        $this->lastName = $lastName;
        $this->firstName = $firstName;
        $this->mail = $mail;
        $this->passwordHash = $passwordHash;
        $this->phone = $phone;
        $this->registrationDate = $registrationDate ?? new DateTime();

    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(?string $id)
    {
        $this->id = $id;
    }


    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastname)
    {
        $this->lastName = $lastname;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstname)
    {
        $this->firstName = $firstname;
    }

    public function getMail(): ?string
    {
        return $this->mail;
    }

    public function setMail(?string $mail)
    {
        $this->mail = $mail;
    }

    public function getPhone(): ?int
    {
        return $this->phone;
    }

    public function setPhone(?int $phone)
    {
        $this->phone = $phone;
    }

    public function getPasswordHash(): ?string
    {
        return $this->passwordHash;
    }

    public function setPasswordHash(?string $passwordHash)
    {
        $this->passwordHash = $passwordHash;
    }

    public function getRegistrationDate(): ?DateTime
    {
        return $this->registrationDate;
    }

    public function setRegistrationDate(?DateTime $registrationDate)
    {
        $this->registrationDate = $registrationDate;
    }

}