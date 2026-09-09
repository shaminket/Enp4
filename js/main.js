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


/* ==========================================================
   MOTOR DE TOLERANCIA Y CRONÓMETRO SONORO EN TIEMPO REAL
   ========================================================== */
const subjectTolerancesMinutes = {
  "Geografía": 10,
  "Física III": 10,
  "Física III (Laboratorio)": 10,
  "Lengua extranjera Inglés IV (Sec. A)": 5,
  "Lengua extranjera Inglés IV (Sec. B)": null, // Sec B sin contador
  "Lengua extranjera Inglés IV": 5,
  "Lengua Española": 5,
  "Orientación Educativa IV (Sec. A)": 10,
  "Orientación Educativa IV (Sec. B)": null, // Sec B sin información
  "Orientación Educativa IV": 10,
  "Matemáticas IV": 15,
  "Dibujo II (Sec. A)": 10,
  "Dibujo II (Sec. B)": null, // Sec B no pongas nada
  "Dibujo II": 10,
  "Informática": 10,
  "Lógica": 10,
  "Género y Prevención de las Violencias": 10,
  "Género y Prevención": 10,
  "Historia Universal III": 10,
  "Educación Física IV": 10
};

// Web Audio API Ticker
let audioCtx = null;
let isAudioMuted = false;
let lastSoundTickTime = 0;

// Generador de sonido de alerta de alto volumen con Web Audio API
function playTickSound(frequency = 1050, duration = 0.06, volume = 0.6) {
  if (isAudioMuted) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    // Onda triangular/seno con armónicos para sonar claro y fuerte como alarma
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    // Volumen al máximo (0.6 a 0.8) para alerta perceptible
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio bloqueado por el navegador
  }
}

function toggleToleranceAudio() {
  isAudioMuted = !isAudioMuted;
  const icon = document.getElementById('audioIcon');
  if (icon) {
    icon.textContent = isAudioMuted ? '🔇' : '🔊';
  }
}

// Variables de estado del cronómetro
let demoModeActive = false;
let demoSecondsLeft = 0;
let toleranceExpiredShown = false;

function triggerToleranceDemo(seconds = 195) {
  demoModeActive = true;
  demoSecondsLeft = seconds; // Inicia en verde (> 180s) para mostrar toda la secuencia
  toleranceExpiredShown = false;
  updateToleranceWidget();
}

