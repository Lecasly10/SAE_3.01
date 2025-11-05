<?php

class Connexion
{
    private $db;

    function __construct()
    {
        try {
            include __DIR__ . '/../conf/conf.inc.php';
            $this->db = new PDO(
                $conf['SGBD'] . ':host=' . $conf['HOST'] . ';dbname=' . $conf['DB_NAME'],
                $conf['USER'],
                $conf['PASSWORD'],
                array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8')
            );

            unset($db_config);
        } catch (Exception $exception) {
            die($exception->getMessage());
        }
    }

    public function execSQL(string $req, array $values = []): array
    {
        try {
            $res = $this->db->prepare($req);
            $res->execute($values);
            return $res->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $exception) {
            die($exception->getMessage());
        }
    }
}
