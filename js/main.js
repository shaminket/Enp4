/* ==========================================================
   LÓGICA JAVASCRIPT GLOBAL: CUATREROS DEL 415
   ========================================================== */

let activeSection = 'all';

function filterBySection(section, btn) {
  activeSection = section;
  document.querySelectorAll('.filter-pills-row .f-pill-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  filterAll();
}

function filterAll() {
  const selectElem = document.getElementById('materiaFilterSelect');
  if (!selectElem) return;
  const selectedSubject = selectElem.value;
  const classCards = document.querySelectorAll('.class-item');

  classCards.forEach(card => {
    const itemSubj = card.getAttribute('data-subj');
    const itemSec = card.getAttribute('data-sec');

    const matchSec = (activeSection === 'all') || (itemSec === 'both') || (itemSec === activeSection);
    const matchSubj = (selectedSubject === 'all') || (itemSubj === selectedSubject);

    if (matchSec && matchSubj) {
      card.classList.remove('is-hidden');
      card.style.display = 'block';
    } else {
      card.classList.add('is-hidden');
      card.style.display = 'none';
    }
  });
}

// Modal de Soporte WhatsApp en 2 Pasos
function openSupportDialog() {
  const modal = document.getElementById('supportModalBackdrop');
  if (modal) modal.classList.add('is-open');
}

function closeSupportDialog() {
  const modal = document.getElementById('supportModalBackdrop');
  if (modal) {
    modal.classList.remove('is-open');
    setTimeout(goToStep1, 300);
  }
}

function onBackdropClick(e) {
  if (e.target.id === 'supportModalBackdrop') {
    closeSupportDialog();
  }
}

function goToStep2() {
  const s1 = document.getElementById('dialogStep1');
  const s2 = document.getElementById('dialogStep2');
  const d1 = document.getElementById('trackDot1');
  const d2 = document.getElementById('trackDot2');
  if (s1 && s2 && d1 && d2) {
    s1.classList.remove('active');
    s2.classList.add('active');
    d1.classList.remove('active');
    d2.classList.add('active');
  }
}

function goToStep1() {
  const s1 = document.getElementById('dialogStep1');
  const s2 = document.getElementById('dialogStep2');
  const d1 = document.getElementById('trackDot1');
  const d2 = document.getElementById('trackDot2');
  if (s1 && s2 && d1 && d2) {
    s2.classList.remove('active');
    s1.classList.add('active');
    d2.classList.remove('active');
    d1.classList.add('active');
  }
}

// Función para copiar prompts al portapapeles
function copyPrompt(elementId, btnElement) {
  const textElem = document.getElementById(elementId);
  if (!textElem) return;
  const textToCopy = textElem.innerText || textElem.textContent;

  navigator.clipboard.writeText(textToCopy).then(() => {
    const originalHTML = btnElement.innerHTML;
    btnElement.innerHTML = '<span>✅ ¡Copiado al portapapeles!</span>';
    btnElement.style.background = '#22c55e';
    btnElement.style.color = '#ffffff';

    setTimeout(() => {
      btnElement.innerHTML = originalHTML;
      btnElement.style.background = '';
      btnElement.style.color = '';
    }, 2800);
  }).catch(err => {
    console.error('Error al copiar:', err);
    alert('No se pudo copiar automáticamente. Por favor selecciónalo y cópialo manualmente.');
  });
}

// Control de Pantalla Completa para el botón verde
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }
}


/* ==========================================================
   LÓGICA DE CALENDARIO, MODOS DÍA/SEMANA Y GESTOS
   ========================================================== */
let currentCalDay = new Date().getDay();
if (currentCalDay < 1 || currentCalDay > 5) currentCalDay = 1; // Lunes por defecto si es fin de semana
let currentCalMode = 'week'; // 'week' o 'day'

const dayNames = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes"
};

