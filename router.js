document.addEventListener('DOMContentLoaded', function() {
    // Seleccionamos los enlaces del sidebar
    const links = document.querySelectorAll('.nav-link');

    // Función para cargar contenido desde otro HTML
    function loadContent(url) {
        const mainContent = document.getElementById('main-content');
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                mainContent.innerHTML = html; // Cargar el contenido en el div
                // Verifica si el contenido cargado es de encuesta o mapa, y llama a las funciones correspondientes
                if (url === 'encuesta.html') {
                    cargarEncuesta(); // Llama a cargarEncuesta solo si es necesario
                } else if (url === 'centro.html') {
                    agregarMapa();
                } else if (url === 'centros-zona.html') {
                    agregarMapaZona();
                } else if (url === 'reportes.html') {
                    selectorZonas();
                }
            })
            .catch(error => {
                console.error('Error loading content:', error);
            });
    }

    // Función para obtener el rol desde la URL
    function getRoleFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('rol') || 'paciente'; // Por defecto es 'paciente' si no se especifica
    }

    // Actualizar el dropdown según el rol del usuario
    function updateUserRoleUI(role) {
        const roleNameElement = document.getElementById('user-role-name');
        const roleLinkElement = document.getElementById('user-role-link');
        
        // Modificar el nombre mostrado según el rol
        if (role === 'admin') {
            roleNameElement.textContent = 'Coordinador'; // Cambia el texto del dropdown
            roleLinkElement.href = '/?rol=admin'; // Actualiza el enlace al rol actual
        } else {
            roleNameElement.textContent = 'Paciente'; // Cambia el texto del dropdown
            roleLinkElement.href = '/?rol=paciente'; // Actualiza el enlace al rol actual
        }
    }

    // Función para mostrar u ocultar elementos según el rol
    function updateVisibilityByRole(role) {
        const pacienteElements = document.querySelectorAll('.url-paciente');
        const adminElements = document.querySelectorAll('.url-admin');

        if (role === 'admin') {
            // Mostrar los elementos para el rol "admin"
            adminElements.forEach(el => el.style.display = 'block');
            // Ocultar los elementos para el rol "paciente"
            pacienteElements.forEach(el => el.style.display = 'none');
        } else {
            // Mostrar los elementos para el rol "paciente"
            pacienteElements.forEach(el => el.style.display = 'block');
            // Ocultar los elementos para el rol "admin"
            adminElements.forEach(el => el.style.display = 'none');
        }
    }

    // Obtener el rol desde la URL y actualizar la UI
    const userRole = getRoleFromURL();
    updateUserRoleUI(userRole);
    updateVisibilityByRole(userRole);

    let initialContent = 'inicio.html'; // Contenido predeterminado

    // Cargar el contenido inicial basado en el rol
    loadContent(initialContent);

    // Escuchar el evento click en cada enlace del sidebar
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Evitar el comportamiento por defecto

            // Obtener el archivo HTML que queremos cargar
            const contentUrl = this.getAttribute('data-url');

            // Cargar el contenido dinámicamente
            loadContent(contentUrl);

            // Actualizar la clase activa del sidebar
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
