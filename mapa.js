function agregarMapa() {
    var ubicacionCentro = [-34.543740, -58.712209]
    var map = L.map('map').setView(ubicacionCentro, 16);
    var ubicacionCentro = L.marker(ubicacionCentro).addTo(map);
    ubicacionCentro.bindPopup("<b>Hospital Municipal</b><br>Dr. Raúl F. Larcade.").openPopup();

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 100,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
}

