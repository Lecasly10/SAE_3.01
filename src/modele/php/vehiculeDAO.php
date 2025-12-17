<?php

require_once __DIR__ . '/vehicule.class.php';

class VehiculeDAO
{
    private $bd;
    private $select;

    public function __construct()
    {
        require_once '../../modele/php/connexion.php';
        $this->bd = new Connexion();
        $this->select = 'SELECT * FROM vehicles';
    }

    private function loadQuery(array $result): array
    {
        $prefs = [];

        foreach ($result as $row) {
            $pref = new Vehicule(
                $row['vehicle_id'],
                $row['vehicle_type'],
                $row['motorization'],
                $row['vehicle_height'],
                $row['license_plate'],
                $row['user_id']
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

    public function getByUserId(string $id): ?Vehicule
    {
        $pref = new Vehicule();
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

    function create(Vehicule $v): bool
    {
        $pdo = $this->bd->getPDO();

        $stmt = $pdo->prepare('
        INSERT INTO vehicles (user_id)
        VALUES (:id)
    ');

        return $stmt->execute([
            ':id' => intval($v->getUserId()),
        ]);
    }

    function update(Vehicule $v): bool
    {
        $pdo = $this->bd->getPDO();

        $stmt = $pdo->prepare('
        UPDATE vehicles
        SET 
            vehicle_type:type
            motorization:motor
            vehicle_height:height
            license_plate:plate
        WHERE user_id = :id
    ');

        return $stmt->execute([
            ':type' => $v->getType(),
            ':motor' => $v->getMotor(),
            ':height' => $v->getVehiculeHeight(),
            ':plate' => $v->getPlate(),
            ':id' => $v->getUserId(),
        ]);
    }
}
