const preguntas = [
    {
        pregunta: "Califique la organización del centro de salud:",
        nombre: "organizacion",
    },
    {
        pregunta: "Califique el tiempo que esperó para ser atendido:",
        nombre: "tiempo_espera",
    },
    {
        pregunta: "Califique la atención del personal médico:",
        nombre: "atencion_personal",
    },
    {
        pregunta: "Califique la limpieza del centro de salud:",
        nombre: "limpieza",
    },
    {
        pregunta: "Califique la información proporcionada:",
        nombre: "informacion",
    },
    {
        pregunta: "Califique la disponibilidad de medicamentos:",
        nombre: "medicamentos",
    },
    {
        pregunta: "Califique la comodidad de las instalaciones:",
        nombre: "comodidad",
    },
    {
        pregunta: "Califique el tiempo de espera en la sala:",
        nombre: "tiempo_sala",
    },
    {
        pregunta: "Califique la atención en el proceso de registro:",
        nombre: "atencion_registro",
    },
    {
        pregunta: "Califique su satisfacción general con el servicio:",
        nombre: "satisfaccion_general",
    },
];

const opciones = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"
];



function cargarEncuesta(){
    const preguntasContainer = document.getElementById('preguntas-container');
    preguntas.forEach((pregunta, index) => {
        const divPregunta = document.createElement('div');
        divPregunta.className = 'p-3';
        
        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = `${index + 1}. ${pregunta.pregunta}`;
        divPregunta.appendChild(label);
    
        const radioContainer = document.createElement('div');
        radioContainer.className = 'd-flex flex-wrap justify-content-evenly';
    
        opciones.forEach((opcion, i) => {
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

        console.log(preguntasContainer)
        console.log(divPregunta)
    
        divPregunta.appendChild(radioContainer);
        preguntasContainer.appendChild(divPregunta);
    });
    
}

