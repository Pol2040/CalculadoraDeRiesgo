/**
 * Lógica base de la Calculadora de Riesgo
 */

// Definición de las preguntas
const QUESTIONS = [
    // Bloque 1: Operación y Flota
    {
        category: 'Operación y Flota',
        text: 'Antigüedad promedio de la flota:',
        options: [
            { text: 'Menos de 5 años', points: 0 },
            { text: 'Entre 5 y 10 años', points: 2 },
            { text: 'Más de 10 años', points: 4 }
        ]
    },
    {
        category: 'Operación y Flota',
        text: 'Tipo de operación principal:',
        options: [
            { text: 'Carga general liviana', points: 1 },
            { text: 'Carga pesada / larga distancia', points: 3 },
            { text: 'Mercancías peligrosas', points: 5 }
        ]
    },
    {
        category: 'Operación y Flota',
        text: 'Kilómetros promedio mensuales por unidad:',
        options: [
            { text: 'Menos de 8.000 km', points: 1 },
            { text: '8.000 a 15.000 km', points: 3 },
            { text: 'Más de 15.000 km', points: 5 }
        ]
    },
    {
        category: 'Operación y Flota',
        text: 'Turnos de conducción:',
        options: [
            { text: 'Solo diurno', points: 1 },
            { text: 'Rotativo', points: 3 },
            { text: 'Mayormente nocturno', points: 5 }
        ]
    },
    // Bloque 2: Conductores
    {
        category: 'Conductores',
        text: 'Experiencia promedio de los conductores:',
        options: [
            { text: 'Más de 10 años', points: 0 },
            { text: 'Entre 3 y 10 años', points: 2 },
            { text: 'Menos de 3 años', points: 4 }
        ]
    },
    {
        category: 'Conductores',
        text: 'Rotación anual de choferes:',
        options: [
            { text: 'Baja', points: 0 },
            { text: 'Media', points: 3 },
            { text: 'Alta', points: 5 }
        ]
    },
    {
        category: 'Conductores',
        text: 'Historial de siniestros últimos 12 meses:',
        options: [
            { text: 'Ninguno', points: 0 },
            { text: 'Siniestros leves', points: 3 },
            { text: 'Siniestros graves', points: 5 }
        ]
    },
    {
        category: 'Conductores',
        text: '¿Se detectan hábitos de riesgo (velocidad, distracción)?',
        options: [
            { text: 'No', points: 0 },
            { text: 'Ocasionalmente', points: 3 },
            { text: 'Frecuentemente', points: 5 }
        ]
    },
    // Bloque 3: Gestión del Riesgo
    {
        category: 'Gestión del Riesgo',
        text: '¿Se realizan capacitaciones periódicas?',
        options: [
            { text: 'Sí, anualmente o más frecuente', points: 0 },
            { text: 'Esporádicamente', points: 3 },
            { text: 'No', points: 5 }
        ]
    },
    {
        category: 'Gestión del Riesgo',
        text: '¿Existe seguimiento posterior a la capacitación?',
        options: [
            { text: 'Sí, sistemático', points: 0 },
            { text: 'Parcial', points: 3 },
            { text: 'No', points: 5 }
        ]
    },
    {
        category: 'Gestión del Riesgo',
        text: '¿Existen protocolos escritos de conducción segura?',
        options: [
            { text: 'Sí y se controlan', points: 0 },
            { text: 'Sí pero no se controlan', points: 3 },
            { text: 'No existen', points: 5 }
        ]
    },
    // Bloque 4: Impacto Económico y Legal
    {
        category: 'Impacto Económico y Legal',
        text: 'Evolución de primas de seguro en 2 años:',
        options: [
            { text: 'Se mantuvieron', points: 1 },
            { text: 'Aumentaron levemente', points: 3 },
            { text: 'Aumentaron significativamente', points: 5 }
        ]
    },
    {
        category: 'Impacto Económico y Legal',
        text: '¿Se registran y analizan costos indirectos de siniestros?',
        options: [
            { text: 'Sí', points: 0 },
            { text: 'Parcialmente', points: 3 },
            { text: 'No', points: 5 }
        ]
    },
    {
        category: 'Impacto Económico y Legal',
        text: 'Nivel de conocimiento del marco legal vigente:',
        options: [
            { text: 'Alto', points: 0 },
            { text: 'Medio', points: 3 },
            { text: 'Bajo', points: 5 }
        ]
    }
];

// Estado de la aplicación
const state = {
    leads: {
        name: '',
        role: '',
        company: '',
        email: ''
    },
    currentQuestionIndex: 0,
    totalPoints: 0,
    answers: []
};

/**
 * Maneja la navegación entre secciones
 */
function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(s => s.classList.remove('active'));

    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (sectionName === 'quiz') {
            startQuiz();
        }
    }
}

/**
 * Captura los datos del formulario (Lead Capture)
 */
function handleAuth(event) {
    event.preventDefault();

    state.leads = {
        name: document.getElementById('user-name').value,
        role: document.getElementById('user-role').value,
        company: document.getElementById('user-company').value,
        email: document.getElementById('user-email').value
    };

    console.log('Lead capturado:', state.leads);
    showSection('quiz');
}

/**
 * Inicia el proceso del quiz
 */
function startQuiz() {
    state.currentQuestionIndex = 0;
    state.totalPoints = 0;
    state.answers = [];
    renderQuestion();
}

/**
 * Renderiza la pregunta actual
 */
