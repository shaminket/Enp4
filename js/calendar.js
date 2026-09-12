
/* ==========================================================
   SISTEMA DE CALENDARIO ESCOLAR (AGOSTO 2026 - ABRIL 2027)
   GRUPO 0415 &bull; PREPA 4 UNAM
   COMPRIMIDO PARA CELULAR: SOLO NÚMEROS + PUNTOS DE COLOR
   ========================================================== */

const academicMonths = [
  { year: 2026, month: 7, name: "Agosto 2026" },
  { year: 2026, month: 8, name: "Septiembre 2026" },
  { year: 2026, month: 9, name: "Octubre 2026" },
  { year: 2026, month: 10, name: "Noviembre 2026" },
  { year: 2026, month: 11, name: "Diciembre 2026" },
  { year: 2027, month: 0, name: "Enero 2027" },
  { year: 2027, month: 1, name: "Febrero 2027" },
  { year: 2027, month: 2, name: "Marzo 2027" },
  { year: 2027, month: 3, name: "Abril 2027" }
];

let currentMonthIdx = 1; // Septiembre 2026 por defecto (mes actual)
let currentCalendarView = 'week'; // 'week' | 'month' (en Mac) o 'day' | 'month' (en Celular)
let selectedCalDateStr = "2026-09-14"; // Día seleccionado por defecto para el cajón de detalles

// Base de datos de eventos y tareas del calendario
const calendarSpecialEvents = {
  // Lunes 14 de septiembre 2026: Mediateca y Tareas
  "2026-09-14": [
    { title: "🇬🇧 Inglés Sec. A: En Mediateca Salón B-318 (Examen)", type: "red", href: "materias/ingles-a" },
    { title: "🗺️ Historia: Planisferio con nombres & entrega pendientes", type: "blue", href: "materias/historia" },
    { title: "📝 Geografía: 4 Noticias en equipo (hoja en 4)", type: "blue", href: "materias/geografia" },
    { title: "🔔 Lengua Española: Hojas pospuestas (Espera indicaciones)", type: "blue", href: "materias/espanol" }
  ],
  "2026-09-15": [
    { title: "📝 Lógica: 3 Tareas (tipos de frases, clase y Gettier)", type: "blue", href: "materias/logica" },
    { title: "💻 Informática: Taller y preparación de exposiciones", type: "blue", href: "materias/informatica" }
  ],
  "2026-09-16": [
    { title: "🔔 Lengua Española: Revisión de acuerdos y apuntes", type: "blue", href: "materias/espanol" },
    { title: "🎨 Dibujo II Sec. A: Paisaje con líneas (Salón B-008)", type: "blue", href: "materias/dibujo-a" }
  ],
  "2026-09-17": [
    { title: "📚 Geografía e Historia: Seguimiento de temarios", type: "blue", href: "materias/historia" }
  ],
  "2026-09-18": [
    { title: "🎨 Dibujo A: Entrega paisaje y revisión puntillismo", type: "blue", href: "materias/dibujo-a" },
    { title: "🧭 Orientación A: Traer post-it, plumones y 2 tareas UNAM", type: "blue", href: "materias/orientacion-a" }
  ],
  "2026-09-22": [
    { title: "🎤 Informática: Exposición Equipo 1 (Dana) y Equipo 2 (Rodrigo)", type: "blue", href: "materias/informatica-exposiciones" }
  ],
  "2026-09-29": [
    { title: "🎤 Informática: Exposición Equipo 3 (Regina) y Equipo 4 (Camila)", type: "blue", href: "materias/informatica-exposiciones" }
  ],
  "2026-10-06": [
    { title: "🎤 Informática: Exposición Equipo 5 (Sandra) y Equipo 6 (Said)", type: "blue", href: "materias/informatica-exposiciones" }
  ],
  "2026-10-13": [
    { title: "🎤 Informática: Exposición Equipo 7 y Equipo 8 (Diana)", type: "blue", href: "materias/informatica-exposiciones" }
  ],
  "2026-10-20": [
    { title: "🎤 Informática: Exposición Equipo 9 (Islas)", type: "blue", href: "materias/informatica-exposiciones" }
  ]
};

