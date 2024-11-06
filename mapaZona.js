function agregarMapaZona() {
    const ubicacionCentro = [-34.543740, -58.712209];
    const map = inicializarMapa(ubicacionCentro);

    cargarCentros()
        .then(zonas => {
            agregarCentrosAlMapa(zonas[0].centros, map);
        })
        .catch(error => {
            mostrarErrorCarga();
        });

    agregarCapaBaseMapa(map);
    configurarBotonEnviar();
}

function inicializarMapa(ubicacionCentro) {
    return L.map('map').setView(ubicacionCentro, 16);
}

function cargarCentros() {
    return fetch('json/centros.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        });
}

function agregarCentrosAlMapa(centros, map) {
    centros.forEach(centro => {
        const marker = crearMarcador(centro, map);
        configurarEventoClickMarcador(marker, centro);
    });
}

function crearMarcador(centro, map) {
    const marker = L.marker(centro.coordenadas).addTo(map);
    marker.bindPopup(`<b>${centro.nombre}</b>`);
    return marker;
}

function configurarEventoClickMarcador(marker, centro) {
    marker.on('click', function() {
        llenarTablaPacientes(centro.pacientes);
        mostrarTablaPacientes();
    });
}

function llenarTablaPacientes(pacientes) {
    const pacientesBody = document.getElementById('pacientes-body');
    pacientesBody.innerHTML = ''; 

    pacientes.forEach(paciente => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${paciente.nombre}</td>
            <td>${paciente.fechaConsulta}</td>
            <td>${paciente.mail}</td>
        `;
        pacientesBody.appendChild(row);
    });
}

function mostrarTablaPacientes() {
    const pacientesTable = document.getElementById('pacientes-table');
    pacientesTable.style.display = 'table'; 
}

function mostrarErrorCarga() {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'alert alert-danger';
    errorContainer.textContent = 'No se pudo cargar la lista de centros. Intente más tarde.';
    document.getElementById('map').appendChild(errorContainer);
}

function agregarCapaBaseMapa(map) {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 100,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

function configurarBotonEnviar() {
    document.getElementById('enviar-btn').addEventListener('click', function() {
        const button = this;
    
        cambiarTextoBotonEnviar(button);
        deshabilitarBotonEnviar(button);
        
        setTimeout(() => {
            cambiarTextoBotonEnviado(button);
            habilitarBotonEnviar(button);
        }, 2000); 
    });
}

function cambiarTextoBotonEnviar(button) {
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando recordatorio...';
}

function deshabilitarBotonEnviar(button) {
    button.disabled = true; 
}

function cambiarTextoBotonEnviado(button) {
    button.innerHTML = 'Enviado';
}

function habilitarBotonEnviar(button) {
    button.disabled = false;
}
