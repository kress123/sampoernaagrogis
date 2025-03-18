document.addEventListener("DOMContentLoaded", function () {
    // === 1. Inisialisasi Peta ===
    var map = L.map("map").setView([-2.5489, 118.0149], 5);

    // === 2. Tambahkan Basemap ===
    var baseLayers = {
        "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }),
        "Google Satelit": L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
            maxZoom: 20,
            subdomains: ["mt0", "mt1", "mt2", "mt3"]
        })
    };

    baseLayers["OpenStreetMap"].addTo(map);
    L.control.layers(baseLayers).addTo(map);

    // === 3. Layer Grup untuk Menyimpan Marker ===
    let markerGroup = L.layerGroup().addTo(map);

    // === 4. Ambil Data dari MySQL melalui `get_data.php` ===
    function loadMarkers() {
        fetch("get_data.php")
        .then(response => response.json())
        .then(data => {
            markerGroup.clearLayers(); // Hapus marker sebelumnya
            data.forEach(item => {
                let marker = L.marker([parseFloat(item.latitude), parseFloat(item.longitude)])
                    .bindPopup(`
                        <b>Lab ID:</b> ${item.labId} <br>
                        <b>Blok:</b> ${item.blok} <br>
                        <b>Nomor Plot:</b> ${item.nomorPlot} <br>
                        <b>Nomor Pokok:</b> ${item.nomorPokok} <br>
                        <b>Nomor Daun:</b> ${item.nomorDaun} <br>
                        <b>N%:</b> ${item.n} <br>
                        <b>P%:</b> ${item.p} <br>
                        <b>K%:</b> ${item.k} <br>
                        <b>Ca%:</b> ${item.ca} <br>
                        <b>Mg%:</b> ${item.mg} <br>
                        <b>B (ppm):</b> ${item.b} <br>
                        <button class="route-btn" data-lat="${item.latitude}" data-lon="${item.longitude}">Tampilkan Rute</button>
                    `);
                markerGroup.addLayer(marker);
            });
        })
        .catch(error => console.error("Error:", error));
    }

    // === 5. Fungsi Menampilkan Rute ke Lokasi di Google Maps ===
    function showRoute(lat, lon) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                let userLat = position.coords.latitude;
                let userLon = position.coords.longitude;

                // Buka Google Maps dengan koordinat asal dan tujuan
                let googleMapsUrl = `https://www.google.com/maps/dir/${userLat},${userLon}/${lat},${lon}/`;
                window.open(googleMapsUrl, "_blank");
            }, () => {
                alert("Lokasi Anda tidak dapat ditemukan!");
            });
        } else {
            alert("Geolocation tidak didukung di browser Anda.");
        }
    }

    // === 6. Event Listener untuk Tombol "Tampilkan Rute" ===
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("route-btn")) {
            let lat = event.target.getAttribute("data-lat");
            let lon = event.target.getAttribute("data-lon");
            showRoute(parseFloat(lat), parseFloat(lon));
        }
    });

    // === 7. Fungsi Pencarian Lokasi ===
    function searchLocation() {
        let query = document.getElementById("search-input").value.toLowerCase();

        fetch("get_data.php")
        .then(response => response.json())
        .then(data => {
            let found = data.find(item =>
                item.nomorPlot.toLowerCase().includes(query) ||
                item.blok.toLowerCase().includes(query) ||
                item.labId.toLowerCase().includes(query)
            );

            if (found) {
                map.setView([parseFloat(found.latitude), parseFloat(found.longitude)], 15);
                L.popup()
                    .setLatLng([parseFloat(found.latitude), parseFloat(found.longitude)])
                    .setContent(`
                        <b>Lab ID:</b> ${found.labId} <br>
                        <b>Blok:</b> ${found.blok} <br>
                        <b>Nomor Plot:</b> ${found.nomorPlot} <br>
                        <button class="route-btn" data-lat="${found.latitude}" data-lon="${found.longitude}">Tampilkan Rute</button>
                    `)
                    .openOn(map);
            } else {
                alert("Lokasi tidak ditemukan.");
            }
        });
    }

    // === 8. Event Listener untuk Pencarian ===
    document.getElementById("search-btn").addEventListener("click", searchLocation);
    document.getElementById("search-input").addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            searchLocation();
        }
    });

    // === 9. Panggil Fungsi untuk Memuat Data ke Peta ===
    loadMarkers();

    // === 10. Perbarui peta saat data berubah di database ===
    setInterval(loadMarkers, 10000); // Memuat ulang data setiap 10 detik
});