function initCalendarSystem(defaultView = 'week') {
  currentCalendarView = defaultView;
  renderMonthCalendar();
}

function setCalendarView(viewMode) {
  currentCalendarView = viewMode;
  
  const timetableEl = document.getElementById('mainTimetableContainer') || document.getElementById('mainTimetable');
  const dayViewEl = document.getElementById('mobileDayScheduleContainer') || document.getElementById('horario');
  const monthViewEl = document.getElementById('calendarMonthViewContainer');

  const btnWeek = document.getElementById('btnViewWeek');
  const btnDay = document.getElementById('btnViewDay');
  const btnMonth = document.getElementById('btnViewMonth');

  if (viewMode === 'month') {
    if (timetableEl) timetableEl.style.display = 'none';
    if (dayViewEl && dayViewEl.classList.contains('mobile-schedule-card')) dayViewEl.style.display = 'none';
    if (monthViewEl) monthViewEl.style.display = 'block';

    if (btnWeek) btnWeek.classList.remove('active');
    if (btnDay) btnDay.classList.remove('active');
    if (btnMonth) btnMonth.classList.add('active');
    renderMonthCalendar();
  } else {
    if (monthViewEl) monthViewEl.style.display = 'none';
    if (timetableEl) timetableEl.style.display = 'block';
    if (dayViewEl && dayViewEl.classList.contains('mobile-schedule-card')) dayViewEl.style.display = 'block';

    if (btnMonth) btnMonth.classList.remove('active');
    if (btnWeek) btnWeek.classList.add('active');
    if (btnDay) btnDay.classList.add('active');
  }
}

function prevMonthCal() {
  if (currentMonthIdx > 0) {
    currentMonthIdx--;
    renderMonthCalendar();
  }
}

function nextMonthCal() {
  if (currentMonthIdx < academicMonths.length - 1) {
    currentMonthIdx++;
    renderMonthCalendar();
  }
}

function onCalDayClick(dateStr, year, month, day, dayOfWeekIdx) {
  selectedCalDateStr = dateStr;
  
  // Actualizar clase seleccionada en celdas
  document.querySelectorAll('.cal-day-cell').forEach(cell => {
    cell.classList.toggle('is-selected-day', cell.getAttribute('data-datestr') === dateStr);
  });

  renderDayDetailsDrawer(dateStr, year, month, day, dayOfWeekIdx);
}

