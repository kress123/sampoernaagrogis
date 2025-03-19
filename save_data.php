<?php 
header("Content-Type: application/json");

// **Koneksi ke database**
$servername = "localhost";
$username = "root"; // Sesuaikan dengan username MySQL Anda
$password = ""; // Sesuaikan dengan password MySQL Anda
$database = "gissampoerna1"; // Nama database Anda

$conn = new mysqli($servername, $username, $password, $database);

// **Cek koneksi**
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Koneksi gagal: " . $conn->connect_error]));
}

// **Cek apakah metode permintaan adalah POST**
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // **Ambil data dari request**
    $labId = $_POST['labId'] ?? null;
    $blok = $_POST['blok'] ?? null;
    $nomorPlot = $_POST['nomorPlot'] ?? null;
    $nomorPokok = $_POST['nomorPokok'] ?? null;
    $nomorDaun = $_POST['nomorDaun'] ?? null;
    $latitude = $_POST['latitude'] ?? null;
    $longitude = $_POST['longitude'] ?? null;
    $n = $_POST['n'] ?? null;
    $p = $_POST['p'] ?? null;
    $k = $_POST['k'] ?? null;
    $ca = $_POST['ca'] ?? null;
    $mg = $_POST['mg'] ?? null;
    $b = $_POST['b'] ?? null;

    // **Cek apakah ada data yang kosong**
    if (!$labId || !$blok || !$nomorPlot || !$nomorPokok || !$nomorDaun || !$latitude || !$longitude) {
        echo json_encode(["status" => "error", "message" => "Semua kolom wajib diisi!"]);
        exit();
    }

    // **Query untuk menyimpan data ke database**
    $sql = "INSERT INTO blok_sawit_a (labId, blok, nomorPlot, nomorPokok, nomorDaun, latitude, longitude, n, p, k, ca, mg, b) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("sssssssssssss", $labId, $blok, $nomorPlot, $nomorPokok, $nomorDaun, $latitude, $longitude, $n, $p, $k, $ca, $mg, $b);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Data berhasil disimpan"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menyimpan data: " . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menyiapkan query: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Metode request tidak valid"]);
}

$conn->close();
?>
