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
    answers: [],
    currentEmailSubject: '',
    currentEmailBody: '',
    // URL de Google Apps Script (Reemplazar con la URL generada al implementar el script)
    googleSheetUrl: 'https://script.google.com/macros/s/AKfycbwOp9v-OlWGMuc2ni0gN1PdOA4KzOLpo5e2k9EkiqMGhjntWEDjE0d95w7XqDXqud0K/exec'
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

    const userData = {
        name: document.getElementById('user-name').value,
        role: document.getElementById('user-role').value,
        company: document.getElementById('user-company').value,
        email: document.getElementById('user-email').value
    };

    state.leads = userData;

    // Ofrecer ser recordado usando las herramientas del navegador (confirm)
    const shouldRemember = confirm(`${userData.name}, ¿deseas que te recordemos en este dispositivo para que la próxima vez entres directamente?`);

    if (shouldRemember) {
        localStorage.setItem('riesgo_user', JSON.stringify(userData));
    } else {
        localStorage.removeItem('riesgo_user');
    }

    console.log('Lead capturado:', state.leads);

    // Notificación visual breve
    if (shouldRemember) {
        console.log('Perfil guardado en este dispositivo.');
    }

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
        <span class="category-label">
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
    let emailBody = '';
    let emailSubject = '';
    let accentColor = '';

    if (score <= 20) {
        riskType = 'RIESGO BAJO';
        accentColor = '#10b981'; // Verde
        screenText = 'La operación presenta buenas prácticas instaladas. Existen oportunidades de mejora preventiva para sostener los resultados en el tiempo.';
        emailSubject = 'Resultado de su Evaluación de Riesgo Operativo';
        emailBody = `Hola, ${state.leads.name}
Gracias por completar la Radiografía Ejecutiva de Riesgo Operativo.
Según sus respuestas, su operación presenta un NIVEL DE RIESGO BAJO.
Esto indica que existen buenas prácticas instaladas y un control operativo adecuado. Sin embargo, incluso en escenarios favorables, la experiencia demuestra que la prevención continua es clave para sostener estos resultados en el tiempo.
Quedo a disposición.
Saludos cordiales,
Sergio De Rosa
LEX Recursos Humanos`;
    } else if (score <= 40) {
        riskType = 'RIESGO MEDIO';
        accentColor = '#f59e0b'; // Amarillo/Ambar
        screenText = 'Se detectan prácticas que pueden derivar en siniestros evitables y aumento de costos si no se implementan acciones correctivas.';
        emailSubject = 'Resultado de su Evaluación de Riesgo Operativo';
        emailBody = `Hola, ${state.leads.name}
Gracias por completar el diagnóstico.
Según la información proporcionada, su operación presenta un NIVEL DE RIESGO MEDIO.
Este nivel indica que existen prácticas y hábitos que podrían derivar en siniestros evitables o sobrecostos si no se intervienen de forma preventiva.
Quedo atento.
Saludos,
Sergio De Rosa
LEX Recursos Humanos`;
    } else {
        riskType = 'RIESGO ALTO';
        accentColor = '#ef4444'; // Rojo
        screenText = 'Existe una alta exposición al riesgo operativo, económico y legal, incrementando la probabilidad de incidentes y sobrecostos.';
        emailSubject = 'Recomendación tras su Evaluación de Riesgo Operativo';
        emailBody = `Hola, ${state.leads.name}
Gracias por completar la evaluación.
Según sus respuestas, su operación presenta un NIVEL DE RIESGO ALTO, lo que implica una exposición significativa en términos operativos, económicos y legales.
Quedo a disposición.
Saludos cordiales,
Sergio De Rosa
LEX Recursos Humanos`;
    }

    // Guardar el asunto y cuerpo para el envío posterior
    state.currentEmailSubject = emailSubject;
    state.currentEmailBody = emailBody;

    document.getElementById('risk-type').innerText = riskType;
    document.getElementById('risk-type').style.color = accentColor;
    document.getElementById('risk-description').innerHTML = `
        <p>${screenText}</p>
        <p class="result-note">
            Descargue el informe completo en PDF para ver el detalle de las recomendaciones.
        </p>
    `;

    // Preparar contenido para el PDF (oculto en pantalla)
    const pdfOutput = document.getElementById('pdf-content');
    if (pdfOutput) {
        pdfOutput.innerText = emailBody; // Usamos el mismo cuerpo extenso para el PDF

        // Cargar datos del lead en el encabezado del PDF
        document.getElementById('pdf-user-name').innerText = state.leads.name;
        document.getElementById('pdf-user-company').innerText = state.leads.company;
        document.getElementById('pdf-date').innerText = new Date().toLocaleDateString();
    }

    // Guardar automáticamente en Google Sheets
    const dataToSave = {
        name: state.leads.name,
        email: state.leads.email,
        company: state.leads.company,
        role: state.leads.role,
        riskType: riskType,
        points: score
    };
    saveToGoogleSheet(dataToSave);

    showSection('result');
}

