function agregarMapaZona() {
    var ubicacionCentro = [-34.543740, -58.712209];
    var map = L.map('map').setView(ubicacionCentro, 16);

    // Cargar el archivo JSON usando fetch
    fetch('json/centros.json') // Asegúrate de que la ruta sea correcta
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(zonas => {
            // Agregar cada centro al mapa
            zonas[0].centros.forEach(centro => {
                var marker = L.marker(centro.coordenadas).addTo(map);
                marker.bindPopup(`<b>${centro.nombre}</b>`);
        
                // Agregar evento de clic en el marcador
                marker.on('click', function() {
                    // Llenar la tabla con los pacientes del centro seleccionado
                    const pacientesBody = document.getElementById('pacientes-body');
                    pacientesBody.innerHTML = ''; // Limpiar la tabla antes de llenarla
        
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
                    pacientesTable.style.display = 'table'; // Mostrar la tabla
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            const errorContainer = document.createElement('div');
            errorContainer.className = 'alert alert-danger';
            errorContainer.textContent = 'No se pudo cargar la lista de centros. Intente más tarde.';
            document.getElementById('map').appendChild(errorContainer);
        });

    // Agregar capa base del mapa
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 100,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    document.getElementById('enviar-btn').addEventListener('click', function() {
        const button = this;
    
        // Cambiar el texto del botón a "Enviando recordatorio"
        button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando recordatorio...';
        button.disabled = true; // Deshabilitar el botón para evitar múltiples clics   
        
        setTimeout(() => {
            button.innerHTML = 'Enviado';
            button.disabled = false; // Rehabilitar el botón si es necesario
        }, 2000); // Simula un retraso de 2 segundos para el envío
    });

}

