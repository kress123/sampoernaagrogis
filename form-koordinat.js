document.addEventListener("DOMContentLoaded", function () {
    // === 1. Cek Peran User ===
    const userRole = localStorage.getItem("userRole");

    if (userRole !== "admin") {
        alert("Akses ditolak! Hanya admin yang dapat mengakses halaman ini.");
        window.location.href = "login.html";
        return; // Stop eksekusi script lebih lanjut
    }

    // === 2. Inisialisasi Peta ===
    var map = L.map("map").setView([-2.5489, 118.0149], 5); // Koordinat default Indonesia

    var googleSatellite = L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
        subdomains: ["mt0", "mt1", "mt2", "mt3"]
    }).addTo(map);

    var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");

    var googleStreet = L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        subdomains: ["mt0", "mt1", "mt2", "mt3"]
    });

    var baseMaps = {
        "Google Satelit": googleSatellite,
        "OpenStreetMap": osm,
        "Google Street": googleStreet
    };
    L.control.layers(baseMaps).addTo(map);

    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItems },
        draw: { polygon: true, polyline: true, rectangle: true, circle: false, marker: true }
    });
    map.addControl(drawControl);

    // === 3. Load Data yang Tersimpan ===
    function loadDrawings() {
        var savedData = localStorage.getItem("mapDrawings");
        if (savedData) {
            JSON.parse(savedData).forEach(function (geoJson) {
                var layer = L.geoJSON(geoJson);
                drawnItems.addLayer(layer);
            });
        }
    }
    loadDrawings();

    // === 4. Event Ketika Menggambar Objek ===
    map.on("draw:created", function (e) {
        var layer = e.layer;
        drawnItems.addLayer(layer);

        var latlng = e.layerType === "marker" ? layer.getLatLng() : layer.getLatLngs()[0][0];

        var formHtml = `
            <div>
                <label>Lab ID:</label><input type="text" id="labIdInput" required><br>
                <label>Blok:</label><input type="text" id="blokInput" required><br>
                <label>Nomor Plot:</label><input type="text" id="nomorPlotInput" required><br>
                <label>Nomor Pokok:</label><input type="text" id="nomorPokokInput" required><br>
                <label>Nomor Daun:</label><input type="text" id="nomorDaunInput" required><br>
                <button onclick="saveDrawingData(${latlng.lat}, ${latlng.lng})">Simpan</button>
            </div>
        `;

        layer.bindPopup(formHtml).openPopup();
    });

    // === 5. Fungsi Menyimpan Data Gambar ke localStorage ===
    function saveDrawingData(lat, lng) {
        var data = {
            labId: document.getElementById("labIdInput").value,
            blok: document.getElementById("blokInput").value,
            nomorPlot: document.getElementById("nomorPlotInput").value,
            nomorPokok: document.getElementById("nomorPokokInput").value,
            nomorDaun: document.getElementById("nomorDaunInput").value,
            latitude: lat,
            longitude: lng
        };

        var drawings = JSON.parse(localStorage.getItem("mapDrawings")) || [];
        drawings.push(data);
        localStorage.setItem("mapDrawings", JSON.stringify(drawings));

        alert("Data berhasil disimpan!");
    }

    // === 6. Menyimpan Form Input Koordinat ke localStorage ===
    document.getElementById("koordinatForm").addEventListener("submit", function (e) {
        e.preventDefault();

        var dataKoordinat = {
            no: document.getElementById("no").value,
            labId: document.getElementById("labId").value,
            blok: document.getElementById("blok").value,
            nomorPlot: document.getElementById("nomorPlot").value,
            nomorPokok: document.getElementById("nomorPokok").value,
            nomorDaun: document.getElementById("nomorDaun").value,
            latitude: parseFloat(document.getElementById("latitude").value),
            longitude: parseFloat(document.getElementById("longitude").value),
            n: document.getElementById("n").value,
            p: document.getElementById("p").value,
            k: document.getElementById("k").value,
            ca: document.getElementById("ca").value,
            mg: document.getElementById("mg").value,
            b: document.getElementById("b").value
        };

        var koordinatList = JSON.parse(localStorage.getItem("koordinatData")) || [];
        koordinatList.push(dataKoordinat);
        localStorage.setItem("koordinatData", JSON.stringify(koordinatList));

        alert("Data berhasil disimpan dan ditampilkan di tabel-data.html!");
        window.location.href = "tabel-data.html";
    });

    // === 7. Perbaiki Link ke Dashboard Admin ===
    const dashboardAdminLink = document.querySelector(".sidebar a[href='dashboard-admin.html']");
    if (dashboardAdminLink) {
        dashboardAdminLink.addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = "dashboard-admin.html";
        });
    }
});
document.getElementById("koordinatForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let formData = new FormData(this);

    fetch("save_data.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert("Data berhasil disimpan!");
            window.location.href = "tabel-data.html";
        } else {
            alert("Terjadi kesalahan: " + data.message);
        }
    })
    .catch(error => console.error("Error:", error));
});
