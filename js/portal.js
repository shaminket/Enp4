/**
 * PORTAL UNICORNIO 0415 • CONTROLADOR DEDICADO DEL PORTAL
 * js/portal.js - Exclusivo para index.html
 */

(function initPortalEngine() {
  // 1. BASE DE DATOS DEL HORARIO SEMANAL GRUPO 0415
  const WEEK_CLASSES = {
    1: [ // LUNES
      { time: "07:00 - 07:50", subject: "Geografía", room: "A-104", prof: "Profra. Silvia Mendoza", sec: "both", hw: "📝 4 Noticias", href: "materias/geografia.html" },
      { time: "07:50 - 08:40", subject: "Física III", room: "B-116", prof: "Profra. Gabriela Reyna", sec: "both", href: "materias/fisica.html" },
      { time: "08:40 - 09:30", subject: "Física III", room: "B-109", prof: "Profra. Gabriela Reyna", sec: "both", href: "materias/fisica.html" },
      { time: "09:30 - 10:20", subject: "Inglés IV (Sec. A)", room: "B-318", prof: "Mediateca", sec: "A", hw: "📍 Mediateca B-318", alert: true, href: "materias/ingles-a.html" },
      { time: "10:20 - 11:10", subject: "Lengua Española", room: "B-112", prof: "Profra. María Vázquez", sec: "both", hw: "🔔 Hojas pospuestas", href: "materias/espanol.html" },
      { time: "11:10 - 12:00", subject: "Lengua Española", room: "B-112", prof: "Profra. María Vázquez", sec: "both", href: "materias/espanol.html" },
      { time: "12:00 - 12:50", subject: "Orientación IV (Sec. A)", room: "B-110", prof: "Tutoría", sec: "A", hw: "📝 2 Tareas UNAM", href: "materias/orientacion-a.html" }
    ],
    2: [ // MARTES
      { time: "07:00 - 07:50", subject: "Matemáticas IV", room: "B-112", prof: "Prof. Saúl Quintana", sec: "both", href: "materias/matematicas.html" },
      { time: "07:50 - 08:40", subject: "Matemáticas IV", room: "B-112", prof: "Prof. Saúl Quintana", sec: "both", href: "materias/matematicas.html" },
      { time: "08:40 - 09:30", subject: "Dibujo II (Sec. A)", room: "B-008", prof: "Taller A", sec: "A", hw: "🎨 Paisaje Líneas", href: "materias/dibujo-a.html" },
      { time: "09:30 - 10:20", subject: "Informática", room: "I-108", prof: "Taller I-108", sec: "both", hw: "💻 Exposiciones", href: "materias/informatica.html" },
      { time: "10:20 - 11:10", subject: "Lógica", room: "B-206", prof: "Filosofía", sec: "both", hw: "📝 3 Tareas", href: "materias/logica.html" },
      { time: "11:10 - 12:00", subject: "Informática", room: "CC-2", prof: "Laboratorio CC-2", sec: "both", href: "materias/informatica.html" },
      { time: "12:00 - 12:50", subject: "Prevención Violencias", room: "B-109", prof: "Cultura de Paz", sec: "both", href: "materias/genero.html" }
    ],
    3: [ // MIÉRCOLES
      { time: "07:00 - 07:50", subject: "Geografía", room: "A-104", prof: "Profra. Silvia Mendoza", sec: "both", href: "materias/geografia.html" },
      { time: "07:50 - 08:40", subject: "Lógica", room: "B-108", prof: "Filosofía", sec: "both", hw: "📝 Tareas", href: "materias/logica.html" },
      { time: "08:40 - 09:30", subject: "Lógica", room: "B-108", prof: "Filosofía", sec: "both", href: "materias/logica.html" },
      { time: "09:30 - 10:20", subject: "Inglés IV (Sec. A)", room: "C-306", prof: "Idiomas", sec: "A", href: "materias/ingles-a.html" },
      { time: "10:20 - 11:10", subject: "Dibujo II (Sec. A)", room: "B-008", prof: "Taller A", sec: "A", href: "materias/dibujo-a.html" },
      { time: "11:10 - 12:00", subject: "Lengua Española", room: "B-112", prof: "Profra. María Vázquez", sec: "both", href: "materias/espanol.html" },
      { time: "12:00 - 12:50", subject: "Lengua Española", room: "B-112", prof: "Profra. María Vázquez", sec: "both", href: "materias/espanol.html" }
    ],
    4: [ // JUEVES
      { time: "07:00 - 07:50", subject: "Matemáticas IV", room: "B-109", prof: "Prof. Saúl Quintana", sec: "both", href: "materias/matematicas.html" },
      { time: "07:50 - 08:40", subject: "Matemáticas IV", room: "B-109", prof: "Prof. Saúl Quintana", sec: "both", href: "materias/matematicas.html" },
      { time: "08:40 - 09:30", subject: "Lengua Española", room: "B-110", prof: "Profra. María Vázquez", sec: "both", href: "materias/espanol.html" },
      { time: "09:30 - 10:20", subject: "Historia Universal III", room: "B-109", prof: "Colegio Historia", sec: "both", hw: "🗺️ Planisferio", href: "materias/historia.html" },
      { time: "10:20 - 11:10", subject: "Historia Universal III", room: "B-109", prof: "Colegio Historia", sec: "both", href: "materias/historia.html" }
    ],
    5: [ // VIERNES
      { time: "07:00 - 07:50", subject: "Dibujo II (Sec. B)", room: "C-201", prof: "Taller B", sec: "B", href: "materias/dibujo-b.html" },
      { time: "07:50 - 08:40", subject: "Historia Universal III", room: "B-117", prof: "Colegio Historia", sec: "both", hw: "🗺️ Planisferio", href: "materias/historia.html" },
      { time: "08:40 - 09:30", subject: "Matemáticas IV", room: "B-117", prof: "Prof. Saúl Quintana", sec: "both", href: "materias/matematicas.html" },
      { time: "09:30 - 10:20", subject: "Inglés IV (Sec. A)", room: "C-306", prof: "Idiomas", sec: "A", href: "materias/ingles-a.html" },
      { time: "10:20 - 11:10", subject: "Prevención Violencias", room: "B-108", prof: "Cultura de Paz", sec: "both", href: "materias/genero.html" },
      { time: "11:10 - 12:00", subject: "Educación Física IV", room: "GIM1", prof: "Gimnasio 1", sec: "both", hw: "📝 Condición Física", href: "materias/educacion-fisica.html" },
      { time: "12:00 - 12:50", subject: "Física III (Teoría)", room: "B-115", prof: "Profra. Gabriela Reyna", sec: "both", href: "materias/fisica.html" },
      { time: "12:50 - 13:40", subject: "Física III (Lab)", room: "A-302", prof: "Laboratorio A-302 (Bata)", sec: "both", href: "materias/fisica.html" }
    ]
  };

  // 2. EVENTOS DEL CALENDARIO MENSUAL
  const CAL_EVENTS = {
    "2026-09-14": [
      { title: "📜 Historia: Cuadernos pendientes (12:00 B-110) & Planisferio", type: "blue", href: "materias/historia.html" },
      { title: "🇬🇧 Inglés Sec. A: En Mediateca Salón B-318 (Audífonos)", type: "red", href: "materias/ingles-a.html" },
      { title: "🌍 Geografía: 4 Noticias en equipo (hoja en 4 cuadrantes)", type: "blue", href: "materias/geografia.html" },
      { title: "🧭 Orientación A: 2 Tareas UNAM y materiales en B-110", type: "blue", href: "materias/orientacion-a.html" },
      { title: "📖 Lengua Española: Hojas pospuestas (espera indicaciones)", type: "blue", href: "materias/espanol.html" }
    ],
    "2026-09-15": [
      { title: "🧠 Lógica: 3 Tareas (tipos frases, corrección $30/$70 y Gettier)", type: "blue", href: "materias/logica.html" },
      { title: "🎨 Dibujo A: Paisaje líneas & corrección puntillismo", type: "blue", href: "materias/dibujo-a.html" }
    ],
    "2026-09-18": [
      { title: "🏃 Educación Física IV: Tarea Condición Física (GIM1)", type: "blue", href: "materias/educacion-fisica.html" },
      { title: "⚡ Física III: Práctica en Laboratorio A-302 con bata", type: "gold", href: "materias/fisica.html" }
    ],
    "2026-09-22": [
      { title: "💻 Informática: Exposición Equipo 1 y Equipo 2 (1+3=1)", type: "blue", href: "materias/informatica-exposiciones.html" }
    ],
    "2026-09-29": [
      { title: "💻 Informática: Exposición Equipo 3 y Equipo 4", type: "blue", href: "materias/informatica-exposiciones.html" }
    ],
    "2026-10-06": [
      { title: "💻 Informática: Exposición Equipo 5 y Equipo 6", type: "blue", href: "materias/informatica-exposiciones.html" }
    ],
    "2026-10-13": [
      { title: "💻 Informática: Exposición Equipo 7 y Equipo 8", type: "blue", href: "materias/informatica-exposiciones.html" }
    ],
    "2026-10-20": [
      { title: "💻 Informática: Exposición Equipo 9 & Cierre", type: "blue", href: "materias/informatica-exposiciones.html" }
    ],
    "2027-04-23": [
      { title: "🎓 Fin de Cursos de 4° Año: ¡Felicidades, Cuatreros, pasaron a 5°!", type: "gold", href: "centro-control.html" }
    ]
  };

  // 3. ESTADO GLOBAL DEL CALENDARIO
  let currentCalYear = 2026;
  let currentCalMonth = 8; // Septiembre (0-indexed: 8 = Septiembre)
  let currentViewMode = "week";

  // 4. SINTETIZADOR WEB AUDIO PARA TOLERANCIA
  let audioCtx = null;
  function playBeep(freq = 880, duration = 0.15) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio seguro
    }
  }

  // 5. RELOJ EN TIEMPO REAL & RADAR DE CLASE
  function updateLiveTelemetry() {
    const now = new Date();
    const clockEl = document.getElementById("portalClock");
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString("es-MX", { hour12: false });
    }

    const day = now.getDay(); // 1=Lunes, 5=Viernes
    const minutesNow = now.getHours() * 60 + now.getMinutes();
    const radarLabel = document.getElementById("liveRadarStatusText");
    const radarBadge = document.getElementById("liveRadarBadge");

    if (day >= 1 && day <= 5 && WEEK_CLASSES[day]) {
      const todayClasses = WEEK_CLASSES[day];
      let activeClass = null;
      let nextClass = null;

      for (const item of todayClasses) {
        const parts = item.time.split(" - ");
        const [hStart, mStart] = parts[0].split(":").map(Number);
        const [hEnd, mEnd] = parts[1].split(":").map(Number);
        const startMin = hStart * 60 + mStart;
        const endMin = hEnd * 60 + mEnd;

        if (minutesNow >= startMin && minutesNow < endMin) {
          activeClass = { ...item, startMin, endMin };
          break;
        } else if (minutesNow < startMin && !nextClass) {
          nextClass = { ...item, startMin, endMin };
        }
      }

      if (activeClass && radarLabel && radarBadge) {
        const elapsedSec = (minutesNow - activeClass.startMin) * 60 + now.getSeconds();
        const toleranceLeft = Math.max(0, 300 - elapsedSec); // 5 min tolerancia

        let statusText = `En curso: ${activeClass.subject} (${activeClass.room})`;
        let badgeColor = "#22c55e";
        let badgeText = "En Vivo";

        if (toleranceLeft > 180) {
          badgeColor = "#22c55e";
          badgeText = `Tolerancia: ${Math.floor(toleranceLeft / 60)}m ${toleranceLeft % 60}s`;
        } else if (toleranceLeft > 0) {
          badgeColor = "#f59e0b";
          badgeText = `¡Corre! ${toleranceLeft}s`;
          if (now.getSeconds() % 5 === 0) playBeep(920, 0.1);
        } else {
          badgeColor = "#ef4444";
          badgeText = "Tolerancia Agotada";
        }

        radarLabel.innerHTML = `<strong>${statusText}</strong> &bull; ${activeClass.prof}`;
        radarBadge.style.background = badgeColor;
        radarBadge.textContent = badgeText;
      } else if (nextClass && radarLabel && radarBadge) {
        const diffMin = nextClass.startMin - minutesNow;
        radarLabel.innerHTML = `Siguiente: <strong>${nextClass.subject}</strong> en ${nextClass.room} (${nextClass.time.split(" - ")[0]})`;
        radarBadge.style.background = "#3b82f6";
        radarBadge.textContent = `En ${diffMin} min`;
      } else if (radarLabel && radarBadge) {
        radarLabel.textContent = "Jornada escolar concluida por hoy. ¡Descansen Cuatreros!";
        radarBadge.style.background = "rgba(255,255,255,0.15)";
        radarBadge.textContent = "Al tiro";
      }
    } else if (radarLabel && radarBadge) {
      radarLabel.textContent = "Fin de semana en el 415. Prepárate para el lunes.";
      radarBadge.style.background = "rgba(213, 159, 15, 0.3)";
      radarBadge.textContent = "Sábado/Domingo";
    }
  }

  // 6. RENDERIZADO DEL HORARIO SEMANAL
  function renderTimetable() {
    const tbody = document.getElementById("scheduleTableBody");
    if (!tbody) return;

    const timeSlots = [
      "07:00 - 07:50",
      "07:50 - 08:40",
      "08:40 - 09:30",
      "09:30 - 10:20",
      "10:20 - 11:10",
      "11:10 - 12:00",
      "12:00 - 12:50",
      "12:50 - 13:40"
    ];

    tbody.innerHTML = "";

    timeSlots.forEach(slot => {
      const tr = document.createElement("tr");

      // Columna de hora
      const tdTime = document.createElement("td");
      tdTime.className = "time-col";
      tdTime.textContent = slot;
      tr.appendChild(tdTime);

      // Columnas de Lunes (1) a Viernes (5)
      for (let day = 1; day <= 5; day++) {
        const td = document.createElement("td");
        const dayList = WEEK_CLASSES[day] || [];
        const match = dayList.find(c => c.time === slot);

        if (match) {
          const card = document.createElement("a");
          card.href = match.href;
          card.className = "class-card-cell" + (match.hw ? " has-homework" : "");

          let hwBadge = match.hw ? `<span class="cell-hw-tag">${match.hw}</span>` : "";
          let roomBadge = `<span class="cell-room-tag">${match.room}</span>`;

          card.innerHTML = `
            <div class="cell-subject-name">${match.subject}</div>
            <div class="cell-meta-row">
              ${roomBadge}
              ${hwBadge}
            </div>
          `;
          td.appendChild(card);
        } else {
          td.innerHTML = `<div style="height:100%; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.1); font-size:0.75rem;">Libre</div>`;
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
  }

  // 7. RENDERIZADO DEL CALENDARIO ESCOLAR (MES A MES)
  const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  function renderCalendarMonth() {
    const grid = document.getElementById("calendarGrid");
    const titleEl = document.getElementById("calendarMonthTitle");
    if (!grid || !titleEl) return;

    titleEl.textContent = `${MONTH_NAMES[currentCalMonth]} ${currentCalYear}`;
    grid.innerHTML = "";

    // Encabezados de días: Dom, Lun, Mar, Mié, Jue, Vie, Sáb
    const dayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    dayLabels.forEach(lbl => {
      const h = document.createElement("div");
      h.className = "cal-day-header";
      h.textContent = lbl;
      grid.appendChild(h);
    });

    const firstDay = new Date(currentCalYear, currentCalMonth, 1).getDay();
    const daysInMonth = new Date(currentCalYear, currentCalMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentCalYear, currentCalMonth, 0).getDate();

    // Días del mes anterior
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const cell = document.createElement("div");
      cell.className = "cal-day-cell other-month";
      cell.innerHTML = `<span class="cal-cell-num">${dayNum}</span>`;
      grid.appendChild(cell);
    }

    // Días del mes actual
    const today = new Date();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentCalYear}-${String(currentCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const events = CAL_EVENTS[dateStr] || [];
      const cell = document.createElement("div");
      cell.className = "cal-day-cell";

      if (today.getFullYear() === currentCalYear && today.getMonth() === currentCalMonth && today.getDate() === d) {
        cell.classList.add("is-today");
      }

      if (events.length > 0) {
        cell.classList.add("has-events");
      }

      let dotsHtml = "";
      if (events.length > 0) {
        dotsHtml = `<div class="cal-dots-row">` +
          events.map(e => `<span class="cal-dot ${e.type}"></span>`).join("") +
          `</div>`;
      }

      cell.innerHTML = `
        <span class="cal-cell-num">${d}</span>
        ${dotsHtml}
      `;

      cell.onclick = () => openDayDetails(dateStr, d);
      grid.appendChild(cell);
    }
  }

  // 8. CAJÓN DE DETALLES DEL DÍA AL TOCAR UNA FECHA
  function openDayDetails(dateStr, dayNum) {
    const drawer = document.getElementById("calendarDrawer");
    if (!drawer) return;

    const events = CAL_EVENTS[dateStr] || [];
    const dObj = new Date(`${dateStr}T12:00:00`);
    const dayOfWeek = dObj.getDay(); // 0=Dom, 1=Lun ...
    const dayClasses = WEEK_CLASSES[dayOfWeek] || [];

    let eventsHtml = "";
    if (events.length > 0) {
      eventsHtml = `<div style="margin-bottom:0.8rem;">
        <strong style="color:var(--unam-gold-bright); font-size:0.85rem; display:block; margin-bottom:0.4rem;">🔔 Avisos y Tareas de esta fecha:</strong>
        <div style="display:flex; flex-direction:column; gap:0.4rem;">` +
        events.map(ev => `
          <a href="${ev.href}" style="background:rgba(255,255,255,0.06); border:1px solid var(--glass-stroke); border-left:3px solid ${ev.type === 'red' ? '#ef4444' : '#3b82f6'}; border-radius:8px; padding:0.45rem 0.75rem; text-decoration:none; color:#fff; font-size:0.82rem; display:flex; justify-content:space-between; align-items:center;">
            <span>${ev.title}</span>
            <span style="font-size:0.75rem; color:#60a5fa; font-weight:800;">Ver materia &rarr;</span>
          </a>
        `).join("") +
        `</div></div>`;
    }

    let classesHtml = "";
    if (dayClasses.length > 0) {
      classesHtml = `<div>
        <strong style="color:#94a3b8; font-size:0.82rem; display:block; margin-bottom:0.4rem;">Clases del día:</strong>
        <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">` +
        dayClasses.map(c => `
          <span style="background:rgba(0,0,0,0.3); border:1px solid var(--glass-stroke); padding:0.25rem 0.55rem; border-radius:6px; font-size:0.75rem; color:#cbd5e1;">
            ${c.time.split(" - ")[0]}: <strong>${c.subject}</strong> (${c.room})
          </span>
        `).join("") +
        `</div></div>`;
    } else {
      classesHtml = `<span style="font-size:0.82rem; color:var(--text-muted); font-style:italic;">Fin de semana &bull; Sin clases regulares programadas.</span>`;
    }

    drawer.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.4rem;">
        <strong style="color:#fff; font-size:0.95rem;">📅 Agenda del ${dayNum} de ${MONTH_NAMES[currentCalMonth]} ${currentCalYear}</strong>
        <button onclick="document.getElementById('calendarDrawer').classList.remove('open')" style="background:none; border:none; color:var(--text-muted); font-size:1.2rem; cursor:pointer;">&times;</button>
      </div>
      ${eventsHtml}
      ${classesHtml}
    `;

    drawer.classList.add("open");
  }

  // 9. NAVEGACIÓN DE MESES
  window.changeMonth = function(delta) {
    currentCalMonth += delta;
    if (currentCalMonth > 11) {
      currentCalMonth = 0;
      currentCalYear++;
    } else if (currentCalMonth < 0) {
      currentCalMonth = 11;
      currentCalYear--;
    }
    renderCalendarMonth();
  };

  // 10. CONMUTADOR DE VISTAS (SEMANA VS MES)
  window.setPortalView = function(mode) {
    currentViewMode = mode;
    const btnWeek = document.getElementById("btnViewWeek");
    const btnMonth = document.getElementById("btnViewMonth");
    const weekWrap = document.getElementById("weekTableView");
    const monthWrap = document.getElementById("monthCalendarView");

    if (btnWeek) btnWeek.classList.toggle("active", mode === "week");
    if (btnMonth) btnMonth.classList.toggle("active", mode === "month");
    if (weekWrap) weekWrap.style.display = (mode === "week") ? "block" : "none";
    if (monthWrap) monthWrap.classList.toggle("active", mode === "month");

    if (mode === "month") {
      renderCalendarMonth();
    }
  };

  // 11. MANEJADOR "PICA AQUÍ"
  window.picaAqui = function(materiaKey, tab) {
    sessionStorage.setItem(`openTab_${materiaKey}`, tab || "tareas");
  };

  // INICIALIZACIÓN
  window.addEventListener("DOMContentLoaded", () => {
    updateLiveTelemetry();
    setInterval(updateLiveTelemetry, 1000);
    renderTimetable();
  });
})();