function updateToleranceWidget() {
  const container = document.getElementById('liveToleranceModule');
  if (!container) return;

  const now = new Date();
  const currentDay = now.getDay();
  const currentTotalSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  let activeSubject = null;
  let tolMinutes = null;
  let remainingSec = 0;
  let totalTolSec = 0;
  let slotRoom = "";

  if (demoModeActive) {
    activeSubject = "Matemáticas IV (Demostración)";
    slotRoom = "Salón B-112";
    totalTolSec = 15 * 60;
    remainingSec = demoSecondsLeft;
    demoSecondsLeft--;
    if (demoSecondsLeft < 0) {
      demoModeActive = false;
      remainingSec = 0;
    }
  } else {
    // Búsqueda en tiempo real
    if (currentDay < 1 || currentDay > 5) {
      container.style.display = 'none';
      return;
    }

    const currentMins = now.getHours() * 60 + now.getMinutes();
    const slotIdx = getActiveSlotIndex();

    if (slotIdx === -1) {
      container.style.display = 'none';
      return;
    }

    const slot = timeSlots[slotIdx];
    const todayClasses = desktopScheduleData[currentDay] || [];
    const activeClassObj = todayClasses[slotIdx];

    if (!activeClassObj || activeClassObj.sec === 'free') {
      container.style.display = 'none';
      return;
    }

    activeSubject = activeClassObj.subj;
    slotRoom = activeClassObj.room;
    tolMinutes = subjectTolerancesMinutes[activeSubject];

    // Si la materia no tiene tolerancia o no se le debe poner contador
    if (tolMinutes === null || tolMinutes === undefined) {
      container.style.display = 'none';
      return;
    }

    totalTolSec = tolMinutes * 60;
    const startTotalSec = (Math.floor(slot.start / 60)) * 3600 + (slot.start % 60) * 60;
    const elapsedSec = currentTotalSec - startTotalSec;
    remainingSec = totalTolSec - elapsedSec;
  }

  // 1. Si el tiempo de tolerancia terminó
  if (remainingSec <= 0) {
    if (!toleranceExpiredShown) {
      toleranceExpiredShown = true;
      container.style.display = 'block';
      container.innerHTML = `
        <div class="tolerance-expired-notice">
          <span style="font-size: 2.2rem;">🚪</span>
          <div>
            <h4 style="margin: 0; font-size: 1.15rem; font-weight: 900; color: #ffffff;">
              Clase iniciada, espera a la siguiente hora para integrarte.
            </h4>
            <p style="margin: 0.25rem 0 0; font-size: 0.92rem; color: #fca5a5; font-weight: 700;">
              Evita interrumpir.
            </p>
          </div>
        </div>
      `;
      // Dura unos pocos segundos y vuelve a crecer el horario
      setTimeout(() => {
        container.style.display = 'none';
      }, 7000);
    }
    return;
  }

  // 2. Si la tolerancia está corriendo activamente
  toleranceExpiredShown = false;
  container.style.display = 'block';

  // Reglas de color y ritmo sonoro exactas:
  // Verde (> 180s): sonido cada segundo (1000ms)
  // Amarillo (<= 180s): sonido cada medio segundo (500ms)
  // Rojo (<= 90s): sonido cada cuarto de segundo (250ms)
  let colorClass = 'tolerance-green';
  let progressColor = '#22c55e';
  let tickIntervalMs = 1000; // Verde: cada segundo
  let beepFreq = 950;
  let alertVol = 0.55;

  if (remainingSec <= 90) {
    colorClass = 'tolerance-red';
    progressColor = '#ef4444';
    tickIntervalMs = 250; // Rojo: cada cuarto de segundo
    beepFreq = 1250;
    alertVol = 0.75; // Máxima alerta
  } else if (remainingSec <= 180) {
    colorClass = 'tolerance-yellow';
    progressColor = '#f59e0b';
    tickIntervalMs = 500; // Amarillo: cada medio segundo
    beepFreq = 1100;
    alertVol = 0.65;
  }

  // Sonido proporcional al tiempo restante
  const nowMs = Date.now();
  if (nowMs - lastSoundTickTime >= tickIntervalMs) {
    playTickSound(beepFreq, 0.05, alertVol);
    lastSoundTickTime = nowMs;
  }

  // Formato MM:SS
  const mins = Math.floor(remainingSec / 60);
  const secs = remainingSec % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const pct = Math.max(0, Math.min(100, (remainingSec / totalTolSec) * 100));

  container.innerHTML = `
    <div class="tolerance-card ${colorClass}">
      <div class="tolerance-header">
        <div class="tolerance-badge-pulse">
          <span class="live-pulse-dot" style="background: ${progressColor};"></span>
          <span>Tolerancia de Entrada &bull; ${activeSubject}</span>
        </div>
        <div class="tolerance-controls">
          <button class="sound-toggle-btn" onclick="toggleToleranceAudio()" title="Silenciar / Activar sonido">
            <span id="audioIcon">${isAudioMuted ? '🔇' : '🔊'}</span>
          </button>
          <button class="demo-toggle-btn" onclick="triggerToleranceDemo(195)" title="Reiniciar demostración de tolerancia">
            ⏱️ Probar 3m
          </button>
        </div>
      </div>

      <div class="tolerance-body">
        <div class="tolerance-countdown-display" id="toleranceTimeDisplay">
          ${timeFormatted}
        </div>
        <div class="tolerance-info">
          <p class="tolerance-status-text" id="toleranceStatusText">
            Tiempo de tolerancia restante para entrar al ${slotRoom} sin falta
          </p>
          <div class="tolerance-progress-bar">
            <div class="tolerance-progress-fill" style="width: ${pct}%; background-color: ${progressColor};"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Iniciar cronómetro de tolerancia segundo a segundo
document.addEventListener('DOMContentLoaded', () => {
  updateToleranceWidget();
  setInterval(updateToleranceWidget, 1000);
});


/* ==========================================================
   SISTEMA DE BANNER MORADO (5 SEGUNDOS) + CONTORNO GIRATORIO
   ========================================================== */
let announcementTimerInterval = null;
let announcementAudioInterval = null;

function activateRotatingPurpleBorders(activate = true) {
  // Buscar elementos de Lengua Española e Informática
  document.querySelectorAll('.class-item, .timeline-class-card, .bento-card').forEach(el => {
    const txt = (el.textContent || '').toLowerCase();
    if (txt.includes('español') || txt.includes('informát')) {
      if (activate) {
        el.classList.add('rotating-purple-border');
        if (el.classList.contains('promo-featured') || el.closest('section')) {
          el.classList.add('rotating-purple-border-dark');
        }
      } else {
        el.classList.remove('rotating-purple-border');
        el.classList.remove('rotating-purple-border-dark');
      }
    }
  });

  // En centro de control, el banner principal de Español
  const espBanner = document.querySelector('section[style*="linear-gradient(135deg, #001628"]');
  if (espBanner) {
    if (activate) espBanner.classList.add('rotating-purple-border');
    else espBanner.classList.remove('rotating-purple-border');
  }
}

function triggerAnnouncementModal() {
  const overlay = document.getElementById('announcementOverlay');
  if (!overlay) return;

  // Activar contorno morado giratorio en Español e Informática
  activateRotatingPurpleBorders(true);

  // Mostrar el banner deslizándose desde el lado
  overlay.classList.remove('dismissing');
  overlay.classList.add('active');

  let timeLeftMs = 5000;
  const timeNumEl = document.getElementById('announcementTimeNum');
  const progressFillEl = document.getElementById('announcementProgressFill');

  if (timeNumEl) timeNumEl.textContent = '5.0s';
  if (progressFillEl) progressFillEl.style.width = '100%';

  // Sonido cada cuarto de segundo (250 ms) a buen volumen
  if (announcementAudioInterval) clearInterval(announcementAudioInterval);
  announcementAudioInterval = setInterval(() => {
    playTickSound(1150, 0.04, 0.5);
  }, 250);

  // Actualizar temporizador de 5 segundos
  if (announcementTimerInterval) clearInterval(announcementTimerInterval);
  const stepMs = 50;
  announcementTimerInterval = setInterval(() => {
    timeLeftMs -= stepMs;
    const s = Math.max(0, timeLeftMs / 1000).toFixed(1);
    if (timeNumEl) timeNumEl.textContent = s + 's';
    if (progressFillEl) {
      const pct = Math.max(0, (timeLeftMs / 5000) * 100);
      progressFillEl.style.width = pct + '%';
    }

    if (timeLeftMs <= 0) {
      clearInterval(announcementTimerInterval);
      clearInterval(announcementAudioInterval);
      dismissAnnouncementModal();
    }
  }, stepMs);
}

function dismissAnnouncementModal() {
  const overlay = document.getElementById('announcementOverlay');
  if (!overlay) return;

  if (announcementAudioInterval) clearInterval(announcementAudioInterval);
  if (announcementTimerInterval) clearInterval(announcementTimerInterval);

  // Se guarda por donde nació (desliza hacia el lado)
  overlay.classList.add('dismissing');

  // Retirar contorno morado giratorio
  activateRotatingPurpleBorders(false);

  setTimeout(() => {
    overlay.classList.remove('active');
    overlay.classList.remove('dismissing');
  }, 550);
}

// Desplegar automáticamente al entrar a la página
document.addEventListener('DOMContentLoaded', () => {
  // Pequeño delay de 250ms para que la animación de entrada desde el lado sea visualmente perfecta
  setTimeout(() => {
    triggerAnnouncementModal();
  }, 250);
});
