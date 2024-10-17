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
                // Verifica si el contenido cargado es de encuesta y llama a cargarEncuesta
                if (url === 'encuesta.html') {
                    cargarEncuesta(); // Llama a cargarEncuesta solo si es necesario
                } else if (url === 'centro.html') {
                    agregarMapa();
                }
            })
            .catch(error => {
                console.error('Error loading content:', error);
            });
    }
    
    // Cargamos el contenido inicial (home.html)
    loadContent('inicio.html');
    
    // Escuchamos el evento click en cada enlace
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