<?php
header("Content-Type: application/json");
include '../db.php';

$sql = "SELECT bookings.*, rooms.room_number, rooms.room_type 
        FROM bookings 
        JOIN rooms ON bookings.room_id = rooms.id 
        ORDER BY bookings.id DESC";

$result = mysqli_query($conn, $sql);

$bookings = [];
while ($row = mysqli_fetch_assoc($result)) {
    $bookings[] = $row;
}

echo json_encode($bookings);
?>