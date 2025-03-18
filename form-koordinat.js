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

    // === 3. Event Ketika Menggambar Objek ===
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

    // === 4. Fungsi Menyimpan Data ke Database MySQL melalui save_data.php ===
    window.saveDrawingData = function(lat, lng) {
        let formData = new FormData();
        formData.append("labId", document.getElementById("labIdInput").value);
        formData.append("blok", document.getElementById("blokInput").value);
        formData.append("nomorPlot", document.getElementById("nomorPlotInput").value);
        formData.append("nomorPokok", document.getElementById("nomorPokokInput").value);
        formData.append("nomorDaun", document.getElementById("nomorDaunInput").value);
        formData.append("latitude", lat);
        formData.append("longitude", lng);

        fetch("save_data.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Data berhasil disimpan ke database!");
                window.location.href = "tabel-data.html";
            } else {
                alert("Terjadi kesalahan: " + data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    };

    // === 5. Event Listener untuk Form Input Data ===
    document.getElementById("koordinatForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let formData = new FormData(this);

        fetch("save_data.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Data berhasil disimpan ke database!");
                window.location.href = "tabel-data.html";
            } else {
                alert("Terjadi kesalahan: " + data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    });
});