function renderQuestion() {
    const question = QUESTIONS[state.currentQuestionIndex];
    const totalQuestions = QUESTIONS.length;

    // Actualizar progreso
    document.getElementById('question-count').innerText = `Pregunta ${state.currentQuestionIndex + 1} de ${totalQuestions}`;

    // Actualizar categoría y texto si existiera un elemento para categoría
    // Por ahora usamos el h2 existente para el texto
    document.getElementById('question-text').innerHTML = `
        <span style="font-size: 0.9rem; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 0.5rem;">
            ${question.category}
        </span>
        ${question.text}
    `;

    // Renderizar opciones
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.innerText = option.text;
        button.onclick = () => handleAnswer(option.points);
        optionsContainer.appendChild(button);
    });
}

/**
 * Procesa la respuesta seleccionada
 */
function handleAnswer(points) {
    state.totalPoints += points;
    state.answers.push(points);

    if (state.currentQuestionIndex < QUESTIONS.length - 1) {
        state.currentQuestionIndex++;
        renderQuestion();
    } else {
        showResults();
    }
}

/**
 * Muestra el resultado final
 */
function showResults() {
    const score = state.totalPoints;
    let riskType = '';
    let screenText = '';
    let pdfText = '';
    let accentColor = '';

    const footerText = `
---------------------------------------------------------------------------------------------
Gracias por completar el Diagnóstico de Riesgo Operativo en Conducción Profesional.

Según el análisis realizado, su operación presenta un NIVEL DE RIESGO [LEVEL], [DESCRIPTION].

Descargue el Informe Ejecutivo con el detalle del análisis y recomendaciones preventivas.

Si lo considera oportuno, podemos agendar una reunión breve de análisis para revisar oportunidades de mejora y fortalecer lo que ya funciona correctamente.

Saludos cordiales,
Sergio De Rosa
LEX Recursos Humanos`;

    if (score <= 20) {
        riskType = 'RIESGO BAJO';
        accentColor = '#10b981'; // Verde
        screenText = 'La operación presenta buenas prácticas instaladas. Existen oportunidades de mejora preventiva para sostener los resultados en el tiempo.';
        pdfText = `RIESGO BAJO:
La operación presenta buenas prácticas instaladas. Existen oportunidades de mejora preventiva para sostener los resultados en el tiempo.
---------------------------------------------------------------------------------------------
Gracias por completar el Diagnóstico de Riesgo Operativo en Conducción Profesional.

Según la información brindada, su operación presenta un NIVEL DE RIESGO BAJO, lo que indica que existen buenas prácticas instaladas en materia de conducción y gestión del riesgo.

Descargue el Informe Ejecutivo con el detalle del análisis y recomendaciones preventivas.

Si lo considera oportuno, podemos agendar una reunión breve de análisis para revisar oportunidades de mejora y fortalecer lo que ya funciona correctamente.

Saludos cordiales,
Sergio De Rosa
LEX Recursos Humanos`;
    } else if (score <= 40) {
        riskType = 'RIESGO MEDIO';
        accentColor = '#f59e0b'; // Amarillo/Ambar
        screenText = 'Se detectan prácticas que pueden derivar en siniestros evitables y aumento de costos si no se implementan acciones correctivas.';
        pdfText = `RIESGO MEDIO:
Se detectan prácticas que pueden derivar en siniestros evitables y aumento de costos si no se implementan acciones correctivas.
---------------------------------------------------------------------------------------------
Gracias por completar el Diagnóstico de Riesgo Operativo en Conducción Profesional.

De acuerdo con las respuestas obtenidas, su operación presenta un NIVEL DE RIESGO MEDIO, lo que implica una oportunidad concreta de mejora antes de que el riesgo se traduzca en siniestros evitables y sobrecostos.

Adjunto encontrará el Informe Ejecutivo con los riesgos detectados y recomendaciones iniciales.

Quedo a disposición para ampliar el análisis si lo considera oportuno.

Saludos cordiales,
Sergio De Rosa
LEX Recursos Humanos`;
    } else {
        riskType = 'RIESGO ALTO';
        accentColor = '#ef4444'; // Rojo
        screenText = 'Existe una alta exposición al riesgo operativo, económico y legal, incrementando la probabilidad de incidentes y sobrecostos.';
        pdfText = `RIESGO ALTO:
Existe una alta exposición al riesgo operativo, económico y legal, incrementando la probabilidad de incidentes y sobrecostos.
---------------------------------------------------------------------------------------------
Gracias por completar el Diagnóstico de Riesgo Operativo en Conducción Profesional.

Según el análisis realizado, su operación presenta un NIVEL DE RIESGO ALTO, con una exposición significativa en términos operativos, económicos y legales.

Adjunto encontrará el Informe Ejecutivo con el detalle de los principales factores de riesgo y recomendaciones iniciales.

Le sugiero evaluar el contenido con atención y quedo a disposición para profundizar el análisis.

Saludos cordiales,
Sergio De Rosa
LEX Recursos Humanos`;
    }

    document.getElementById('risk-type').innerText = riskType;
    document.getElementById('risk-type').style.color = accentColor;
    document.getElementById('risk-description').innerHTML = `
        <p>${screenText}</p>
        <p style="margin-top: 1.5rem; font-style: italic; font-size: 1rem;">
            Descargue el informe completo en PDF para ver el detalle de las recomendaciones.
        </p>
    `;

    // Preparar contenido para el PDF (oculto en pantalla)
    const pdfOutput = document.getElementById('pdf-content');
    if (pdfOutput) {
        pdfOutput.innerText = pdfText;
    }

    showSection('result');
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('Calculadora de Riesgo inicializada');
});
