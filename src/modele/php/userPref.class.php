<?php

class UserPref
{
    private string $id;
    private float $maxHourlyBudget;
    private float $maxDistance;
    private bool $preferFree;
    private bool $isPmr;
    private bool $preferCovered;

    public function __construct(
        string $id = '',
        float $maxHourlyBudget = 0,
        float $maxDistance = 0,
        bool $preferFree = false,
        bool $isPmr = false,
        bool $preferCovered = false
    ) {
        $this->id = $id;
        $this->maxHourlyBudget = $maxHourlyBudget;
        $this->maxDistance = $maxDistance;
        $this->preferFree = $preferFree;
        $this->isPmr = $isPmr;
        $this->preferCovered = $preferCovered;
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(?string $id): void
    {
        $this->id = $id;
    }

    public function getMaxHourlyBudget(): float
    {
        return $this->maxHourlyBudget;
    }

    public function setMaxHourlyBudget(float $maxHourlyBudget): void
    {
        $this->maxHourlyBudget = $maxHourlyBudget;
    }

    public function getMaxDistance(): float
    {
        return $this->maxDistance;
    }

    public function setMaxDistance(float $maxDistance): void
    {
        $this->maxDistance = $maxDistance;
    }

    public function getPreferFree(): bool
    {
        return $this->preferFree;
    }

    public function setPreferFree(bool $preferFree): void
    {
        $this->preferFree = $preferFree;
    }

    public function getIsPmr(): bool
    {
        return $this->isPmr;
    }

    public function setIsPmr(bool $isPmr): void
    {
        $this->isPmr = $isPmr;
    }

    public function getPreferCovered(): bool
    {
        return $this->preferCovered;
    }

    public function setPreferCovered(bool $preferCovered): void
    {
        $this->preferCovered = $preferCovered;
    }
}