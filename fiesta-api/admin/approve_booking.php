<?php
header("Content-Type: application/json");
include '../db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? '';

if (!$id) {
    echo json_encode(["error" => "Booking ID is required"]);
    exit();
}

$sql = "UPDATE bookings SET status='approved' WHERE id=$id";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["message" => "Booking approved successfully"]);
} else {
    echo json_encode(["error" => "Failed to approve booking"]);
}
?>