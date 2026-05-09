<?php
header("Content-Type: application/json");
include '../db.php';

$totalRooms = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as total FROM rooms"))['total'];
$availableRooms = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as total FROM rooms WHERE status='available'"))['total'];
$totalBookings = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as total FROM bookings"))['total'];
$totalGuests = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as total FROM users"))['total'];

echo json_encode([
    "total_rooms" => $totalRooms,
    "available_rooms" => $availableRooms,
    "total_bookings" => $totalBookings,
    "total_guests" => $totalGuests
]);
?>