<?php
header("Content-Type: application/json");
include '../db.php';

$data = json_decode(file_get_contents("php://input"), true);

$room_id = $data['room_id'] ?? '';
$guest_name = $data['guest_name'] ?? '';
$guest_email = $data['guest_email'] ?? '';
$phone = $data['phone'] ?? '';
$special_requests = $data['special_requests'] ?? '';
$check_in = $data['check_in'] ?? '';
$check_out = $data['check_out'] ?? '';
$guests = $data['guests'] ?? 1;

if (!$room_id || !$guest_name || !$guest_email || !$check_in || !$check_out) {
    echo json_encode(["error" => "All fields are required"]);
    exit();
}

$sql = "INSERT INTO bookings (room_id, guest_name, guest_email, phone, special_requests, check_in, check_out, guests, status)
        VALUES ('$room_id', '$guest_name', '$guest_email', '$phone', '$special_requests', '$check_in', '$check_out', '$guests', 'pending')";

if (mysqli_query($conn, $sql)) {
    mysqli_query($conn, "UPDATE rooms SET status='unavailable' WHERE id=$room_id");
    echo json_encode(["message" => "Booking created successfully"]);
} else {
    echo json_encode(["error" => "Booking failed"]);
}
?>