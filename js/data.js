/**
 * FUENTE DE DATOS Y GESTOR DE ALMACENAMIENTO — GRUPO 415 (PREPA 4 UNAM)
 * Arquitectura desacoplada: Única fuente de verdad para el sistema digital.
 * Sistema de clasificación temporal automática: Actual / Próximo vs Vencido / Finalizado / Archivado.
 * Carga de contenidos académicos actuales solicitados para el 415.
 */

const GRUPO_415_DATA_DEFAULT = {
  version: "2.4.0",
  ultimaActualizacion: "2026-09-27T16:31:00",

  institucion: {
    escuela: "Universidad Nacional Autónoma de México",
    plantel: "Escuela Nacional Preparatoria Plantel 4 \"Vidal Castañeda y Nájera\"",
    grupo: "415",
    turno: "Matutino",
    ciclo: "2026-2027",
    contactoOficial: {
      correo: "ENP4.SHAMINKET@GMAIL.COM",
      telefono: "+52 55 7198 5641",
      direccion: "Av. Observatorio #170, Col. Observatorio, Alcaldía Miguel Hidalgo, CDMX"
    }
  },

  // Nomenclatura oficial: REGLA EXCLUSIVA PARA LA MATERIA DE HISTORIA UNIVERSAL III
  reglaRenombradoHistoria: {
    materiaId: "historia",
    patron: "415_ApellidosDelAlumno_tarea00",
    ejemplo: "415_PerezGarcia_tarea03.pdf",
    prefijoObligatorio: "415",
    instruccion: "Para la materia de Historia Universal III, es obligatorio entregar las tareas nombradas con este formato exacto."
  },

  // 12 Materias reales del Grupo 415 según SiHo oficial
  materias: [
    {
      id: "lengua-espanola",
      nombre: "Lengua Española",
      clave: "1401",
      slug: "lengua-espanola.html",
      destacada: true,
      ordenDestacado: 1,
      profesor: null,
      seccionEspecifica: false,
      salones: ["B-110", "B-112", "B-113"],
      descripcionCorta: "Análisis textual, redacción académica y comprensión lectora.",
      horasSemanales: 5
    },
    {
      id: "historia",
      nombre: "Historia Universal III",
      clave: "1403",
      slug: "historia.html",
      destacada: true,
      ordenDestacado: 2,
      profesor: null,
      seccionEspecifica: false,
      salones: ["B-109", "B-117"],
      descripcionCorta: "Procesos históricos universales, transformaciones sociales y políticas contemporáneas.",
      horasSemanales: 3,
      tieneRegalos: true,
      formatoEntrega: "415_ApellidosDelAlumno_tarea00",
      ejemploEntrega: "415_PerezGarcia_tarea03.pdf"
    },
    {
      id: "matematicas",
      nombre: "Matemáticas IV",
      clave: "1400",
      slug: "matematicas.html",
      destacada: false,
      profesor: null,
      seccionEspecifica: false,
      salones: ["B-109", "B-112", "B-117"],
      descripcionCorta: "Álgebra avanzada, geometría analítica y modelación matemática.",
      horasSemanales: 5
    },
    {
      id: "fisica",
      nombre: "Física III",
      clave: "1402",
      slug: "fisica.html",
      destacada: false,
      profesor: null,
      seccionEspecifica: false,
      salones: ["A-302", "B-109", "B-115", "B-116"],
      descripcionCorta: "Mecánica clásica, leyes de movimiento y experimentación en laboratorio.",
      horasSemanales: 5
    },
    {
      id: "logica",
      nombre: "Lógica",
      clave: "1404",
      slug: "logica.html",
      destacada: false,
      profesor: null,
      seccionEspecifica: false,
      salones: ["B-108", "B-206"],
      descripcionCorta: "Estructuras de razonamiento formal, tablas de verdad y argumentación dialógica.",
      horasSemanales: 3
    },
    {
      id: "geografia",
      nombre: "Geografía",
      clave: "1405",
      slug: "geografia.html",
      destacada: false,
      profesor: null,
      seccionEspecifica: false,
      salones: ["A-104"],
      descripcionCorta: "Espacio geográfico, análisis cartográfico y geosistemas de México y el mundo.",
      horasSemanales: 3
    },
    {
      id: "dibujo",
      nombre: "Dibujo II",
      clave: "1406",
      slug: "dibujo.html",
      destacada: false,
      profesor: null,
      seccionEspecifica: true,
      salones: ["B-008 (Sec. A)", "C-201 (Sec. B)"],
      descripcionCorta: "Dibujo técnico, trazo geométrico, vistas, cotas y sistemas de proyección.",
      horasSemanales: 2
    },
    {
      id: "ingles",
      nombre: "Lengua extranjera Inglés IV",
      clave: "1407",
      slug: "ingles.html",
      destacada: false,
      profesor: null,
      seccionEspecifica: true,
      salones: ["C-306 (Sec. A)", "C-205 (Sec. B)"],
      descripcionCorta: "Desarrollo de competencias lingüísticas: gramática, lectura y expresión oral/escrita.",
      horasSemanales: 3
    },
    {
      id: "informatica",
      nombre: "Informática",
      clave: "1408",
      slug: "informatica.html",
      destacada: false,
      profesor: null,
      seccionEspecifica: false,
      salones: ["B-108", "CC-2"],
      descripcionCorta: "Herramientas computacionales, laboratorio de cómputo y fundamentos de sistemas.",
      horasSemanales: 2
    },
    {
      id: "genero-prevencion",
      nombre: "Género y Prevención de las Violencias",
      clave: "8000",
      slug: "genero-prevencion.html",
      destacada: false,
      profesor: null,
      seccionEspecifica: false,
      salones: ["B-108", "B-109"],
      descripcionCorta: "Análisis de relaciones de género, derechos humanos, convivencia pacífica y prevención.",
      horasSemanales: 2
    },
    {
      id: "educacion-fisica",
      nombre: "Educación Física IV",
      clave: "1409",
      slug: "educacion-fisica.html",
      destacada: false,
      profesor: null,
      seccionEspecifica: false,
      salones: ["GIM1"],
      descripcionCorta: "Acondicionamiento físico, hábitos de salud deportiva y trabajo colaborativo.",
      horasSemanales: 1
    },
    {
      id: "orientacion-educativa",
      nombre: "Orientación Educativa IV",
      clave: "1410",
      slug: "orientacion-educativa.html",
      destacada: false,
      profesor: null,
      seccionEspecifica: true,
      salones: ["B-110 (Sec. A)", "B-112 (Sec. B)"],
      descripcionCorta: "Acompañamiento psicopedagógico, toma de decisiones y proyecto vocacional.",
      horasSemanales: 1
    }
  ],

  // Horario semanal oficial basado fielmente en SiHo
  horarioSemanal: [
    // --- LUNES (day 1) ---
    { id: "h-lun-1", dia: 1, diaNombre: "Lunes", inicio: "07:00", fin: "07:50", materiaId: "geografia", salon: "A-104", seccion: null },
    { id: "h-lun-2", dia: 1, diaNombre: "Lunes", inicio: "07:50", fin: "08:40", materiaId: "fisica", salon: "B-116", seccion: null },
    { id: "h-lun-3", dia: 1, diaNombre: "Lunes", inicio: "08:40", fin: "09:30", materiaId: "fisica", salon: "B-109", seccion: null },
    { id: "h-lun-4a", dia: 1, diaNombre: "Lunes", inicio: "09:30", fin: "10:20", materiaId: "ingles", salon: "C-306", seccion: "A" },
    { id: "h-lun-4b", dia: 1, diaNombre: "Lunes", inicio: "09:30", fin: "10:20", materiaId: "ingles", salon: "C-205", seccion: "B" },
    { id: "h-lun-5", dia: 1, diaNombre: "Lunes", inicio: "10:20", fin: "11:10", materiaId: "lengua-espanola", salon: "B-112", seccion: null },
    { id: "h-lun-6", dia: 1, diaNombre: "Lunes", inicio: "11:10", fin: "12:00", materiaId: "lengua-espanola", salon: "B-112", seccion: null },
    { id: "h-lun-7a", dia: 1, diaNombre: "Lunes", inicio: "12:00", fin: "12:50", materiaId: "orientacion-educativa", salon: "B-110", seccion: "A" },
    { id: "h-lun-7b", dia: 1, diaNombre: "Lunes", inicio: "12:00", fin: "12:50", materiaId: "orientacion-educativa", salon: "B-112", seccion: "B" },
    { id: "h-lun-8", dia: 1, diaNombre: "Lunes", inicio: "12:50", fin: "13:40", materiaId: "fisica", salon: "A-302", seccion: null },

    // --- MARTES (day 2) ---
    { id: "h-mar-1", dia: 2, diaNombre: "Martes", inicio: "07:00", fin: "07:50", materiaId: "matematicas", salon: "B-112", seccion: null },
    { id: "h-mar-2", dia: 2, diaNombre: "Martes", inicio: "07:50", fin: "08:40", materiaId: "matematicas", salon: "B-112", seccion: null },
    { id: "h-mar-3a", dia: 2, diaNombre: "Martes", inicio: "08:40", fin: "09:30", materiaId: "dibujo", salon: "B-008", seccion: "A" },
    { id: "h-mar-4", dia: 2, diaNombre: "Martes", inicio: "09:30", fin: "10:20", materiaId: "informatica", salon: "B-108", seccion: null },
    { id: "h-mar-5", dia: 2, diaNombre: "Martes", inicio: "10:20", fin: "11:10", materiaId: "logica", salon: "B-206", seccion: null },
    { id: "h-mar-6", dia: 2, diaNombre: "Martes", inicio: "11:10", fin: "12:00", materiaId: "informatica", salon: "CC-2", seccion: null },
    { id: "h-mar-7", dia: 2, diaNombre: "Martes", inicio: "12:00", fin: "12:50", materiaId: "genero-prevencion", salon: "B-109", seccion: null },

    // --- MIÉRCOLES (day 3) ---
    { id: "h-mie-1", dia: 3, diaNombre: "Miércoles", inicio: "07:00", fin: "07:50", materiaId: "geografia", salon: "A-104", seccion: null },
    { id: "h-mie-2", dia: 3, diaNombre: "Miércoles", inicio: "07:50", fin: "08:40", materiaId: "logica", salon: "B-108", seccion: null },
    { id: "h-mie-3", dia: 3, diaNombre: "Miércoles", inicio: "08:40", fin: "09:30", materiaId: "logica", salon: "B-108", seccion: null },
    { id: "h-mie-4a", dia: 3, diaNombre: "Miércoles", inicio: "09:30", fin: "10:20", materiaId: "ingles", salon: "C-306", seccion: "A" },
    { id: "h-mie-4b", dia: 3, diaNombre: "Miércoles", inicio: "09:30", fin: "10:20", materiaId: "ingles", salon: "C-205", seccion: "B" },
    { id: "h-mie-5a", dia: 3, diaNombre: "Miércoles", inicio: "10:20", fin: "11:10", materiaId: "dibujo", salon: "B-008", seccion: "A" },
    { id: "h-mie-5b", dia: 3, diaNombre: "Miércoles", inicio: "10:20", fin: "11:10", materiaId: "dibujo", salon: "C-201", seccion: "B" },
    { id: "h-mie-6", dia: 3, diaNombre: "Miércoles", inicio: "11:10", fin: "12:00", materiaId: "lengua-espanola", salon: "B-113", seccion: null },
    { id: "h-mie-7", dia: 3, diaNombre: "Miércoles", inicio: "12:00", fin: "12:50", materiaId: "lengua-espanola", salon: "B-113", seccion: null },

    // --- JUEVES (day 4) ---
    { id: "h-jue-1", dia: 4, diaNombre: "Jueves", inicio: "07:00", fin: "07:50", materiaId: "matematicas", salon: "B-109", seccion: null },
    { id: "h-jue-2", dia: 4, diaNombre: "Jueves", inicio: "07:50", fin: "08:40", materiaId: "matematicas", salon: "B-109", seccion: null },
    { id: "h-jue-3", dia: 4, diaNombre: "Jueves", inicio: "08:40", fin: "09:30", materiaId: "lengua-espanola", salon: "B-110", seccion: null },
    { id: "h-jue-4", dia: 4, diaNombre: "Jueves", inicio: "09:30", fin: "10:20", materiaId: "geografia", salon: "A-104", seccion: null },
    { id: "h-jue-5", dia: 4, diaNombre: "Jueves", inicio: "10:20", fin: "11:10", materiaId: "historia", salon: "B-109", seccion: null },
    { id: "h-jue-6", dia: 4, diaNombre: "Jueves", inicio: "11:10", fin: "12:00", materiaId: "historia", salon: "B-109", seccion: null },

    // --- VIERNES (day 5) ---
    { id: "h-vie-1b", dia: 5, diaNombre: "Viernes", inicio: "07:00", fin: "07:50", materiaId: "dibujo", salon: "C-201", seccion: "B" },
    { id: "h-vie-2", dia: 5, diaNombre: "Viernes", inicio: "07:50", fin: "08:40", materiaId: "historia", salon: "B-117", seccion: null },
    { id: "h-vie-3", dia: 5, diaNombre: "Viernes", inicio: "08:40", fin: "09:30", materiaId: "matematicas", salon: "B-117", seccion: null },
    { id: "h-vie-4a", dia: 5, diaNombre: "Viernes", inicio: "09:30", fin: "10:20", materiaId: "ingles", salon: "C-306", seccion: "A" },
    { id: "h-vie-4b", dia: 5, diaNombre: "Viernes", inicio: "09:30", fin: "10:20", materiaId: "ingles", salon: "C-205", seccion: "B" },
    { id: "h-vie-5", dia: 5, diaNombre: "Viernes", inicio: "10:20", fin: "11:10", materiaId: "genero-prevencion", salon: "B-108", seccion: null },
    { id: "h-vie-6", dia: 5, diaNombre: "Viernes", inicio: "11:10", fin: "12:00", materiaId: "educacion-fisica", salon: "GIM1", seccion: null },
    { id: "h-vie-7", dia: 5, diaNombre: "Viernes", inicio: "12:00", fin: "12:50", materiaId: "fisica", salon: "B-115", seccion: null },
    { id: "h-vie-8", dia: 5, diaNombre: "Viernes", inicio: "12:50", fin: "13:40", materiaId: "fisica", salon: "A-302", seccion: null }
  ],

  // TAREAS: ÚNICAMENTE LAS ESPECIFICADAS COMO ACTUALES + REGISTROS HISTÓRICOS
  tareas: [
    // --- TAREA ACTUAL: MATEMÁTICAS ---
    {
      id: "tarea-mat-exponentes",
      codigo: "TAREA-415-MAT-001",
      materiaId: "matematicas",
      numeroTarea: "01",
      titulo: "Ejercicios con base en la ley de los exponentes",
      estado: "publicado",
      fechaPublicacion: "2026-09-27",
      fechaEntregaISO: "2026-09-29",
      fechaEntrega: "Martes 29 de septiembre de 2026",
      seccion: "Todas",
      indicaciones: "No te olvides de realizar los ejercicios en base a la ley de los exponentes."
    },

    // --- TAREAS ANTERIORES / HISTORIAL (Archivadas para consulta en subpágina Historial) ---
    {
      id: "tarea-hist-lengua-000",
      codigo: "TAREA-415-LENGUA-000",
      materiaId: "lengua-espanola",
      numeroTarea: "00",
      titulo: "Cuestionario diagnóstico de comprensión lectora",
      estado: "publicado",
      fechaPublicacion: "2026-08-11",
      fechaEntregaISO: "2026-08-18",
      fechaEntrega: "18 de agosto de 2026",
      seccion: "Todas",
      indicaciones: "Lectura diagnóstica de tres fragmentos narrativos breves y resolución del cuestionario inicial de inferencia textual para perfil de ingreso."
    },
    {
      id: "tarea-hist-mat-000",
      codigo: "TAREA-415-MAT-000",
      materiaId: "matematicas",
      numeroTarea: "00",
      titulo: "Evaluación diagnóstica de álgebra básica y fracciones",
      estado: "publicado",
      fechaPublicacion: "2026-08-11",
      fechaEntregaISO: "2026-08-19",
      fechaEntrega: "19 de agosto de 2026",
      seccion: "Todas",
      indicaciones: "Resolución de 15 reactivos de operaciones con fracciones, jerarquía de operaciones algebraicas y productos notables para diagnóstico de grupo."
    },
    {
      id: "tarea-hist-fisica-000",
      codigo: "TAREA-415-FIS-000",
      materiaId: "fisica",
      numeroTarea: "00",
      titulo: "Firma de reglamento de laboratorio y verificación de bata",
      estado: "publicado",
      fechaPublicacion: "2026-08-12",
      fechaEntregaISO: "2026-08-21",
      fechaEntrega: "21 de agosto de 2026",
      seccion: "Todas",
      indicaciones: "Entrega del talón firmado por padre o tutor del reglamento de seguridad de los laboratorios de ciencias de la ENP 4 y verificación de bata blanca reglamentaria."
    },
    {
      id: "tarea-hist-historia-000",
      codigo: "TAREA-415-HIST-000",
      materiaId: "historia",
      numeroTarea: "00",
      codigoRenombrado: "415_ApellidosDelAlumno_tarea00",
      titulo: "Línea de tiempo introductoria: Del Medievo a la Modernidad",
      estado: "publicado",
      fechaPublicacion: "2026-08-14",
      fechaEntregaISO: "2026-08-28",
      fechaEntrega: "28 de agosto de 2026",
      seccion: "Todas",
      indicaciones: "Elaboración de una línea de tiempo gráfica ubicando los siglos XIV al XVIII y sus hitos fundamentales de transición socioeconómica."
    },
    {
      id: "tarea-hist-info-000",
      codigo: "TAREA-415-INFO-000",
      materiaId: "informatica",
      numeroTarea: "00",
      titulo: "Alta de cuenta institucional @comunidad.unam.mx y Classroom",
      estado: "publicado",
      fechaPublicacion: "2026-08-15",
      fechaEntregaISO: "2026-08-26",
      fechaEntrega: "26 de agosto de 2026",
      seccion: "Todas",
      indicaciones: "Validación de acceso al correo institucional UNAM y registro en las aulas virtuales oficiales del curso de Informática."
    }
  ],

  // AVISOS Y RECORDATORIOS ACTUALES
  avisos: [
    // --- GEOGRAFÍA: AVISO / COMERCIAL HOJAS MEMBRETADAS ($30 ENCARDOMY) ---
    {
      id: "aviso-geo-hojas",
      titulo: "Recuerda tener listas tus hojas membretadas",
      materiaId: "geografia",
      fechaPublicacion: "2026-09-27",
      fechaFin: "2026-10-31",
      tipo: "comercial",
      seccion: "Todas",
      contenido: "Recuerda tener listas tus hojas membretadas. Si todavía no las tienes, puedes conseguirlas por $30 pesos mediante Encardomy y solicitar que te las lleven.",
      precio: "$30 pesos",
      proveedor: "Encardomy",
      contactoWhatsApp: "+52 55 7198 5641"
    },

    // --- INFORMÁTICA: AVISO EXPOSICIONES ---
    {
      id: "aviso-info-exposicion",
      titulo: "Exposiciones de Equipo (Equipos 1 y 3)",
      materiaId: "informatica",
      fechaPublicacion: "2026-09-27",
      fechaFin: "2026-10-06",
      tipo: "academico",
      seccion: "Todas",
      contenido: "Equipo 1 y 3, prepárense para exponer. Si no perteneces a estos equipos, sigue preparando tu exposición."
    },

    // --- LÓGICA: AVISO / RECORDATORIO ---
    {
      id: "aviso-logica-investigacion",
      titulo: "Recordatorio de Investigación",
      materiaId: "logica",
      fechaPublicacion: "2026-09-27",
      fechaFin: "2026-10-06",
      tipo: "recordatorio",
      seccion: "Todas",
      contenido: "No olvides tu investigación."
    },

    // --- EDUCACIÓN FÍSICA: RECORDATORIO ---
    {
      id: "aviso-edufis-cuerda",
      titulo: "Recordatorio de Material",
      materiaId: "educacion-fisica",
      fechaPublicacion: "2026-09-27",
      fechaFin: "2026-10-06",
      tipo: "recordatorio",
      seccion: "Todas",
      contenido: "No olvides tu cuerda."
    },

    // --- COMUNICADO GENERAL INSTITUCIONAL ---
    {
      id: "aviso-convocatoria-olimpiadas",
      titulo: "Convocatoria Olimpiadas de la Ciencia UNAM 2026-2027",
      materiaId: "general",
      fechaPublicacion: "2026-09-25",
      fechaFin: "2026-10-15",
      tipo: "academico",
      seccion: "Todas",
      contenido: "La Secretaría Académica invita a los alumnos del Grupo 415 a inscribirse a los comités preparatorios de Física, Matemáticas y Geografía."
    },

    // --- AVISOS ANTERIORES / HISTORIAL ---
    {
      id: "aviso-hist-bienvenida",
      titulo: "Bienvenida oficial al ciclo escolar 2026-2027 Grupo 415",
      materiaId: "general",
      fechaPublicacion: "2026-08-10",
      fechaFin: "2026-08-25",
      tipo: "institucional",
      seccion: "Todas",
      contenido: "La Dirección del Plantel 4 da la más cordial bienvenida a los alumnos del grupo 415 al turno matutino, informando los lineamientos de ingreso."
    },
    {
      id: "aviso-hist-credenciales",
      titulo: "Jornada de canje y entrega de credenciales UNAM",
      materiaId: "orientacion-educativa",
      fechaPublicacion: "2026-08-17",
      fechaFin: "2026-08-24",
      tipo: "institucional",
      seccion: "Todas",
      contenido: "Presentarse en ventanilla de Servicios Escolares con comprobante de inscripción y fotografía oficial para emisión de credencial."
    },
    {
      id: "aviso-hist-simulacro",
      titulo: "Simulacro Nacional Conmemorativo 19 de Septiembre",
      materiaId: "general",
      fechaPublicacion: "2026-09-15",
      fechaFin: "2026-09-19",
      tipo: "institucional",
      seccion: "Todas",
      contenido: "Instrucciones de repliegue y rutas de evacuación en los edificios A, B y C para el simulacro de las 11:00 horas."
    }
  ],

  // EXÁMENES: FÍSICA III (LUNES 28 DE SEPTIEMBRE DE 2026)
  examenes: [
    {
      id: "examen-fisica-001",
      titulo: "Examen de Física III",
      materiaId: "fisica",
      fecha: "2026-09-28", // Lunes 28 de septiembre de 2026
      tipo: "parcial",
      seccion: "Todas",
      descripcion: "Examen el lunes 28 de septiembre de 2026."
    },
    {
      id: "examen-hist-diagnostico",
      titulo: "Examen Diagnóstico Institucional de 4° Año",
      materiaId: "general",
      fecha: "2026-08-14",
      tipo: "diagnostico",
      seccion: "Todas",
      descripcion: "Batería diagnóstica institucional aplicada durante la primera semana lectiva del ciclo 2026-2027."
    }
  ],

  // EVENTOS Y CALENDARIO ACADÉMICO: LENGUA ESPAÑOLA (DON JUAN TENORIO)
  eventosCalendario: [
    // --- EVENTO CULTURAL LENGUA ESPAÑOLA ---
    {
      id: "evento-don-juan-tenorio",
      materiaId: "lengua-espanola",
      titulo: "Don Juan Tenorio Clásico",
      tipo: "cultural",
      fecha: "2026-10-17", // Sábado 17 de octubre de 2026
      horaInicio: "10:00",
      horaFin: "12:00",
      lugar: "Teatro Xola • Julio Prieto (Eje 4 Sur 809, Col. del Valle, CDMX)",
      costo: "$300 pesos",
      informes: "55 22 99 89 49",
      compania: "SKENIKA",
      direccion: "Félix Maldonado",
      descripcion: "Puesta en escena de Don Juan Tenorio Clásico en el Teatro Xola Julio Prieto. Sábado 17 de octubre de 2026 a las 10:00 AM. Costo: $300 pesos. Informes y reservaciones: 55 22 99 89 49. Asistencia sugerida Grupo 415 Lengua Española ENP 4.",
      seccion: "Todas"
    },

    // --- EVENTOS OFICIALES DEL CICLO ESCOLAR ENP 2026-2027 ---
    {
      id: "cal-2026-11-06",
      fecha: "2026-11-06",
      titulo: "Entrega 1ª Evaluación Parcial",
      tipo: "evaluacion",
      descripcion: "Fecha límite oficial para la captura y entrega de la primera evaluación parcial.",
      seccion: "Todas"
    },
    {
      id: "cal-2026-11-17",
      fecha: "2026-11-17",
      fechaFin: "2026-11-23",
      titulo: "1er Reporte del Avance Programático",
      tipo: "institucional",
      descripcion: "Periodo de captura del primer reporte docente del avance de asignaturas.",
      seccion: "Todas"
    },
    {
      id: "cal-2027-02-05",
      fecha: "2027-02-05",
      titulo: "Entrega 2ª Evaluación Parcial",
      tipo: "evaluacion",
      descripcion: "Fecha límite oficial para el registro de la segunda evaluación parcial del curso.",
      seccion: "Todas"
    },
    {
      id: "cal-2027-04-23",
      fecha: "2027-04-23",
      titulo: "Fin de Cursos y Entrega 3ª Evaluación",
      tipo: "evaluacion",
      descripcion: "Conclusión formal de las clases del ciclo 2026-2027 y entrega de la tercera evaluación.",
      seccion: "Todas"
    },
    {
      id: "cal-2027-05-13",
      fecha: "2027-05-13",
      fechaFin: "2027-05-18",
      titulo: "Registro Exámenes Extraordinarios EB y EC",
      tipo: "examenes",
      descripcion: "Inscripción a exámenes extraordinarios para el alumnado de la ENP.",
      seccion: "Todas"
    },

    // --- EVENTOS PASADOS / HISTORIAL ---
    {
      id: "cal-2026-08-10",
      fecha: "2026-08-10",
      titulo: "Inicio de Cursos Ciclo 2026-2027",
      tipo: "academico",
      descripcion: "Arranque oficial del ciclo escolar 2026-2027 en la Escuela Nacional Preparatoria.",
      seccion: "Todas"
    },
    {
      id: "cal-2026-09-19",
      fecha: "2026-09-19",
      titulo: "Simulacro Conmemorativo 19S",
      tipo: "institucional",
      descripcion: "Ejercicio nacional de protección civil en todos los planteles de la UNAM.",
      seccion: "Todas"
    }
  ],

  // ARCHIVOS PDF VIGENTES E HISTÓRICOS
  archivos: [
    {
      id: "archivo-historia-001",
      codigo: "ARCHIVO-415-HISTORIA-001",
      nombre: "Historia de la UNAM y la ENP: 10 Datos Históricos y 5 Figuras",
      nombreOriginal: "UNAM_ENP_10_Datos_y_5_Personajes.pdf",
      materiaId: "historia",
      seccion: "Todas",
      categoria: "Lecturas",
      estado: "publicado",
      version: "1.0",
      descripcion: "10 datos históricos documentados con normas APA 7 y análisis de figuras históricas fundamentales de la UNAM y la Escuela Nacional Preparatoria.",
      fecha: "2026-09-20",
      tamano: "15.4 KB",
      paginas: 5,
      url: "https://drive.google.com/file/d/1Ngo3BSBPf8OWGK-sBb6Ou25C8NP-qlAY/view?usp=drivesdk"
    },
    {
      id: "archivo-general-001",
      codigo: "ARCHIVO-415-GENERAL-001",
      nombre: "Calendario Escolar Oficial ENP 2026-2027",
      nombreOriginal: "Calendario_ENP_2026-2027.pdf",
      materiaId: "general",
      seccion: "Todas",
      categoria: "Institucional",
      estado: "publicado",
      version: "1.0",
      descripcion: "Calendario anual oficial aprobado por el H. Consejo Técnico de la Escuela Nacional Preparatoria para el ciclo lectivo 2026-2027.",
      fecha: "2026-08-25",
      tamano: "290.6 KB",
      paginas: 1,
      url: "https://drive.google.com/file/d/13ARG7htFOgZcLkF4boKa4LadygAX_en7/view?usp=drivesdk"
    },
    {
      id: "archivo-orientacion-001",
      codigo: "ARCHIVO-415-ORIENTACION-001",
      nombre: "Guía de Trámites e Inscripción Primer Ingreso ENP 4",
      nombreOriginal: "Bienvenida Generación 2027-2029.pdf",
      materiaId: "orientacion-educativa",
      seccion: "Todas",
      categoria: "Guías",
      estado: "publicado",
      version: "1.0",
      descripcion: "Instructivo oficial con procedimientos de inscripción, entrega documental y registro de actividades de inicio de ciclo.",
      fecha: "2026-08-18",
      tamano: "654.2 KB",
      paginas: 14,
      url: "https://drive.google.com/file/d/1qbB58FrjRtfVRuz7bomoXoSOXCMo_GvF/view?usp=drivesdk"
    }
  ],

  // PROMPT REUTILIZABLE PARA RESOLVER EJERCICIOS CON IA (SECCIÓN REGALOS)
  promptResolucionEjercicios: {
    titulo: "Prompt Maestro para Resolver Ejercicios con IA",
    descripcion: "Copia este prompt y pégalo en cualquier IA (ChatGPT, Claude, Gemini, etc.) adjuntando la foto o documento de tus ejercicios.",
    texto: `Actúa como un profesor y tutor académico experto. A continuación te adjunto una imagen/documento con ejercicios académicos. Por favor:

1. Analiza cuidadosamente los ejercicios adjuntos e identifica con precisión qué se está solicitando en cada uno.
2. Si alguna parte de la imagen o texto adjunto no es claramente legible o tiene ambigüedad, indícalo expresamente antes de asumir datos.
3. Respeta exactamente las instrucciones, restricciones y formato solicitados en el enunciado original. No inventes información, datos ni variables que no aparezcan en el documento.
4. Resuelve cada ejercicio mostrando el procedimiento detallado paso a paso, explicando de forma didáctica y comprensible el porqué de cada paso.
5. Si se trata de ejercicios matemáticos o de ciencias, muestra con claridad las fórmulas empleadas, la sustitución de valores, las operaciones aritméticas/algebraicas y las unidades correspondientes.
6. Si existen varios ejercicios, numera cada respuesta de forma que coincida exactamente con la numeración del documento original.
7. Revisa y verifica internamente los cálculos y resultados antes de entregar la respuesta para asegurar su consistencia.
8. Presenta la respuesta final de cada ejercicio de manera destacada y clara al final de cada procedimiento.`
  },

  recuerdos: []
};

