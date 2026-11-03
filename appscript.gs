/**
 * ============================================================
 *  LEX RRHH — Diagnóstico de Salud Organizacional (ISO)
 *  Google Apps Script — doPost + generarPDFAlVuelo
 * ============================================================
 *
 *  Estructura de columnas en la hoja:
 *  A=1  Fecha / Hora
 *  B=2  Nombre
 *  C=3  Email
 *  D=4  Empresa
 *  E=5  Colaboradores
 *  F=6  Cargo
 *  G=7  Resultado ISO  (ej. "SALUD ORGANIZACIONAL ALTA")
 *  H=8  Puntaje ISO (Pts)
 *  I=9  Porcentaje ISO (%)
 *  J=10 Comunicación (pts)
 *  K=11 Comunicación (%)
 *  L=12 Liderazgo (pts)
 *  M=13 Liderazgo (%)
 *  N=14 Clima Laboral (pts)
 *  O=15 Clima Laboral (%)
 *  P=16 Trabajo en Equipo (pts)
 *  Q=17 Trabajo en Equipo (%)
 *  R=18 Gestión de Cambio (pts)
 *  S=19 Gestión de Cambio (%)
 *  T=20 R1
 *  U=21 R2
 *  V=22 R3
 *  W=23 R4
 *  X=24 R5
 *  Y=25 R6
 *  Z=26 R7
 *  AA=27 R8
 *  AB=28 R9
 *  AC=29 R10
 *  AD=30 R11
 *  AE=31 R12
 *
 *  Puntajes máximos por dimensión:
 *    Comunicación      = 3 preguntas × 5 = 15 pts
 *    Liderazgo         = 3 preguntas × 5 = 15 pts
 *    Clima Laboral     = 2 preguntas × 5 = 10 pts
 *    Trabajo en Equipo = 2 preguntas × 5 = 10 pts
 *    Gestión de Cambio = 2 preguntas × 5 = 10 pts
 *    ISO Total                           = 60 pts
 * ============================================================
 */

/**
 * Recibe los datos del formulario web y los guarda en la hoja.
 * Las 12 respuestas individuales se almacenan en columnas H-S.
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data  = JSON.parse(e.postData.contents);

    // Crear encabezados si la hoja está vacía
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Fecha / Hora", "Nombre", "Email", "Empresa", "Colaboradores", "Cargo",
        "Resultado ISO", "Puntaje ISO (Pts)", "Porcentaje ISO (%)",
        "Comunicación (pts)", "Comunicación (%)",
        "Liderazgo (pts)", "Liderazgo (%)",
        "Clima Laboral (pts)", "Clima Laboral (%)",
        "Trabajo en Equipo (pts)", "Trabajo en Equipo (%)",
        "Gestión de Cambio (pts)", "Gestión de Cambio (%)",
        "R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9", "R10", "R11", "R12"
      ]);
    }

    // Extraer las 12 respuestas individuales
    var ans = data.individualAnswers || [];

    var rowData = [
      new Date(),
      data.name      || '',
      data.email     || '',
      data.company   || '',
      data.fleetSize || '',
      data.role      || '',
      data.riskType  || '',   // "SALUD ORGANIZACIONAL ALTA/MEDIA/BAJA"
      
      // Resultados calculados generales y por dimensión
      Number(data.isoScore) || 0,
      (Number(data.isoPercentage) || 0) / 100,
      
      Number(data.comunicacionScore) || 0,
      (Number(data.comunicacionPercentage) || 0) / 100,
      
      Number(data.liderazgoScore) || 0,
      (Number(data.liderazgoPercentage) || 0) / 100,
      
      Number(data.climaLaboralScore) || 0,
      (Number(data.climaLaboralPercentage) || 0) / 100,
      
      Number(data.trabajoEquipoScore) || 0,
      (Number(data.trabajoEquipoPercentage) || 0) / 100,
      
      Number(data.gestionCambioScore) || 0,
      (Number(data.gestionCambioPercentage) || 0) / 100,
      
      // 12 respuestas individuales (Columnas T a AE)
      Number(ans[0])  || 0,
      Number(ans[1])  || 0,
      Number(ans[2])  || 0,
      Number(ans[3])  || 0,
      Number(ans[4])  || 0,
      Number(ans[5])  || 0,
      Number(ans[6])  || 0,
      Number(ans[7])  || 0,
      Number(ans[8])  || 0,
      Number(ans[9])  || 0,
      Number(ans[10]) || 0,
      Number(ans[11]) || 0
    ];

    sheet.appendRow(rowData);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Menú personalizado al abrir la hoja
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Generar PDF')
    .addItem('Descargar Informe PDF', 'generarPDFAlVuelo')
    .addToUi();
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Genera el PDF del diagnóstico ISO a partir de los datos de la fila seleccionada.
 * Todos los puntajes se calculan aquí desde las 12 respuestas individuales (cols H-S).
 */
