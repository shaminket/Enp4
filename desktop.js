/**
 * CUATREROS DEL 415 • DESKTOP COMMAND DECK
 * Clústeres Funcionales, Atajos de Teclado, Líneas de Tareas e Intersección 3D
 */

(function () {
  'use strict';

  // Base de datos de materias categorizadas por Clústeres Funcionales
  const SUBJECTS_DATA = [
    { name: "Matemáticas IV", cluster: "ciencias", code: "1400", prof: "Prof. Saúl Quintana", room: "B-112, B-109, B-117" },
    { name: "Física III", cluster: "ciencias", code: "1401", prof: "Profra. Gabriela Reyna", room: "B-116, B-109, B-115, Lab A-302" },
    { name: "Historia Universal III", cluster: "humanidades", code: "1403", prof: "Colegio de Historia", room: "B-109, B-117" },
    { name: "Geografía", cluster: "humanidades", code: "1405", prof: "Profra. Silvia Mendoza", room: "A-104" },
    { name: "Lógica", cluster: "humanidades", code: "1404", prof: "Colegio de Filosofía", room: "B-108, B-206" },
    { name: "Prevención de las Violencias", cluster: "humanidades", code: "8000", prof: "Cultura de Paz", room: "B-108, B-109" },
    { name: "Lengua Española", cluster: "idiomas", code: "1402", prof: "Profra. María Vázquez", room: "B-110, B-112, B-113" },
    { name: "Lengua Extranjera Inglés IV", cluster: "idiomas", code: "1407", prof: "Colegio de Idiomas", room: "C-306, C-205, B-318 (Mediateca)" },
    { name: "Informática", cluster: "idiomas", code: "1408", prof: "Laboratorio Cómputo", room: "I-108, CC-2" },
    { name: "Dibujo II", cluster: "arte", code: "1406", prof: "Taller Dibujo", room: "B-008 (Sec. A), C-201 (Sec. B)" },
    { name: "Educación Física IV", cluster: "arte", code: "1409", prof: "Acondicionamiento", room: "GIM1 (Gimnasio 1)" },
    { name: "Orientación Educativa IV", cluster: "arte", code: "1410", prof: "Tutoría Institucional", room: "B-110 (Sec. A), B-112 (Sec. B)" }
  ];

  const DESKTOP_SCHEDULE = {
    1: [ // Lunes
      { time: "07:00 - 07:50", subject: "Geografía", room: "A-104", prof: "Profra. Silvia Mendoza", cluster: "humanidades", tag: "🔴 4 Noticias", desc: "4 Noticias en equipo (1 hoja dividida en 4 cuadrantes, pluma negra, orden alfabético por apellidos)." },
      { time: "07:50 - 08:40", subject: "Física III", room: "B-116", prof: "Profra. Gabriela Reyna", cluster: "ciencias", tag: null, desc: "Teoría de satélites y cinemática en B-116." },
      { time: "08:40 - 09:30", subject: "Física III", room: "B-109", prof: "Profra. Gabriela Reyna", cluster: "ciencias", tag: null, desc: "Resolución de problemas." },
      { time: "09:30 - 10:20", subject: "Lengua Extranjera Inglés IV", room: "B-318 (Mediateca)", prof: "Profra. Idiomas", cluster: "idiomas", tag: "🔵 Mediateca B-318", desc: "📍 Asistencia obligatoria en Mediateca Salón B-318 (llevar audífonos propios)." },
      { time: "10:20 - 12:00", subject: "Lengua Española", room: "B-112", prof: "Profra. María Vázquez", cluster: "idiomas", tag: "🔵 Hojas pospuestas", desc: "Hojas de La Gomita pospuestas; espera indicaciones en clase." },
      { time: "12:00 - 12:50", subject: "Orientación Educativa IV", room: "B-110 (Sec. A) / B-112 (Sec. B)", prof: "Tutoría", cluster: "arte", tag: "🔴 2 Tareas + Historia", desc: "Sec. A: Post-it, plumones, carpeta y 2 tareas UNAM. Entrega Historia atrasados límite 12:50." }
    ],
    2: [ // Martes
      { time: "07:00 - 08:40", subject: "Matemáticas IV", room: "B-112", prof: "Prof. Saúl Quintana", cluster: "ciencias", tag: null, desc: "Álgebra y Funciones." },
      { time: "08:40 - 09:30", subject: "Dibujo II", room: "B-008", prof: "Taller Dibujo", cluster: "arte", tag: "🟡 Paisaje Líneas", desc: "Lámina paisaje con líneas y corrección puntillismo." },
      { time: "09:30 - 10:20", subject: "Informática", room: "I-108", prof: "Laboratorio", cluster: "idiomas", tag: "🟡 Exposiciones", desc: "Preparación metodología 1+3=1." },
      { time: "10:20 - 11:10", subject: "Lógica", room: "B-206", prof: "Colegio Filosofía", cluster: "humanidades", tag: "🟡 3 Tareas", desc: "Tipos de oraciones, corrección $30/$70 y Gettier." },
      { time: "12:00 - 12:50", subject: "Prevención de las Violencias", room: "B-109", prof: "Cultura de Paz", cluster: "humanidades", tag: "🔵 Clave 8000", desc: "Derechos humanos y protocolos UNAM." }
    ],
    3: [ // Miércoles
      { time: "07:00 - 07:50", subject: "Geografía", room: "A-104", prof: "Profra. Silvia Mendoza", cluster: "humanidades", tag: null, desc: "Cartografía y husos horarios." },
      { time: "07:50 - 09:30", subject: "Lógica", room: "B-108", prof: "Colegio Filosofía", cluster: "humanidades", tag: null, desc: "Conectivos lógicos y tablas de verdad." },
      { time: "09:30 - 10:20", subject: "Lengua Extranjera Inglés IV", room: "C-306", prof: "Idiomas", cluster: "idiomas", tag: null, desc: "Comprensión lectora A2/B1." },
      { time: "10:20 - 11:10", subject: "Dibujo II", room: "B-008", prof: "Taller Dibujo", cluster: "arte", tag: null, desc: "Revisión de portafolio." },
      { time: "11:10 - 12:50", subject: "Lengua Española", room: "B-112", prof: "Profra. María Vázquez", cluster: "idiomas", tag: null, desc: "Análisis literario y redacción." }
    ],
    4: [ // Jueves
      { time: "07:00 - 08:40", subject: "Matemáticas IV", room: "B-109", prof: "Prof. Saúl Quintana", cluster: "ciencias", tag: null, desc: "Sistemas de ecuaciones lineales." },
      { time: "08:40 - 09:30", subject: "Lengua Española", room: "B-110", prof: "Profra. María Vázquez", cluster: "idiomas", tag: null, desc: "Sintaxis y figuras retóricas." }
    ],
    5: [ // Viernes
      { time: "07:50 - 08:40", subject: "Historia Universal III", room: "B-117", prof: "Colegio Historia", cluster: "humanidades", tag: "🔴 Planisferio", desc: "Planisferio con nombres numerado 1 a 136 obligatorio." },
      { time: "08:40 - 09:30", subject: "Matemáticas IV", room: "B-117", prof: "Prof. Saúl Quintana", cluster: "ciencias", tag: null, desc: "Modelación y problemas aplicados." },
      { time: "09:30 - 10:20", subject: "Lengua Extranjera Inglés IV", room: "C-306", prof: "Idiomas", cluster: "idiomas", tag: null, desc: "Listening comprehension." },
      { time: "10:20 - 11:10", subject: "Prevención de las Violencias", room: "B-108", prof: "Cultura de Paz", cluster: "humanidades", tag: null, desc: "Convivencia pacífica." },
      { time: "11:10 - 12:00", subject: "Educación Física IV", room: "GIM1", prof: "Acondicionamiento", cluster: "arte", tag: "🟡 Condición Física", desc: "Tarea: ¿Qué es la condición física? y capacidades condicionales." },
      { time: "12:00 - 12:50", subject: "Física III", room: "B-115", prof: "Profra. Gabriela Reyna", cluster: "ciencias", tag: null, desc: "Teoría previa de laboratorio." },
      { time: "12:50 - 13:40", subject: "Física III (Laboratorio)", room: "Lab A-302", prof: "Profra. Gabriela Reyna", cluster: "ciencias", tag: "🔵 Bata Obligatoria", desc: "Laboratorio A-302 con bata blanca obligatoria." }
    ]
  };

  let activeClusterFilter = 'all';
  let activeDay = 1;

  // Renderizar la tabla central de clases
  function renderDesktopSchedule(dayNum) {
    activeDay = dayNum;
    const tableBody = document.getElementById('panoramicTableBody');
    if (!tableBody) return;

    // Actualizar botones de días
    document.querySelectorAll('.day-strip-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.getAttribute('data-day')) === dayNum);
    });

    const classes = DESKTOP_SCHEDULE[dayNum] || DESKTOP_SCHEDULE[1];
    tableBody.innerHTML = '';

    classes.forEach(c => {
      // Filtrar si hay un clúster activo
      if (activeClusterFilter !== 'all' && c.cluster !== activeClusterFilter) {
        return;
      }

      const isCrimson = c.tag && c.tag.includes('🔴');
      const tr = document.createElement('tr');
      tr.className = `class-row-interactive ${isCrimson ? 'has-crimson' : ''}`;
      tr.onclick = () => highlightClassDetails(c);

      tr.innerHTML = `
        <td style="font-weight:900; color:var(--unam-gold-bright); font-variant-numeric:tabular-nums; white-space:nowrap;">
          ⏰ ${c.time}
        </td>
        <td>
          <div style="font-weight:900; color:#fff; font-size:0.95rem;">${c.subject}</div>
          <span style="font-size:0.75rem; color:#94a3b8;">${c.prof}</span>
        </td>
        <td>
          <span class="cluster-tag-pill cluster-${c.cluster}">Bloque ${c.cluster.toUpperCase()}</span>
        </td>
        <td>
          <span style="background:rgba(0,122,255,0.15); color:#60a5fa; border:1px solid #007AFF; font-size:0.75rem; font-weight:900; padding:2px 8px; border-radius:6px;">
            📍 ${c.room}
          </span>
        </td>
        <td>
          ${c.tag ? `<span style="font-size:0.75rem; font-weight:900; color:${isCrimson ? '#ff6961' : '#fcd866'};">${c.tag}</span>` : '<span style="color:#64748b; font-size:0.75rem;">Sin entrega</span>'}
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }
  window.renderDesktopSchedule = renderDesktopSchedule;

  function highlightClassDetails(c) {
    const detailBox = document.getElementById('selectedClassDetailBox');
    if (detailBox) {
      detailBox.innerHTML = `
        <div style="background:rgba(213,159,15,0.12); border:1.5px solid var(--unam-gold); border-radius:14px; padding:1rem; margin-top:0.6rem; animation:fadeIn 0.2s ease;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <strong style="color:#fff; font-size:1rem;">${c.subject}</strong>
            <span style="background:#007AFF; color:#fff; font-size:0.7rem; font-weight:900; padding:2px 6px; border-radius:4px;">${c.room}</span>
          </div>
          <p style="font-size:0.84rem; color:#cbd5e1; line-height:1.45;">${c.desc}</p>
          <div style="font-size:0.74rem; color:var(--unam-gold-bright); margin-top:0.4rem; font-weight:800;">
            Profesor: ${c.prof} &bull; Horario: ${c.time}
          </div>
        </div>
      `;
    }
  }

  // Filtrado por Clústeres Funcionales
  function filterByCluster(clusterName) {
    activeClusterFilter = clusterName;
    document.querySelectorAll('.cluster-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cluster') === clusterName);
    });
    renderDesktopSchedule(activeDay);
  }
  window.filterByCluster = filterByCluster;

  // Sistema de Atajos de Teclado Profesionales
  function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Si el usuario está escribiendo en un input, ignorar atajos globales
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      const key = e.key.toUpperCase();
      if (key === '1') { filterByCluster('ciencias'); }
      else if (key === '2') { filterByCluster('humanidades'); }
      else if (key === '3') { filterByCluster('idiomas'); }
      else if (key === '4') { filterByCluster('arte'); }
      else if (key === '0' || key === 'ESCAPE') { filterByCluster('all'); }
      else if (key === 'T') {
        const rail = document.getElementById('urgencyHighwayBox');
        if (rail) rail.scrollIntoView({ behavior: 'smooth' });
      }
      else if (key === 'M') {
        const map = document.getElementById('campusMapPanel');
        if (map) map.scrollIntoView({ behavior: 'smooth' });
      }
      else if (key === 'L') {
        openDesktopAuth();
      }
    });
  }

  // Telemetría de reloj y semáforo Carmesí
  function updateDesktopTelemetry() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const timeEl = document.getElementById('desktopLiveTime');
    if (timeEl) timeEl.textContent = timeStr;

    // Conteo regresivo hacia el límite estricto de entrega de Historia (Lunes 12:50 PM)
    const target = new Date(2026, 8, 14, 12, 50, 0);
    const diff = target - now;
    const counterEl = document.getElementById('desktopCrimsonCountdown');
    if (counterEl) {
      if (diff <= 0) {
        counterEl.textContent = "Plazo concluido 12:50";
      } else {
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        counterEl.textContent = `${hrs}h ${mins}m ${secs}s restantes`;
      }
    }
  }

  // Auth Modal
  function openDesktopAuth() {
    const overlay = document.getElementById('desktopAuthModal');
    if (overlay) overlay.classList.add('active');
  }
  window.openDesktopAuth = openDesktopAuth;

  function closeDesktopAuth() {
    const overlay = document.getElementById('desktopAuthModal');
    if (overlay) overlay.classList.remove('active');
  }
  window.closeDesktopAuth = closeDesktopAuth;

  function simulateDesktopGoogleLogin() {
    const mockUser = { name: "Alumno 0415", email: "alumno415@unam.mx", provider: "google_identity" };
    localStorage.setItem('cuatreros_auth_token', "jwt_desktop_google_mock");
    localStorage.setItem('cuatreros_user_profile', JSON.stringify(mockUser));

    const btn = document.getElementById('btnDeskAuth');
    if (btn) btn.textContent = `👤 ${mockUser.name}`;

    alert("¡Sesión iniciada con éxito mediante Google Workspace UNAM!");
    closeDesktopAuth();
  }
  window.simulateDesktopGoogleLogin = simulateDesktopGoogleLogin;

  function handleDeskEmailLogin(e) {
    e.preventDefault();
    const email = document.getElementById('deskEmailInput').value;
    const mockUser = { name: email.split('@')[0], email: email, provider: "credentials" };
    localStorage.setItem('cuatreros_auth_token', "jwt_desktop_credentials");
    localStorage.setItem('cuatreros_user_profile', JSON.stringify(mockUser));

    const btn = document.getElementById('btnDeskAuth');
    if (btn) btn.textContent = `👤 ${mockUser.name}`;

    alert(`¡Bienvenido al Comando Espacial, ${mockUser.name}!`);
    closeDesktopAuth();
  }
  window.handleDeskEmailLogin = handleDeskEmailLogin;

  // Onboarding para Escritorio
  function checkDesktopOnboarding() {
    if (localStorage.getItem('cuatreros_desktop_onboarded') === null) {
      setTimeout(() => {
        const overlay = document.getElementById('desktopTourOverlay');
        if (overlay) overlay.classList.add('active');
      }, 750);
    }
  }

  function closeDesktopTour() {
    localStorage.setItem('cuatreros_desktop_onboarded', 'true');
    const overlay = document.getElementById('desktopTourOverlay');
    if (overlay) overlay.classList.remove('active');
  }
  window.closeDesktopTour = closeDesktopTour;

  document.addEventListener('DOMContentLoaded', () => {
    renderDesktopSchedule(1);
    updateDesktopTelemetry();
    setInterval(updateDesktopTelemetry, 1000);
    initKeyboardShortcuts();
    checkDesktopOnboarding();

    const saved = localStorage.getItem('cuatreros_user_profile');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        const btn = document.getElementById('btnDeskAuth');
        if (btn) btn.textContent = `👤 ${u.name}`;
      } catch (e) {}
    }
  });

})();
