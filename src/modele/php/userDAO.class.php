<?php

require_once __DIR__ . '/user.class.php';

class UserDAO
{
    private $bd;
    private $select;

    public function __construct()
    {
        require_once '../../modele/php/connexion.php';
        $this->bd = new Connexion();
        $this->select = 'SELECT * FROM users';
    }

    private function loadQuery(array $result): array
    {
        $users = [];
        foreach ($result as $row) {
            $user = new User();
            $user->setId($row['user_id']);
            $user->setLastName($row['last_name']);
            $user->setFirstName($row['first_name']);
            $user->setMail($row['email']);
            $user->setPasswordHash($row['password_hash']);
            $user->setPhone(intval($row['phone']));
            $user->setRegistrationDate(new DateTime($row['registration_date']));
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
        $users = $this->loadQuery($this->bd->execSQL($this->select . ' WHERE
        user_id=:id', [':id' => $id]));
        if (count($users) > 0) {
            $user = $users[0];
        }
        return $user;
    }

    function getByMail(string $mail): User
    {
        $user = new User();
        $users = $this->loadQuery($this->bd->execSQL($this->select . ' WHERE
        email=:mail', [':mail' => $mail]));
        if (count($users) > 0) {
            $user = $users[0];
        }
        return $user;
    }

    function create(User $user): boolval
    {
        $result = true;
        $req = 'INSERT INTO users (email) (last_name) (first_name) (password_hash) (phone) (registration_date) VALUES (:mail) (:name) (:surname) (:passw) (:tel) (:date)';
        $ex = $this->bd->execSQL($req, [
            ':mail' => $user->getMail(),
            ':name' => $user->getLastName(),
            ':surname' => $user->getFirstName(),
            ':passw' => $user->getPasswordHash(),
            ':tel' => $user->getPhone(),
            ':date' => $user->getRegistrationDate()
        ]);

        if ($ex->rowCount() === 1) {
            $res = true;
            $user->setId($ex->lastInsertId());
        } else {
            $res = false;
        }
        return $res;
    }
}
