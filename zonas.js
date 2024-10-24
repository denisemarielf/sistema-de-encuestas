function selectorZonas(){



    var map = L.map('map').setView([-34.543740, -58.712209], 16);

    // Cargar capa base del mapa
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Cargar el archivo JSON usando fetch
    fetch('json/centros.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(zonas => {
            const zonaSelect = document.getElementById('zona-select');

            // Llenar el select con las zonas
            zonas.forEach((zona, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = zona.zona;
                zonaSelect.appendChild(option);
            });

            // Escuchar el cambio de selección de la zona
            zonaSelect.addEventListener('change', function() {
                const selectedIndex = this.value;
                if (selectedIndex === "") {
                    return;
                }

                // Limpiar el mapa antes de agregar nuevos centros
                map.eachLayer(layer => {
                    if (layer instanceof L.Marker) {
                        map.removeLayer(layer);
                    }
                });

                // Agregar los centros de la zona seleccionada al mapa
                const selectedZona = zonas[selectedIndex];
                selectedZona.centros.forEach(centro => {
                    var marker = L.marker(centro.coordenadas).addTo(map);
                    marker.bindPopup(`<b>${centro.nombre}</b>`);

                    // Evento al hacer clic en el marcador para mostrar la tabla de pacientes
                    marker.on('click', function() {
                        const pacientesBody = document.getElementById('pacientes-body');
                        pacientesBody.innerHTML = ''; // Limpiar tabla

                        centro.pacientes.forEach(paciente => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${paciente.nombre}</td>
                                <td>${paciente.fechaConsulta}</td>
                                <td>${paciente.mail}</td>
                            `;
                            pacientesBody.appendChild(row);
                        });

                        // Mostrar la tabla
                        const pacientesTable = document.getElementById('pacientes-table');
                        pacientesTable.style.display = 'table';
                    });
                });

                // Centrar el mapa en la primera coordenada de la zona seleccionada
                if (selectedZona.centros.length > 0) {
                    map.setView(selectedZona.centros[0].coordenadas, 16);
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            const errorContainer = document.createElement('div');
            errorContainer.className = 'alert alert-danger';
            errorContainer.textContent = 'No se pudo cargar la lista de centros. Intente más tarde.';
            document.getElementById('map').appendChild(errorContainer);
        });
}