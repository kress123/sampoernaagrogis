document.addEventListener("DOMContentLoaded", function () {
    loadTableData();
});

// Fungsi untuk memuat data ke dalam tabel tanpa duplikasi
function loadTableData() {
    let koordinatData = JSON.parse(localStorage.getItem("koordinatData")) || [];
    let tbody = document.getElementById("dataTabelBody");
    tbody.innerHTML = ""; // Mengosongkan tabel sebelum menambahkan data baru

    let uniqueData = [];
    let uniqueKeys = new Set(); // Set untuk menyimpan data unik berdasarkan kombinasi koordinat

    koordinatData.forEach((data) => {
        let key = `${data.latitude}-${data.longitude}-${data.labId}`;
        if (!uniqueKeys.has(key)) {
            uniqueKeys.add(key);
            uniqueData.push(data);
        }
    });

    // Simpan data unik kembali ke localStorage untuk mencegah duplikasi
    localStorage.setItem("koordinatData", JSON.stringify(uniqueData));

    uniqueData.forEach((data, index) => {
        let row = `
            <tr>
                <td>${index + 1}</td>
                <td>${data.labId}</td>
                <td>${data.blok}</td>
                <td>${data.nomorPlot}</td>
                <td>${data.nomorPokok}</td>
                <td>${data.nomorDaun}</td>
                <td>${data.latitude}</td>
                <td>${data.longitude}</td>
                <td>${data.n}</td>
                <td>${data.p}</td>
                <td>${data.k}</td>
                <td>${data.ca}</td>
                <td>${data.mg}</td>
                <td>${data.b}</td>
                <td>
                    <button onclick="lihatPeta(${data.latitude}, ${data.longitude})">Lihat Peta</button>
                    <button onclick="hapusData(${index})">Hapus</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Fungsi untuk melihat lokasi pada peta
function lihatPeta(lat, lng) {
    localStorage.setItem("selectedLocation", JSON.stringify({ lat, lng }));
    window.location.href = "peta.html";
}

// Fungsi untuk menghapus data tertentu dari tabel dan localStorage
function hapusData(index) {
    let koordinatData = JSON.parse(localStorage.getItem("koordinatData")) || [];
    koordinatData.splice(index, 1);
    localStorage.setItem("koordinatData", JSON.stringify(koordinatData));
    loadTableData(); // Perbarui tabel setelah penghapusan
}
document.addEventListener("DOMContentLoaded", function () {
    // Inisialisasi Peta
    var map = L.map("map").setView([-2.5489, 118.0149], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    dataKoordinat.forEach((data) => {
        L.marker([data.lat, data.lon])
            .addTo(map)
            .bindPopup(`Lab ID: ${data.labID} <br> Blok: ${data.blok}`);
    });

    // Tampilkan data ke tabel
    let tabelBody = document.getElementById("dataTabelBody");
    dataKoordinat.forEach((data, index) => {
        let row = tabelBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${data.labID}</td>
            <td>${data.blok}</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>${data.lat}</td>
            <td>${data.lon}</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>Jan 2024</td>
            <td><button>Hapus</button></td>
        `;
    });
});
