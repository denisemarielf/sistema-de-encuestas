function agregarMapa() {

  const mapModal = document.getElementById('mapModal');
  mapModal.addEventListener('shown.bs.modal', function () {

    const ubicacionCentro = [-34.543740, -58.712209]

    var map = L.map('map').setView(ubicacionCentro, 16);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.marker(ubicacionCentro).addTo(map)
      .bindPopup("<b>Hospital Municipal</b><br>Dr. Raúl F. Larcade.")
      .openPopup();
  });
}

