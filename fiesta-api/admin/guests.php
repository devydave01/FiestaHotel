<?php
header("Content-Type: application/json");
include '../db.php';

$sql = "SELECT * FROM users ORDER BY id DESC";
$result = mysqli_query($conn, $sql);

$guests = [];
while ($row = mysqli_fetch_assoc($result)) {
    unset($row['password']); // don't expose passwords
    $guests[] = $row;
}

echo json_encode($guests);
?>