function generarPDFAlVuelo() {
  var sheet      = SpreadsheetApp.getActiveSheet();
  var filaActual = sheet.getActiveCell().getRow();

  if (filaActual < 2) {
    SpreadsheetApp.getUi().alert("Por favor, selecciona una fila con datos.");
    return;
  }

  // ── 1. LEER DATOS DE LA FILA ──────────────────────────────────────────────
  var fechaVal = sheet.getRange(filaActual, 1).getValue();
  var fecha    = (fechaVal instanceof Date)
    ? Utilities.formatDate(fechaVal, "GMT-3", "dd/MM/yyyy")
    : String(fechaVal);

  var nombre        = String(sheet.getRange(filaActual, 2).getValue() || '');
  var empresa       = String(sheet.getRange(filaActual, 4).getValue() || '');
  var colaboradores = String(sheet.getRange(filaActual, 5).getValue() || '');
  var cargo         = String(sheet.getRange(filaActual, 6).getValue() || '');
  var riskTypeGuard = String(sheet.getRange(filaActual, 7).getValue() || '').toUpperCase();

  if (!nombre) {
    SpreadsheetApp.getUi().alert("Selecciona una fila válida con datos.");
    return;
  }

  // Leer las 12 respuestas individuales (columnas T=20 a AE=31)
  var p = [];
  for (var col = 20; col <= 31; col++) {
    p.push(Number(sheet.getRange(filaActual, col).getValue()) || 0);
  }
  // p[0]..p[2]  → COMUNICACIÓN    (Q1-Q3, max 15)
  // p[3]..p[5]  → LIDERAZGO       (Q4-Q6, max 15)
  // p[6]..p[7]  → CLIMA LABORAL   (Q7-Q8, max 10)
  // p[8]..p[9]  → TRABAJO EQUIPO  (Q9-Q10, max 10)
  // p[10]..p[11]→ GESTIÓN CAMBIO  (Q11-Q12, max 10)

  // ── 2. CALCULAR PUNTAJES ──────────────────────────────────────────────────
  var comScore  = p[0] + p[1] + p[2];
  var lidScore  = p[3] + p[4] + p[5];
  var climScore = p[6] + p[7];
  var teScore   = p[8] + p[9];
  var gcScore   = p[10] + p[11];
  var isoScore  = comScore + lidScore + climScore + teScore + gcScore;

  var comPct  = Math.round((comScore  / 15) * 100);
  var lidPct  = Math.round((lidScore  / 15) * 100);
  var climPct = Math.round((climScore / 10) * 100);
  var tePct   = Math.round((teScore   / 10) * 100);
  var gcPct   = Math.round((gcScore   / 10) * 100);
  var isoPct  = Math.round((isoScore  / 60) * 100);

  // ── 3. DETERMINAR NIVEL ISO ───────────────────────────────────────────────
  var riskType, accentColor, screenText, benchmarkText;

  // Prioridad: usar el riskType guardado; si no existe, derivarlo del puntaje
  var esAlta  = riskTypeGuard.includes('ALTA')  || (!riskTypeGuard && isoPct >= 80);
  var esMedia = riskTypeGuard.includes('MEDIA') || (!riskTypeGuard && isoPct >= 50 && isoPct < 80);

  // Identificar desvíos específicos por dimensión
  var dimsData = [
    { name: 'COMUNICACIÓN',      pct: comPct },
    { name: 'LIDERAZGO',         pct: lidPct },
    { name: 'CLIMA LABORAL',     pct: climPct },
    { name: 'TRABAJO EN EQUIPO', pct: tePct },
    { name: 'GESTIÓN DE CAMBIO', pct: gcPct }
  ];

  var criticalCategories = [];
  var warningCategories = [];
  var strengths = [];

  for (var i = 0; i < dimsData.length; i++) {
    var d = dimsData[i];
    if (d.pct < 50) {
      criticalCategories.push(d);
    } else if (d.pct < 80) {
      warningCategories.push(d);
    } else {
      strengths.push(d.name);
    }
  }

  // Helper para obtener variante determinista según el nombre del usuario
  var getVariant = function(variants, name) {
    var seed = 0;
    var nameStr = name || '';
    for (var charIdx = 0; charIdx < nameStr.length; charIdx++) {
      seed += nameStr.charCodeAt(charIdx);
    }
    return variants[seed % variants.length];
  };

  if (esAlta) {
    riskType      = 'SALUD ORGANIZACIONAL ALTA';
    accentColor   = '#10b981';
    benchmarkText = 'Su empresa presenta un nivel de salud organizacional óptimo, superior al 85% de las organizaciones evaluadas.';
    
    if (criticalCategories.length === 0 && warningCategories.length === 0) {
      screenText = 'La organización posee prácticas maduras y consistentes en todas sus dimensiones (comunicación, liderazgo, clima, trabajo en equipo y gestión de cambio). El desafío es sostener estas fortalezas y sistematizarlas como cultura de la empresa.';
    } else {
      screenText = 'La organización presenta un nivel de salud organizacional general alto, sustentado por fortalezas sólidas en la mayoría de sus dimensiones. Sin embargo, se detectan desequilibrios que requieren atención para consolidar la salud general:';
      if (criticalCategories.length > 0) {
        var names = criticalCategories.map(function(c) { return '<strong>' + c.name + '</strong> (' + c.pct + '%)'; }).join(', ');
        var variants = [
          'Se identifican desvíos críticos en el área de ' + names + '. A pesar del buen resultado general, estas deficiencias pueden actuar como un cuello de botella que neutralice las fortalezas de la organización.',
          'Se observan desajustes graves en el área de ' + names + ' que requieren intervención. Si no se resuelven, corren el riesgo de opacar el buen desempeño del resto de la organización.',
          'El área de ' + names + ' presenta un nivel crítico que exige atención inmediata. Estas debilidades podrían desestabilizar la salud general y reducir la efectividad del resto de los procesos.'
        ];
        screenText += '<br><br><strong>Nota de atención crítica:</strong> ' + getVariant(variants, nombre);
      }
      if (warningCategories.length > 0) {
        var names = warningCategories.map(function(c) { return '<strong>' + c.name + '</strong> (' + c.pct + '%)'; }).join(', ');
        var variants = [
          'El área de ' + names + ' se encuentra en desarrollo, existiendo espacio para estandarizar y consolidar sus prácticas.',
          'Se detectan oportunidades de optimización en el área de ' + names + ', donde la formalización de procesos ayudará a consolidar el nivel general.',
          'El área de ' + names + ' muestra inconsistencias moderadas. Enfocar esfuerzos aquí permitirá unificar los criterios de trabajo y potenciar los resultados.'
        ];
        screenText += '<br><br><strong>Oportunidad de mejora:</strong> ' + getVariant(variants, nombre);
      }
    }
  } else if (esMedia) {
    riskType      = 'SALUD ORGANIZACIONAL MEDIA';
    accentColor   = '#f59e0b';
    benchmarkText = 'Su empresa presenta un nivel de salud organizacional en desarrollo, similar al promedio del sector.';
    screenText    = 'Existen bases operativas construidas, pero se observan inconsistencias que frenan el desempeño. Se requiere estandarizar procesos de alineación y feedback para consolidar los equipos.';
    if (criticalCategories.length > 0) {
      var names = criticalCategories.map(function(c) { return '<strong>' + c.name + '</strong> (' + c.pct + '%)'; }).join(', ');
      var variants = [
        'Se observan resultados críticos en el área de ' + names + ', que deben ser abordados con urgencia para estabilizar el desempeño del equipo.',
        'Los resultados presentan conflictos graves en el área de ' + names + '; el desempeño del equipo puede verse comprometido al mantener las condiciones actuales.',
        'Se registran desvíos severos en el área de ' + names + '. Es fundamental intervenir a corto plazo para mitigar riesgos en la operación y asegurar el bienestar del equipo.'
      ];
      screenText += '<br><br><strong>Atención prioritaria:</strong> ' + getVariant(variants, nombre);
    }
  } else {
    riskType      = 'SALUD ORGANIZACIONAL BAJA';
    accentColor   = '#ef4444';
    benchmarkText = 'Su empresa presenta un nivel de salud organizacional crítico, requiriendo atención prioritaria.';
    screenText    = 'Se identifican bloqueos significativos en el liderazgo, la integración y el flujo de información. Es prioritaria una intervención para rediseñar canales de comunicación y fortalecer el clima de confianza.';
    if (strengths.length > 0) {
      var names = strengths.map(function(s) { return '<strong>' + s + '</strong>'; }).join(', ');
      var variants = [
        'Como aspecto positivo, el área de ' + names + ' se destaca como una fortaleza sobre la cual apalancar las acciones de mejora.',
        'A pesar del panorama complejo, el área de ' + names + ' se sostiene como un pilar fuerte que puede servir de guía y base para el resto de la organización.',
        'La dimensión de ' + names + ' se mantiene en un nivel óptimo. Recomendamos utilizar esta fortaleza como punto de partida y modelo para impulsar la recuperación de las demás áreas.'
      ];
      screenText += '<br><br><strong>Punto de apoyo:</strong> ' + getVariant(variants, nombre);
    }
  }

  // ── 4. FEEDBACKS POR DIMENSIÓN ────────────────────────────────────────────
  function catColor(pct) {
    return pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
  }

  function getFeedback(cat, pct) {
    switch (cat) {
      case 'COMUNICACIÓN':
        if (pct <= 32) {
          return 'La comunicación presenta importantes dificultades. Los objetivos, el seguimiento y el feedback no forman parte de prácticas sistemáticas, generando desalineación y pérdida de eficiencia.';
        } else if (pct <= 46) {
          return 'Existen mecanismos de comunicación, aunque todavía son inconsistentes. La claridad depende más de iniciativas individuales que de procesos establecidos.';
        } else if (pct <= 66) {
          return 'La comunicación muestra bases aceptables, aunque aún existen oportunidades para fortalecer la claridad de objetivos, el seguimiento y el feedback.';
        } else if (pct <= 85) {
          return 'Existen prácticas de comunicación establecidas, aunque algunos equipos perciben falta de claridad en objetivos y feedback.';
        } else {
          return 'La comunicación constituye una fortaleza organizacional. Los objetivos son claros, las reuniones generan acuerdos concretos y el feedback acompaña el desempeño de manera consistente.';
        }
      case 'LIDERAZGO':
        if (pct <= 32) {
          return 'Los líderes presentan dificultades para orientar, acompañar y alinear a sus equipos, afectando la coordinación cotidiana y la confianza.';
        } else if (pct <= 46) {
          return 'Existen prácticas de liderazgo, aunque todavía son poco consistentes entre equipos o responsables.';
        } else if (pct <= 66) {
          return 'El liderazgo sostiene el funcionamiento general, aunque fortalecer el seguimiento y la cercanía con los equipos mejoraría los resultados.';
        } else if (pct <= 86) {
          return 'Los líderes brindan dirección clara y mantienen espacios de seguimiento periódicos. Existen oportunidades para consolidar estas prácticas.';
        } else {
          return 'El liderazgo constituye una fortaleza organizacional. Los responsables acompañan, orientan y generan alineación de manera consistente.';
        }
      case 'CLIMA LABORAL':
        if (pct <= 39) {
          return 'Predomina un contexto donde expresar diferencias o reconocer aportes resulta poco frecuente, afectando la confianza y el compromiso.';
        } else if (pct <= 59) {
          return 'Se observan señales positivas, aunque todavía existen barreras para consolidar relaciones basadas en confianza y reconocimiento.';
        } else if (pct <= 79) {
          return 'El clima laboral resulta funcional para la mayoría de los equipos, aunque fortalecer el reconocimiento y la seguridad psicológica favorecería mejores niveles de colaboración.';
        } else if (pct <= 94) {
          return 'El ambiente de trabajo favorece relaciones respetuosas y espacios donde las diferencias pueden abordarse de manera constructiva.';
        } else {
          return 'El clima laboral constituye una fortaleza. Predominan relaciones basadas en confianza, respeto y reconocimiento.';
        }
      case 'TRABAJO EN EQUIPO':
        if (pct <= 39) {
          return 'La colaboración entre áreas presenta dificultades frecuentes y los conflictos no siempre encuentran espacios adecuados para su resolución.';
        } else if (pct <= 59) {
          return 'Existen experiencias positivas de colaboración, aunque todavía dependen de personas o situaciones puntuales.';
        } else if (pct <= 79) {
          return 'El trabajo conjunto permite sostener la operación cotidiana, aunque fortalecer la coordinación interáreas mejoraría la eficiencia.';
        } else if (pct <= 94) {
          return 'La organización muestra una buena capacidad de colaboración y resolución de conflictos mediante conversaciones orientadas a acuerdos.';
        } else {
          return 'La colaboración entre equipos constituye una fortaleza organizacional y favorece una respuesta coordinada frente a desafíos compartidos.';
        }
      case 'GESTIÓN DE CAMBIO':
        if (pct <= 39) {
          return 'Los cambios suelen implementarse sin suficiente comunicación ni acompañamiento, dificultando la adaptación de los equipos.';
        } else if (pct <= 59) {
          return 'La organización comunica algunos cambios, aunque el proceso todavía presenta oportunidades para mejorar la comprensión y la reorganización posterior.';
        } else if (pct <= 79) {
          return 'Los cambios se gestionan de manera aceptable, aunque fortalecer la comunicación previa y el seguimiento facilitaría la adaptación.';
        } else if (pct <= 94) {
          return 'La organización comunica adecuadamente los cambios y acompaña a los equipos durante la implementación.';
        } else {
          return 'La gestión del cambio constituye una capacidad consolidada. Los equipos comprenden los cambios, reorganizan su trabajo y sostienen el funcionamiento con rapidez.';
        }
      default:
        return '';
    }
  }

  function getCategoryRecommendation(category, percentage, name) {
    var recommendations = [];
    var catUpper = (category || '').toUpperCase();
    switch (catUpper) {
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
    var randomIndex = Math.floor(Math.random() * recommendations.length);
    return recommendations[randomIndex];
  }


  // ── 5. CONSTRUIR FILAS DE DIMENSIONES ────────────────────────────────────
  var dimensions = [
    { name: 'COMUNICACIÓN',      score: comScore,  max: 15, pct: comPct  },
    { name: 'LIDERAZGO',         score: lidScore,  max: 15, pct: lidPct  },
    { name: 'CLIMA LABORAL',     score: climScore, max: 10, pct: climPct },
    { name: 'TRABAJO EN EQUIPO', score: teScore,   max: 10, pct: tePct   },
    { name: 'GESTIÓN DE CAMBIO', score: gcScore,   max: 10, pct: gcPct   }
  ];

  var dimRowsHtml = '';
  for (var i = 0; i < dimensions.length; i++) {
    var d        = dimensions[i];
    var color    = catColor(d.pct);
    var feedback = getFeedback(d.name, d.pct);
    var recommendation = getCategoryRecommendation(d.name, d.pct, nombre);
    dimRowsHtml +=
      '<div style="border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-bottom:12px;background:#fafafa;page-break-inside:avoid;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
          '<strong style="font-size:11.5pt;color:#1a1f36;">' + d.name + '</strong>' +
          '<span style="font-weight:bold;color:' + color + ';font-size:10.5pt;">' +
            d.score + ' / ' + d.max + ' pts (' + d.pct + '%)' +
          '</span>' +
        '</div>' +
        '<div style="background:#e5e7eb;height:6px;border-radius:3px;overflow:hidden;margin-bottom:9px;">' +
          '<div style="background:' + color + ';width:' + d.pct + '%;height:100%;"></div>' +
        '</div>' +
        '<p style="font-size:10pt;color:#4a5568;margin:0 0 8px 0;line-height:1.45;">' + feedback + '</p>' +
        '<p style="font-size:10pt;color:#1a1f36;margin:0;line-height:1.45;font-weight:bold;">' +
          'Recomendación: <span style="font-weight:normal;color:#4a5568;">' + recommendation + '</span>' +
        '</p>' +
      '</div>';
  }

  // ── 5.5. CALCULAR FORTALEZAS Y MEJORAS PARA EL PDF ──────────────────────────
  var STRENGTH_FEEDBACK = {
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

  var IMPROVEMENT_FEEDBACK = {
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

  var strengthCandidates = [];
  var improvementCandidates = [];
  for (var i = 0; i < dimsData.length; i++) {
    var d = dimsData[i];
    if (d.pct >= 60) {
      strengthCandidates.push(d);
    } else {
      improvementCandidates.push(d);
    }
  }

  // Ordenar de mayor a menor porcentaje para fortalezas
  strengthCandidates.sort(function(a, b) { return b.pct - a.pct; });
  var topStrengths = strengthCandidates.slice(0, 3);

  var chosenStrengths = [];
  for (var i = 0; i < topStrengths.length; i++) {
    var str = topStrengths[i];
    var stateKey = str.pct >= 80 ? 'verde' : 'amarillo';
    var options = STRENGTH_FEEDBACK[str.name] && STRENGTH_FEEDBACK[str.name][stateKey];
    if (options && options.length > 0) {
      var randIndex = Math.floor(Math.random() * options.length);
      chosenStrengths.push(options[randIndex]);
    }
  }

  // Ordenar de menor a mayor porcentaje para mejoras
  improvementCandidates.sort(function(a, b) { return a.pct - b.pct; });
  var topImprovements = improvementCandidates.slice(0, 3);

  var chosenImprovements = [];
  for (var i = 0; i < topImprovements.length; i++) {
    var str = topImprovements[i];
    var stateKey = str.pct < 50 ? 'rojo' : 'amarillo';
    var options = IMPROVEMENT_FEEDBACK[str.name] && IMPROVEMENT_FEEDBACK[str.name][stateKey];
    if (options && options.length > 0) {
      var randIndex = Math.floor(Math.random() * options.length);
      chosenImprovements.push(options[randIndex]);
    }
  }

  var pdfStrengthsHtml = '';
  if (chosenStrengths.length > 0) {
    pdfStrengthsHtml =
      '<div style="margin-top: 20px; margin-bottom: 20px; page-break-inside: avoid;">' +
        '<strong style="font-size: 12pt; color: #1a1f36; display: block; margin-bottom: 8px;">Principales Fortalezas:</strong>' +
        '<ul style="margin: 0; padding-left: 20px; font-size: 10.5pt; color: #4a5568; line-height: 1.5;">' +
          chosenStrengths.map(function(dev) { return '<li style="margin-bottom: 4px;">' + dev + '</li>'; }).join('') +
        '</ul>' +
      '</div>';
  }

  var pdfImprovementsHtml = '';
  if (chosenImprovements.length > 0) {
    pdfImprovementsHtml =
      '<div style="margin-top: 20px; margin-bottom: 20px; page-break-inside: avoid;">' +
        '<strong style="font-size: 12pt; color: #1a1f36; display: block; margin-bottom: 8px;">Áreas de mejora:</strong>' +
        '<ul style="margin: 0; padding-left: 20px; font-size: 10.5pt; color: #4a5568; line-height: 1.5;">' +
          chosenImprovements.map(function(dev) { return '<li style="margin-bottom: 4px;">' + dev + '</li>'; }).join('') +
        '</ul>' +
      '</div>';
  }

  // ── 6. HTML COMPLETO DEL PDF ──────────────────────────────────────────────
  var primerNombre = nombre.split(' ')[0];

  var metaExtra = '';
  if (colaboradores) metaExtra += '<div><strong>COLABORADORES:</strong> ' + colaboradores + '</div>';
  if (cargo)         metaExtra += '<div><strong>CARGO:</strong> ' + cargo + '</div>';

  var htmlContent =
    '<html><head><style>' +
      'body{font-family:Arial,sans-serif;padding:12px 30px 30px 30px;color:#333;line-height:1.5;}' +
      '.header-title{font-size:24pt;font-weight:bold;text-align:center;margin-bottom:4px;}' +
      '.header-subtitle{font-size:13pt;color:#666;text-align:center;margin-bottom:20px;}' +
      '.divider{border-top:1px solid #ccc;margin:18px 0;}' +
      '.meta{font-size:10.5pt;margin-bottom:22px;}' +
      'h2{color:#000;font-size:16pt;margin-top:22px;margin-bottom:12px;}' +
      'h3{border-bottom:2px solid #e21d48;padding-bottom:4px;margin-top:30px;margin-bottom:12px;font-size:14pt;}' +
      '.risk-text{font-size:16pt;font-weight:bold;color:' + accentColor + ';}' +
      '.iso-box{margin-top:14px;background:#fafafa;border:1px solid #e2e8f0;border-left:4px solid ' + accentColor + ';border-radius:6px;padding:14px 18px;}' +
      '.sig{margin-top:45px;border-top:1px solid #eee;padding-top:22px;font-size:10.5pt;}' +
      '.disc{font-style:italic;margin-bottom:12px;color:#555;}' +
      '.conf{color:#999;font-size:8.5pt;}' +
    '</style></head><body>' +

    // Logotipo
    '<table style="width:100%; border:none; border-collapse:collapse; margin-bottom:15px;">' +
      '<tr>' +
        '<td style="text-align:left; vertical-align:middle; border:none; padding:0 0 0 20px;">' +
          '<table style="border:none; border-collapse:collapse; display:inline-table; vertical-align:middle;">' +
            '<tr>' +
              '<td style="border:none; padding:0; vertical-align:middle;">' +
                '<svg width="42" viewBox="315 20 1306 1877" style="display:block;">' +
                  '<path fill="#e21d48" d="m907.23 392.29l-0.23 1502.93-588.27-365.91-2.74-1509.31z"/>' +
                  '<path fill="#9f133a" d="m1620.72 810.65l-0.73 728.68-586.81 357.15-0.52-737.83z"/>' +
                '</svg>' +
              '</td>' +
              '<td style="border:none; padding-left:6px; vertical-align:middle; font-size:18pt; font-weight:bold; color:#e21d48; font-family:Arial,sans-serif; line-height:1;">' +
                'LEX' +
              '</td>' +
            '</tr>' +
          '</table>' +
        '</td>' +
        '<td style="text-align:right; vertical-align:middle; border:none; padding:0;">' +
          '<img src="data:image/png;base64,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" style="height:30px; width:auto;" />' +
        '</td>' +
      '</tr>' +
    '</table>' +

    '<div class="header-title">Diagnóstico organizacional</div>' +
    '<div class="header-subtitle">LEX + ELAC - Calculadora RRHH</div>' +
    '<div class="divider"></div>' +

    '<div class="meta">' +
      '<div><strong>PARA:</strong> ' + nombre + '</div>' +
      '<div><strong>EMPRESA:</strong> ' + empresa + '</div>' +
      metaExtra +
      '<div><strong>FECHA:</strong> ' + fecha + '</div>' +
    '</div>' +

    '<p>Estimado/a ' + primerNombre + ',</p>' +
    '<p>Gracias por completar el <strong>Diagnóstico de Salud Organizacional (ISO)</strong>.</p>' +

    '<h2>Resultado General</h2>' +
    '<div style="margin-bottom:12px;"><strong>Nivel ISO:</strong> <span class="risk-text">' + riskType + '</span></div>' +

    '<div class="iso-box">' +
      '<div style="font-size:13pt;font-weight:bold;margin-bottom:8px;color:#1a1f36;">' +
        'Índice de Salud Organizacional: ' +
        '<span style="color:' + accentColor + ';">' + isoScore + ' / 60 pts (' + isoPct + '%)</span>' +
      '</div>' +
      '<p style="margin:0;font-size:10.5pt;color:#4a5568;">' + screenText + '</p>' +
    '</div>' +

    '<p style="margin-top:14px;font-size:10.5pt;color:#555;">' +
      '<strong>Benchmark:</strong> ' + benchmarkText +
    '</p>' +
    getBenchmarkTableHtml(isoPct) +

    '<h3>Resultados por Dimensión</h3>' +
    dimRowsHtml +
    pdfStrengthsHtml +
    pdfImprovementsHtml +

    '<div class="sig">' +
      '<p><strong>Lic. Susana Nuevo.</strong> Master Coach Ontológico Profesional. Directora de Fundación ELAC Delegaciones Ramos Mejía y Luján.</p>' +
      '<p><strong>Lic. Marcelo Trulls.</strong> Licenciado en Ciencias de la Comunicación. Universidad de Morón. Senior Coach Ontológico Profesional. Fundación ELAC, certificado por la AACOP. Director de Fundación ELAC Delegaciones Ramos Mejía y Luján.</p>' +
  '<p><strong>ELAC</strong> General Soler 138 – Ramos Mejía. Provincia de Buenos Aires <strong>Tel: +54 911 5110-6664</strong>.</p>' +
        '<a href="elacramosmejia@elacoaching.com.ar" style="color:#e21d48;">elacramosmejia@elacoaching.com.ar</a>' +
      '</p>' +
      '<p><strong>LEX Recursos Humanos y Organización S.R.L.</strong> ' +
        '<a href="https://bio.site/LEXRRHH" style="color:#e21d48;">https://bio.site/LEXRRHH</a>' +
      '</p>' +
      '<p class="disc">Este diagnóstico identifica riesgos, pero no los corrige. Para reducirlos de forma concreta, se recomienda una reunión de análisis personalizada.</p>' +
      '<p class="conf">Documento confidencial – Uso exclusivo de la empresa</p>' +
    '</div>' +

    '</body></html>';

  // ── 7. GENERAR PDF Y MOSTRAR DESCARGA ────────────────────────────────────
  var blob    = Utilities.newBlob(htmlContent, 'text/html', 'temp.html');
  var pdfName = 'Informe_ISO_LEX_' + nombre.replace(/\s+/g, '_') + '.pdf';
  var pdf     = blob.getAs('application/pdf').setName(pdfName);
  var base64  = Utilities.base64Encode(pdf.getBytes());

  var output = HtmlService.createHtmlOutput(
    '<div style="text-align:center;font-family:Arial,sans-serif;padding:24px;">' +
      '<p style="font-size:15px;font-weight:bold;color:#1a1f36;">✅ Informe ISO generado con éxito</p>' +
      '<p style="font-size:12px;color:#555;margin-bottom:18px;">' + nombre + ' — ' + empresa + ' &nbsp;|&nbsp; ISO: ' + isoScore + '/60 (' + isoPct + '%)</p>' +
      '<a href="data:application/pdf;base64,' + base64 + '"' +
         ' download="' + pdfName + '"' +
         ' style="display:inline-block;padding:12px 28px;background:#e21d48;color:white;' +
                'text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;">' +
        '⬇ Descargar Informe PDF' +
      '</a>' +
      '<p style="margin-top:14px;font-size:10px;color:#999;">Si el archivo no se descarga automáticamente, haga clic en el botón.</p>' +
    '</div>'
  ).setWidth(420).setHeight(200);

  SpreadsheetApp.getUi().showModalDialog(output, 'Generador de Informes ISO — LEX');
}

/**
 * Genera el bloque HTML de la tabla de benchmark para el PDF
 */
function getBenchmarkTableHtml(percentage) {
  var ranges = [
    { min: 95, max: 100, rangeText: "95% - 100%", label: "Top 10%", color: "#0d9488", bg: "#f0fdfa" },
    { min: 80, max: 94, rangeText: "80% - 94%", label: "Promedio alto", color: "#10b981", bg: "#f0fdf4" },
    { min: 60, max: 79, rangeText: "60% - 79%", label: "Promedio", color: "#3b82f6", bg: "#eff6ff" },
    { min: 40, max: 59, rangeText: "40% - 59%", label: "Riesgo", color: "#f59e0b", bg: "#fffbeb" },
    { min: 0, max: 39, rangeText: "20% - 39%", label: "Alto riesgo", color: "#ef4444", bg: "#fef2f2" }
  ];

  var rowsHtml = '';
  for (var i = 0; i < ranges.length; i++) {
    var r = ranges[i];
    var isUserRange = (percentage >= r.min && percentage <= r.max);
    var rowBg = isUserRange ? r.bg : '#ffffff';
    var textColor = isUserRange ? r.color : '#2d3748';
    var fontStyle = isUserRange ? 'font-weight: bold;' : '';
    var borderStyle = 'border: 1px solid #e2e8f0;';
    
    var indicator = isUserRange 
      ? '<span style="background-color: ' + r.color + '; color: #ffffff; padding: 3px 10px; border-radius: 20px; font-size: 8.5pt; font-weight: bold; display: inline-block;">Su empresa</span>'
      : '';

    rowsHtml += '<tr style="background-color: ' + rowBg + '; ' + fontStyle + '">' +
      '<td style="padding: 8px 12px; font-size: 10pt; ' + borderStyle + ' text-align: left; color: ' + textColor + ';">' + r.rangeText + '</td>' +
      '<td style="padding: 8px 12px; font-size: 10pt; ' + borderStyle + ' text-align: left; color: ' + textColor + ';">' + r.label + '</td>' +
      '<td style="padding: 8px 12px; font-size: 10pt; ' + borderStyle + ' text-align: center; vertical-align: middle;">' + indicator + '</td>' +
    '</tr>';
  }

  return '<div style="margin-top: 15px; margin-bottom: 20px; font-family: Arial, sans-serif; page-break-inside: avoid;">' +
    '<div style="font-weight: bold; font-size: 11pt; margin-bottom: 8px; color: #1a1f36; text-align: left;">Ubicación en el Benchmark de Salud Organizacional:</div>' +
    '<table style="width: 100%; border-collapse: collapse; margin-top: 5px;">' +
      '<thead>' +
        '<tr style="background-color: #f7fafc; border-bottom: 2px solid #e2e8f0;">' +
          '<th style="padding: 10px 12px; font-size: 9.5pt; color: #4a5568; text-align: left; font-weight: bold; border: 1px solid #e2e8f0;">Rango ISO</th>' +
          '<th style="padding: 10px 12px; font-size: 9.5pt; color: #4a5568; text-align: left; font-weight: bold; border: 1px solid #e2e8f0;">Clasificación</th>' +
          '<th style="padding: 10px 12px; font-size: 9.5pt; color: #4a5568; text-align: center; font-weight: bold; border: 1px solid #e2e8f0; width: 110px;">Su Nivel</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>' +
        rowsHtml +
      '</tbody>' +
    '</table>' +
  '</div>';
}
