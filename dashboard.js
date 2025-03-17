document.addEventListener("DOMContentLoaded", function () {
  let map;
  let baseLayers;

  function showSection(sectionId) {
      document.querySelectorAll("section").forEach(section => {
          section.classList.add("hidden");
      });
      document.getElementById(sectionId).classList.remove("hidden");
  }

  document.getElementById("dashboard-link").addEventListener("click", function () {
      showSection("dashboard-overview");
  });

  document.getElementById("map-link").addEventListener("click", function () {
      showSection("map-section");
      setTimeout(loadMap, 100);
  });

  function loadMap() {
      if (map) return;

      map = L.map("map").setView([-2.5489, 118.0149], 5);

      let osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '© OpenStreetMap' });
      let satelliteLayer = L.tileLayer("https://{s}.google.com/earth/vt/lyrs=s&x={x}&y={y}&z={z}", { subdomains: ["mt0", "mt1", "mt2", "mt3"], attribution: '© Google Maps' });
      let terrainLayer = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", { attribution: '© OpenTopoMap' });

      baseLayers = {
          "osm": osmLayer,
          "satellite": satelliteLayer,
          "terrain": terrainLayer
      };

      osmLayer.addTo(map);

      document.getElementById("basemapSelect").addEventListener("change", function () {
          let selectedLayer = this.value;
          map.eachLayer(layer => map.removeLayer(layer));
          baseLayers[selectedLayer].addTo(map);
      });

      let koordinatData = JSON.parse(localStorage.getItem("koordinat")) || [];
      koordinatData.forEach(koordinat => {
          L.marker([koordinat.lat, koordinat.lng]).addTo(map)
              .bindPopup(`<b>${koordinat.desc}</b><br>Lat: ${koordinat.lat}, Lng: ${koordinat.lng}`);
      });
  }

  document.getElementById("logout-link").addEventListener("click", function () {
      window.location.href = "login.html";
  });
});
// Inisialisasi Peta
var map = L.map('map').setView([-2.5489, 118.0149], 5); // Koordinat Indonesia

// Layer Peta
var baseMaps = {
    "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }),
    "Satelit": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenTopoMap contributors'
    }),
    "Terrain": L.tileLayer('https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=YOUR_API_KEY', {
        attribution: '&copy; Thunderforest'
    })
};

// Default Peta
baseMaps["OpenStreetMap"].addTo(map);

// Event Pilihan Basemap
document.getElementById("basemapSelect").addEventListener("change", function() {
    var selectedLayer = this.value;
    map.eachLayer(function(layer) {
        map.removeLayer(layer);
    });
    baseMaps[selectedLayer].addTo(map);
});

