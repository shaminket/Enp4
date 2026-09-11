
/* ==========================================================
   SISTEMA DE CALENDARIO ESCOLAR (AGOSTO 2026 - ABRIL 2027)
   GRUPO 0415 &bull; PREPA 4 UNAM
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

// Fechas y eventos clave
const calendarSpecialEvents = {
  // Lunes 14 de septiembre 2026: Inglés en Mediateca B-318
  "2026-09-14": [
    { title: "🇬🇧 Inglés Sec. A: Mediateca B-318", type: "mediateca", href: "materias/ingles-a" },
    { title: "📝 Historia: Tarea renombrada", type: "blue", href: "materias/historia" },
    { title: "📝 Geografía: 4 Noticias en equipo", type: "blue", href: "materias/geografia" }
  ],
  "2026-09-22": [
    { title: "🎤 Info: Exposición Eq. 1 y 2", type: "blue", href: "materias/informatica-exposiciones" }
  ],
  "2026-09-29": [
    { title: "🎤 Info: Exposición Eq. 3 y 4", type: "blue", href: "materias/informatica-exposiciones" }
  ],
  "2026-10-06": [
    { title: "🎤 Info: Exposición Eq. 5 y 6", type: "blue", href: "materias/informatica-exposiciones" }
  ],
  "2026-10-13": [
    { title: "🎤 Info: Exposición Eq. 7 y 8", type: "blue", href: "materias/informatica-exposiciones" }
  ],
  "2026-10-20": [
    { title: "🎤 Info: Exposición Eq. 9", type: "blue", href: "materias/informatica-exposiciones" }
  ]
};

function initCalendarSystem(defaultView = 'week') {
  currentCalendarView = defaultView;
  renderMonthCalendar();
}

function setCalendarView(viewMode) {
  currentCalendarView = viewMode;
  
  // Elementos de vista
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

function renderMonthCalendar() {
  const container = document.getElementById('calendarMonthViewContainer');
  if (!container) return;

  const cur = academicMonths[currentMonthIdx];
  const year = cur.year;
  const month = cur.month; // 0-indexed

  // Primer día del mes y total de días
  const firstDayObj = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Día de la semana del día 1 (0=Dom, 1=Lun...)
  let firstDayOfWeek = firstDayObj.getDay();
  // Ajustar para que Lunes sea columna 0, Domingo columna 6
  let startingCol = (firstDayOfWeek === 0) ? 6 : firstDayOfWeek - 1;

  // Días del mes anterior para relleno
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const isApril2027 = (year === 2027 && month === 3);

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
          &larr; Mes anterior
        </button>
        <button class="mac-nav-back-btn" onclick="nextMonthCal()" ${currentMonthIdx === academicMonths.length - 1 ? 'disabled style="opacity:0.4;"' : ''}>
          Mes siguiente &rarr;
        </button>
      </div>
    </div>

    <!-- Leyenda de colores del calendario -->
    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.2rem; font-size: 0.8rem; background: #f8fafc; padding: 0.6rem 1rem; border-radius: 12px; border: 1px solid #e2e8f0;">
      <span style="display: flex; align-items: center; gap: 6px;">
        <span style="width: 12px; height: 12px; background: #1d4ed8; border-radius: 3px; display: inline-block;"></span>
        <strong>Azul Rey:</strong> Materias con tarea o aviso activo
      </span>
      <span style="display: flex; align-items: center; gap: 6px;">
        <span style="width: 12px; height: 12px; background: #ef4444; border-radius: 3px; display: inline-block;"></span>
        <strong>Rojo:</strong> Fechas límite de entrega / Examen / Mediateca
      </span>
      <span style="display: flex; align-items: center; gap: 6px; margin-left: auto;">
        <span style="width: 12px; height: 12px; border: 2px solid #2D7FF9; background: #eff6ff; border-radius: 3px; display: inline-block;"></span>
        <strong>Día actual</strong>
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

  // Celdas de días anteriores
  for (let i = 0; i < startingCol; i++) {
    const prevDayNum = prevMonthTotalDays - startingCol + i + 1;
    gridHtml += `
      <div class="cal-day-cell other-month">
        <span class="cal-day-num">${prevDayNum}</span>
      </div>
    `;
  }

  // Celdas de los días del mes actual
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  for (let d = 1; d <= totalDays; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayOfWeekIdx = (startingCol + d - 1) % 7; // 0=Lun, 1=Mar, 4=Vie, 5=Sab, 6=Dom
    const isWeekend = (dayOfWeekIdx === 5 || dayOfWeekIdx === 6);
    const isCurrentDay = (year === todayYear && month === todayMonth && d === todayDate);

    const specialEvts = calendarSpecialEvents[dStr] || [];

    let eventsHtml = '';
    
    // Si hay eventos especiales programados
    specialEvts.forEach(ev => {
      let evClass = 'cal-event-blue';
      if (ev.type === 'mediateca' || ev.type === 'red') evClass = 'cal-deadline-red';
      eventsHtml += `<a href="${ev.href}" class="cal-event-pill ${evClass}" title="${ev.title}">${ev.title}</a>`;
    });

    // Indicador general de clases regulares en días hábiles
    if (!isWeekend && specialEvts.length === 0) {
      if (dayOfWeekIdx === 0) { // Lunes
        eventsHtml += `
          <span class="cal-event-pill cal-event-blue" title="Historia: Renombrado PDF">📝 Historia</span>
          <span class="cal-event-pill cal-event-blue" title="Geografía: 4 Noticias">📝 Geografía</span>
        `;
      } else if (dayOfWeekIdx === 1) { // Martes
        eventsHtml += `
          <span class="cal-event-pill cal-event-blue" title="Lógica: 3 Tareas">📝 Lógica</span>
          <span class="cal-event-pill cal-event-blue" title="Informática: Exposiciones">💻 Informática</span>
        `;
      } else if (dayOfWeekIdx === 2) { // Miércoles
        eventsHtml += `
          <span class="cal-event-pill cal-event-blue" title="Español: Hoja La Gomita">📖 Español</span>
        `;
      } else if (dayOfWeekIdx === 3) { // Jueves
        eventsHtml += `
          <span class="cal-event-pill cal-event-blue" title="Geografía e Historia">📚 Geog. / Hist.</span>
        `;
      } else if (dayOfWeekIdx === 4) { // Viernes
        eventsHtml += `
          <span class="cal-event-pill cal-event-blue" title="Dibujo A: Paisaje líneas">🎨 Dibujo A</span>
          <span class="cal-event-pill cal-event-blue" title="Orientación A: 2 Tareas">🧭 Orientación</span>
        `;
      }
    } else if (isWeekend) {
      eventsHtml += `<span style="font-size: 0.65rem; color: #94a3b8; font-style: italic;">Descanso</span>`;
    }

    gridHtml += `
      <div class="cal-day-cell ${isCurrentDay ? 'is-today' : ''}">
        <span class="cal-day-num" style="${isWeekend ? 'color: #64748b;' : ''}">${d}</span>
        <div style="flex-grow: 1; margin-top: 2px;">
          ${eventsHtml}
        </div>
      </div>
    `;
  }

  // Rellenar días restantes para completar la última semana
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

  // Si es Abril 2027: Agregar banner de felicitación de 5to año
  if (isApril2027) {
    gridHtml += `
      <div class="graduation-celebration-banner">
        <span style="font-size: 2.8rem; display: block; margin-bottom: 0.5rem;">🎓 🎉</span>
        <h3 style="font-size: 1.8rem; font-weight: 900; margin: 0 0 0.4rem; color: #ffffff;">
          ¡Felicidades! Has concluido 4to año
        </h3>
        <p style="font-size: 1.05rem; margin: 0; opacity: 0.95;">
          ¡Ya estás en <strong>5to año de Preparatoria</strong>! Todo el Grupo 0415 pasa al siguiente ciclo de la UNAM.
        </p>
      </div>
    `;
  }

  container.innerHTML = gridHtml;
}

window.setCalendarView = setCalendarView;
window.prevMonthCal = prevMonthCal;
window.nextMonthCal = nextMonthCal;