function renderDayDetailsDrawer(dateStr, year, month, day, dayOfWeekIdx) {
  const drawer = document.getElementById('calendarDayDetailsDrawer');
  if (!drawer) return;

  const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const dayName = dayNames[dayOfWeekIdx];
  const monthName = monthNames[month];
  const specialEvts = calendarSpecialEvents[dateStr] || [];

  const isMobile = (window.innerWidth <= 820);
  const ext = isMobile ? '-movil' : '';

  let eventsListHtml = '';

  if (specialEvts.length > 0) {
    specialEvts.forEach(ev => {
      const isRed = (ev.type === 'red' || ev.type === 'mediateca');
      const href = ev.href ? (ev.href + (isMobile ? '-movil' : '')) : '#';
      eventsListHtml += `
        <a href="${href}" class="cal-drawer-item ${isRed ? 'cal-drawer-red' : 'cal-drawer-blue'}">
          ${isRed ? '🚨' : '📘'} <strong>${ev.title}</strong>
          <span style="display: block; font-size: 0.76rem; opacity: 0.85; margin-top: 2px;">Toca para abrir información oficial &rarr;</span>
        </a>
      `;
    });
  } else if (dayOfWeekIdx >= 1 && dayOfWeekIdx <= 5) {
    // Día hábil regular con materias habituales
    const weekdaySummaries = {
      1: [
        { t: "Geografía (7:00 AM &bull; A-104)", h: "materias/geografia" + ext },
        { t: "Física III (7:50 - 9:30 AM &bull; B-116 / B-109)", h: "materias/fisica" + ext },
        { t: "Inglés IV (9:30 AM &bull; Sec. A C-306 / Sec. B C-205)", h: "materias/ingles" + ext },
        { t: "Lengua Española (10:20 - 12:00 &bull; B-112)", h: "materias/espanol" + ext },
        { t: "Orientación Educativa IV (12:00 &bull; B-110 / B-112)", h: "materias/orientacion" + ext }
      ],
      2: [
        { t: "Matemáticas IV (7:00 - 8:40 AM &bull; B-112)", h: "materias/matematicas" + ext },
        { t: "Dibujo II Sec. A (8:40 AM &bull; B-008)", h: "materias/dibujo-a" + ext },
        { t: "Informática (9:30 AM &bull; I-108 y 11:10 CC-2)", h: "materias/informatica" + ext },
        { t: "Lógica (10:20 AM &bull; B-206)", h: "materias/logica" + ext },
        { t: "Género y Prevención (12:00 &bull; B-109)", h: "materias/genero" + ext }
      ],
      3: [
        { t: "Geografía (7:00 AM &bull; A-104)", h: "materias/geografia" + ext },
        { t: "Lógica (7:50 - 9:30 AM &bull; B-108)", h: "materias/logica" + ext },
        { t: "Inglés IV (9:30 AM &bull; C-306 / C-205)", h: "materias/ingles" + ext },
        { t: "Dibujo II (10:20 AM &bull; B-008 Sec. A / C-201 Sec. B)", h: "materias/dibujo" + ext },
        { t: "Lengua Española (11:10 - 12:50 &bull; B-113)", h: "materias/espanol" + ext }
      ],
      4: [
        { t: "Matemáticas IV (7:00 - 8:40 AM &bull; B-109)", h: "materias/matematicas" + ext },
        { t: "Lengua Española (8:40 AM &bull; B-110)", h: "materias/espanol" + ext },
        { t: "Geografía (9:30 AM &bull; A-104)", h: "materias/geografia" + ext },
        { t: "Historia Universal III (10:20 - 12:00 &bull; B-109)", h: "materias/historia" + ext }
      ],
      5: [
        { t: "Dibujo II Sec. B (7:00 AM &bull; C-201)", h: "materias/dibujo-b" + ext },
        { t: "Historia Universal III (7:50 AM &bull; B-117)", h: "materias/historia" + ext },
        { t: "Matemáticas IV (8:40 AM &bull; B-117)", h: "materias/matematicas" + ext },
        { t: "Inglés IV (9:30 AM &bull; C-306 / C-205)", h: "materias/ingles" + ext },
        { t: "Género y Prevención (10:20 AM &bull; B-108)", h: "materias/genero" + ext },
        { t: "🏃 Educación Física IV: Tarea Condición Física (11:10 AM &bull; GIM1)", h: "materias/educacion-fisica" + ext },
        { t: "Física III y Laboratorio (12:00 - 13:40 &bull; B-115 / A-302)", h: "materias/fisica" + ext }
      ]
    };

    const classes = weekdaySummaries[dayOfWeekIdx] || [];
    classes.forEach(c => {
      eventsListHtml += `
        <a href="${c.h}" class="cal-drawer-item cal-drawer-gray">
          📘 <strong>${c.t}</strong>
        </a>
      `;
    });
  } else {
    // Fin de semana
    eventsListHtml = `
      <div class="cal-drawer-item cal-drawer-gray" style="text-align: center; padding: 1.2rem;">
        ☕ <strong>Fin de Semana &bull; Día de Descanso</strong>
        <p style="margin: 0.3rem 0 0; font-size: 0.8rem; color: #64748b;">Aprovecha para repasar tus lecturas y organizar tus tareas de la semana.</p>
      </div>
    `;
  }

  drawer.innerHTML = `
    <div class="cal-drawer-header">
      <div>
        <span style="font-size: 0.72rem; font-weight: 800; color: #7C3AED; text-transform: uppercase;">
          Día Seleccionado &bull; Grupo 0415
        </span>
        <h4 style="margin: 0.2rem 0 0; color: #002B7A; font-size: 1.15rem; font-weight: 900;">
          🗓️ ${dayName} ${day} de ${monthName} ${year}
        </h4>
      </div>
      <span class="homework-tag-badge" style="background:#7C3AED; color:#fff;">
        ${specialEvts.length > 0 ? 'Con Avisos / Tareas' : (dayOfWeekIdx === 0 || dayOfWeekIdx === 6 ? 'Fin de semana' : 'Clases Regulares')}
      </span>
    </div>
    <div class="cal-drawer-list">
      ${eventsListHtml}
    </div>
  `;
}

