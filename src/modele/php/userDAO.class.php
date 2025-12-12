<?php


require_once __DIR__ . "/user.class.php";

class UserDAO
{
    private $bd;
    private $select;

    public function __construct()
    {
        require_once "../../modele/php/connexion.php";
        $this->bd = new Connexion();
        $this->select = "SELECT * FROM users";
    }

    private function loadQuery(array $result): array
    {
        $users = [];
        foreach ($result as $row) {
            $user = new User();
            $user->setId($row['user_id']);
            $user->setLastName($row['last_name']);
            $user->setFirstName($row['first_name']);
            $user->setMail($row['mail']);
            $user->setPasswordHash($row['password_hash']);
            $user->setPhone(intval($row['phone']));
            $user->setRegistrationDate(new DateTime($row['date']));
            $users[] = $user;
        }
        return $users;
    }

    function getAll(): array
    {
        return ($this->loadQuery($this->bd->execSQL($this->select)));
    }

    function getById(string $id): User
    {
        $user = new User();
        $users = $this->loadQuery($this->bd->execSQL($this->select . " WHERE
        user_id=:id", [':id' => $id]));
        if (count($users) > 0) {
            $user = $users[0];
        }
        return $user;
    }

}
