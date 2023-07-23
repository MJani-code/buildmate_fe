<?php

$servername = "mysql.nethely.hu";
$username = "lm_dev";
$password = "Ma19900114";
$dbname = "lm_dev";

try {
    // Kapcsolódás az adatbázishoz PDO-val
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // Beállítjuk az adatbázis kapcsolat karakterkódolását UTF-8-ra (opcionális, de ajánlott)
    $conn->exec("set names utf8");
    // Beállítjuk a hibakódot és kivételeket dob, ha hiba történik
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Egyszerű lekérdezés példa
    $sql = "SELECT * FROM users";
    //$result = $conn->query($sql);

    $statement = $conn->prepare("SELECT * FROM users");
    $statement->execute();
    $result = $statement->fetchAll(PDO::FETCH_ASSOC);


    if ($result) {

        // Kiírjuk a lekérdezés eredményét
        // while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        //     echo $row["id"];
        // }
    } else {
        echo "Nincs eredmény.";
    }

} catch (PDOException $e) {
    die("Sikertelen kapcsolódás: " . $e->getMessage());
}

// Bezárjuk a kapcsolatot
//$conn = null;
?>