<?php

class ParkingTarif
{
    private string $id;
    private bool $is_free;
    private float $pmr_rate;
    private float $rate_1h;
    private float $rate_2h;
    private float $rate_3h;
    private float $rate_4h;
    private float $rate_24h;
    private int $resident_sub;
    private int $nonresident_sub;

    function __construct(
        string $id = '',
        bool $is_free = false, 
        float $pmr_rate = 0.0,
        float $rate_1h = 0.0,
        float $rate_2h = 0.0,
        float $rate_3h = 0.0,
        float $rate_4h = 0.0,
        float $rate_24h = 0.0,
        int $resident_sub = 0,
        int $nonresident_sub  = 0,
    ) {
        $this->id = $id;
        $this->is_free = $is_free;
        $this->pmr_rate = $pmr_rate;
        $this->rat_1h = $rat_1h;
        $this->rat_2h = $rat_2h;
        $this->rat_3h = $rat_3h;
        $this->rat_4h = $rat_4h;
        $this->rat_24h = $rat_24h;
        $this->resident_sub = $resident_sub;
        $this->nonresident_sub = $nonresident_sub;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id)
    {
        $this->id = $id;
    }
    public function getFree(): bool
    {
        return $this->is_free;
    }

    public function setFree(bool $is_free)
    {
        $this->is_free = $is_free;
    }
    public function getPmrRate(): float
    {
        return $this->pmr_rate;
    }

    public function setPmrRate(float $pmr_rate)
    {
        $this->pmr_rate = $pmr_rate;
    }

    public function getRate1h(): float
    {
        return $this->rate_1h;
    }

    public function setRate1h(float $rate_1h)
    {
        $this->rate_1h = $rate_1h;
    }

        public function getRate2h(): float
    {
        return $this->rate_2h;
    }

    public function setRate2h(float $rate_2h)
    {
        $this->rate_2h = $rate_2h;
    }

        public function getRate3h(): float
    {
        return $this->rate_3h;
    }

    public function setRate3h(float $rate_3h)
    {
        $this->rate_3h = $rate_3h;
    }

        public function getRate4h(): float
    {
        return $this->rate_4h;
    }

    public function setRate4h(float $rate_4h)
    {
        $this->rate_4h = $rate_4h;
    }

        public function getRate24h(): float
    {
        return $this->rate_24h;
    }

    public function setRate24h(float $rate_24h)
    {
        $this->rate_24h = $rate_24h;
    }

    public function getResidentSub(): int
    {
        return $this->resident_sub;
    }

    public function setResidentSub(int $resident_sub)
    {
        $this->resident_sub = $resident_sub;
    }

    public function getNonResidentSub(): int
    {
        return $this->nonresident_sub;
    }

    public function setNonResidentSub(int $nonresident_sub)
    {
        $this->nonresident_sub = $nonresident_sub;
    }

}
