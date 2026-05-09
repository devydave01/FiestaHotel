<?php
header("Content-Type: application/json");
include '../db.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(["error" => "Email and password are required"]);
    exit();
}

$sql = "SELECT * FROM users WHERE email = '$email'";
$result = mysqli_query($conn, $sql);
$user = mysqli_fetch_assoc($result);

if ($user && password_verify($password, $user['password'])) {
    echo json_encode([
        "message" => "Login successful",
        "token" => base64_encode($user['id'] . ':' . $user['email']),
        "user" => [
            "id" => $user['id'],
            "name" => $user['name'],
            "email" => $user['email'],
            "role" => $user['role']
        ]
    ]);
} else {
    echo json_encode(["error" => "Invalid email or password"]);
}
?>