const desktopScheduleData = {
  1: [
    { time: "07:00 - 07:50", subj: "Geografía", room: "A-104", sec: "both", prof: "Asignatura Ordinaria" },
    { time: "07:50 - 08:40", subj: "Física III", room: "B-116", sec: "both", prof: "Profra. Reyna García Gabriela" },
    { time: "08:40 - 09:30", subj: "Física III", room: "B-109", sec: "both", prof: "Profra. Reyna García Gabriela" },
    { time: "09:30 - 10:20", subj: "Lengua extranjera Inglés IV", room: "C-306 (Sec. A) / C-205 (Sec. B)", sec: "both", prof: "Sección A y B" },
    { time: "10:20 - 11:10", subj: "Lengua Española", room: "B-112", sec: "both", prof: "Profra. Vázquez González María" },
    { time: "11:10 - 12:00", subj: "Lengua Española", room: "B-112", sec: "both", prof: "Profra. Vázquez González María" },
    { time: "12:00 - 12:50", subj: "Orientación Educativa IV", room: "B-110 (Sec. A) / B-112 (Sec. B)", sec: "both", prof: "Sección A y B" }
  ],
  2: [
    { time: "07:00 - 07:50", subj: "Matemáticas IV", room: "B-112", sec: "both", prof: "Prof. Quintana Mejía Saúl" },
    { time: "07:50 - 08:40", subj: "Matemáticas IV", room: "B-112", sec: "both", prof: "Prof. Quintana Mejía Saúl" },
    { time: "08:40 - 09:30", subj: "Dibujo II", room: "B-008", sec: "A", prof: "Sección A" },
    { time: "09:30 - 10:20", subj: "Informática", room: "I-108", sec: "both", prof: "Edificio I" },
    { time: "10:20 - 11:10", subj: "Lógica", room: "B-206", sec: "both", prof: "Asignatura Ordinaria" },
    { time: "11:10 - 12:00", subj: "Informática", room: "CC-2", sec: "both", prof: "Centro Cómputo 2" },
    { time: "12:00 - 12:50", subj: "Género y Prevención de las Violencias", room: "B-109", sec: "both", prof: "Asignatura Ordinaria" }
  ],
  3: [
    { time: "07:00 - 07:50", subj: "Geografía", room: "A-104", sec: "both", prof: "Asignatura Ordinaria" },
    { time: "07:50 - 08:40", subj: "Lógica", room: "B-108", sec: "both", prof: "Asignatura Ordinaria" },
    { time: "08:40 - 09:30", subj: "Lógica", room: "B-108", sec: "both", prof: "Asignatura Ordinaria" },
    { time: "09:30 - 10:20", subj: "Lengua extranjera Inglés IV", room: "C-306 (Sec. A) / C-205 (Sec. B)", sec: "both", prof: "Sección A y B" },
    { time: "10:20 - 11:10", subj: "Dibujo II", room: "B-008 (Sec. A) / C-201 (Sec. B)", sec: "both", prof: "Sección A y B" },
    { time: "11:10 - 12:00", subj: "Lengua Española", room: "B-113", sec: "both", prof: "Profra. Vázquez González María" },
    { time: "12:00 - 12:50", subj: "Lengua Española", room: "B-113", sec: "both", prof: "Profra. Vázquez González María" }
  ],
  4: [
    { time: "07:00 - 07:50", subj: "Matemáticas IV", room: "B-109", sec: "both", prof: "Prof. Quintana Mejía Saúl" },
    { time: "07:50 - 08:40", subj: "Matemáticas IV", room: "B-109", sec: "both", prof: "Prof. Quintana Mejía Saúl" },
    { time: "08:40 - 09:30", subj: "Lengua Española", room: "B-110", sec: "both", prof: "Profra. Vázquez González María" },
    { time: "09:30 - 10:20", subj: "Geografía", room: "A-104", sec: "both", prof: "Asignatura Ordinaria" },
    { time: "10:20 - 11:10", subj: "Historia Universal III", room: "B-109", sec: "both", prof: "Asignatura Ordinaria" },
    { time: "11:10 - 12:00", subj: "Historia Universal III", room: "B-109", sec: "both", prof: "Asignatura Ordinaria" },
    { time: "12:00 - 13:40", subj: "Tiempo Libre / Estudio", room: "-", sec: "free", prof: "Sin clases programadas" }
  ],
  5: [
    { time: "07:00 - 07:50", subj: "Dibujo II", room: "C-201", sec: "B", prof: "Sección B" },
    { time: "07:50 - 08:40", subj: "Historia Universal III", room: "B-117", sec: "both", prof: "Asignatura Ordinaria" },
    { time: "08:40 - 09:30", subj: "Matemáticas IV", room: "B-117", sec: "both", prof: "Prof. Quintana Mejía Saúl" },
    { time: "09:30 - 10:20", subj: "Lengua extranjera Inglés IV", room: "C-306 (Sec. A) / C-205 (Sec. B)", sec: "both", prof: "Sección A y B" },
    { time: "10:20 - 11:10", subj: "Género y Prevención de las Violencias", room: "B-108", sec: "both", prof: "Asignatura Ordinaria" },
    { time: "11:10 - 12:00", subj: "Educación Física IV", room: "GIM1", sec: "both", prof: "Gimnasio 1" },
    { time: "12:00 - 12:50", subj: "Física III", room: "B-115", sec: "both", prof: "Profra. Reyna García Gabriela" },
    { time: "12:50 - 13:40", subj: "Física III (Laboratorio)", room: "A-302", sec: "both", prof: "Laboratorio A-302" }
  ]
};

