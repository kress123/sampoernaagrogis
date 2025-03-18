<?php
$servername = "localhost";
$username = "root"; // Sesuaikan dengan username database Anda
$password = ""; // Sesuaikan dengan password database Anda
$database = "gissampoerna1"; // Nama database Anda

// Koneksi ke database
$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Ambil data dari form
$labId = $_POST['labId'];
$blok = $_POST['blok'];
$nomorPlot = $_POST['nomorPlot'];
$nomorPokok = $_POST['nomorPokok'];
$nomorDaun = $_POST['nomorDaun'];
$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];
$n = $_POST['n'];
$p = $_POST['p'];
$k = $_POST['k'];
$ca = $_POST['ca'];
$mg = $_POST['mg'];
$b = $_POST['b'];

// Query untuk menyimpan data
$sql = "INSERT INTO `blok_sawit_a` (labId, blok, nomorPlot, nomorPokok, nomorDaun, latitude, longitude, n, p, k, ca, mg, b) 
        VALUES ('$labId', '$blok', '$nomorPlot', '$nomorPokok', '$nomorDaun', '$latitude', '$longitude', '$n', '$p', '$k', '$ca', '$mg', '$b')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}

$conn->close();
?>
