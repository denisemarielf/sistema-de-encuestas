document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.nav-link');
    
    const contenidoInicial = 'inicio.html';
    const rolUsuario = obtenerRolDesdeURL();

    actualizarUIConRol(rolUsuario);
    actualizarVisibilidadPorRol(rolUsuario);

    cargarContenido(contenidoInicial);

    enlacesSidebar(links);
});

function cargarContenido(url) {
    const mainContent = document.getElementById('main-content');
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            mainContent.innerHTML = html;
            cargarFuncionesSegunContenido(url);
        })
        .catch(error => {
            console.error('Error loading content:', error);
        });
}

function cargarFuncionesSegunContenido(url) {
    if (url === 'encuesta.html') {
        cargarEncuesta();
    } else if (url === 'centro.html') {
        agregarMapa();
    } else if (url === 'centros-zona.html') {
        agregarMapaZona();
    } else if (url === 'reportes.html') {
        selectorZonas();
    }
}

function obtenerRolDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('rol') || 'paciente';
}

function actualizarUIConRol(rol) {
    const roleNameElement = document.getElementById('user-role-name');
    const roleLinkElement = document.getElementById('user-role-link');
    
    if (rol === 'admin') {
        roleNameElement.textContent = 'Coordinador';
        roleLinkElement.href = '/?rol=admin';
    } else {
        roleNameElement.textContent = 'Paciente';
        roleLinkElement.href = '/?rol=paciente';
    }
}

function actualizarVisibilidadPorRol(rol) {
    const elementosPaciente = document.querySelectorAll('.url-paciente');
    const elementosAdmin = document.querySelectorAll('.url-admin');

    if (rol === 'admin') {
        mostrarElementos(elementosAdmin);
        ocultarElementos(elementosPaciente);
    } else {
        mostrarElementos(elementosPaciente);
        ocultarElementos(elementosAdmin);
    }
}

function mostrarElementos(elementos) {
    elementos.forEach(el => el.style.display = 'block');
}

function ocultarElementos(elementos) {
    elementos.forEach(el => el.style.display = 'none');
}

function enlacesSidebar(links) {
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            const contenidoUrl = this.getAttribute('data-url');
            cargarContenido(contenidoUrl);

            actualizarClaseActiva(link);
        });
    });
}

function actualizarClaseActiva(link) {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
}