/**
 * Envía los datos a Google Sheets usando Apps Script
 */
async function saveToGoogleSheet(data) {
    if (!state.googleSheetUrl || state.googleSheetUrl.includes('XXXXXXXXXXXX')) {
        console.warn('Google Sheets URL no configurada correctamente.');
        return;
    }

    try {
        // Usamos mode: 'no-cors' ya que Google Apps Script a veces da problemas con CORS
        // aunque el éxito no sea detectable desde JS, el dato llega a la hoja.
        await fetch(state.googleSheetUrl, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        console.log('Datos enviados a Google Sheets');
    } catch (error) {
        console.error('Error al enviar a Google Sheets:', error);
    }
}

/**
 * Envía los resultados por correo electrónico de forma automática usando EmailJS
 */
function sendEmail() {
    if (!state.leads.email) {
        alert("No se encontró un correo electrónico asociado.");
        return;
    }

    const btn = document.querySelector('.btn-secondary');
    const originalText = btn.innerText;

    // Estado de carga
    btn.disabled = true;
    btn.innerText = "Enviando...";

    const riskType = document.getElementById('risk-type').innerText;
    const reportContent = state.currentEmailBody || document.getElementById('pdf-content').innerText;
    const emailSubject = state.currentEmailSubject || `Resultados Radiografía de Riesgo - ${riskType}`;

    // Estos parámetros coinciden exactamente con tu nueva plantilla HTML
    const templateParams = {
        to_email: state.leads.email,
        name: state.leads.name, // para {{name}}
        time: new Date().toLocaleString(), // para {{time}}
        message: reportContent, // para {{message}}
        subject: emailSubject
    };

    console.log('Iniciando envío de email a:', state.leads.email);
    console.log('Parámetros enviados:', templateParams);

    // CONFIGURACIÓN: Reemplaza estos valores con los que obtengas de EmailJS
    const SERVICE_ID = 'service_iroclp9';
    const TEMPLATE_ID = 'template_dkpkqkf';
    const PUBLIC_KEY = 'QqvN175XJ37_kz0JR';

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
        .then(() => {
            console.log('Email enviado con éxito a:', state.leads.email);
            btn.innerText = "¡Enviado con éxito!";
            btn.style.background = "#10b981"; // Verde éxito
            setTimeout(() => {
                btn.disabled = false;
                btn.innerText = originalText;
                btn.style.background = ""; // Reset
            }, 3000);
        })
        .catch((error) => {
            console.error('Error detallado de EmailJS:', error);
            let errorMessage = "Hubo un problema al enviar el correo.";

            if (error.status === 401 || error.status === 403) {
                errorMessage = "Error de autenticación con EmailJS. Por favor revise las credenciales.";
            } else if (error.text) {
                errorMessage = "Error: " + error.text;
            }

            alert(errorMessage);
            btn.disabled = false;
            btn.innerText = originalText;
        });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Inicializamos EmailJS con tu Public Key
    emailjs.init("QqvN175XJ37_kz0JR");
    checkSavedUser();
});

/**
 * Revisa si hay un usuario guardado en localStorage y salta el registro si existe
 */
function checkSavedUser() {
    const savedUser = localStorage.getItem('riesgo_user');
    if (savedUser) {
        try {
            const userData = JSON.parse(savedUser);
            state.leads = userData;



            console.log('Usuario recordado:', state.leads);

            // Actualizar botones de "Comenzar"
            const mainButtons = document.querySelectorAll('.btn-primary');
            mainButtons.forEach(btn => {
                const currentText = btn.innerText;
                // Buscamos botones que parezcan de inicio (Comenzar, Iniciar, etc.)
                if (currentText.toLowerCase().includes('comenzar') || currentText.toLowerCase().includes('iniciar')) {
                    const firstName = userData.name.split(' ')[0];
                    btn.innerText = `Continuar como ${firstName}`;

                    // Asegurarnos de que el botón vaya al quiz
                    btn.onclick = (e) => {
                        e.preventDefault();
                        showSection('quiz');
                    };

                    // Añadir link de "No soy yo" (evitar duplicados)
                    if (!document.getElementById('logout-link')) {
                        const logoutLink = document.createElement('a');
                        logoutLink.id = 'logout-link';
                        logoutLink.href = '#';
                        logoutLink.innerText = 'Cambiar usuario';
                        logoutLink.className = 'logout-link';
                        logoutLink.onclick = (e) => {
                            e.preventDefault();
                            logout();
                        };
                        btn.after(logoutLink);
                    }
                }
            });

        } catch (e) {
            console.error('Error al cargar usuario guardado', e);
            localStorage.removeItem('riesgo_user');
        }
    }
}

/**
 * Limpia los datos guardados y reinicia la vista
 */
function logout() {
    localStorage.removeItem('riesgo_user');
    state.leads = { name: '', role: '', company: '', email: '' };

    // Recargar para limpiar todo el estado limpiamente
    window.location.reload();
}
