function cargarEncuesta() {
    const preguntasContainer = document.getElementById('preguntas-container');
    
    // Cargar el archivo JSON usando fetch
    fetch('json/preguntas.json') // Asegúrate de que la ruta sea correcta
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            const preguntas = data.preguntas;
            const opciones = data.opciones;

            preguntas.forEach((pregunta, index) => {
                const divPregunta = document.createElement('div');
                divPregunta.className = 'p-3';
                
                const label = document.createElement('label');
                label.className = 'form-label';
                label.textContent = `${index + 1}. ${pregunta.pregunta}`;
                divPregunta.appendChild(label);
            
                const radioContainer = document.createElement('div');
                radioContainer.className = 'd-flex flex-wrap justify-content-evenly';
            
                opciones.forEach((opcion) => {
                    const divRadio = document.createElement('div');
                    divRadio.className = 'form-check form-check-inline';
                    
                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = pregunta.nombre;
                    input.value = opcion;
                    input.id = `${pregunta.nombre}${opcion}`;
                    input.className = 'form-check-input';
                    radioContainer.appendChild(divRadio);
                    
                    const labelOpcion = document.createElement('label');
                    labelOpcion.htmlFor = `${pregunta.nombre}${opcion}`;
                    labelOpcion.className = 'form-check-label';
                    labelOpcion.textContent = opcion;
                    
                    divRadio.appendChild(input);
                    divRadio.appendChild(labelOpcion);
                });
            
                divPregunta.appendChild(radioContainer);
                preguntasContainer.appendChild(divPregunta);
            });

            const form = document.getElementById('encuesta-form');
            const submitButton = form.querySelector('button[type="submit"]');

            form.addEventListener('submit', function(event) {
                event.preventDefault(); // Evita que se recargue la página al enviar el formulario

                // Limpiar mensajes de error previos
                const mensajesError = form.querySelectorAll('.text-danger');
                mensajesError.forEach(mensaje => mensaje.remove());

                // Variable para verificar si todas las preguntas están respondidas
                let todasRespondidas = true;
                const respuestas = [];

                // Recorrer todas las preguntas
                preguntas.forEach((pregunta) => {
                    const selectedOption = document.querySelector(`input[name="${pregunta.nombre}"]:checked`);

                    if (selectedOption) {
                        // Almacenar la respuesta
                        respuestas.push({ pregunta: pregunta.pregunta, respuesta: selectedOption.value });
                    } else {
                        // Si no hay ninguna opción seleccionada, mostrar un mensaje de advertencia
                        todasRespondidas = false;
                        const respuestaContainer = document.createElement('div');
                        respuestaContainer.className = 'mt-2 text-danger';
                        respuestaContainer.textContent = `No se seleccionó respuesta para: ${pregunta.pregunta}.`;

                        const parentDiv = document.querySelector(`input[name="${pregunta.nombre}"]`).closest('.p-3');
                        parentDiv.appendChild(respuestaContainer);
                    }
                });

                if (todasRespondidas) {
                    // Simular el envío
                    submitButton.innerHTML = `<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only"></span></div> Enviando...`; // Cambiar texto del botón
                    submitButton.disabled = true; // Deshabilitar botón
                    
                    preguntas.forEach((pregunta) => {
                        // Deshabilitar todos los inputs de radio para esta pregunta
                        const allOptions = document.querySelectorAll(`input[name="${pregunta.nombre}"]`);
                        allOptions.forEach(option => {
                            option.disabled = true; // Deshabilitar los radios
                        });
                    });

                    // Deshabilitar el campo de comentarios
                    const comentariosInput = document.getElementById('comentarios');
                    comentariosInput.disabled = true; // Deshabilitar comentarios

                    // Simular un retraso para enviar
                    setTimeout(() => {
                        submitButton.textContent = "Enviado"; 
                    }, 2000);
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            const errorContainer = document.createElement('div');
            errorContainer.className = 'alert alert-danger';
            errorContainer.textContent = 'No se pudo cargar la encuesta. Intente más tarde.';
            preguntasContainer.appendChild(errorContainer);
        });
}