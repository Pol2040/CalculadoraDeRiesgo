// La inicialización del tema se realiza en el <head> del HTML para evitar destellos.

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

/**
 * Lógica base de la Calculadora de Riesgo
 */

// Definición de las preguntas
const QUESTIONS = [
    // COMUNICACIÓN
    {
        category: 'COMUNICACIÓN', text: 'En mi empresa y/o equipo se comunican objetivos específicos y fechas de cumplimiento.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    {
        category: 'COMUNICACIÓN', text: 'Las reuniones finalizan con tareas, responsables y próximos pasos definidos.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    {
        category: 'COMUNICACIÓN', text: 'Los colaboradores reciben de manera trimestral feedback claro sobre su desempeño y resultados.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    // LIDERAZGO
    {
        category: 'LIDERAZGO', text: 'Los jefes brindan dirección clara a sus equipos.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    {
        category: 'LIDERAZGO', text: 'Los líderes están disponibles para escuchar problemas o ideas.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    {
        category: 'LIDERAZGO', text: 'Los líderes realizan reuniones o conversaciones periódicas para alinear objetivos y seguimiento.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    // CLIMA LABORAL
    {
        category: 'CLIMA LABORAL', text: 'En nuestros equipos de trabajo las diferencias o desacuerdos pueden expresarse sin temor a represalias.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    {
        category: 'CLIMA LABORAL', text: 'Los logros o aportes de las personas son reconocidos explícitamente dentro del equipo.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    // TRABAJO EN EQUIPO
    {
        category: 'TRABAJO EN EQUIPO', text: 'Diversas áreas responden en tiempo y forma cuando se requiere colaboración.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    {
        category: 'TRABAJO EN EQUIPO', text: 'Cuando aparecen conflictos, se generan conversaciones para resolverlos y definir acuerdos.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    // GESTIÓN DE CAMBIO
    {
        category: 'GESTIÓN DE CAMBIO', text: 'Antes de implementar cambios, se comunica qué cambia, por qué y cómo impacta en el trabajo.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    },
    {
        category: 'GESTIÓN DE CAMBIO', text: 'Después de un cambio organizacional, los equipos logran reorganizar tareas y funcionamiento en tiempos definidos.', options: [
            { text: 'Nunca', points: 1 },
            { text: 'Rara vez', points: 2 },
            { text: 'A veces', points: 3 },
            { text: 'Frecuentemente', points: 4 },
            { text: 'Siempre', points: 5 }
        ]
    }
];

// Estado de la aplicación
const state = {
    leads: {
        name: '',
        role: '',
        company: '',
        fleetSize: '',
        email: ''
    },
    skippedAuth: false,
    currentQuestionIndex: 0,
    totalPoints: 0,
    answers: [],
    currentEmailSubject: '',
    currentEmailBody: '',
    googleSheetUrl: 'https://script.google.com/macros/s/AKfycbxC1GoidUfFRMWaK3qnML8CE4dS0HabmTixXwD3fyAYpwj8RbdLN_Vd6pZPC-TYxwT9xg/exec'
};

/**
 * Funciones de Cooldown (Ban temporal por 1 hora)
 */
const WHITELIST_EMAILS = [
    'poloocuello@gmail.com',
    'sergiogustavoderosa@yahoo.com.ar',
    'aohrnialian@gmail.com',
    'lexsaludorganizacional@gmail.com'
];

function isEmailBanned(email) {
    if (!email) return false;

    // Los correos en la lista blanca nunca son baneados
    if (WHITELIST_EMAILS.includes(email.toLowerCase())) {
        return false;
    }

    const banData = localStorage.getItem(`ban_${email}`);
    if (!banData) return false;

    const lastSubmission = parseInt(banData, 10);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (now - lastSubmission < oneHour) {
        const remainingMinutes = Math.ceil((oneHour - (now - lastSubmission)) / (60 * 1000));
        return remainingMinutes;
    }

    // Si ya pasó más de una hora, limpiamos el registro
    localStorage.removeItem(`ban_${email}`);
    return false;
}

function banEmail(email) {
    if (!email) return;

    // No banear si está en la lista blanca
    if (WHITELIST_EMAILS.includes(email.toLowerCase())) {
        return;
    }

    localStorage.setItem(`ban_${email}`, Date.now().toString());
}

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
    }
}

/**
 * Captura los datos del formulario (Lead Capture)
 */
function handleAuth(event) {
    event.preventDefault();

    const roleElement = document.getElementById('user-role');
    const triggerBtn = document.getElementById('custom-select-trigger');
    
    if (!roleElement || !roleElement.value) {
        if (triggerBtn) {
            triggerBtn.classList.add('invalid');
            triggerBtn.focus();
        }
        return;
    }

    const userData = {
        name: document.getElementById('user-name').value,
        role: roleElement.value,
        company: document.getElementById('user-company').value,
        fleetSize: document.getElementById('user-fleet-size').value,
        email: document.getElementById('user-email').value.trim().toLowerCase()
    };

    // Verificar si el email está en periodo de espera
    const waitingTime = isEmailBanned(userData.email);
    if (waitingTime) {
        alert(`Este correo electrónico ya ha completado una evaluación recientemente. Por seguridad y para garantizar la precisión de los resultados, debe esperar ${waitingTime} minutos antes de realizar una nueva radiografía.\n\nSi necesita asistencia inmediata, por favor contacte a LEX Recursos Humanos.`);
        return;
    }

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

    alert('¡Registro completado con éxito!');
    updateAuthUI(state.leads);

    showSection('quiz');

    if (state.answers.length > state.currentQuestionIndex) {
        if (state.currentQuestionIndex < QUESTIONS.length - 1) {
            state.currentQuestionIndex++;
            renderQuestion();
        } else {
            showResults();
        }
    } else {
        renderQuestion();
    }

    // Asegurarse de que los botones de inicio ahora digan "Reiniciar radiografía"
    const headerBtn = document.getElementById('header-start-btn');
    if (headerBtn) headerBtn.innerText = 'Reiniciar radiografía';

    const heroBtn = document.getElementById('hero-start-btn');
    if (heroBtn) heroBtn.innerText = 'Reiniciar radiografía';
}

/**
 * Permite omitir el registro y continuar el quiz
 */
function skipAuth() {
    state.skippedAuth = true;
    showSection('quiz');

    if (state.answers.length > state.currentQuestionIndex) {
        if (state.currentQuestionIndex < QUESTIONS.length - 1) {
            state.currentQuestionIndex++;
            renderQuestion();
        } else {
            showResults();
        }
    } else {
        renderQuestion();
    }

    // Asegurarse de que los botones de inicio ahora digan "Reiniciar radiografía"
    const headerBtn = document.getElementById('header-start-btn');
    if (headerBtn) headerBtn.innerText = 'Reiniciar radiografía';

    const heroBtn = document.getElementById('hero-start-btn');
    if (heroBtn) heroBtn.innerText = 'Reiniciar radiografía';
}

/**
 * Inicia el proceso del quiz
 */
function startQuiz() {
    // Verificar si el usuario ya está logueado y si tiene ban
    if (state.leads.email) {
        const waitingTime = isEmailBanned(state.leads.email);
        if (waitingTime) {
            alert(`Ya has completado una evaluación recientemente. Debes esperar ${waitingTime} minutos para realizar una nueva radiografía.\n\nTe recomendamos analizar los resultados obtenidos o contactarnos para una reunión personalizada.`);
            showSection('hero');
            return;
        }
    }

    state.currentQuestionIndex = 0;
    state.totalPoints = 0;
    state.answers = [];
    showSection('quiz');
    renderQuestion();

    // Cambiar los botones de inicio a "Reiniciar radiografía"
    const headerBtn = document.getElementById('header-start-btn');
    if (headerBtn) headerBtn.innerText = 'Reiniciar radiografía';

    const heroBtn = document.getElementById('hero-start-btn');
    if (heroBtn) heroBtn.innerText = 'Reiniciar radiografía';
}

/**
 * Renderiza la pregunta actual
 */
function renderQuestion() {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const question = QUESTIONS[state.currentQuestionIndex];
    const totalQuestions = QUESTIONS.length;

    const displayIndex = state.currentQuestionIndex + 1;

    // Actualizar progreso
    document.getElementById('question-count').innerText = `Pregunta ${displayIndex} de ${totalQuestions}`;

    // Actualizar barra de progreso visual
    const progressBar = document.getElementById('quiz-progress-bar');
    if (progressBar) {
        const progressPercentage = (displayIndex / totalQuestions) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        const progressTrack = progressBar.parentElement;
        if (progressTrack) {
            progressTrack.setAttribute('aria-valuenow', displayIndex);
        }
    }

    // Actualizar categoría y texto
    document.getElementById('question-text').innerHTML = `
        <span class="category-label">${question.category}</span>
        <span class="question-main-text">${question.text}</span>
    `;

    // Renderizar opciones
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    optionsContainer.style.pointerEvents = 'auto';

    if (question.multiSelect) {
        // Renderizar checkboxes para selección múltiple
        optionsContainer.classList.remove('quiz-grid');
        optionsContainer.classList.add('quiz-checkbox-group');

        const optionsToRender = question.groupedOptions || question.options;

        optionsToRender.forEach((option, index) => {
            if (option.title) {
                // Título del grupo (no seleccionable)
                const titleElement = document.createElement('div');
                titleElement.className = 'quiz-group-title';
                titleElement.innerText = option.title;
                optionsContainer.appendChild(titleElement);

                // Opciones del grupo (seleccionables)
                option.items.forEach((item, itemIndex) => {
                    const label = document.createElement('label');
                    label.className = 'quiz-checkbox-item';
                    label.innerHTML = `
                        <input type="checkbox" name="dg_option" value="${option.title}: ${item}">
                        <span class="quiz-checkbox-label" style="margin-left: 1.5rem;">${item}</span>
                    `;
                    const inputEl = label.querySelector('input');
                    if (inputEl) {
                        inputEl.addEventListener('change', (e) => {
                            label.classList.toggle('selected', e.target.checked);
                        });
                    }
                    optionsContainer.appendChild(label);
                });
            } else {
                // Opción simple
                const label = document.createElement('label');
                label.className = 'quiz-checkbox-item';
                label.innerHTML = `
                    <input type="checkbox" name="dg_option" value="${option.text}">
                    <span class="quiz-checkbox-label">${option.text}</span>
                `;
                const inputEl = label.querySelector('input');
                if (inputEl) {
                    inputEl.addEventListener('change', (e) => {
                        label.classList.toggle('selected', e.target.checked);
                    });
                }
                optionsContainer.appendChild(label);
            }
        });

        // Botón para continuar
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-primary';
        nextBtn.style.width = 'fit-content';
        nextBtn.style.display = 'block';
        nextBtn.style.margin = '2rem auto 0';
        nextBtn.style.paddingInline = '3rem';
        nextBtn.innerText = 'Siguiente';
        nextBtn.onclick = () => {
            // Guardamos las respuestas múltiples
            const selected = Array.from(document.querySelectorAll('input[name="dg_option"]:checked')).map(cb => cb.value);
            handleAnswer(0, selected.join(', '));
        };
        optionsContainer.appendChild(nextBtn);
    } else {
        // Renderizar botones normales
        optionsContainer.classList.remove('quiz-checkbox-group');
        optionsContainer.classList.add('quiz-grid');

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.innerText = option.text;
            button.onclick = (e) => {
                e.preventDefault();
                // Desmarcar cualquier otra opción
                const allOptions = optionsContainer.querySelectorAll('.quiz-option');
                allOptions.forEach(opt => opt.classList.remove('selected'));

                // Marcar esta opción con el destacado intenso
                button.classList.add('selected');
                optionsContainer.style.pointerEvents = 'none';

                // Breve pausa para apreciación visual del usuario antes de avanzar
                setTimeout(() => {
                    handleAnswer(option.points, index + 1);
                }, 280);
            };
            optionsContainer.appendChild(button);
        });
    }
}

/**
 * Procesa la respuesta seleccionada
 */
function handleAnswer(points, optionNumber) {
    state.totalPoints += points;
    state.answers.push({ points, optionNumber });

    if (state.currentQuestionIndex < QUESTIONS.length - 1) {
        state.currentQuestionIndex++;
        renderQuestion();
    } else {
        // Al finalizar todas las preguntas, si no ha completado el registro ni lo ha omitido, mostramos la sección de registro
        if (!state.leads.email && !state.skippedAuth) {
            showSection('auth');
        } else {
            showResults();
        }
    }
}


function showResults() {
    // 1. Calcular puntajes y porcentajes por categoría
    const categoryScores = {
        'COMUNICACIÓN': { score: 0, max: 0 },
        'LIDERAZGO': { score: 0, max: 0 },
        'CLIMA LABORAL': { score: 0, max: 0 },
        'TRABAJO EN EQUIPO': { score: 0, max: 0 },
        'GESTIÓN DE CAMBIO': { score: 0, max: 0 }
    };

    QUESTIONS.forEach((q, index) => {
        const answer = state.answers[index];
        const points = answer ? answer.points : 0;
        if (categoryScores[q.category]) {
            categoryScores[q.category].score += points;
            const maxPoints = q.options ? Math.max(...q.options.map(opt => opt.points)) : 5;
            categoryScores[q.category].max += maxPoints;
        }
    });

    state.categoryRecommendations = {};
    const categoryResults = {};
    for (const cat in categoryScores) {
        const { score, max } = categoryScores[cat];
        const percentage = max > 0 ? Math.round((score / max) * 100) : 0;
        categoryResults[cat] = { score, max, percentage };
        state.categoryRecommendations[cat] = getCategoryRecommendation(cat, percentage);
    }

    // 2. Cálculo del ISO (Índice de Salud Organizacional)
    const isoScore = state.totalPoints;
    const isoMax = Object.values(categoryScores).reduce((sum, item) => sum + item.max, 0) || 60;
    const isoPercentage = Math.round((isoScore / isoMax) * 100);

    function getCategoryFeedback(category, percentage) {
        switch (category) {
            case 'COMUNICACIÓN':
                if (percentage <= 32) {
                    return 'La comunicación presenta importantes dificultades. Los objetivos, el seguimiento y el feedback no forman parte de prácticas sistemáticas, generando desalineación y pérdida de eficiencia.';
                } else if (percentage <= 46) {
                    return 'Existen mecanismos de comunicación, aunque todavía son inconsistentes. La claridad depende más de iniciativas individuales que de procesos establecidos.';
                } else if (percentage <= 66) {
                    return 'La comunicación muestra bases aceptables, aunque aún existen oportunidades para fortalecer la claridad de objetivos, el seguimiento y el feedback.';
                } else if (percentage <= 85) {
                    return 'Existen prácticas de comunicación establecidas, aunque algunos equipos perciben falta de claridad en objetivos y feedback.';
                } else {
                    return 'La comunicación constituye una fortaleza organizacional. Los objetivos son claros, las reuniones generan acuerdos concretos y el feedback acompaña el desempeño de manera consistente.';
                }
            case 'LIDERAZGO':
                if (percentage <= 32) {
                    return 'Los líderes presentan dificultades para orientar, acompañar y alinear a sus equipos, afectando la coordinación cotidiana y la confianza.';
                } else if (percentage <= 46) {
                    return 'Existen prácticas de liderazgo, aunque todavía son poco consistentes entre equipos o responsables.';
                } else if (percentage <= 66) {
                    return 'El liderazgo sostiene el funcionamiento general, aunque fortalecer el seguimiento y la cercanía con los equipos mejoraría los resultados.';
                } else if (percentage <= 86) {
                    return 'Los líderes brindan dirección clara y mantienen espacios de seguimiento periódicos. Existen oportunidades para consolidar estas prácticas.';
                } else {
                    return 'El liderazgo constituye una fortaleza organizacional. Los responsables acompañan, orientan y generan alineación de manera consistente.';
                }
            case 'CLIMA LABORAL':
                if (percentage <= 39) {
                    return 'Predomina un contexto donde expresar diferencias o reconocer aportes resulta poco frecuente, afectando la confianza y el compromiso.';
                } else if (percentage <= 59) {
                    return 'Se observan señales positivas, aunque todavía existen barreras para consolidar relaciones basadas en confianza y reconocimiento.';
                } else if (percentage <= 79) {
                    return 'El clima laboral resulta funcional para la mayoría de los equipos, aunque fortalecer el reconocimiento y la seguridad psicológica favorecería mejores niveles de colaboración.';
                } else if (percentage <= 94) {
                    return 'El ambiente de trabajo favorece relaciones respetuosas y espacios donde las diferencias pueden abordarse de manera constructiva.';
                } else {
                    return 'El clima laboral constituye una fortaleza. Predominan relaciones basadas en confianza, respeto y reconocimiento.';
                }
            case 'TRABAJO EN EQUIPO':
                if (percentage <= 39) {
                    return 'La colaboración entre áreas presenta dificultades frecuentes y los conflictos no siempre encuentran espacios adecuados para su resolución.';
                } else if (percentage <= 59) {
                    return 'Existen experiencias positivas de colaboración, aunque todavía dependen de personas o situaciones puntuales.';
                } else if (percentage <= 79) {
                    return 'El trabajo conjunto permite sostener la operación cotidiana, aunque fortalecer la coordinación interáreas mejoraría la eficiencia.';
                } else if (percentage <= 94) {
                    return 'La organización muestra una buena capacidad de colaboración y resolución de conflictos mediante conversaciones orientadas a acuerdos.';
                } else {
                    return 'La colaboración entre equipos constituye una fortaleza organizacional y favorece una respuesta coordinada frente a desafíos compartidos.';
                }
            case 'GESTIÓN DE CAMBIO':
                if (percentage <= 39) {
                    return 'Los cambios suelen implementarse sin suficiente comunicación ni acompañamiento, dificultando la adaptación de los equipos.';
                } else if (percentage <= 59) {
                    return 'La organización comunica algunos cambios, aunque el proceso todavía presenta oportunidades para mejorar la comprensión y la reorganización posterior.';
                } else if (percentage <= 79) {
                    return 'Los cambios se gestionan de manera aceptable, aunque fortalecer la comunicación previa y el seguimiento facilitaría la adaptación.';
                } else if (percentage <= 94) {
                    return 'La organización comunica adecuadamente los cambios y acompaña a los equipos durante la implementación.';
                } else {
                    return 'La gestión del cambio constituye una capacidad consolidada. Los equipos comprenden los cambios, reorganizan su trabajo y sostienen el funcionamiento con rapidez.';
                }
            default:
                return '';
        }
    }

    function getCategoryRecommendation(category, percentage, name) {
        let recommendations = [];
        switch (category.toUpperCase()) {
            case 'COMUNICACIÓN':
                if (percentage <= 32) {
                    recommendations = [
                        "Definir objetivos claros.",
                        "Estandarizar reuniones.",
                        "Implementar feedback periódico."
                    ];
                } else if (percentage <= 46) {
                    recommendations = [
                        "Formalizar rutinas de comunicación.",
                        "Homogeneizar criterios.",
                        "Incrementar el feedback."
                    ];
                } else if (percentage <= 66) {
                    recommendations = [
                        "Fortalecer claridad de objetivos.",
                        "Optimizar feedback.",
                        "Revisar reuniones."
                    ];
                } else if (percentage <= 85) {
                    recommendations = [
                        "Consolidar buenas prácticas.",
                        "Promover aprendizaje entre líderes.",
                        "Monitorear consistencia."
                    ];
                } else {
                    recommendations = [
                        "Mantener prácticas.",
                        "Documentar buenas prácticas.",
                        "Compartir experiencias."
                    ];
                }
                break;
            case 'LIDERAZGO':
                if (percentage <= 32) {
                    recommendations = [
                        "Desarrollar habilidades de conducción.",
                        "Reuniones de seguimiento.",
                        "Acompañar mandos medios."
                    ];
                } else if (percentage <= 46) {
                    recommendations = [
                        "Homogeneizar criterios.",
                        "Fortalecer seguimiento.",
                        "Incrementar disponibilidad."
                    ];
                } else if (percentage <= 66) {
                    recommendations = [
                        "Profundizar conversaciones de desarrollo.",
                        "Reforzar acompañamiento.",
                        "Mejorar alineación."
                    ];
                } else if (percentage <= 86) {
                    recommendations = [
                        "Consolidar prácticas.",
                        "Desarrollar liderazgo situacional.",
                        "Compartir buenas prácticas."
                    ];
                } else {
                    recommendations = [
                        "Mantener modelo.",
                        "Mentorear líderes.",
                        "Programas avanzados."
                    ];
                }
                break;
            case 'CLIMA LABORAL':
                if (percentage <= 39) {
                    recommendations = [
                        "Generar espacios seguros.",
                        "Implementar reconocimiento.",
                        "Reforzar confianza."
                    ];
                } else if (percentage <= 59) {
                    recommendations = [
                        "Incrementar reconocimiento.",
                        "Promover conversaciones.",
                        "Trabajar seguridad psicológica."
                    ];
                } else if (percentage <= 79) {
                    recommendations = [
                        "Consolidar reconocimiento.",
                        "Monitorear clima.",
                        "Fortalecer participación."
                    ];
                } else if (percentage <= 94) {
                    recommendations = [
                        "Mantener buenas prácticas.",
                        "Extender experiencias.",
                        "Reconocer logros."
                    ];
                } else {
                    recommendations = [
                        "Conservar cultura.",
                        "Difundir prácticas.",
                        "Usar el clima como ventaja."
                    ];
                }
                break;
            case 'TRABAJO EN EQUIPO':
                if (percentage <= 39) {
                    recommendations = [
                        "Mejorar coordinación.",
                        "Resolver conflictos.",
                        "Definir acuerdos."
                    ];
                } else if (percentage <= 59) {
                    recommendations = [
                        "Estandarizar cooperación.",
                        "Reducir tiempos.",
                        "Impulsar coordinación."
                    ];
                } else if (percentage <= 79) {
                    recommendations = [
                        "Optimizar colaboración.",
                        "Revisar acuerdos.",
                        "Monitorear conflictos."
                    ];
                } else if (percentage <= 94) {
                    recommendations = [
                        "Consolidar colaboración.",
                        "Compartir prácticas.",
                        "Fortalecer proyectos."
                    ];
                } else {
                    recommendations = [
                        "Mantener colaboración.",
                        "Transferir aprendizajes.",
                        "Promover innovación."
                    ];
                }
                break;
            case 'GESTIÓN DE CAMBIO':
            case 'GESTIÓN DEL CAMBIO':
                if (percentage <= 39) {
                    recommendations = [
                        "Comunicar cambios antes de implementarlos.",
                        "Explicar impactos.",
                        "Acompañar adaptación."
                    ];
                } else if (percentage <= 59) {
                    recommendations = [
                        "Estandarizar comunicación.",
                        "Mejorar seguimiento.",
                        "Reducir incertidumbre."
                    ];
                } else if (percentage <= 79) {
                    recommendations = [
                        "Fortalecer planificación.",
                        "Medir adaptación.",
                        "Comunicar resultados."
                    ];
                } else if (percentage <= 94) {
                    recommendations = [
                        "Consolidar metodología.",
                        "Documentar aprendizajes.",
                        "Mantener acompañamiento."
                    ];
                } else {
                    recommendations = [
                        "Mantener madurez.",
                        "Difundir prácticas.",
                        "Promover mejora continua."
                    ];
                }
                break;
            default:
                return '';
        }

        if (recommendations.length === 0) return '';
        const randomIndex = Math.floor(Math.random() * recommendations.length);
        return recommendations[randomIndex];
    }


    function getCategoryColor(percentage) {
        if (percentage >= 80) return '#10b981'; // Verde
        if (percentage >= 50) return '#f59e0b'; // Amarillo
        return '#ef4444'; // Rojo
    }

    function getBenchmarkTableHtml(percentage) {
        const ranges = [
            { min: 95, max: 100, rangeText: "95% - 100%", label: "Top 10%", color: "#0d9488", bg: "#f0fdfa" },
            { min: 80, max: 94, rangeText: "80% - 94%", label: "Promedio alto", color: "#10b981", bg: "#f0fdf4" },
            { min: 60, max: 79, rangeText: "60% - 79%", label: "Promedio", color: "#3b82f6", bg: "#eff6ff" },
            { min: 40, max: 59, rangeText: "40% - 59%", label: "Riesgo", color: "#f59e0b", bg: "#fffbeb" },
            { min: 0, max: 39, rangeText: "20% - 39%", label: "Alto riesgo", color: "#ef4444", bg: "#fef2f2" }
        ];

        let rowsHtml = '';
        ranges.forEach(r => {
            const isUserRange = (percentage >= r.min && percentage <= r.max);
            const rowBg = isUserRange ? r.bg : '#ffffff';
            const textColor = isUserRange ? r.color : '#2d3748';
            const fontStyle = isUserRange ? 'font-weight: bold;' : '';
            const borderStyle = 'border: 1px solid #e2e8f0;';

            const indicator = isUserRange
                ? `<span style="background-color: ${r.color}; color: #ffffff; padding: 3px 10px; border-radius: 20px; font-size: 8.5pt; font-weight: bold; display: inline-block;">Su empresa</span>`
                : '';

            rowsHtml += `
                <tr style="background-color: ${rowBg}; ${fontStyle}">
                    <td style="padding: 8px 12px; font-size: 10pt; ${borderStyle} text-align: left; color: ${textColor};">${r.rangeText}</td>
                    <td style="padding: 8px 12px; font-size: 10pt; ${borderStyle} text-align: left; color: ${textColor};">${r.label}</td>
                    <td style="padding: 8px 12px; font-size: 10pt; ${borderStyle} text-align: center; vertical-align: middle;">${indicator}</td>
                </tr>
            `;
        });

        return `
            <div style="margin-top: 15px; margin-bottom: 20px; font-family: Arial, sans-serif; page-break-inside: avoid;">
                <div style="font-weight: bold; font-size: 11pt; margin-bottom: 8px; color: #1a1f36; text-align: left;">Ubicación en el Benchmark de Salud Organizacional:</div>
                <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
                    <thead>
                        <tr style="background-color: #f7fafc; border-bottom: 2px solid #e2e8f0;">
                            <th style="padding: 10px 12px; font-size: 9.5pt; color: #4a5568; text-align: left; font-weight: bold; border: 1px solid #e2e8f0;">Rango ISO</th>
                            <th style="padding: 10px 12px; font-size: 9.5pt; color: #4a5568; text-align: left; font-weight: bold; border: 1px solid #e2e8f0;">Clasificación</th>
                            <th style="padding: 10px 12px; font-size: 9.5pt; color: #4a5568; text-align: center; font-weight: bold; border: 1px solid #e2e8f0; width: 110px;">Su Nivel</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        `;
    }

    // 4. Clasificación del Nivel General ISO
    let riskType = '';
    let screenText = '';
    let emailSubject = 'Resultado de su Diagnóstico de Salud Organizacional (ISO)';
    let accentColor = '';
    let benchmarkText = '';

    if (isoPercentage >= 80) {
        riskType = 'SALUD ORGANIZACIONAL ALTA';
        accentColor = '#10b981';
        benchmarkText = 'Su empresa presenta un nivel de salud organizacional óptimo, superior al 85% de las organizaciones evaluadas.';
    } else if (isoPercentage >= 50) {
        riskType = 'SALUD ORGANIZACIONAL MEDIA';
        accentColor = '#f59e0b';
        benchmarkText = 'Su empresa presenta un nivel de salud organizacional en desarrollo, similar al promedio del sector.';
    } else {
        riskType = 'SALUD ORGANIZACIONAL BAJA';
        accentColor = '#ef4444';
        benchmarkText = 'Su empresa presenta un nivel de salud organizacional crítico, requiriendo atención prioritaria.';
    }

    // Identificar desvíos específicos por dimensión
    const criticalCategories = [];
    const warningCategories = [];
    const strengths = [];

    for (const cat in categoryResults) {
        const { percentage } = categoryResults[cat];
        if (percentage < 50) {
            criticalCategories.push({ name: cat, percentage });
        } else if (percentage < 80) {
            warningCategories.push({ name: cat, percentage });
        } else {
            strengths.push(cat);
        }
    }

    // Helper para obtener variante determinista según el nombre del usuario
    const getVariant = (variants, name) => {
        const seed = (name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
        return variants[seed % variants.length];
    };

    // Construcción dinámica del texto de devolución general (screenText)
    if (isoPercentage >= 80) {
        if (criticalCategories.length === 0 && warningCategories.length === 0) {
            screenText = 'La organización posee prácticas maduras y consistentes en todas sus dimensiones (comunicación, liderazgo, clima, trabajo en equipo y gestión de cambio). El desafío es sostener estas fortalezas y sistematizarlas como cultura de la empresa.';
        } else {
            screenText = 'La organización presenta un nivel de salud organizacional general alto, sustentado por fortalezas sólidas en la mayoría de sus dimensiones. Sin embargo, se detectan desequilibrios que requieren atención para consolidar la salud general:';
            if (criticalCategories.length > 0) {
                const names = criticalCategories.map(c => `<strong>${c.name}</strong> (${c.percentage}%)`).join(', ');
                const variants = [
                    `Se identifican desvíos críticos en el área de ${names}. A pesar del buen resultado general, estas deficiencias pueden actuar como un cuello de botella que neutralice las fortalezas de la organización.`,
                    `Se observan desajustes graves en el área de ${names} que requieren intervención. Si no se resuelven, corren el riesgo de opacar el buen desempeño del resto de la organización.`,
                    `El área de ${names} presenta un nivel crítico que exige atención inmediata. Estas debilidades podrían desestabilizar la salud general y reducir la efectividad del resto de los procesos.`
                ];
                screenText += `<br><br><strong>Nota de atención crítica:</strong> ${getVariant(variants, state.leads.name)}`;
            }
            if (warningCategories.length > 0) {
                const names = warningCategories.map(c => `<strong>${c.name}</strong> (${c.percentage}%)`).join(', ');
                const variants = [
                    `El área de ${names} se encuentra en desarrollo, existiendo espacio para estandarizar y consolidar sus prácticas.`,
                    `Se detectan oportunidades de optimización en el área de ${names}, donde la formalización de procesos ayudará a consolidar el nivel general.`,
                    `El área de ${names} muestra inconsistencias moderadas. Enfocar esfuerzos aquí permitirá unificar los criterios de trabajo y potenciar los resultados.`
                ];
                screenText += `<br><br><strong>Oportunidad de mejora:</strong> ${getVariant(variants, state.leads.name)}`;
            }
        }
    } else if (isoPercentage >= 50) {
        screenText = 'Existen bases operativas construidas, pero se observan inconsistencias que frenan el desempeño. Se requiere estandarizar procesos de alineación y feedback para consolidar los equipos.';
        if (criticalCategories.length > 0) {
            const names = criticalCategories.map(c => `<strong>${c.name}</strong> (${c.percentage}%)`).join(', ');
            const variants = [
                `Se observan resultados críticos en el área de ${names}, que deben ser abordados con urgencia para estabilizar el desempeño del equipo.`,
                `Los resultados presentan conflictos graves en el área de ${names}; el desempeño del equipo puede verse comprometido al mantener las condiciones actuales.`,
                `Se registran desvíos severos en el área de ${names}. Es fundamental intervenir a corto plazo para mitigar riesgos en la operación y asegurar el bienestar del equipo.`
            ];
            screenText += `<br><br><strong>Atención prioritaria:</strong> ${getVariant(variants, state.leads.name)}`;
        }
    } else {
        screenText = 'Se identifican bloqueos significativos en el liderazgo, la integración y el flujo de información. Es prioritaria una intervención para rediseñar canales de comunicación y fortalecer el clima de confianza.';
        if (strengths.length > 0) {
            const names = strengths.map(s => `<strong>${s}</strong>`).join(', ');
            const variants = [
                `Como aspecto positivo, el área de ${names} se destaca como una fortaleza sobre la cual apalancar las acciones de mejora.`,
                `A pesar del panorama complejo, el área de ${names} se sostiene como un pilar fuerte que puede servir de guía y base para el resto de la organización.`,
                `La dimensión de ${names} se mantiene en un nivel óptimo. Recomendamos utilizar esta fortaleza como punto de partida y modelo para impulsar la recuperación de las demás áreas.`
            ];
            screenText += `<br><br><strong>Punto de apoyo:</strong> ${getVariant(variants, state.leads.name)}`;
        }
    }

    // 5. Renderizar los desgloses visuales en pantalla
    let categoriesHtml = `<div class="iso-breakdown" style="margin-top: 2.5rem; text-align: left;">
        <h3 style="font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--text-main); border-bottom: 2px solid var(--border); padding-bottom: 0.5rem;">
            Resultados por Dimensión
        </h3>`;

    for (const cat in categoryResults) {
        const { score, max, percentage } = categoryResults[cat];
        const feedback = getCategoryFeedback(cat, percentage);
        const catColor = getCategoryColor(percentage);

        categoriesHtml += `
            <div class="category-result-card" style="background: rgba(0,0,0,0.02); border: 1px solid var(--border); padding: 1.5rem; border-radius: 16px; margin-bottom: 1.2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-weight: var(--fw-bold); font-size: 1.1rem; color: var(--text-main);">${cat}</span>
                    <span style="font-weight: var(--fw-bold); color: ${catColor};">${score} / ${max} pts (${percentage}%)</span>
                </div>
                <div style="background: rgba(0,0,0,0.05); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 0.8rem;">
                    <div style="background: ${catColor}; width: ${percentage}%; height: 100%; border-radius: 4px;"></div>
                </div>
                <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${feedback}</p>
            </div>
        `;
    }
    categoriesHtml += `</div>`;

    // 5.5. Calcular Fortalezas (>= 60%)
    const STRENGTH_FEEDBACK = {
        'COMUNICACIÓN': {
            verde: [
                'La comunicación interna es fluida, clara y los objetivos están alineados en todos los niveles.',
                'Se destacan prácticas sólidas de feedback continuo y reuniones efectivas orientadas a la acción.',
                'Los canales de comunicación son transparentes y facilitan la alineación estratégica del equipo.'
            ],
            amarillo: [
                'La comunicación presenta prácticas establecidas, aunque existen oportunidades de mejora en el feedback periódico.',
                'Los objetivos se transmiten de manera aceptable, pero se requiere mayor consistencia en el seguimiento de reuniones.',
                'Existen canales de información funcionales, aunque se puede optimizar la claridad en la delegación de tareas.'
            ]
        },
        'LIDERAZGO': {
            verde: [
                'Los líderes guían con claridad, están accesibles y fomentan un ambiente de confianza.',
                'El estilo de liderazgo promueve la alineación de objetivos y el desarrollo de los colaboradores.',
                'Los mandos medios demuestran una sólida capacidad de acompañamiento y feedback hacia sus equipos.'
            ],
            amarillo: [
                'El liderazgo sostiene la operación de forma adecuada, aunque se puede profundizar en la cercanía y escucha activa.',
                'Los responsables brindan dirección, pero se observa espacio para estandarizar las reuniones de seguimiento.',
                'Se percibe orientación al logro, con oportunidad de fortalecer el empoderamiento y autonomía del equipo.'
            ]
        },
        'CLIMA LABORAL': {
            verde: [
                'Buen clima laboral, caracterizado por relaciones de confianza y un alto nivel de compromiso.',
                'Existe una cultura de reconocimiento mutuo y un espacio seguro para expresar opiniones.',
                'Predomina el respeto y la valoración de los logros, consolidando la motivación de las personas.'
            ],
            amarillo: [
                'El ambiente de trabajo es positivo, aunque se puede potenciar el reconocimiento formal de los logros.',
                'Existe respeto en el día a día, con oportunidad de fortalecer los espacios de seguridad psicológica para debatir diferencias.',
                'El clima es estable, pero se beneficiaría de dinámicas que refuercen la integración y el sentido de pertenencia.'
            ]
        },
        'TRABAJO EN EQUIPO': {
            verde: [
                'Buena colaboración entre equipos, con una respuesta ágil y coordinada ante desafíos comunes.',
                'Los equipos cooperan de manera sinérgica, resolviendo conflictos a través de acuerdos constructivos.',
                'Sólida sinergia interdepartamental que facilita el logro de los objetivos organizacionales.'
            ],
            amarillo: [
                'La colaboración mutua funciona bien en general, aunque persisten oportunidades para agilizar la respuesta interáreas.',
                'Existe predisposición para trabajar en equipo, pero se requiere formalizar acuerdos para resolver diferencias operativas.',
                'Los equipos cooperan ante emergencias, con la oportunidad de estructurar mejor el flujo cotidiano de tareas compartidas.'
            ]
        },
        'GESTIÓN DE CAMBIO': {
            verde: [
                'La organización posee una excelente capacidad de adaptación y acompaña eficazmente los procesos de cambio.',
                'Los colaboradores asimilan los cambios rápidamente, reorganizando tareas sin perder productividad.',
                'Los procesos de cambio se comunican de forma oportuna, reduciendo la incertidumbre y facilitando la transición.'
            ],
            amarillo: [
                'La adaptación a nuevas directrices es aceptable, aunque se puede mejorar la comunicación previa al impacto.',
                'Los cambios son asimilados, pero los equipos requieren un acompañamiento más estructurado durante la transición.',
                'Existe flexibilidad ante los cambios, con la oportunidad de definir con mayor claridad los nuevos roles y procesos.'
            ]
        }
    };

    const strengthCandidates = [];
    for (const cat in categoryResults) {
        const { percentage } = categoryResults[cat];
        if (percentage >= 60) {
            strengthCandidates.push({ name: cat, percentage });
        }
    }
    // Ordenar de mayor a menor porcentaje
    strengthCandidates.sort((a, b) => b.percentage - a.percentage);
    const topStrengths = strengthCandidates.slice(0, 3);

    const chosenStrengths = [];
    topStrengths.forEach(str => {
        const stateKey = str.percentage >= 80 ? 'verde' : 'amarillo';
        const options = STRENGTH_FEEDBACK[str.name]?.[stateKey];
        if (options && options.length > 0) {
            const randIndex = Math.floor(Math.random() * options.length);
            chosenStrengths.push(options[randIndex]);
        }
    });

    let screenStrengthsHtml = '';
    if (chosenStrengths.length > 0) {
        screenStrengthsHtml = `
            <div class="strengths-section" style="margin-top: 2rem; text-align: left; background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.15); padding: 1.5rem; border-radius: 16px;">
                <h4 style="font-size: 1.2rem; margin-top: 0; margin-bottom: 1rem; color: var(--text-main); font-weight: var(--fw-bold);">
                    Principales Fortalezas:
                </h4>
                <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.95rem; color: var(--text-muted); line-height: 1.6;">
                    ${chosenStrengths.map(dev => `<li style="margin-bottom: 0.5rem;">${dev}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    let pdfStrengthsHtml = '';
    if (chosenStrengths.length > 0) {
        pdfStrengthsHtml = `
            <div style="margin-top: 20px; margin-bottom: 20px; page-break-inside: avoid;">
                <strong style="font-size: 12pt; color: #1a1f36; display: block; margin-bottom: 8px;">Principales Fortalezas:</strong>
                <ul style="margin: 0; padding-left: 20px; font-size: 10.5pt; color: #4a5568; line-height: 1.5;">
                    ${chosenStrengths.map(dev => `<li style="margin-bottom: 4px;">${dev}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // 5.6. Calcular Áreas de Mejora (< 60%)
    const IMPROVEMENT_FEEDBACK = {
        'COMUNICACIÓN': {
            rojo: [
                'Brechas críticas en la alineación diaria; se requiere formalizar canales y minutas de reuniones.',
                'Ausencia de feedback regular y formal hacia los colaboradores, generando desorientación operativa.',
                'Falta de claridad en los objetivos y metas semanales, afectando el cumplimiento y la productividad.'
            ],
            amarillo: [
                'Oportunidad de estructurar de forma más regular las reuniones de alineación del equipo.',
                'Se requiere mayor continuidad y formalidad en la retroalimentación individual de desempeño.',
                'Los flujos de información son intermitentes; se sugiere definir responsables claros por canal.'
            ]
        },
        'LIDERAZGO': {
            rojo: [
                'Estilo de conducción poco participativo o ausente, afectando la motivación y autonomía del equipo.',
                'Dificultades severas de supervisión y acompañamiento en las tareas cotidianas.',
                'Baja disponibilidad de los líderes para escuchar ideas o resolver inquietudes operativas.'
            ],
            amarillo: [
                'Se sugiere capacitar a los líderes en técnicas de feedback constructivo y escucha activa.',
                'Oportunidad de estandarizar las rutinas cotidianas de seguimiento y apoyo al equipo.',
                'Necesidad de fortalecer el liderazgo situacional para delegar con mayor efectividad.'
            ]
        },
        'CLIMA LABORAL': {
            rojo: [
                'Bajos niveles de confianza mutua y barreras significativas para expresar diferencias sin temor.',
                'Ausencia persistente de reconocimiento hacia los logros y aportes del equipo.',
                'Ambiente laboral tensionado que desgasta la motivación y eleva la rotación del personal.'
            ],
            amarillo: [
                'Se recomienda establecer programas sencillos de reconocimiento por hitos alcanzados.',
                'Oportunidad de habilitar dinámicas grupales para favorecer la seguridad psicológica en los debates.',
                'Falta de integración y cohesión interna; conviene promover espacios extra-operativos.'
            ]
        },
        'TRABAJO EN EQUIPO': {
            rojo: [
                'Falta de colaboración crítica interáreas que genera demoras y duplicación de tareas.',
                'Dificultad para resolver conflictos operativos mediante el diálogo y acuerdos constructivos.',
                'Aislamiento de los equipos (silos), impidiendo una respuesta unificada ante problemas.'
            ],
            amarillo: [
                'Conviene definir acuerdos de nivel de servicio (SLA) internos para mejorar la colaboración interdepartamental.',
                'Oportunidad de capacitar en técnicas de comunicación asertiva para la gestión de conflictos.',
                'Falta de alineación en procesos comunes; se sugiere repasar responsabilidades compartidas.'
            ]
        },
        'GESTIÓN DE CAMBIO': {
            rojo: [
                'Los procesos de cambio se implementan de forma abrupta, sin comunicación clara de propósitos e impactos.',
                'Fuerte resistencia operativa debido a la falta de acompañamiento en las transiciones.',
                'Baja agilidad organizacional para reorganizar roles y procesos tras una modificación estructural.'
            ],
            amarillo: [
                'Se recomienda involucrar de forma temprana a los líderes en el diseño y comunicación del cambio.',
                'Oportunidad de documentar las lecciones aprendidas después de cada cambio importante.',
                'Acompañamiento intermitente; conviene estructurar mejor el plan de capacitación del nuevo proceso.'
            ]
        }
    };

    const improvementCandidates = [];
    for (const cat in categoryResults) {
        const { percentage } = categoryResults[cat];
        if (percentage < 60) {
            improvementCandidates.push({ name: cat, percentage });
        }
    }
    // Ordenar de menor a mayor porcentaje
    improvementCandidates.sort((a, b) => a.percentage - b.percentage);
    const topImprovements = improvementCandidates.slice(0, 3);

    const chosenImprovements = [];
    topImprovements.forEach(str => {
        const stateKey = str.percentage < 50 ? 'rojo' : 'amarillo';
        const options = IMPROVEMENT_FEEDBACK[str.name]?.[stateKey];
        if (options && options.length > 0) {
            const randIndex = Math.floor(Math.random() * options.length);
            chosenImprovements.push(options[randIndex]);
        }
    });

    let screenImprovementsHtml = '';
    if (chosenImprovements.length > 0) {
        screenImprovementsHtml = `
            <div class="improvements-section" style="margin-top: 1.5rem; text-align: left; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.15); padding: 1.5rem; border-radius: 16px;">
                <h4 style="font-size: 1.2rem; margin-top: 0; margin-bottom: 1rem; color: var(--text-main); font-weight: var(--fw-bold);">
                    Áreas de mejora:
                </h4>
                <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.95rem; color: var(--text-muted); line-height: 1.6;">
                    ${chosenImprovements.map(dev => `<li style="margin-bottom: 0.5rem;">${dev}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    let pdfImprovementsHtml = '';
    if (chosenImprovements.length > 0) {
        pdfImprovementsHtml = `
            <div style="margin-top: 20px; margin-bottom: 20px; page-break-inside: avoid;">
                <strong style="font-size: 12pt; color: #1a1f36; display: block; margin-bottom: 8px;">Áreas de mejora:</strong>
                <ul style="margin: 0; padding-left: 20px; font-size: 10.5pt; color: #4a5568; line-height: 1.5;">
                    ${chosenImprovements.map(dev => `<li style="margin-bottom: 4px;">${dev}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    document.getElementById('risk-type').innerText = riskType;
    document.getElementById('risk-type').style.color = accentColor;
    document.getElementById('risk-description').innerHTML = `
        <div style="font-size: 1.4rem; font-weight: bold; margin-bottom: 1rem; color: var(--text-main);">
            Índice de Salud Organizacional (ISO): <span style="color: ${accentColor};">${isoScore} / ${isoMax} pts (${isoPercentage}%)</span>
        </div>
        <p style="margin-bottom: 1.5rem;">${screenText}</p>
        ${categoriesHtml}
        <p class="result-note" style="margin-top: 2rem;">
            Descargue el informe completo en PDF para ver el detalle de las recomendaciones.
        </p>
    `;

    // 6. Preparar contenido para el PDF
    let pdfCategoriesHtml = '';
    for (const cat in categoryResults) {
        const { score, max, percentage } = categoryResults[cat];
        const feedback = getCategoryFeedback(cat, percentage);
        const recommendation = state.categoryRecommendations[cat];
        const catColor = getCategoryColor(percentage);

        pdfCategoriesHtml += `
            <div style="border: 1px solid #ddd; padding: 12px; border-radius: 8px; margin-bottom: 12px; background-color: #fafafa; page-break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <strong style="font-size: 12pt; color: #1a1f36;">${cat}</strong>
                    <span style="font-weight: bold; color: ${catColor}; font-size: 11pt;">${score} / ${max} pts (${percentage}%)</span>
                </div>
                <div style="background: #eee; height: 6px; border-radius: 3px; overflow: hidden; margin-bottom: 8px;">
                    <div style="background: ${catColor}; width: ${percentage}%; height: 100%;"></div>
                </div>
                <p style="font-size: 10.5pt; color: #4a5568; margin: 0 0 6px 0; line-height: 1.4;">${feedback}</p>
                <p style="font-size: 10.5pt; color: #1a1f36; margin: 0; line-height: 1.4; font-weight: bold;">
                    Recomendación: <span style="font-weight: normal; color: #4a5568;">${recommendation}</span>
                </p>
            </div>
        `;
    }

    const gmailButtonBody = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #000;">
            <p>Estimado/a${state.leads.name ? ' ' + state.leads.name : ''},</p>
            <p>Gracias por completar el diagnóstico de salud organizacional.</p>
            
            <div style="margin-top: 1.5rem; margin-bottom: 1.5rem; border-left: 4px solid ${accentColor}; padding-left: 12px;">
                <strong style="font-size: 16pt;">Resultado General: <span style="color: ${accentColor};">${riskType}</span></strong><br>
                <strong>Índice ISO:</strong> ${isoScore} / ${isoMax} puntos (${isoPercentage}%)<br>
                <strong>Benchmark:</strong> ${benchmarkText}
            </div>
            
            ${getBenchmarkTableHtml(isoPercentage)}
            
            <p style="font-size: 11pt; margin-bottom: 1.5rem;">${screenText}</p>
            
            <h3 style="font-size: 14pt; border-bottom: 1px solid #eee; padding-bottom: 6px; margin-top: 2rem; margin-bottom: 1rem; color: #1a1f36;">
                Resultados Detallados por Categoría
            </h3>
            
            ${pdfCategoriesHtml}
            
            ${pdfStrengthsHtml}
            
            ${pdfImprovementsHtml}
            
            <div style="margin-top: 2.5rem; border-top: 1px solid #eee; padding-top: 1.5rem; font-size: 10.5pt; color: #555;">
                <strong>Lic. Susana Nuevo.</strong> Master Coach Ontológico Profesional. Directora de Fundación ELAC Delegaciones Ramos Mejía y Luján.</a><br><br>         
                <strong>Lic. Marcelo Trulls.</strong> Licenciado en Ciencias de la Comunicación. Universidad de Morón. Senior Coach Ontológico Profesional. Fundación ELAC, certificado por la AACOP. Director de Fundación ELAC Delegaciones Ramos Mejía y Luján.</a><br><br>
                <strong>ELAC</strong>  General Soler 138 – Ramos Mejía. Provincia de Buenos Aires </a><br>
                <strong>Tel: +54 911 5110-6664 </strong><a href="elacramosmejia@elacoaching.com.ar" target="_blank" style="color: #e8650a; text-decoration: none;">elacramosmejia@elacoaching.com.ar</a><br><br>
                <strong>LEX Recursos Humanos y Organización S.R.L.</strong> <a href="https://bio.site/LEXRRHH" target="_blank" style="color: #e8650a; text-decoration: none;">https://bio.site/LEXRRHH</a><br><br>
                <em style="font-size: 9.5pt; color: #777;">Este diagnóstico identifica áreas de mejora, pero no las corrige de forma automatizada. Para profundizar en los desvíos detectados y diseñar un plan de acción a medida, le sugerimos agendar una reunión de análisis personalizada.</em>
            </div>
        </div>
    `;
    const pdfOutput = document.getElementById('pdf-content');
    if (pdfOutput) {
        pdfOutput.innerHTML = gmailButtonBody;

        document.getElementById('pdf-user-name').innerText = state.leads.name;
        document.getElementById('pdf-user-company').innerText = state.leads.company;
        document.getElementById('pdf-date').innerText = new Date().toLocaleDateString();
    }

    // 7. Configurar textos para Email Automático
    const emailBody = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #1a1f36;">
            <h2>Hola ${state.leads.name || ''},</h2>
            <p>Gracias por completar el <strong>Diagnóstico de Salud Organizacional</strong>.</p>
            <p>Según sus respuestas, su organización presenta un <strong>Índice de Salud Organizacional (ISO)</strong> de <strong>${isoScore} / ${isoMax} puntos (${isoPercentage}%)</strong>, correspondiente a un nivel de:</p>
            <div style="margin: 1.5rem 0; padding: 12px; border-left: 4px solid ${accentColor}; background-color: #fafafa; font-size: 14pt; font-weight: bold; color: ${accentColor};">
                ${riskType}
            </div>
            <p>${screenText}</p>
            <p>Estamos a su disposición para conversar sobre sus resultados.</p>
            <br>
                       <div style="margin-top: 2.5rem; border-top: 1px solid #eee; padding-top: 1.5rem; font-size: 10.5pt; color: #555;">
                <strong>Lic. Susana Nuevo.</strong> Master Coach Ontológico Profesional. Directora de Fundación ELAC Delegaciones Ramos Mejía y Luján.                </a><br><br>
                <strong>Lic. Marcelo Trulls.</strong> Licenciado en Ciencias de la Comunicación. Universidad de Morón. Senior Coach Ontológico Profesional. Fundación ELAC, certificado por la AACOP. Director de Fundación ELAC Delegaciones Ramos Mejía y Luján.</a><br><br>
                <strong>ELAC</strong>  General Soler 138 – Ramos Mejía. Provincia de Buenos Aires <strong>Tel: +54 911 5110-6664</strong>.<a href="elacramosmejia@elacoaching.com.ar" target="_blank" style="color: #e8650a; text-decoration: none;">elacramosmejia@elacoaching.com.ar</a><br><br>
                <strong>LEX Recursos Humanos y Organización S.R.L.</strong> <a href="https://bio.site/LEXRRHH" target="_blank" style="color: #e8650a; text-decoration: none;">https://bio.site/LEXRRHH</a><br><br>
            </div>
        </div>
    `;

    state.currentEmailSubject = emailSubject;
    state.currentEmailBody = emailBody;

    // 8. Enviar datos a Google Sheets
    const dataToSave = {
        name: state.leads.name,
        email: state.leads.email,
        company: state.leads.company,
        fleetSize: state.leads.fleetSize,
        role: state.leads.role,
        riskType: riskType,
        points: isoScore,
        isoScore: isoScore,
        isoPercentage: isoPercentage,

        // Puntajes y porcentajes por dimensión
        comunicacionScore: categoryResults['COMUNICACIÓN'].score,
        comunicacionPercentage: categoryResults['COMUNICACIÓN'].percentage,
        liderazgoScore: categoryResults['LIDERAZGO'].score,
        liderazgoPercentage: categoryResults['LIDERAZGO'].percentage,
        climaLaboralScore: categoryResults['CLIMA LABORAL'].score,
        climaLaboralPercentage: categoryResults['CLIMA LABORAL'].percentage,
        trabajoEquipoScore: categoryResults['TRABAJO EN EQUIPO'].score,
        trabajoEquipoPercentage: categoryResults['TRABAJO EN EQUIPO'].percentage,
        gestionCambioScore: categoryResults['GESTIÓN DE CAMBIO'].score,
        gestionCambioPercentage: categoryResults['GESTIÓN DE CAMBIO'].percentage,

        individualAnswers: state.answers.map(a => a.optionNumber)
    };
    saveToGoogleSheet(dataToSave);

    // 9. Envío automático de email al terminar
    sendAutoEmail(riskType, emailSubject, emailBody);

    if (state.leads.email) {
        banEmail(state.leads.email);
    }

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

    console.log('📤 Enviando datos a Google Sheets:', data);

    try {
        await fetch(state.googleSheetUrl, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        console.log('✅ Datos enviados con éxito (revisa tu hoja de cálculo).');
    } catch (error) {
        console.error('❌ Error al enviar a Google Sheets:', error);
    }
}

/**
 * Envía los resultados por correo electrónico de forma automática usando EmailJS
 */
/**
 * [COMENTADO TEMPORALMENTE] Envía los resultados por correo electrónico de forma automática usando EmailJS
 * 
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
    const reportContent = state.gmailButtonBody || state.currentEmailBody || document.getElementById('pdf-content').innerText;
    const emailSubject = state.currentEmailSubject || `Resultados Radiografía de Riesgo - ${riskType}`;

    // Estos parámetros coinciden exactamente con tu nueva plantilla HTML
    const templateParams = {
        to_email: state.leads.email,
        name: 'LEX + ELAC - Calculadora RRHH', // para {{name}}
        time: new Date().toLocaleString(), // para {{time}}
        message: reportContent, // para {{message}}
        subject: emailSubject
    };

    console.log('Iniciando envío de email a:', state.leads.email);
    console.log('Parámetros enviados:', templateParams);

    // CONFIGURACIÓN: Todos los casos usan la cuenta principal por ahora
    SERVICE_ID = 'service_iroclp9';
    TEMPLATE_ID = 'template_dkpkqkf';
    PUBLIC_KEY = 'LVsT7wnz6G3_xp-AL';

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
*/

/**
 * Configuración centralizada de EmailJS para la cuenta LexSaludOrganizacional@gmail.com
 */
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_d4lc1lt',
    TEMPLATE_ID: 'template_tj22x0c',
    PUBLIC_KEY: 'QqvN175XJ37_kz0JR'
};

/**
 * Envío automático y silencioso al finalizar el test
 */
function sendAutoEmail(riskType, emailSubject, emailBody) {
    if (!state.leads.email) {
        console.log('No se envía email automático: el usuario no proporcionó correo.');
        return;
    }

    const templateParams = {
        to_email: state.leads.email,
        name: 'LEX + ELAC - Calculadora RRHH',
        time: new Date().toLocaleString(),
        message: emailBody,
        subject: emailSubject
    };

    console.log('📤 Iniciando envío automático de email a:', state.leads.email);

    emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams, EMAILJS_CONFIG.PUBLIC_KEY)
        .then(() => {
            console.log('✅ Email automático enviado con éxito.');
        })
        .catch((error) => {
            console.error('❌ Error en el envío automático de EmailJS:', error);
        });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Se comenta inicialización global para permitir usar distintas cuentas de EmailJS
    // emailjs.init("QqvN175XJ37_kz0JR");
    initCustomSelect();
    checkSavedUser();
});

/**
 * Inicializa el menú desplegable personalizado para el apartado 'Cargo'
 * integrando la estética general en Modo Claro y Modo Oscuro.
 */
function initCustomSelect() {
    const selectEl = document.getElementById('user-role');
    const wrapper = document.getElementById('user-role-wrapper');
    const trigger = document.getElementById('custom-select-trigger');
    const label = document.getElementById('custom-select-label');
    const optionsContainer = document.getElementById('custom-select-options');

    if (!selectEl || !wrapper || !trigger || !optionsContainer || !label) return;

    optionsContainer.innerHTML = '';

    const options = Array.from(selectEl.options);
    options.forEach(opt => {
        if (opt.disabled) return;

        const optionDiv = document.createElement('div');
        optionDiv.className = 'custom-select-option';
        if (selectEl.value === opt.value) {
            optionDiv.classList.add('selected');
        }
        optionDiv.dataset.value = opt.value;
        optionDiv.setAttribute('role', 'option');
        optionDiv.setAttribute('tabindex', '0');

        optionDiv.innerHTML = `<span>${opt.textContent}</span>`;

        const pickOption = (e) => {
            if (e) e.stopPropagation();
            selectOption(opt.value, opt.textContent);
        };

        optionDiv.addEventListener('click', pickOption);
        optionDiv.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                pickOption(e);
            }
        });

        optionsContainer.appendChild(optionDiv);
    });

    function selectOption(val, text) {
        selectEl.value = val;
        label.textContent = text;
        label.classList.remove('placeholder');
        trigger.classList.remove('invalid');

        const allOpts = optionsContainer.querySelectorAll('.custom-select-option');
        allOpts.forEach(item => {
            if (item.dataset.value === val) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });

        closeDropdown();
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function toggleDropdown() {
        if (wrapper.classList.contains('open')) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }

    function openDropdown() {
        wrapper.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
        wrapper.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            closeDropdown();
        }
    });

    trigger.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!wrapper.classList.contains('open')) {
                openDropdown();
            } else {
                const selectedOpt = optionsContainer.querySelector('.custom-select-option.selected') || optionsContainer.firstElementChild;
                if (selectedOpt) selectedOpt.focus();
            }
        } else if (e.key === 'Escape') {
            closeDropdown();
        }
    });

    selectEl.addEventListener('change', () => {
        const currentOpt = Array.from(selectEl.options).find(o => o.value === selectEl.value);
        if (currentOpt && !currentOpt.disabled) {
            label.textContent = currentOpt.textContent;
            label.classList.remove('placeholder');
            trigger.classList.remove('invalid');
            optionsContainer.querySelectorAll('.custom-select-option').forEach(item => {
                if (item.dataset.value === selectEl.value) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });
        } else {
            label.textContent = 'Seleccione su cargo';
            label.classList.add('placeholder');
            optionsContainer.querySelectorAll('.custom-select-option').forEach(item => item.classList.remove('selected'));
        }
    });
}

