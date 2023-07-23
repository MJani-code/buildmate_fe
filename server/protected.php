<?php
require('../vendor/autoload.php');
session_start();


use \Firebase\JWT\JWT;
use Firebase\JWT\Key;


$secretKey = '0815bd5951b692cfd181cb677d75d034f2be8edf9bf70729737106a1f3c9335c';
$key = base64_encode($secretKey);


// JWT ellenőrzése


$token = $_SESSION['jwt_token'] ?? '';
echo $token;
if (!$token) {
    http_response_code(403);
    echo json_encode(array('error' => 'A hozzáférés megtagadva. Hiányzó JWT token.'));
    exit;
}

try {
    $header = array(
        "typ" => "JWT",
        "alg" => "HS256",
        "kid" => "unique-key-id"// Adj meg egy egyedi kulcs azonosítót
    );
    $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
    $username = $decoded->username;
    echo $username;
} catch (Exception $e) {
    echo $e;
    http_response_code(500);
    echo json_encode(array('error' => 'Érvénytelen JWT token.'));
    exit;
}

// Itt érdemes meghatározni, hogy mely útvonalak a védett útvonalak
$protectedRoutes = array('/protected', '/another_protected_route');

// Ellenőrizzük, hogy a kérés útvonala szerepel-e a védett útvonalak között
// if (!in_array($_SERVER['REQUEST_URI'], $protectedRoutes)) {
//     http_response_code(403);
//     echo json_encode(array('error' => 'A hozzáférés megtagadva. Nincs jogosultságod az adott útvonalhoz.'));
//     exit;
// }

// A védett útvonalhoz tartozó kód, például adatlekérdezés vagy műveletek
//echo json_encode(array('message' => 'Védett útvonal, csak bejelentkezett felhasználóknak engedélyezett.'));
?>