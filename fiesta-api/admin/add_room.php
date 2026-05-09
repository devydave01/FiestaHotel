<?php
header("Content-Type: application/json");
include '../db.php';

$data = json_decode(file_get_contents("php://input"), true);

$room_number = $data['room_number'] ?? '';
$room_type = $data['room_type'] ?? '';
$price = $data['price'] ?? '';
$status = $data['status'] ?? 'available';
$description = $data['description'] ?? '';

if (!$room_number || !$room_type || !$price) {
    echo json_encode(["error" => "Room number, type and price are required"]);
    exit();
}

$sql = "INSERT INTO rooms (room_number, room_type, price, status, description) 
        VALUES ('$room_number', '$room_type', '$price', '$status', '$description')";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["message" => "Room added successfully"]);
} else {
    echo json_encode(["error" => "Failed to add room"]);
}
?>