function renderMonthCalendar() {
  const container = document.getElementById('calendarMonthViewContainer');
  if (!container) return;

  const cur = academicMonths[currentMonthIdx];
  const year = cur.year;
  const month = cur.month;

  const firstDayObj = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();

  let firstDayOfWeek = firstDayObj.getDay();
  let startingCol = (firstDayOfWeek === 0) ? 6 : firstDayOfWeek - 1;
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const isApril2027 = (year === 2027 && month === 3);
  const isMobile = (window.innerWidth <= 820) || (document.getElementById('mobileDayScheduleContainer') !== null);

  let gridHtml = `
    <div class="calendar-month-header">
      <div>
        <span style="font-size: 0.78rem; font-weight: 800; color: #D59F0F; text-transform: uppercase; letter-spacing: 1px;">
          Ciclo Escolar 2026 - 2027 &bull; Prepa 4
        </span>
        <h3 class="calendar-month-title">${cur.name}</h3>
      </div>
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <button class="mac-nav-back-btn" onclick="prevMonthCal()" ${currentMonthIdx === 0 ? 'disabled style="opacity:0.4;"' : ''}>
          &larr; Anterior
        </button>
        <button class="mac-nav-back-btn" onclick="nextMonthCal()" ${currentMonthIdx === academicMonths.length - 1 ? 'disabled style="opacity:0.4;"' : ''}>
          Siguiente &rarr;
        </button>
      </div>
    </div>

    <!-- Leyenda de puntos de color -->
    <div style="display: flex; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 0.9rem; font-size: 0.76rem; background: #f8fafc; padding: 0.5rem 0.8rem; border-radius: 12px; border: 1px solid #e2e8f0; align-items: center;">
      <span style="display: flex; align-items: center; gap: 4px;">
        <span class="cal-dot cal-dot-blue"></span>
        <strong>Azul:</strong> Tareas / avisos
      </span>
      <span style="display: flex; align-items: center; gap: 4px;">
        <span class="cal-dot cal-dot-red"></span>
        <strong>Rojo:</strong> Examen / Mediateca
      </span>
      <span style="display: flex; align-items: center; gap: 4px; margin-left: auto; color: #7C3AED; font-weight: 800;">
        💡 Toca cualquier día con color para ver sus detalles
      </span>
    </div>

    <div class="calendar-grid-7cols">
      <div class="cal-header-cell">Lun</div>
      <div class="cal-header-cell">Mar</div>
      <div class="cal-header-cell">Mié</div>
      <div class="cal-header-cell">Jue</div>
      <div class="cal-header-cell">Vie</div>
      <div class="cal-header-cell" style="color: #2563eb;">Sáb</div>
      <div class="cal-header-cell" style="color: #dc2626;">Dom</div>
  `;

  // Celdas mes anterior
  for (let i = 0; i < startingCol; i++) {
    const prevDayNum = prevMonthTotalDays - startingCol + i + 1;
    gridHtml += `
      <div class="cal-day-cell other-month">
        <span class="cal-day-num">${prevDayNum}</span>
      </div>
    `;
  }

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  let initialDrawerTarget = null;

  for (let d = 1; d <= totalDays; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayOfWeekIdx = (startingCol + d - 1) % 7; // 0=Lun, 1=Mar, 4=Vie, 5=Sab, 6=Dom
    const isWeekend = (dayOfWeekIdx === 5 || dayOfWeekIdx === 6);
    const isCurrentDay = (year === todayYear && month === todayMonth && d === todayDate);

    const specialEvts = calendarSpecialEvents[dStr] || [];

    // Determinar puntos de color
    let hasBlueDot = false;
    let hasRedDot = false;

    if (specialEvts.length > 0) {
      specialEvts.forEach(ev => {
        if (ev.type === 'red' || ev.type === 'mediateca') hasRedDot = true;
        else hasBlueDot = true;
      });
    } else if (!isWeekend) {
      // Días hábiles regulares con tareas de la semana
      hasBlueDot = true;
    }

    let dotsHtml = '<div class="cal-dots-row">';
    if (hasRedDot) dotsHtml += '<span class="cal-dot cal-dot-red"></span>';
    if (hasBlueDot) dotsHtml += '<span class="cal-dot cal-dot-blue"></span>';
    dotsHtml += '</div>';

    // Guardar para el cajón inicial
    if (dStr === selectedCalDateStr || (!initialDrawerTarget && isCurrentDay) || (!initialDrawerTarget && d === 14 && month === 8)) {
      initialDrawerTarget = { dStr, year, month, d, dayOfWeekIdx };
    }

    const isSelected = (dStr === selectedCalDateStr);

    gridHtml += `
      <div class="cal-day-cell ${isCurrentDay ? 'is-today' : ''} ${isSelected ? 'is-selected-day' : ''}" 
           data-datestr="${dStr}" 
           onclick="onCalDayClick('${dStr}', ${year}, ${month}, ${d}, ${dayOfWeekIdx})">
        <span class="cal-day-num" style="${isWeekend ? 'color: #94a3b8;' : ''}">${d}</span>
        ${dotsHtml}
      </div>
    `;
  }

  // Rellenar días restantes
  const totalCellsSoFar = startingCol + totalDays;
  const remainingCols = (7 - (totalCellsSoFar % 7)) % 7;
  for (let j = 1; j <= remainingCols; j++) {
    gridHtml += `
      <div class="cal-day-cell other-month">
        <span class="cal-day-num">${j}</span>
      </div>
    `;
  }

  gridHtml += `</div>`;

  // CAJÓN DE DETALLES AL TOCAR UN DÍA CON COLOR
  gridHtml += `<div id="calendarDayDetailsDrawer" class="calendar-day-details-box"></div>`;

  // Banner Abril 2027
  if (isApril2027) {
    gridHtml += `
      <div class="graduation-celebration-banner">
        <span style="font-size: 2.8rem; display: block; margin-bottom: 0.5rem;">🎓 🎉</span>
        <h3 style="font-size: 1.65rem; font-weight: 900; margin: 0 0 0.4rem; color: #ffffff;">
          ¡Felicidades! Has concluido 4to año
        </h3>
        <p style="font-size: 1rem; margin: 0; opacity: 0.95;">
          ¡Ya estás en <strong>5to año de Preparatoria</strong>! Todo el Grupo 0415 pasa al siguiente ciclo de la UNAM.
        </p>
      </div>
    `;
  }

  container.innerHTML = gridHtml;

  // Renderizar cajón de detalles inicial
  if (initialDrawerTarget) {
    renderDayDetailsDrawer(initialDrawerTarget.dStr, initialDrawerTarget.year, initialDrawerTarget.month, initialDrawerTarget.d, initialDrawerTarget.dayOfWeekIdx);
  } else {
    renderDayDetailsDrawer(selectedCalDateStr, 2026, 8, 14, 1);
  }
}

window.setCalendarView = setCalendarView;
window.prevMonthCal = prevMonthCal;
window.nextMonthCal = nextMonthCal;
window.onCalDayClick = onCalDayClick;
