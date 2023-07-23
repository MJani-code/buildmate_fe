<?php
require('conn.php');
require('../vendor/autoload.php');
session_start();

use \Firebase\JWT\JWT;

//$length = 32; // 32 bájtos kulcs (256 bites)
//$secretKey = bin2hex(random_bytes($length));
$secretKey = '0815bd5951b692cfd181cb677d75d034f2be8edf9bf70729737106a1f3c9335c';

// Egyszerű bejelentkezési logika
//$_SERVER['REQUEST_METHOD'] === 'POST'
if (true) {

    try {
        $email = 'martonjanos1990@gmail.com';
        $password = sha1('Ma19900114');

        // $email = $_POST['email'];
        // $password = sha1($_POST['password']);

        // Itt helyezd el a valós bejelentkezési logikát, például adatbázis lekérdezéssel
        $stmt = $conn->prepare(
            "SELECT * FROM users u
            LEFT JOIN users_roles ur ON ur.id = u.role_id
            WHERE email = :email AND password = :password
            ");
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $password);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($result) {
            $header = array(
                "typ" => "JWT",
                "alg" => "HS256",
                "kid" => "unique-key-id"// Adj meg egy egyedi kulcs azonosítót
            );
            //Lejárati idő meghatározása
            $currentTimestamp = time();
            $expirationTimestamp = strtotime('+8 hours', $currentTimestamp);

            // JWT kibocsátása
            $payload = array(
                'email' => $email,
                'expirationTime' => $expirationTimestamp
            );
            $jwt = JWT::encode($payload, $secretKey, 'HS256');

            $response = array(
                "loginstatus" => "success",
                "loginmessage" => "Sikeres bejelentkezés!",
                "userrole" => $result[0]['name'],
                "userstatus" => $result[0]['status'],
                "token" => $jwt
            );

            // HTTP fejlécek beállítása a válaszban
            $_SESSION['token_response'] = $response;

            //echo json_encode($_SESSION);
            print_r($_SESSION);
            print_r($result);

    }else {
        http_response_code(401);
        echo json_encode(array('error' => 'Hibás felhasználónév vagy jelszó.'));
        exit;
    }
    }catch (Exception $e) {
        echo json_encode("Hiba történt a bejelentkezés közben: " . $e->getMessage());
        exit;
    }

}
?>