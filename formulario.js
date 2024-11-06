function cargarEncuesta() {
    const preguntasContainer = document.getElementById('preguntas-container');

    obtenerPreguntas()
        .then(data => {
            const preguntas = data.preguntas;
            const opciones = data.opciones;

            preguntas.forEach((pregunta, index) => {
                const divPregunta = crearDivPregunta(pregunta, index);
                const radioContainer = crearRadioContainer(pregunta, opciones);

                divPregunta.appendChild(radioContainer);
                preguntasContainer.appendChild(divPregunta);
            });

            configurarFormulario(preguntas);
        })
        .catch(error => {
            mostrarErrorCarga();
        });
}

function obtenerPreguntas() {
    return fetch('json/preguntas.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        });
}

function crearDivPregunta(pregunta, index) {
    const divPregunta = document.createElement('div');
    divPregunta.className = 'p-3';

    const label = document.createElement('label');
    label.className = 'form-label';
    label.textContent = `${index + 1}. ${pregunta.pregunta}`;
    divPregunta.appendChild(label);

    return divPregunta;
}

function crearRadioContainer(pregunta, opciones) {
    const radioContainer = document.createElement('div');
    radioContainer.className = 'd-flex flex-wrap justify-content-evenly';

    opciones.forEach(opcion => {
        const divRadio = crearDivRadio(pregunta, opcion);
        radioContainer.appendChild(divRadio);
    });

    return radioContainer;
}

function crearDivRadio(pregunta, opcion) {
    const divRadio = document.createElement('div');
    divRadio.className = 'form-check form-check-inline';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = pregunta.nombre;
    input.value = opcion;
    input.id = `${pregunta.nombre}${opcion}`;
    input.className = 'form-check-input';

    const labelOpcion = document.createElement('label');
    labelOpcion.htmlFor = `${pregunta.nombre}${opcion}`;
    labelOpcion.className = 'form-check-label';
    labelOpcion.textContent = opcion;

    divRadio.appendChild(input);
    divRadio.appendChild(labelOpcion);

    return divRadio;
}

function configurarFormulario(preguntas) {
    const form = document.getElementById('encuesta-form');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        limpiarErrores();

        let todasRespondidas = true;
        const respuestas = [];

        preguntas.forEach((pregunta) => {
            const selectedOption = document.querySelector(`input[name="${pregunta.nombre}"]:checked`);

            if (selectedOption) {
                respuestas.push({ pregunta: pregunta.pregunta, respuesta: selectedOption.value });
            } else {
                todasRespondidas = false;
                mostrarErrorPregunta(pregunta);
            }
        });

        if (todasRespondidas) {
            enviarFormulario(submitButton, preguntas);
        }
    });
}

function limpiarErrores() {
    const mensajesError = document.querySelectorAll('.text-danger');
    mensajesError.forEach(mensaje => mensaje.remove());
}

function mostrarErrorPregunta(pregunta) {
    const respuestaContainer = document.createElement('div');
    respuestaContainer.className = 'mt-2 text-danger';
    respuestaContainer.textContent = `No se seleccionó respuesta para: ${pregunta.pregunta}.`;

    const parentDiv = document.querySelector(`input[name="${pregunta.nombre}"]`).closest('.p-3');
    parentDiv.appendChild(respuestaContainer);
}

function enviarFormulario(submitButton, preguntas) {
    submitButton.innerHTML = `<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only"></span></div> Enviando...`;
    submitButton.disabled = true;

    deshabilitarOpciones(preguntas);

    const comentariosInput = document.getElementById('comentarios');
    comentariosInput.disabled = true;

    setTimeout(() => {
        submitButton.textContent = "Enviado";
    }, 2000);
}

function deshabilitarOpciones(preguntas) {
    preguntas.forEach((pregunta) => {
        const allOptions = document.querySelectorAll(`input[name="${pregunta.nombre}"]`);
        allOptions.forEach(option => {
            option.disabled = true;
        });
    });
}

function mostrarErrorCarga() {
    const preguntasContainer = document.getElementById('preguntas-container');
    const errorContainer = document.createElement('div');
    errorContainer.className = 'alert alert-danger';
    errorContainer.textContent = 'No se pudo cargar la encuesta. Intente más tarde.';
    preguntasContainer.appendChild(errorContainer);
}