// ----------------------------------------------------
// MOTOR DE CLASIFICACIÓN Y GESTOR DE ALMACENAMIENTO (DATA STORE)
// ----------------------------------------------------
const DataStore = (function () {
  'use strict';

  const STORAGE_KEY = 'grupo_415_live_database';

  function getRawData() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Si el almacenamiento local tiene versión anterior, migramos a la 2.3.0
          if (parsed && parsed.version === GRUPO_415_DATA_DEFAULT.version) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('[DataStore] Error al leer almacenamiento local, usando defaults.', e);
    }
    const fresh = JSON.parse(JSON.stringify(GRUPO_415_DATA_DEFAULT));
    saveRawData(fresh);
    return fresh;
  }

  function saveRawData(newData) {
    newData.ultimaActualizacion = new Date().toISOString();
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      }
      return true;
    } catch (e) {
      console.error('[DataStore] Error al guardar datos:', e);
      return false;
    }
  }

  function resetToDefaults() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function getEffectiveDate(referenceDate) {
    if (referenceDate instanceof Date) {
      return referenceDate;
    }
    if (typeof App415 !== 'undefined' && typeof App415.getSimulatedTime === 'function') {
      const sim = App415.getSimulatedTime();
      if (sim) return new Date(sim);
    }
    return new Date();
  }

  function getEffectiveDateStr(referenceDate) {
    const d = getEffectiveDate(referenceDate);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function clasificarElemento(item, tipo, referenceDate) {
    const todayStr = getEffectiveDateStr(referenceDate);

    if (item.estado === 'borrador') {
      return { estado: 'Borrador', esActual: false, etiqueta: 'Borrador privado' };
    }
    if (item.estado === 'archivado') {
      return { estado: 'Archivado', esActual: false, etiqueta: 'Archivado en historial' };
    }

    // 1. TAREAS
    if (tipo === 'tarea' || item.numeroTarea || item.codigoRenombrado) {
      const fechaClave = item.fechaEntregaISO || item.fechaEntrega;
      if (fechaClave && fechaClave.match(/^\d{4}-\d{2}-\d{2}$/)) {
        if (fechaClave < todayStr) {
          return { estado: 'Vencido', esActual: false, etiqueta: 'Entrega vencida' };
        } else if (fechaClave === todayStr) {
          return { estado: 'Actual', esActual: true, etiqueta: 'Vence hoy' };
        } else {
          return { estado: 'Próximo', esActual: true, etiqueta: 'Pendiente' };
        }
      }
      if (item.fechaPublicacion && item.fechaPublicacion < todayStr) {
        const diffDays = (new Date(todayStr) - new Date(item.fechaPublicacion)) / (1000 * 3600 * 24);
        if (diffDays > 10) {
          return { estado: 'Vencido', esActual: false, etiqueta: 'Entrega anterior' };
        }
      }
      return { estado: 'Actual', esActual: true, etiqueta: 'Pendiente activo' };
    }

    // 2. EXÁMENES
    if (tipo === 'examen' || item.tipo === 'parcial' || item.tipo === 'diagnostico' || item.tipo === 'extraordinario') {
      const fechaClave = item.fecha;
      if (fechaClave && fechaClave.match(/^\d{4}-\d{2}-\d{2}$/)) {
        if (fechaClave < todayStr) {
          return { estado: 'Finalizado', esActual: false, etiqueta: 'Examen concluido' };
        } else if (fechaClave === todayStr) {
          return { estado: 'Actual', esActual: true, etiqueta: 'Examen hoy' };
        } else {
          return { estado: 'Próximo', esActual: true, etiqueta: 'Próximo examen' };
        }
      }
      return { estado: 'Próximo', esActual: true, etiqueta: 'Programado' };
    }

    // 3. AVISOS
    if (tipo === 'aviso' || item.contenido !== undefined) {
      if (item.fechaFin && item.fechaFin < todayStr) {
        return { estado: 'Archivado', esActual: false, etiqueta: 'Aviso anterior' };
      }
      if (item.fechaPublicacion && item.fechaPublicacion > todayStr) {
        return { estado: 'Próximo', esActual: false, etiqueta: 'Programado futuro' };
      }
      return { estado: 'Actual', esActual: true, etiqueta: 'Aviso vigente' };
    }

    // 4. EVENTOS DE CALENDARIO
    if (tipo === 'evento' || item.tipo === 'cultural' || item.fechaFin !== undefined || (item.tipo && item.tipo !== 'parcial')) {
      const fechaFinClave = item.fechaFin || item.fecha;
      if (fechaFinClave && fechaFinClave < todayStr) {
        return { estado: 'Finalizado', esActual: false, etiqueta: 'Evento concluido' };
      } else if (item.fecha === todayStr || (item.fecha <= todayStr && item.fechaFin >= todayStr)) {
        return { estado: 'Actual', esActual: true, etiqueta: 'En curso hoy' };
      } else {
        return { estado: 'Próximo', esActual: true, etiqueta: 'Próximo evento' };
      }
    }

    // 5. ARCHIVOS Y RECURSOS
    if (tipo === 'archivo' || item.tamano || item.paginas) {
      if (item.categoria === 'Normativa' || item.categoria === 'Encuadre') {
        if (item.fecha && item.fecha < '2026-09-01') {
          return { estado: 'Archivado', esActual: false, etiqueta: 'Registro histórico' };
        }
      }
      return { estado: 'Actual', esActual: true, etiqueta: 'Recurso vigente' };
    }

    return { estado: 'Actual', esActual: true, etiqueta: 'Activo' };
  }

  function getContenidoMateria(materiaId, options = {}) {
    const data = getRawData();
    const seccion = options.seccion || 'Todas';
    const refDate = options.referenceDate || null;

    const actual = { avisos: [], tareas: [], examenes: [], eventos: [], archivos: [] };
    const historial = { avisos: [], tareas: [], examenes: [], eventos: [], archivos: [] };

    // Tareas
    (data.tareas || []).forEach((t) => {
      if (t.materiaId !== materiaId) return;
      if (t.seccion !== 'Todas' && seccion !== 'Todas' && t.seccion !== seccion) return;
      const clasif = clasificarElemento(t, 'tarea', refDate);
      const enriched = { ...t, _clasificacion: clasif };
      if (clasif.esActual) actual.tareas.push(enriched);
      else historial.tareas.push(enriched);
    });

    // Avisos
    (data.avisos || []).forEach((av) => {
      if (av.materiaId !== materiaId) return;
      if (av.seccion !== 'Todas' && seccion !== 'Todas' && av.seccion !== seccion) return;
      const clasif = clasificarElemento(av, 'aviso', refDate);
      const enriched = { ...av, _clasificacion: clasif };
      if (clasif.esActual) actual.avisos.push(enriched);
      else historial.avisos.push(enriched);
    });

    // Exámenes
    (data.examenes || []).forEach((ex) => {
      if (ex.materiaId !== materiaId) return;
      if (ex.seccion !== 'Todas' && seccion !== 'Todas' && ex.seccion !== seccion) return;
      const clasif = clasificarElemento(ex, 'examen', refDate);
      const enriched = { ...ex, _clasificacion: clasif };
      if (clasif.esActual) actual.examenes.push(enriched);
      else historial.examenes.push(enriched);
    });

    // Eventos (ej. Don Juan Tenorio para Lengua Española)
    (data.eventosCalendario || []).forEach((ev) => {
      if (ev.materiaId !== materiaId) return;
      if (ev.seccion !== 'Todas' && seccion !== 'Todas' && ev.seccion !== seccion) return;
      const clasif = clasificarElemento(ev, 'evento', refDate);
      const enriched = { ...ev, _clasificacion: clasif };
      if (clasif.esActual) actual.eventos.push(enriched);
      else historial.eventos.push(enriched);
    });

    // Archivos / Recursos
    (data.archivos || []).forEach((ar) => {
      if (ar.materiaId !== materiaId && ar.materiaId !== 'general') return;
      if (ar.seccion !== 'Todas' && seccion !== 'Todas' && ar.seccion !== seccion) return;
      const clasif = clasificarElemento(ar, 'archivo', refDate);
      const enriched = { ...ar, _clasificacion: clasif };
      if (clasif.esActual) actual.archivos.push(enriched);
      else historial.archivos.push(enriched);
    });

    return { actual, historial };
  }

  function getContenidoGlobal(options = {}) {
    const data = getRawData();
    const seccion = options.seccion || 'Todas';
    const refDate = options.referenceDate || null;

    const actual = { avisos: [], tareas: [], examenes: [], eventos: [], archivos: [] };
    const historial = { avisos: [], tareas: [], examenes: [], eventos: [], archivos: [] };

    (data.tareas || []).forEach((t) => {
      if (t.seccion !== 'Todas' && seccion !== 'Todas' && t.seccion !== seccion) return;
      const c = clasificarElemento(t, 'tarea', refDate);
      const item = { ...t, _clasificacion: c };
      if (c.esActual) actual.tareas.push(item);
      else historial.tareas.push(item);
    });

    (data.avisos || []).forEach((av) => {
      if (av.seccion !== 'Todas' && seccion !== 'Todas' && av.seccion !== seccion) return;
      const c = clasificarElemento(av, 'aviso', refDate);
      const item = { ...av, _clasificacion: c };
      if (c.esActual) actual.avisos.push(item);
      else historial.avisos.push(item);
    });

    (data.examenes || []).forEach((ex) => {
      if (ex.seccion !== 'Todas' && seccion !== 'Todas' && ex.seccion !== seccion) return;
      const c = clasificarElemento(ex, 'examen', refDate);
      const item = { ...ex, _clasificacion: c };
      if (c.esActual) actual.examenes.push(item);
      else historial.examenes.push(item);
    });

    (data.eventosCalendario || []).forEach((ev) => {
      if (ev.seccion !== 'Todas' && seccion !== 'Todas' && ev.seccion !== seccion) return;
      const c = clasificarElemento(ev, 'evento', refDate);
      const item = { ...ev, _clasificacion: c };
      if (c.esActual) actual.eventos.push(item);
      else historial.eventos.push(item);
    });

    (data.archivos || []).forEach((ar) => {
      if (ar.seccion !== 'Todas' && seccion !== 'Todas' && ar.seccion !== seccion) return;
      const c = clasificarElemento(ar, 'archivo', refDate);
      const item = { ...ar, _clasificacion: c };
      if (c.esActual) actual.archivos.push(item);
      else historial.archivos.push(item);
    });

    return { actual, historial };
  }

  function getActiveData() {
    const data = getRawData();
    const globalGroup = getContenidoGlobal();
    data.tareas = globalGroup.actual.tareas;
    data.avisos = globalGroup.actual.avisos;
    data.examenes = globalGroup.actual.examenes;
    data.archivos = globalGroup.actual.archivos;
    data.eventosCalendario = globalGroup.actual.eventos;
    return data;
  }

  function exportJSON() {
    return JSON.stringify(getRawData(), null, 2);
  }

  function importJSON(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.materias && parsed.horarioSemanal) {
        saveRawData(parsed);
        return { success: true };
      }
      return { success: false, error: 'Estructura JSON inválida para el Grupo 415' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async function syncWithCloud(endpoint, authToken) {
    console.log('[DataStore] Hook de sincronización en la nube preparado para:', endpoint);
    return {
      status: "pending_backend_infrastructure",
      mensaje: "Se requiere un proyecto configurado en Supabase, Firebase o un servidor Node.js/Python con base de datos."
    };
  }

  function materiaTieneSeccionB(materiaId) {
    const raw = getRawData();
    const mat = (raw.materias || []).find(function (m) { return m.id === materiaId; });
    if (!mat) return false;
    if (mat.seccionEspecifica === true) return true;
    return (raw.horarioSemanal || []).some(function (c) { return c.materiaId === materiaId && c.seccion === 'B'; });
  }

  function seccionBTieneInformacion(materiaId) {
    const raw = getRawData();
    const tieneTareas = (raw.tareas || []).some(function (t) { return t.materiaId === materiaId && t.seccion === 'B'; });
    const tieneAvisos = (raw.avisos || []).some(function (a) { return a.materiaId === materiaId && a.seccion === 'B'; });
    const tieneExamenes = (raw.examenes || []).some(function (e) { return e.materiaId === materiaId && e.seccion === 'B'; });
    return tieneTareas || tieneAvisos || tieneExamenes;
  }

  function debeMostrarAvisoSeccionB(materiaId, seccion) {
    if (seccion !== 'B') return false;
    if (!materiaTieneSeccionB(materiaId)) return false;
    if (seccionBTieneInformacion(materiaId)) return false;
    return true;
  }

  function getMateriasConSeccionB() {
    const raw = getRawData();
    return (raw.materias || []).filter(function (m) { return materiaTieneSeccionB(m.id); });
  }

  return {
    getRawData,
    saveRawData,
    getActiveData,
    getContenidoMateria,
    getContenidoGlobal,
    clasificarElemento,
    getEffectiveDateStr,
    resetToDefaults,
    exportJSON,
    importJSON,
    syncWithCloud,
    materiaTieneSeccionB,
    seccionBTieneInformacion,
    debeMostrarAvisoSeccionB,
    getMateriasConSeccionB
  };
})();

// Acceso global para scripts existentes
const GRUPO_415_DATA = DataStore.getActiveData();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { GRUPO_415_DATA, DataStore, GRUPO_415_DATA_DEFAULT };
}
