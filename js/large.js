/**
 * CONTROLADOR DE EXPERIENCIA GRAN FORMATO (iMac, Studio Display, 4K/5K/6K, TV)
 * Grupo 415 — Prepa 4 UNAM
 * 
 * Consume DataStore de js/data.js como fuente única de verdad.
 * Proporciona soporte para mouse, trackpad, teclado integral (⌘K / Esc / Enter),
 * control remoto de Smart TV y dispositivos táctiles de gran escala.
 */

var LargeApp415 = (function () {
  'use strict';

  const STORAGE_KEY_SECTION = 'seccion_415_active';

  let state = {
    activeSection: 'A',
    searchQuery: ''
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
    updateLargeSectionBNotice();
    setupKeyboardAndRemoteNav();
    startClockAndLiveTracker();
    initAmbientCanvas();

    console.info('[LargeApp415] Experiencia Gran Formato inicializada con éxito.');
  }

  function setSection(sec) {
    if (sec !== 'A' && sec !== 'B') return;
    state.activeSection = sec;
    localStorage.setItem(STORAGE_KEY_SECTION, sec);
    updateSectionUI();

    if (typeof renderLargeLiveHero === 'function') {
      renderLargeLiveHero();
    }
    const secBadges = document.querySelectorAll('.large-active-section-label');
    secBadges.forEach(el => { el.textContent = sec; });
    updateLargeSectionBNotice();
  }

  function updateLargeSectionBNotice() {
    const noticeElId = 'large-secb-notice-card';
    let existing = document.getElementById(noticeElId);

    let materiaId = null;
    const path = window.location.pathname;
    if (path.includes('imac-ingles')) materiaId = 'ingles';
    else if (path.includes('imac-dibujo')) materiaId = 'dibujo';
    else if (path.includes('imac-orientacion-educativa')) materiaId = 'orientacion-educativa';

    if (!materiaId || typeof DataStore === 'undefined' || !DataStore.debeMostrarAvisoSeccionB(materiaId, state.activeSection)) {
      if (existing) existing.remove();
      return;
    }

    if (!existing) {
      const stageBody = document.querySelector('.large-stage-body');
      if (!stageBody) return;
      const data = getData();
      const mat = data.materias.find(function (m) { return m.id === materiaId; });
      const nombreMat = mat ? mat.nombre : materiaId;

      existing = document.createElement('div');
      existing.id = noticeElId;
      existing.className = 'large-panel';
      existing.style.cssText = 'background:linear-gradient(145deg, rgba(62,28,107,0.88) 0%, rgba(27,11,46,0.96) 100%); border:1px solid var(--c-oro-border); margin-bottom:24px; box-shadow:0 8px 24px rgba(10,4,20,0.45);';
      existing.innerHTML = `
        <div style="display:flex; align-items:flex-start; gap:16px; margin-bottom:16px;">
          <span style="font-size:2rem; line-height:1;">📢</span>
          <div>
            <span style="font-size:var(--text-large-meta); font-weight:800; color:var(--c-oro); text-transform:uppercase; letter-spacing:0.1em; display:block; margin-bottom:6px;">
              Aviso para Sección B
            </span>
            <p style="margin:0; font-size:1.15rem; color:var(--c-hueso); font-weight:600; line-height:1.45;">
              Encardomy by Shaminket no cuenta con información de esta sección. Si tú la tienes, puedes apoyarnos.
            </p>
          </div>
        </div>
        <button type="button" class="large-action-btn" onclick="ColaboracionSeccionB.abrir('${nombreMat}', '${materiaId}')" style="height:46px; font-weight:800; background:var(--c-oro); color:var(--c-obsidiana); border:none; font-size:0.92rem;">
          🤝 Ayúdanos con esta sección ›
        </button>
      `;

      const grid = stageBody.querySelector('div[style*="display:grid"]');
      if (grid) {
        stageBody.insertBefore(existing, grid);
      } else {
        stageBody.prepend(existing);
      }
    }
  }

  function updateSectionUI() {
    const btnA = document.getElementById('large-btn-sec-a');
    const btnB = document.getElementById('large-btn-sec-b');
    if (btnA && btnB) {
      btnA.classList.toggle('active', state.activeSection === 'A');
      btnB.classList.toggle('active', state.activeSection === 'B');
      btnA.setAttribute('aria-pressed', state.activeSection === 'A');
      btnB.setAttribute('aria-pressed', state.activeSection === 'B');
    }

    const secBadges = document.querySelectorAll('.large-active-section-label');
    secBadges.forEach(el => { el.textContent = state.activeSection; });
  }

  function setupKeyboardAndRemoteNav() {
    document.addEventListener('keydown', function (e) {
      // ⌘K o Ctrl+K para búsqueda global
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        window.location.href = 'imac-buscar.html';
        return;
      }

      // Escape para cerrar modal
      if (e.key === 'Escape') {
        cerrarModalHojas();
      }

      // Enter en el modal para enviar
      const modal = document.getElementById('large-modal-hojas');
      if (modal && modal.classList.contains('active') && e.key === 'Enter') {
        const activeInput = document.activeElement;
        if (activeInput && activeInput.id === 'large-input-nombre-apellidos') {
          e.preventDefault();
          confirmarEnvioHojasWhatsApp();
        }
      }
    });
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
      const clockEls = document.querySelectorAll('#large-live-clock, .large-live-clock');
      clockEls.forEach(el => { el.textContent = timeStr; });
    }

    updateClock();
    setInterval(updateClock, 1000);

    // Actualizar live hero de horario en tiempo real cada segundo
    renderLargeLiveHero();
    setInterval(renderLargeLiveHero, 1000);
  }

  function renderLargeLiveHero() {
    const heroContent = document.getElementById('large-hero-dynamic-content');
    if (!heroContent) return;

    const data = getData();
    const horario = data.horarioSemanal || [];
    const now = new Date();
    const day = now.getDay(); // 0 Dom, 1 Lun... 5 Vie
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const diasNombres = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaHoy = diasNombres[day] || 'Lunes';

    if (day === 0 || day === 6) {
      heroContent.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:20px;">
          <div>
            <div style="font-size:var(--text-large-meta); font-weight:800; color:var(--c-oro); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:8px;">
              Fin de Semana · Turno Matutino
            </div>
            <h2 style="font-size:var(--text-large-title1); font-weight:800; margin:0 0 10px 0; color:var(--c-hueso); letter-spacing:-0.02em;">
              No hay clases activas en este momento
            </h2>
            <p style="margin:0; font-size:var(--text-large-body); color:var(--c-hueso-secondary); max-width:65ch;">
              Las actividades académicas de la Prepa 4 se reanudan el próximo lunes a las 07:00 hrs. Consulta el cronograma semanal en el panel lateral.
            </p>
          </div>
          <div style="display:flex; gap:12px; align-items:center;">
            <a href="imac-calendario.html" class="large-action-btn secondary" style="min-height:44px; padding:10px 20px;">
              Ver Horario Semanal ›
            </a>
          </div>
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

      heroContent.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:24px;">
          <div>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
              <span class="large-live-dot"></span>
              <span style="font-size:var(--text-large-meta); font-weight:800; color:#34C759; text-transform:uppercase; letter-spacing:0.12em;">
                CLASE EN CURSO AHORA · SECCIÓN ${state.activeSection}
              </span>
            </div>
            <h2 style="font-size:var(--text-large-title1); font-weight:800; margin:0 0 10px 0; color:var(--c-hueso); letter-spacing:-0.02em;">
              ${nombreActual}
            </h2>
            <div style="display:flex; flex-wrap:wrap; gap:16px; font-size:var(--text-large-body); color:var(--c-hueso-secondary); align-items:center;">
              <span style="color:var(--c-oro); font-weight:700; font-family:var(--font-family-mono);">${claseActual.inicio} – ${claseActual.fin} hrs</span>
              <span>•</span>
              <span>Aula / Laboratorio: <strong>${claseActual.salon || 'Por confirmar'}</strong></span>
              <span>•</span>
              <span>Docente: <strong>${(matActual && matActual.profesor) || 'Docente titular'}</strong></span>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
            ${siguienteClase ? `
              <div style="background:rgba(42,45,52,0.6); border:1px solid var(--c-large-border); border-radius:12px; padding:10px 16px; font-size:var(--text-large-meta);">
                <span style="color:var(--c-hueso-tertiary);">Siguiente:</span>
                <strong style="color:var(--c-hueso); margin-left:6px;">${nombreSig}</strong>
                <span style="color:var(--c-oro); margin-left:6px; font-family:var(--font-family-mono);">(${siguienteClase.inicio})</span>
              </div>
            ` : ''}
            <a href="imac-calendario.html" class="large-action-btn secondary" style="min-height:42px; padding:8px 18px; font-size:0.9rem;">
              Ver Horario Completo ›
            </a>
          </div>
        </div>
      `;
    } else if (siguienteClase) {
      const matSig = data.materias.find(m => m.id === siguienteClase.materiaId);
      const nombreSig = matSig ? matSig.nombre : siguienteClase.materiaId;

      heroContent.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:24px;">
          <div>
            <div style="font-size:var(--text-large-meta); font-weight:800; color:var(--c-oro); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:8px;">
              Próxima Clase · Hoy ${diaHoy} · Sección ${state.activeSection}
            </div>
            <h2 style="font-size:var(--text-large-title1); font-weight:800; margin:0 0 10px 0; color:var(--c-hueso); letter-spacing:-0.02em;">
              ${nombreSig}
            </h2>
            <div style="display:flex; flex-wrap:wrap; gap:16px; font-size:var(--text-large-body); color:var(--c-hueso-secondary); align-items:center;">
              <span style="color:var(--c-oro); font-weight:700; font-family:var(--font-family-mono);">${siguienteClase.inicio} hrs</span>
              <span>•</span>
              <span>Aula: <strong>${siguienteClase.salon || 'Asignada'}</strong></span>
              <span>•</span>
              <span>Docente: <strong>${(matSig && matSig.profesor) || 'Docente titular'}</strong></span>
            </div>
          </div>
          <a href="imac-calendario.html" class="large-action-btn secondary" style="min-height:44px; padding:10px 20px;">
            Ver Horario Completo ›
          </a>
        </div>
      `;
    } else {
      heroContent.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:20px;">
          <div>
            <div style="font-size:var(--text-large-meta); font-weight:800; color:var(--c-cempasuchil); text-transform:uppercase; letter-spacing:0.12em; margin-bottom:8px;">
              Jornada Concluida · Prepa 4
            </div>
            <h2 style="font-size:var(--text-large-title1); font-weight:800; margin:0 0 10px 0; color:var(--c-hueso); letter-spacing:-0.02em;">
              Clases de hoy finalizadas para la Sección ${state.activeSection}
            </h2>
            <p style="margin:0; font-size:var(--text-large-body); color:var(--c-hueso-secondary); max-width:65ch;">
              Revisa tus tareas y entregas pendientes para mañana en el panel de avisos o accede a la biblioteca de archivos.
            </p>
          </div>
          <a href="imac-calendario.html" class="large-action-btn secondary" style="min-height:44px; padding:10px 20px;">
            Ver Horario de Mañana ›
          </a>
        </div>
      `;
    }
  }

  function abrirModalHojas() {
    const modal = document.getElementById('large-modal-hojas');
    if (!modal) return;
    modal.classList.add('active');
    const input = document.getElementById('large-input-nombre-apellidos');
    if (input) {
      setTimeout(() => input.focus(), 100);
    }
  }

  function cerrarModalHojas() {
    const modal = document.getElementById('large-modal-hojas');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  function confirmarEnvioHojasWhatsApp() {
    const input = document.getElementById('large-input-nombre-apellidos');
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
    const canvas = document.getElementById('large-ambient-canvas');
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

    // Partículas doradas / cempasúchil flotantes
    const particles = [];
    const count = Math.min(28, Math.floor(width / 90));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        alpha: Math.random() * 0.35 + 0.1,
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

  // Auto-inicialización
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
    abrirModalHojas: abrirModalHojas,
    cerrarModalHojas: cerrarModalHojas,
    confirmarEnvioHojasWhatsApp: confirmarEnvioHojasWhatsApp,
    renderLiveHero: renderLargeLiveHero
  };
})();

// Alias para compatibilidad con código que invoque DesktopApp415
if (typeof window !== 'undefined') {
  window.LargeApp415 = LargeApp415;
  if (!window.DesktopApp415) {
    window.DesktopApp415 = LargeApp415;
  }
}
