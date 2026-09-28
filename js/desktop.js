/**
 * CONTROLADOR DE EXPERIENCIA COMPUTADORA (MAC & DESKTOP) — GRUPO 415 (PREPA 4 UNAM)
 * Diseñado para mouse, trackpad, teclado, monitores Ultrawide y laptops.
 * Consume DataStore de js/data.js como fuente única de verdad.
 */

var DesktopApp415 = (function () {
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
    return typeof GRUPO_415_DATA_DEFAULT !== 'undefined' ? GRUPO_415_DATA_DEFAULT : { materias: [], horarioSemanal: [], tareas: [], avisos: [], examenes: [], eventosCalendario: [], archivos: [] };
  }

  function init() {
    // 1. Cargar sección
    const savedSec = localStorage.getItem(STORAGE_KEY_SECTION);
    if (savedSec === 'A' || savedSec === 'B') {
      state.activeSection = savedSec;
    } else {
      state.activeSection = 'A';
      localStorage.setItem(STORAGE_KEY_SECTION, 'A');
    }

    updateSectionUI();
    updateDesktopSectionBNotice();
    setupKeyboardShortcuts();
    startClockAndLiveTracker();
    initAmbientCanvas();

    console.info('[DesktopApp415] Experiencia de Computadora inicializada con éxito.');
  }

  function setSection(sec) {
    if (sec !== 'A' && sec !== 'B') return;
    state.activeSection = sec;
    localStorage.setItem(STORAGE_KEY_SECTION, sec);
    updateSectionUI();

    // Notificar o refrescar vistas si existen hooks específicos
    if (typeof renderDesktopLiveHero === 'function') {
      renderDesktopLiveHero();
    }
    const secBadges = document.querySelectorAll('.desktop-active-section-label');
    secBadges.forEach(el => { el.textContent = sec; });
    updateDesktopSectionBNotice();
  }

  function updateSectionUI() {
    const btnA = document.getElementById('desktop-btn-sec-a');
    const btnB = document.getElementById('desktop-btn-sec-b');
    if (btnA && btnB) {
      btnA.classList.toggle('active', state.activeSection === 'A');
      btnB.classList.toggle('active', state.activeSection === 'B');
    }
  }

  function updateDesktopSectionBNotice() {
    const noticeElId = 'desktop-secb-notice-card';
    let existing = document.getElementById(noticeElId);

    let materiaId = null;
    const path = window.location.pathname;
    if (path.includes('mac-ingles')) materiaId = 'ingles';
    else if (path.includes('mac-dibujo')) materiaId = 'dibujo';
    else if (path.includes('mac-orientacion-educativa')) materiaId = 'orientacion-educativa';

    if (!materiaId || typeof DataStore === 'undefined' || !DataStore.debeMostrarAvisoSeccionB(materiaId, state.activeSection)) {
      if (existing) existing.remove();
      return;
    }

    if (!existing) {
      const stageBody = document.querySelector('.desktop-stage-body');
      if (!stageBody) return;
      const data = getData();
      const mat = data.materias.find(function (m) { return m.id === materiaId; });
      const nombreMat = mat ? mat.nombre : materiaId;

      existing = document.createElement('div');
      existing.id = noticeElId;
      existing.style.cssText = 'background:linear-gradient(145deg, rgba(62,28,107,0.88) 0%, rgba(27,11,46,0.96) 100%); border:1px solid var(--c-oro-border); border-radius:var(--desktop-radius-card); padding:20px 24px; margin-bottom:22px; box-shadow:0 8px 24px rgba(10,4,20,0.45);';
      existing.innerHTML = `
        <div style="display:flex; align-items:flex-start; gap:14px; margin-bottom:14px;">
          <span style="font-size:1.8rem; line-height:1;">📢</span>
          <div>
            <span style="font-size:0.75rem; font-weight:800; color:var(--c-oro); text-transform:uppercase; letter-spacing:0.1em; display:block; margin-bottom:4px;">
              Aviso para Sección B
            </span>
            <p style="margin:0; font-size:1.02rem; color:var(--c-hueso); font-weight:600; line-height:1.45;">
              Encardomy by Shaminket no cuenta con información de esta sección. Si tú la tienes, puedes apoyarnos.
            </p>
          </div>
        </div>
        <button type="button" class="desktop-action-btn" onclick="ColaboracionSeccionB.abrir('${nombreMat}', '${materiaId}')" style="height:42px; font-weight:800; background:var(--c-oro); color:var(--c-obsidiana); border:none;">
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

  /**
   * Atajos de teclado ergonómicos de escritorio
   */
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // 1. Esc para cerrar modales
      if (e.key === 'Escape') {
        cerrarModalHojas();
      }

      // 2. Cmd+K o Ctrl+K o '/' para búsqueda rápida
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('desktop-search-input') || document.getElementById('desktop-global-search-input');
        if (searchInput) {
          searchInput.focus();
        } else {
          window.location.href = 'mac-buscar.html';
        }
      }

      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('desktop-search-input') || document.getElementById('desktop-global-search-input');
        if (searchInput) searchInput.focus();
        else window.location.href = 'mac-buscar.html';
      }
    });

    // Enter dentro del input del modal envía automáticamente
    const inpModal = document.getElementById('desktop-input-nombre-apellidos');
    if (inpModal) {
      inpModal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          confirmarEnvioHojasWhatsApp();
        }
      });
    }
  }

  /**
   * Reloj y seguimiento en vivo (#AHORA y #DESPUÉS)
   */
  function startClockAndLiveTracker() {
    updateClock();
    updateLiveClassBanner();

    setInterval(() => {
      updateClock();
      updateLiveClassBanner();
    }, 1000);
  }

  function updateClock() {
    const clockEl = document.getElementById('desktop-live-clock');
    if (!clockEl) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;
  }

  function updateLiveClassBanner() {
    const targetEl = document.getElementById('desktop-hero-dynamic-content');
    if (!targetEl) return;

    const data = getData();
    const sec = state.activeSection;
    const now = new Date();
    const day = now.getDay();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const curTimeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const curTotalSec = h * 3600 + m * 60 + s;

    let claseActual = null;
    let siguienteClase = null;
    let minutosTerminar = null;
    let minutosSiguiente = null;
    let porcentaje = 0;

    if (day >= 1 && day <= 5) {
      const clasesDelDia = data.horarioSemanal.filter(c => c.dia === day && (c.seccion === null || c.seccion === sec));
      clasesDelDia.sort((a, b) => a.inicio.localeCompare(b.inicio));
      const curTotalMin = h * 60 + m;

      for (let i = 0; i < clasesDelDia.length; i++) {
        const c = clasesDelDia[i];
        const [iniH, iniM] = c.inicio.split(':').map(Number);
        const [finH, finM] = c.fin.split(':').map(Number);
        const iniTotalMin = iniH * 60 + iniM;
        const finTotalMin = finH * 60 + finM;

        if (curTotalMin >= iniTotalMin && curTotalMin < finTotalMin) {
          claseActual = c;
          minutosTerminar = Math.max(0, finTotalMin - curTotalMin);
          const duracionTotalSec = (finTotalMin - iniTotalMin) * 60;
          const transcurridoSec = Math.max(0, curTotalSec - (iniTotalMin * 60));
          porcentaje = Math.min(100, Math.max(0, Math.round((transcurridoSec / duracionTotalSec) * 100)));
        } else if (curTotalMin < iniTotalMin && !siguienteClase) {
          siguienteClase = c;
          minutosSiguiente = iniTotalMin - curTotalMin;
        }
      }
    }

    if (claseActual) {
      const mat = data.materias.find(m => m.id === claseActual.materiaId);
      const matNombre = mat ? mat.nombre : claseActual.materiaId;

      targetEl.innerHTML = `
        <div class="desktop-live-hero-grid">
          <div>
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:0.7rem; font-weight:900; background:var(--c-cempasuchil); color:var(--c-obsidiana); padding:3px 10px; border-radius:var(--radius-pill); text-transform:uppercase; letter-spacing:0.1em;">
                ● AHORA EN CLASE
              </span>
              <span style="font-family:var(--font-family-mono); font-size:0.85rem; color:var(--c-oro); font-weight:700;">${claseActual.inicio} - ${claseActual.fin}</span>
            </div>
            <div class="desktop-live-subject-title">${matNombre}</div>
            <div style="font-size:0.88rem; color:var(--c-hueso-secondary); display:flex; gap:16px;">
              <span>Salón: <strong style="color:var(--c-hueso);">${claseActual.salon}</strong> (Sec. ${sec})</span>
              <span>⏳ Quedan <strong style="color:var(--c-hueso);">${minutosTerminar} min</strong></span>
            </div>
            <div class="desktop-progress-bar-wrap">
              <div class="desktop-progress-bar-fill" style="width: ${porcentaje}%;"></div>
            </div>
          </div>

          <div style="background:rgba(11,12,16,0.6); border:1px solid var(--c-copal-line); border-radius:var(--radius-md); padding:18px 20px;">
            <span style="font-size:0.7rem; font-weight:800; color:var(--c-oro); text-transform:uppercase; letter-spacing:0.1em; display:block; margin-bottom:4px;">
              # DESPUÉS EN EL HORARIO
            </span>
            ${siguienteClase ? `
              <div style="font-size:1.15rem; font-weight:700; color:var(--c-hueso);">
                ${(data.materias.find(m => m.id === siguienteClase.materiaId) || {}).nombre || siguienteClase.materiaId}
              </div>
              <div style="font-size:0.85rem; color:var(--c-hueso-secondary); margin-top:4px;">
                Salón ${siguienteClase.salon} · Inicia a las <strong>${siguienteClase.inicio}</strong> (en ${minutosSiguiente} min)
              </div>
            ` : `
              <div style="font-size:0.9rem; color:var(--c-hueso-tertiary);">
                Jornada académica concluida por hoy.
              </div>
            `}
          </div>
        </div>
      `;
    } else {
      let detalle = 'Revisa tu horario completo para consultar la próxima sesión matutina.';
      if (day === 0 || day === 6) {
        detalle = 'Fin de Semana · Próxima jornada el Lunes a las 07:00 AM';
      } else if (curTimeStr < '07:00') {
        detalle = 'La primera clase del día comienza a las 07:00 AM';
      } else if (curTimeStr >= '13:40') {
        detalle = 'Jornada escolar concluida por hoy en el turno matutino.';
      }

      targetEl.innerHTML = `
        <div class="desktop-live-hero-grid">
          <div>
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:0.7rem; font-weight:800; background:rgba(247,244,238,0.1); color:var(--c-hueso); padding:3px 10px; border-radius:var(--radius-pill); text-transform:uppercase;">
                ⏸ Pausa / Sin clase
              </span>
              <span style="font-family:var(--font-family-mono); font-size:0.85rem; color:var(--c-hueso-tertiary); font-weight:700;">${curTimeStr}</span>
            </div>
            <div class="desktop-live-subject-title" style="font-size:1.6rem;">Intermedio / Fuera de horario</div>
            <div style="font-size:0.9rem; color:var(--c-hueso-secondary);">${detalle}</div>
          </div>

          <div style="background:rgba(11,12,16,0.6); border:1px solid var(--c-copal-line); border-radius:var(--radius-md); padding:18px 20px;">
            <span style="font-size:0.7rem; font-weight:800; color:var(--c-oro); text-transform:uppercase; letter-spacing:0.1em; display:block; margin-bottom:4px;">
              # PRÓXIMA SESIÓN
            </span>
            ${siguienteClase ? `
              <div style="font-size:1.15rem; font-weight:700; color:var(--c-hueso);">
                ${(data.materias.find(m => m.id === siguienteClase.materiaId) || {}).nombre || siguienteClase.materiaId}
              </div>
              <div style="font-size:0.85rem; color:var(--c-hueso-secondary); margin-top:4px;">
                Salón ${siguienteClase.salon} · Inicia a las <strong>${siguienteClase.inicio}</strong> (en ${minutosSiguiente} min)
              </div>
            ` : `
              <div style="font-size:0.9rem; color:var(--c-hueso-tertiary);">
                Consulta el calendario institucional para fechas de evaluación.
              </div>
            `}
          </div>
        </div>
      `;
    }
  }

  /**
   * Modal de Hojas Membretadas
   */
  function abrirModalHojas() {
    const modal = document.getElementById('desktop-modal-hojas');
    if (modal) {
      modal.style.display = 'flex';
      const inp = document.getElementById('desktop-input-nombre-apellidos');
      if (inp) setTimeout(() => inp.focus(), 100);
    }
  }

  function cerrarModalHojas() {
    const modal = document.getElementById('desktop-modal-hojas');
    if (modal) modal.style.display = 'none';
  }

  function confirmarEnvioHojasWhatsApp() {
    const inp = document.getElementById('desktop-input-nombre-apellidos');
    const nombre = inp ? inp.value.trim() : '';
    if (!nombre) {
      mostrarToast('Por favor escribe tu nombre completo');
      if (inp) inp.focus();
      return;
    }
    const msg = encodeURIComponent(`Hola, soy ${nombre} y vengo desde la página del 415 para solicitar información sobre las hojas membretadas.`);
    const url = `https://wa.me/525571985641?text=${msg}`;
    cerrarModalHojas();
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Copiar Prompt de IA con portapapeles
   */
  function copiarPromptIA() {
    const data = getData();
    const promptTexto = data.promptResolucionEjercicios ? data.promptResolucionEjercicios.texto : `Actúa como un profesor y tutor académico experto. A continuación te adjunto una imagen/documento con ejercicios académicos. Por favor:

1. Analiza cuidadosamente los ejercicios adjuntos e identifica con precisión qué se está solicitando en cada uno.
2. Si alguna parte de la imagen o texto adjunto no es claramente legible o tiene ambigüedad, indícalo expresamente antes de asumir datos.
3. Respeta exactamente las instrucciones, restricciones y formato solicitados en el enunciado original. No inventes información, datos ni variables que no aparezcan en el documento.
4. Resuelve cada ejercicio mostrando el procedimiento detallado paso a paso, explicando de forma didáctica y comprensible el porqué de cada paso.
5. Si se trata de ejercicios matemáticos o de ciencias, muestra con claridad las fórmulas empleadas, la sustitución de valores, las operaciones aritméticas/algebraicas y las unidades correspondientes.
6. Si existen varios ejercicios, numera cada respuesta de forma que coincida exactamente con la numeración del documento original.
7. Revisa y verifica internamente los cálculos y resultados antes de entregar la respuesta para asegurar su consistencia.
8. Presenta la respuesta final de cada ejercicio de manera destacada y clara al final de cada procedimiento.`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(promptTexto).then(() => {
        mostrarToast('✓ Prompt copiado al portapapeles');
      }).catch(() => {
        mostrarToast('✓ Selecciona y copia el texto del prompt');
      });
    } else {
      mostrarToast('✓ Selecciona y copia el texto del prompt');
    }
  }

  function mostrarToast(mensaje) {
    let t = document.getElementById('desktop-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'desktop-toast';
      t.style.cssText = 'position:fixed; bottom:28px; right:28px; background:rgba(30,33,42,0.95); border:1px solid var(--c-oro-border); color:var(--c-hueso); padding:12px 24px; border-radius:var(--radius-pill); font-size:0.88rem; font-weight:700; z-index:300; box-shadow:0 8px 30px rgba(0,0,0,0.6); backdrop-filter:blur(16px); pointer-events:none; transition:opacity 0.25s, transform 0.25s;';
      document.body.appendChild(t);
    }
    t.textContent = mensaje;
    t.style.opacity = '1';
    t.style.transform = 'translateY(0)';
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(8px)';
    }, 2500);
  }

  function initAmbientCanvas() {
    const canvas = document.getElementById('desktop-ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.45 - 0.1,
        color: Math.random() > 0.5 ? 'rgba(255, 122, 0, 0.4)' : 'rgba(229, 169, 60, 0.35)'
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  return {
    init,
    setSection,
    abrirModalHojas,
    cerrarModalHojas,
    confirmarEnvioHojasWhatsApp,
    copiarPromptIA,
    mostrarToast
  };
})();

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('mac-')) {
      DesktopApp415.init();
    }
  });
}
