<?php
header("Content-Type: application/json");
include '../db.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(["error" => "Room ID is required"]);
    exit();
}

$sql = "SELECT * FROM rooms WHERE id = $id";
$result = mysqli_query($conn, $sql);
$room = mysqli_fetch_assoc($result);

if ($room) {
    echo json_encode($room);
} else {
    echo json_encode(["error" => "Room not found"]);
}
?>