function updateCalLabel() {
  const lbl = document.getElementById('calDateLabel');
  if (!lbl) return;
  const today = new Date().getDay();
  const isToday = (currentCalDay === today);
  const prefix = isToday ? "Hoy: " : "";
  lbl.innerHTML = `${prefix}${dayNames[currentCalDay]}, Ciclo 2026-2027`;
}

function setCalendarMode(mode) {
  currentCalMode = mode;
  const dayView = document.getElementById('desktopDayTimelineView');
  const weekView = document.getElementById('mainTimetable')?.parentElement;
  const btnDay = document.getElementById('viewBtnDay');
  const btnWeek = document.getElementById('viewBtnWeek');

  if (!btnDay || !btnWeek) return;

  if (mode === 'day') {
    btnDay.style.background = '#002B7A';
    btnDay.style.color = '#ffffff';
    btnWeek.style.background = 'transparent';
    btnWeek.style.color = '#64748b';
    if (dayView) dayView.style.display = 'block';
    if (weekView) weekView.style.display = 'none';
    renderDesktopDayView();
  } else {
    btnWeek.style.background = '#002B7A';
    btnWeek.style.color = '#ffffff';
    btnDay.style.background = 'transparent';
    btnDay.style.color = '#64748b';
    if (dayView) dayView.style.display = 'none';
    if (weekView) weekView.style.display = 'block';
  }
  updateCalLabel();
}

function renderDesktopDayView() {
  const container = document.getElementById('desktopDayCardsList');
  if (!container) return;
  const classes = desktopScheduleData[currentCalDay] || [];
  container.innerHTML = '';

  classes.forEach(c => {
    if (c.sec === 'free') {
      container.innerHTML += `
        <div style="background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 14px; padding: 1rem; text-align: center; color: #94a3b8; font-style: italic;">
          ☕ ${c.time} &bull; ${c.subj} (${c.prof})
        </div>
      `;
      return;
    }

    container.innerHTML += `
      <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-left: 5px solid #002B7A; border-radius: 14px; padding: 1.1rem 1.4rem; box-shadow: var(--shadow-sm); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.8rem;">
        <div>
          <div style="font-size: 0.85rem; font-weight: 800; color: #002B7A; margin-bottom: 0.2rem;">⏰ ${c.time}</div>
          <div style="font-size: 1.15rem; font-weight: 900; color: #001628;">${c.subj}</div>
          <div style="font-size: 0.84rem; color: #64748b; margin-top: 0.2rem;">👤 ${c.prof}</div>
        </div>
        <div style="text-align: right;">
          <span style="background: #e0f2fe; color: #0369a1; font-weight: 800; padding: 0.35rem 0.8rem; border-radius: 8px; font-size: 0.9rem; display: inline-block;">
            Salón ${c.room}
          </span>
        </div>
      </div>
    `;
  });
}

function calGoToday() {
  const d = new Date().getDay();
  currentCalDay = (d >= 1 && d <= 5) ? d : 1;
  updateCalLabel();
  if (currentCalMode === 'day') renderDesktopDayView();
}

function calPrevDay() {
  currentCalDay = currentCalDay > 1 ? currentCalDay - 1 : 5;
  updateCalLabel();
  if (currentCalMode === 'day') renderDesktopDayView();
}

function calNextDay() {
  currentCalDay = currentCalDay < 5 ? currentCalDay + 1 : 1;
  updateCalLabel();
  if (currentCalMode === 'day') renderDesktopDayView();
}

// Gestos táctiles de deslizamiento (Swipe)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const diff = touchEndX - touchStartX;
  if (Math.abs(diff) > 70) {
    if (diff > 0) {
      if (typeof prevDay === 'function') prevDay();
      calPrevDay();
    } else {
      if (typeof nextDay === 'function') nextDay();
      calNextDay();
    }
  }
}

// Navegación por flechas del teclado en computadora
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'ArrowLeft') {
    calPrevDay();
  } else if (e.key === 'ArrowRight') {
    calNextDay();
  }
});

/* ==========================================================
   FORMULARIO DE FEEDBACK -> ENVÍO DIRECTO A WHATSAPP
   ========================================================== */