/**
 * Actualiza la interfaz para mostrar el usuario activo
 */
function updateAuthUI(userData) {
    if (!userData || !userData.name) return;

    // Ocultar botón de registrarse en la barra de navegación si está registrado
    const navRegisterBtn = document.getElementById('nav-register-btn');
    if (navRegisterBtn) {
        navRegisterBtn.style.display = 'none';
    }

    // Actualizar botones de "Comenzar"
    const buttonsToUpdate = [document.getElementById('header-start-btn'), document.getElementById('hero-start-btn')];
    buttonsToUpdate.forEach(btn => {
        if (!btn) return;
        const currentText = btn.innerText;
        // Buscamos botones que parezcan de inicio (Comenzar, Iniciar, etc.)
        if (currentText.toLowerCase().includes('comenzar') || currentText.toLowerCase().includes('iniciar')) {
            const firstName = userData.name.split(' ')[0];
            btn.innerText = `Continuar como ${firstName}`;

            // Asegurarnos de que el botón vaya al quiz
            btn.onclick = (e) => {
                e.preventDefault();
                startQuiz();
            };

            // Añadir link de "No soy yo" (evitar duplicados)
            const logoutId = 'logout-link-' + btn.id;
            if (!document.getElementById(logoutId)) {
                const logoutLink = document.createElement('a');
                logoutLink.id = logoutId;
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
}

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
            updateAuthUI(userData);
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
    state.leads = { name: '', role: '', company: '', fleetSize: '', email: '' };

    // Recargar para limpiar todo el estado limpiamente
    window.location.reload();
}
