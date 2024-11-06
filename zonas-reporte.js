function selectorZonas() {
    const mapa = crearMapa();
    cargarCapaBaseMapa(mapa);

    cargarCentros()
        .then(zonas => {
            const zonaSelect = document.getElementById('zona-select');
            llenarSelectConZonas(zonas, zonaSelect);
            agregarEventoCambioZona(zonas, zonaSelect, mapa);
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensajeError('No se pudo cargar la lista de centros. Intente más tarde.');
        });
}

function crearMapa() {
    return L.map('map').setView([-34.543740, -58.712209], 16);
}

function cargarCapaBaseMapa(mapa) {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapa);
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

function llenarSelectConZonas(zonas, zonaSelect) {
    zonas.forEach((zona, index) => {
        const opcion = document.createElement('option');
        opcion.value = index;
        opcion.textContent = zona.zona;
        zonaSelect.appendChild(opcion);
    });
}

function agregarEventoCambioZona(zonas, zonaSelect, mapa) {
    zonaSelect.addEventListener('change', function() {
        const indiceSeleccionado = this.value;
        if (indiceSeleccionado === "") {
            return;
        }

        limpiarMarcadoresMapa(mapa);
        agregarCentrosZonaAlMapa(zonas, indiceSeleccionado, mapa);
        centrarMapaEnZona(zonas, indiceSeleccionado, mapa);
    });
}

function limpiarMarcadoresMapa(mapa) {
    mapa.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            mapa.removeLayer(layer);
        }
    });
}

function agregarCentrosZonaAlMapa(zonas, indiceSeleccionado, mapa) {
    const zonaSeleccionada = zonas[indiceSeleccionado];
    zonaSeleccionada.centros.forEach(centro => {
        const marcador = L.marker(centro.coordenadas).addTo(mapa);
        marcador.bindPopup(`<b>${centro.nombre}</b>`);
        agregarEventoClicMarcador(centro, marcador);
    });
}

function agregarEventoClicMarcador(centro, marcador) {
    marcador.on('click', function() {
        const pacientesBody = document.getElementById('pacientes-body');
        pacientesBody.innerHTML = ''; 

        if (centro.evaluaciones && centro.evaluaciones.length > 0) {
            centro.evaluaciones.forEach((evaluacion, i) => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>Respuesta ${i + 1}</td>
                    <td>${evaluacion.organizacion}</td>
                    <td>${evaluacion.tiempo_espera}</td>
                    <td>${evaluacion.atencion_personal}</td>
                    <td>${evaluacion.limpieza}</td>
                    <td>${evaluacion.informacion}</td>
                    <td>${evaluacion.medicamentos}</td>
                    <td>${evaluacion.comodidad}</td>
                    <td>${evaluacion.tiempo_sala}</td>
                    <td>${evaluacion.atencion_registro}</td>
                    <td>${evaluacion.satisfaccion_general}</td>
                    <td>${evaluacion.comentario || "-"}</td>
                `;
                pacientesBody.appendChild(fila);
            });

            mostrarTablaPacientes();
        } else {
            mostrarMensajeNoRespuestas();
        }
    });
}

function mostrarTablaPacientes() {
    const pacientesTable = document.getElementById('pacientes-table');
    pacientesTable.style.display = 'table';
}

function mostrarMensajeNoRespuestas() {
    const noResponsesMessage = document.createElement('tr');
    noResponsesMessage.innerHTML = `<td colspan="12">No hay respuestas disponibles para este centro de salud.</td>`;
    const pacientesBody = document.getElementById('pacientes-body');
    pacientesBody.appendChild(noResponsesMessage);
}

function centrarMapaEnZona(zonas, indiceSeleccionado, mapa) {
    const zonaSeleccionada = zonas[indiceSeleccionado];
    if (zonaSeleccionada.centros.length > 0) {
        mapa.setView(zonaSeleccionada.centros[0].coordenadas, 16);
    }
}

function mostrarMensajeError(mensaje) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'alert alert-danger';
    errorContainer.textContent = mensaje;
    document.getElementById('map').appendChild(errorContainer);
}