function submitPageFeedback() {
  const author = document.getElementById('feedbackAuthor')?.value.trim() || 'Un alumno del 415';
  const content = document.getElementById('feedbackContent')?.value.trim();

  if (!content) {
    alert('Por favor escribe tu sugerencia o necesidad para poder enviarla al grupo.');
    document.getElementById('feedbackContent')?.focus();
    return;
  }

  const message = `¡Hola! Soy ${author} del Grupo 0415.\n\n📝 Sugerencia para la página web:\n"${content}"`;
  const url = `https://wa.me/525571985641?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}


/* ==========================================================
   SISTEMA DE DETECCIÓN Y RESALTADO DE MATERIA EN TIEMPO REAL
   ========================================================== */
const timeSlots = [
  { start: 420, end: 470, text: "07:00 - 07:50", label: "7:00 - 7:50", row: 0 },
  { start: 470, end: 520, text: "07:50 - 08:40", label: "7:50 - 8:40", row: 1 },
  { start: 520, end: 570, text: "08:40 - 09:30", label: "8:40 - 9:30", row: 2 },
  { start: 570, end: 620, text: "09:30 - 10:20", label: "9:30 - 10:20", row: 3 },
  { start: 620, end: 670, text: "10:20 - 11:10", label: "10:20 - 11:10", row: 4 },
  { start: 670, end: 720, text: "11:10 - 12:00", label: "11:10 - 12:00", row: 5 },
  { start: 720, end: 770, text: "12:00 - 12:50", label: "12:00 - 12:50", row: 6 },
  { start: 770, end: 820, text: "12:50 - 13:40", label: "12:50 - 13:40", row: 7 }
];

function getActiveSlotIndex() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  for (let i = 0; i < timeSlots.length; i++) {
    if (currentMinutes >= timeSlots[i].start && currentMinutes < timeSlots[i].end) {
      return i;
    }
  }
  return -1;
}

function highlightDesktopLiveClass() {
  const table = document.getElementById('mainTimetable');
  if (!table) return;

  const now = new Date();
  const currentDay = now.getDay(); // 1 = Lun, 2 = Mar, ..., 5 = Vie
  const activeSlotIdx = getActiveSlotIndex();

  // Limpiar estados anteriores
  table.querySelectorAll('.is-live-class-now').forEach(el => el.classList.remove('is-live-class-now'));
  table.querySelectorAll('.is-live-time-now').forEach(el => el.classList.remove('is-live-time-now'));
  table.querySelectorAll('.live-status-badge').forEach(el => el.remove());

  // Si hoy es entre Lunes y Viernes y hay una clase activa
  if (currentDay >= 1 && currentDay <= 5 && activeSlotIdx !== -1) {
    const rows = table.querySelectorAll('tbody tr');
    const targetRow = rows[activeSlotIdx];
    if (targetRow) {
      // 1. Resaltar la hora en la columna 0
      const timeCell = targetRow.querySelector('.time-cell');
      if (timeCell) {
        timeCell.classList.add('is-live-time-now');
        const badge = document.createElement('div');
        badge.className = 'live-status-badge';
        badge.innerHTML = '<span class="live-pulse-dot"></span> HORA ACTUAL';
        timeCell.prepend(badge);
      }

      // 2. Resaltar la materia que se está teniendo ahora en el día actual
      const dayCell = targetRow.children[currentDay];
      if (dayCell) {
        const classItems = dayCell.querySelectorAll('.class-item');
        classItems.forEach(item => {
          item.classList.add('is-live-class-now');
          const liveBadge = document.createElement('div');
          liveBadge.className = 'live-status-badge';
          liveBadge.innerHTML = '<span class="live-pulse-dot"></span> EN CURSO AHORA';
          item.prepend(liveBadge);
        });
      }
    }
  }
}

// Ejecutar al cargar y actualizar cada 30 segundos
document.addEventListener('DOMContentLoaded', () => {
  highlightDesktopLiveClass();
  setInterval(highlightDesktopLiveClass, 30000);
});

// En renderDesktopDayView, resaltar la clase en curso
const originalRenderDesktopDayView = renderDesktopDayView;
renderDesktopDayView = function() {
  originalRenderDesktopDayView();
  const now = new Date();
  const currentDay = now.getDay();
  const activeSlotIdx = getActiveSlotIndex();

  if (currentCalDay === currentDay && activeSlotIdx !== -1) {
    const slot = timeSlots[activeSlotIdx];
    const container = document.getElementById('desktopDayCardsList');
    if (!container) return;

    container.querySelectorAll('.timeline-class-card, div').forEach(card => {
      if (card.textContent.includes(slot.label) || card.textContent.includes(slot.text)) {
        card.classList.add('is-live-class-now');
        if (!card.querySelector('.live-status-badge')) {
          const b = document.createElement('div');
          b.className = 'live-status-badge';
          b.style.marginBottom = '0.5rem';
          b.innerHTML = '<span class="live-pulse-dot"></span> EN CLASE AHORA';
          card.prepend(b);
        }
      }
    });
  }
};
