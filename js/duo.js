/**
 * CONTROLADOR DE EXPERIENCIA PLEGABLE (iPHONE DUO) — GRUPO 415 (PREPA 4 UNAM)
 * 
 * Filosofía y funcionalidades:
 * - Detección y adaptación continua de dos posturas principales:
 *   - Pantalla exterior 5.4" (Modo Cerrado / Compacto)
 *   - Pantalla interior 7.6" plegable (Modo Abierto / Expandido)
 * - Motor de Horario en Vivo de Alta Precisión:
 *   - Cálculo de materia en curso, hora de inicio/fin, porcentaje de progreso visual
 *   - Contador regresivo en minutos ("X min restantes")
 *   - Detección de siguiente materia y transición automática sin recargar
 * - Soporte para CSS Viewport Segments y env(viewport-segment-*) con fallback transparente
 * - Sincronización de Sección A/B en LocalStorage
 * - Navegación táctil de alta ergonomía y modal accesible de hojas membretadas
 */

var DuoApp415 = (function () {
  'use strict';

  const STORAGE_KEY_SECTION = 'seccion_415_active';

  let state = {
    activeSection: 'A',
    posture: 'closed', // 'closed' (5.4") | 'open' (7.6")
    segmentsCount: 1
  };

  function getData() {
    if (typeof DataStore !== 'undefined' && typeof DataStore.getActiveData === 'function') {
      return DataStore.getActiveData();
    }
    return typeof GRUPO_415_DATA_DEFAULT !== 'undefined'
      ? GRUPO_415_DATA_DEFAULT
      : { materias: [], horarioSemanal: [], tareas: [], avisos: [], examenes: [], eventosCalendario: [], archivos: [] };
  }

  function init() {
    // 1. Cargar sección activa
    const savedSec = localStorage.getItem(STORAGE_KEY_SECTION);
    if (savedSec === 'A' || savedSec === 'B') {
      state.activeSection = savedSec;
    } else {
      state.activeSection = 'A';
      localStorage.setItem(STORAGE_KEY_SECTION, 'A');
    }

    updateSectionUI();
    updateDuoSectionBNotice();
    evaluateFoldState();
    startClockAndLiveTracker();
    initAmbientCanvas();
    setupEventListeners();

    console.info('[DuoApp415] Experiencia iPhone Duo inicializada con éxito.');
  }

  function setSection(sec) {
    if (sec !== 'A' && sec !== 'B') return;
    state.activeSection = sec;
    localStorage.setItem(STORAGE_KEY_SECTION, sec);
    updateSectionUI();
    renderLiveSchedule();
    updateDuoSectionBNotice();
  }

  function updateDuoSectionBNotice() {
    const noticeElId = 'duo-secb-notice-card';
    let existing = document.getElementById(noticeElId);

    let materiaId = null;
    const path = window.location.pathname;
    if (path.includes('duo-ingles')) materiaId = 'ingles';
    else if (path.includes('duo-dibujo')) materiaId = 'dibujo';
    else if (path.includes('duo-orientacion-educativa')) materiaId = 'orientacion-educativa';

    if (!materiaId || typeof DataStore === 'undefined' || !DataStore.debeMostrarAvisoSeccionB(materiaId, state.activeSection)) {
      if (existing) existing.remove();
      return;
    }

    if (!existing) {
      const zoneMain = document.querySelector('.duo-zone-main');
      if (!zoneMain) return;
      const data = getData();
      const mat = data.materias.find(function (m) { return m.id === materiaId; });
      const nombreMat = mat ? mat.nombre : materiaId;

      existing = document.createElement('div');
      existing.id = noticeElId;
      existing.className = 'duo-panel';
      existing.style.cssText = 'background:linear-gradient(145deg, rgba(62,28,107,0.88) 0%, rgba(27,11,46,0.96) 100%); border:1px solid var(--c-oro-border); box-shadow:0 8px 24px rgba(10,4,20,0.45);';
      existing.innerHTML = `
        <div style="display:flex; align-items:flex-start; gap:12px; margin-bottom:12px;">
          <span style="font-size:1.6rem; line-height:1;">📢</span>
          <div>
            <span style="font-size:0.72rem; font-weight:800; color:var(--c-oro); text-transform:uppercase; letter-spacing:0.08em; display:block; margin-bottom:4px;">
              Aviso para Sección B
            </span>
            <p style="margin:0; font-size:0.95rem; color:var(--c-hueso); font-weight:600; line-height:1.45;">
              Encardomy by Shaminket no cuenta con información de esta sección. Si tú la tienes, puedes apoyarnos.
            </p>
          </div>
        </div>
        <button type="button" class="duo-btn" onclick="ColaboracionSeccionB.abrir('${nombreMat}', '${materiaId}')" style="min-height:42px; font-weight:800; background:var(--c-oro); color:var(--c-obsidiana); border:none; width:100%; justify-content:center;">
          🤝 Ayúdanos con esta sección ›
        </button>
      `;

      zoneMain.prepend(existing);
    }
  }

  function updateSectionUI() {
    const btnA = document.getElementById('duo-btn-sec-a');
    const btnB = document.getElementById('duo-btn-sec-b');
    if (btnA && btnB) {
      btnA.classList.toggle('active', state.activeSection === 'A');
      btnB.classList.toggle('active', state.activeSection === 'B');
      btnA.setAttribute('aria-pressed', state.activeSection === 'A');
      btnB.setAttribute('aria-pressed', state.activeSection === 'B');
    }

    const secBadges = document.querySelectorAll('.duo-active-section-label');
    secBadges.forEach(el => { el.textContent = state.activeSection; });
  }

  /**
   * Evalúa si el dispositivo se encuentra en postura abierta o cerrada
   * considerando dimensiones del viewport y segmentos de pantalla reales
   */
  function evaluateFoldState() {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth || document.documentElement.clientWidth || 390;
    const height = window.innerHeight || document.documentElement.clientHeight || 844;

    // Comprobación de segmentos de viewport CSS si el navegador los expone
    let hasSegments = false;
    if (window.matchMedia) {
      const segMedia = window.matchMedia('(horizontal-viewport-segments: 2)');
      if (segMedia.matches) {
        hasSegments = true;
      }
    }

    // Heurística iPhone Duo:
    // Pantalla exterior de 5.4": viewport típicamente < 600px en ancho portrait
    // Pantalla interior de 7.6": viewport típicamente >= 680px en portrait o landscape
    const isExpanded = width >= 680 || hasSegments;
    state.posture = isExpanded ? 'open' : 'closed';
    state.segmentsCount = hasSegments ? 2 : 1;

    // Actualizar clases de estado en el elemento raíz/body
    if (document.body) {
      document.body.classList.toggle('duo-state-compact', !isExpanded);
      document.body.classList.toggle('duo-state-expanded', isExpanded);
      document.body.classList.toggle('duo-segments-dual', hasSegments);
    }

    const postureBadge = document.getElementById('duo-posture-badge-text');
    if (postureBadge) {
      postureBadge.textContent = isExpanded ? '7.6" Abierto' : '5.4" Cerrado';
    }
  }

  function startClockAndLiveTracker() {
    function updateClock() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      const clockEls = document.querySelectorAll('#duo-live-clock, .duo-live-clock');
      clockEls.forEach(el => { el.textContent = timeStr; });
    }

    updateClock();
    setInterval(updateClock, 1000);

    renderLiveSchedule();
    // Actualizar cálculo de horario y barra de avance cada segundo en tiempo real
    setInterval(renderLiveSchedule, 1000);
  }

  /**
   * Renderiza el componente de horario con línea de tiempo y progreso
   */
  function renderLiveSchedule() {
    const hero = document.getElementById('duo-hero-dynamic-content');
    if (!hero) return;

    const data = getData();
    const horario = data.horarioSemanal || [];
    const now = new Date();
    const day = now.getDay(); // 0 Dom, 1 Lun... 6 Sáb
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const diasNombres = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaHoy = diasNombres[day] || 'Lunes';

    // Fin de semana
    if (day === 0 || day === 6) {
      hero.innerHTML = `
        <div class="duo-hero-top">
          <span class="duo-hero-state-pill" style="color:var(--c-oro); background:var(--c-oro-soft); border-color:var(--c-oro-border);">
            Fin de Semana
          </span>
          <span class="duo-hero-clock duo-live-clock">--:--:--</span>
        </div>
        <h2 class="duo-subject-title">Sin clases activas hoy</h2>
        <p style="margin:0; font-size:0.85rem; color:var(--c-hueso-secondary); line-height:1.45;">
          Las clases del Grupo 415 se reanudan el próximo lunes a las 07:00 hrs. Consulta el horario completo en la pestaña correspondiente.
        </p>
        <div style="margin-top:6px;">
          <a href="duo-calendario.html" class="duo-btn secondary" style="width:100%; min-height:42px;">
            Ver Horario Semanal ›
          </a>
        </div>
      `;
      return;
    }

    // Filtrar clases de hoy para la sección activa (1 = Lunes ... 5 = Viernes)
    const clasesHoy = (day >= 1 && day <= 5) ? horario.filter(h => {
      const matchDia = (h.dia === day || h.diaNombre === diaHoy);
      const matchSec = (h.seccion === null || h.seccion === 'Todas' || h.seccion === 'Ambas' || h.seccion === state.activeSection);
      return matchDia && matchSec;
    }).sort((a, b) => {
      const [ha, ma] = a.inicio.split(':').map(Number);
      const [hb, mb] = b.inicio.split(':').map(Number);
      return (ha * 60 + ma) - (hb * 60 + mb);
    }) : [];

    let claseActual = null;
    let siguienteClase = null;

    for (const c of clasesHoy) {
      const [ih, im] = c.inicio.split(':').map(Number);
      const [fh, fm] = c.fin.split(':').map(Number);
      const startMins = ih * 60 + im;
      const endMins = fh * 60 + fm;

      if (currentMins >= startMins && currentMins < endMins) {
        claseActual = c;
        claseActual.startMins = startMins;
        claseActual.endMins = endMins;
      } else if (currentMins < startMins && !siguienteClase) {
        siguienteClase = c;
        siguienteClase.startMins = startMins;
      }
    }

    if (claseActual) {
      const matActual = data.materias.find(m => m.id === claseActual.materiaId);
      const nombreActual = matActual ? matActual.nombre : claseActual.materiaId;
      const matSig = siguienteClase ? data.materias.find(m => m.id === siguienteClase.materiaId) : null;
      const nombreSig = matSig ? matSig.nombre : (siguienteClase ? siguienteClase.materiaId : '');

      const totalDur = claseActual.endMins - claseActual.startMins;
      const elapsed = Math.max(0, currentMins - claseActual.startMins);
      const remaining = Math.max(0, claseActual.endMins - currentMins);
      const pct = Math.min(100, Math.max(0, Math.round((elapsed / totalDur) * 100)));

      hero.innerHTML = `
        <div class="duo-hero-top">
          <span class="duo-hero-state-pill">
            <span class="duo-posture-dot"></span> EN CURSO · SEC. ${state.activeSection}
          </span>
          <span class="duo-hero-clock duo-live-clock">--:--:--</span>
        </div>

        <div>
          <h2 class="duo-subject-title">${nombreActual}</h2>
          <div class="duo-subject-meta">
            <span>Salón: <strong style="color:var(--c-hueso);">${claseActual.salon || 'Por confirmar'}</strong></span>
            <span>•</span>
            <span>Horario: <strong style="color:var(--c-oro); font-family:var(--font-family-mono);">${claseActual.inicio} – ${claseActual.fin}</strong></span>
          </div>
        </div>

        <!-- Línea temporal con barra de progreso interactiva -->
        <div class="duo-timeline-container">
          <div class="duo-timeline-times">
            <span>${claseActual.inicio}</span>
            <span>${pct}% transcurrido</span>
            <span>${claseActual.fin}</span>
          </div>
          <div class="duo-timeline-track">
            <div class="duo-timeline-fill" style="width:${pct}%;"></div>
          </div>
          <div class="duo-timeline-footer">
            <span>Inició hace ${elapsed} min</span>
            <span class="duo-countdown-text">Quedan ${remaining} min restantes</span>
          </div>
        </div>

        ${siguienteClase ? `
          <div class="duo-next-class-bar">
            <span style="color:var(--c-hueso-tertiary);">Siguiente materia:</span>
            <strong style="color:var(--c-hueso);">${nombreSig} (${siguienteClase.inicio})</strong>
          </div>
        ` : ''}
      `;
    } else if (siguienteClase) {
      const matSig = data.materias.find(m => m.id === siguienteClase.materiaId);
      const nombreSig = matSig ? matSig.nombre : siguienteClase.materiaId;
      const minsUntil = siguienteClase.startMins - currentMins;
      hero.innerHTML = `
        <div class="duo-hero-top">
          <span class="duo-hero-state-pill" style="color:var(--c-oro); background:var(--c-oro-soft); border-color:var(--c-oro-border);">
            Próxima Clase · Sec. ${state.activeSection}
          </span>
          <span class="duo-hero-clock duo-live-clock">--:--:--</span>
        </div>

        <div>
          <h2 class="duo-subject-title">${nombreSig}</h2>
          <div class="duo-subject-meta">
            <span style="color:var(--c-oro); font-weight:700;">Inicia a las ${siguienteClase.inicio} hrs</span>
            <span>•</span>
            <span>Salón: <strong>${siguienteClase.salon || 'Por confirmar'}</strong></span>
          </div>
        </div>

        <div style="background:rgba(42,45,52,0.5); border-radius:10px; padding:10px 14px; font-size:0.82rem; color:var(--c-oro);">
          ⏳ Inicia en <strong>${minsUntil} minutos</strong>
        </div>
      `;
    } else {
      hero.innerHTML = `
        <div class="duo-hero-top">
          <span class="duo-hero-state-pill" style="color:var(--c-cempasuchil); background:rgba(255,122,0,0.12); border-color:rgba(255,122,0,0.3);">
            Jornada Concluida
          </span>
          <span class="duo-hero-clock duo-live-clock">--:--:--</span>
        </div>
        <h2 class="duo-subject-title">Clases de hoy finalizadas</h2>
        <p style="margin:0; font-size:0.85rem; color:var(--c-hueso-secondary); line-height:1.45;">
          Has concluido tus sesiones del día para la Sección ${state.activeSection}. Revisa las tareas pendientes de entrega.
        </p>
      `;
    }
  }

  function setupEventListeners() {
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        evaluateFoldState();
        renderLiveSchedule();
      }, 150);
    }, { passive: true });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        evaluateFoldState();
        renderLiveSchedule();
      }, 100);
    }, { passive: true });

    // Escuchar visualViewport si está soportado
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => {
        evaluateFoldState();
      }, { passive: true });
    }
  }

  function abrirModalHojas() {
    const modal = document.getElementById('duo-modal-hojas');
    if (!modal) return;
    modal.classList.add('active');
    const input = document.getElementById('duo-input-nombre-apellidos');
    if (input) {
      setTimeout(() => input.focus(), 100);
    }
  }

  function cerrarModalHojas() {
    const modal = document.getElementById('duo-modal-hojas');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  function confirmarEnvioHojasWhatsApp() {
    const input = document.getElementById('duo-input-nombre-apellidos');
    if (!input) return;
    const nombre = input.value.trim();
    if (!nombre) {
      input.focus();
      input.style.borderColor = '#FF3B30';
      return;
    }

    const tel = '525571985641';
    const msg = `Hola, soy ${nombre} y vengo desde la página del 415 para solicitar información sobre las hojas membretadas.`;
    const url = `https://wa.me/${tel}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    cerrarModalHojas();
    input.value = '';
    input.style.borderColor = '';
  }

  function initAmbientCanvas() {
    const canvas = document.getElementById('duo-ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height;
    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.35 - 0.05,
        alpha: Math.random() * 0.3 + 0.1,
        color: Math.random() > 0.5 ? '255, 122, 0' : '229, 169, 60'
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      }
      requestAnimationFrame(render);
    }
    render();
  }

  // Auto-inicio
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  return {
    init: init,
    setSection: setSection,
    evaluateFoldState: evaluateFoldState,
    abrirModalHojas: abrirModalHojas,
    cerrarModalHojas: cerrarModalHojas,
    confirmarEnvioHojasWhatsApp: confirmarEnvioHojasWhatsApp,
    renderLiveSchedule: renderLiveSchedule
  };
})();

if (typeof window !== 'undefined') {
  window.DuoApp415 = DuoApp415;
}
