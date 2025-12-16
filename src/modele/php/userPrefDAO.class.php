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

    public function getById(string $id): ?UserPref
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
            return $pref;
        }
        return null;
    }

    function create(UserPref $user): bool
    {
        $pdo = $this->bd->getPDO();

        $stmt = $pdo->prepare('
        INSERT INTO user_preferences (user_id)
        VALUES (:id)
    ');

        $stmt->execute([
            ':id' => intval($user->getId()),
        ]);

        return $stmt->rowCount() === 1;
    }

    function update(UserPref $user): bool
    {
        $pdo = $this->bd->getPDO();

        $stmt = $pdo->prepare('
        UPDATE user_preferences
        SET 
            pmr = :pmr,
            prefer_free = :free,
            prefer_covered = :cover,
            max_hourly_budget = :maxh,
            max_distance_km = :maxd
        WHERE user_id = :id
    ');

        $stmt->execute([
            ':pmr' => intval($user->getIsPmr()),
            ':free' => intval($user->getPreferFree()),
            ':cover' => intval($user->getPreferCovered()),
            ':maxh' => floatval($user->getMaxHourlyBudget()),
            ':maxd' => floatval($user->getMaxDistance()),
            ':id' => intval($user->getId()),
        ]);

        return $stmt->rowCount() === 1;
    }
}
