<?php
header("Content-Type: application/json");
include '../db.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? '';
$room_number = $data['room_number'] ?? '';
$room_type = $data['room_type'] ?? '';
$price = $data['price'] ?? '';
$status = $data['status'] ?? 'available';
$description = $data['description'] ?? '';

if (!$id) {
    echo json_encode(["error" => "Room ID is required"]);
    exit();
}

$sql = "UPDATE rooms SET 
        room_number='$room_number', 
        room_type='$room_type', 
        price='$price', 
        status='$status', 
        description='$description' 
        WHERE id=$id";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["message" => "Room updated successfully"]);
} else {
    echo json_encode(["error" => "Failed to update room"]);
}
?>