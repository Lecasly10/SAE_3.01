<?php

require_once __DIR__ . '/userPref.class.php';

class UserPrefDAO
{
    private $bd;
    private $select;

    public function __construct()
    {
        require_once '../../modele/php/connexion.php';
        $this->bd = new Connexion();
        $this->select = 'SELECT * FROM user_preferences';
    }

    private function loadQuery(array $result): array
    {
        $prefs = [];

        foreach ($result as $row) {
            $pref = new UserPref(
                $row['user_id'],
                floatval($row['max_hourly_budget']),
                floatval($row['max_distance_km']),
                boolval($row['prefer_free']),
                boolval($row['pmr']),
                boolval($row['prefer_covered'])
            );

            $prefs[] = $pref;
        }

        return $prefs;
    }

    public function getAll(): array
    {
        return $this->loadQuery(
            $this->bd->execSQL($this->select)
        );
    }

    public function getById(string $id): UserPref
    {
        $pref = new UserPref();
        $prefs = $this->loadQuery(
            $this->bd->execSQL(
                $this->select . ' WHERE user_id = :id',
                [':id' => $id]
            )
        );

        if (count($prefs) > 0) {
            $pref = $prefs[0];
        }
        return $pref;
    }
}
