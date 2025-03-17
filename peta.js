document.addEventListener("DOMContentLoaded", function () {
    // Inisialisasi Peta
    var map = L.map("map").setView([-2.5489, 118.0149], 5);

    // Definisikan tile layer
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

    // Layer grup untuk menyimpan marker dari data koordinat
    let markerGroup = L.layerGroup().addTo(map);

    // Fungsi untuk mengambil data koordinat dari localStorage
    function getDataKoordinat() {
        return JSON.parse(localStorage.getItem("koordinatData")) || [];
    }

    // Fungsi untuk memperbarui marker di peta
    function updateMap() {
        markerGroup.clearLayers();
        let dataKoordinat = getDataKoordinat();

        dataKoordinat.forEach(data => {
            let marker = L.marker([parseFloat(data.latitude), parseFloat(data.longitude)])
                .bindPopup(`
                    <b>Lab ID:</b> ${data.labId} <br>
                    <b>Blok:</b> ${data.blok} <br>
                    <b>Nomor Plot:</b> ${data.nomorPlot} <br>
                    <b>Nomor Pokok:</b> ${data.nomorPokok} <br>
                    <b>Nomor Daun:</b> ${data.nomorDaun} <br>
                    <b>N%:</b> ${data.n} <br>
                    <b>P%:</b> ${data.p} <br> 
                    <b>K%:</b> ${data.k} <br>
                    <b>Ca%:</b> ${data.ca} <br>
                    <b>Mg%:</b> ${data.mg} <br>
                    <b>B (ppm):</b> ${data.b} <br>
                    <button class="route-btn" data-lat="${data.latitude}" data-lon="${data.longitude}">Tampilkan Rute</button>
                `);
            markerGroup.addLayer(marker);
        });
    }

    // Fungsi menampilkan rute perjalanan di Google Maps
    function showRoute(lat, lon) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                let userLat = position.coords.latitude;
                let userLon = position.coords.longitude;

                // Redirect ke Google Maps dengan koordinat asal dan tujuan
                let googleMapsUrl = `https://www.google.com/maps/dir/${userLat},${userLon}/${lat},${lon}/`;
                window.open(googleMapsUrl, "_blank");
            }, () => {
                alert("Lokasi Anda tidak dapat ditemukan!");
            });
        } else {
            alert("Geolocation tidak didukung di browser Anda.");
        }
    }

    // Event listener untuk tombol rute
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("route-btn")) {
            let lat = event.target.getAttribute("data-lat");
            let lon = event.target.getAttribute("data-lon");
            showRoute(parseFloat(lat), parseFloat(lon));
        }
    });

    // Fungsi Pencarian Lokasi
    function searchLocation() {
        let query = document.getElementById("search-input").value.toLowerCase();
        let dataKoordinat = getDataKoordinat();

        let found = dataKoordinat.find(item =>
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
    }

    // Event Listener untuk Pencarian
    document.getElementById("search-btn").addEventListener("click", searchLocation);
    document.getElementById("search-input").addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            searchLocation();
        }
    });

    // Perbarui peta jika data koordinat berubah di localStorage
    window.addEventListener("storage", function (event) {
        if (event.key === "koordinatData") {
            updateMap();
        }
    });

    // Panggil fungsi untuk menampilkan data di peta saat halaman dimuat
    updateMap();
});
