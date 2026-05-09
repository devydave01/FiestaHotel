<?php
header("Content-Type: application/json");
include '../db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? '';

if (!$id) {
    echo json_encode(["error" => "Room ID is required"]);
    exit();
}

$sql = "DELETE FROM rooms WHERE id=$id";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["message" => "Room deleted successfully"]);
} else {
    echo json_encode(["error" => "Failed to delete room"]);
}
?>