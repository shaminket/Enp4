/**
 * LÓGICA DE APLICACIÓN Y EXPERIENCIA MÓVIL — GRUPO 415
 * Filosofía Apple iOS / Reactividad inmediata / Persistencia de sección A/B
 * Extensión: Sistema "AHORA" y "DESPUÉS", Favoritos, Lectura de Novedades y PWA
 */

const App415 = (function () {
  'use strict';

  const STORAGE_KEY_SECTION = 'seccion_415_active';
  const STORAGE_KEY_ONBOARDED = 'onboarded_415';
  const STORAGE_KEY_FAVORITOS = 'favoritos_415_ids';
  const STORAGE_KEY_LEIDOS = 'materias_leidas_415_ids';

  const getStorage = () => {
    try {
      return typeof localStorage !== 'undefined' ? localStorage : null;
    } catch (e) {
      return null;
    }
  };

  let currentSection = (getStorage() && getStorage().getItem(STORAGE_KEY_SECTION)) || null;
  let simulatedTime = null; // Para pruebas en vivo si se desea
  let deferredInstallPrompt = null;

  // Inicialización global
  function init() {
    // 0. Enrutamiento inteligente global
    if (typeof DeviceRouter !== 'undefined') {
      DeviceRouter.route();
    }

    setupSectionModal();
    updateSectionBadges();
    initClockAndCurrentClass();
    initScheduleTabs();
    initBanners();
    initBottomNav();
    initSearch();
    initFavoritosBar();
    initConnectivityWatcher();
    initPWA();
    autoMarkCurrentPageAsRead();
    autoInitMateriaView();
    renderIndexAvisos();
  }

  // ----------------------------------------------------
  // 1. SELECCIÓN DE SECCIÓN (A / B)
  // ----------------------------------------------------
  function setupSectionModal() {
    const modalBackdrop = document.getElementById('section-modal-backdrop');
    if (!modalBackdrop) return;

    if (currentSection === 'A' || currentSection === 'B') {
      modalBackdrop.style.display = 'none';
      return;
    }

    modalBackdrop.style.display = 'flex';

    const btnA = document.getElementById('btn-select-a');
    const btnB = document.getElementById('btn-select-b');

    if (btnA) btnA.addEventListener('click', () => selectSection('A'));
    if (btnB) btnB.addEventListener('click', () => selectSection('B'));
  }

  function selectSection(section) {
    if (section !== 'A' && section !== 'B') return;
    currentSection = section;
    const s = getStorage();
    if (s) {
      s.setItem(STORAGE_KEY_SECTION, section);
      s.setItem(STORAGE_KEY_ONBOARDED, 'true');
    }

    const modalBackdrop = document.getElementById('section-modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.style.animation = 'fadeOut 0.25s ease forwards';
      setTimeout(() => {
        modalBackdrop.style.display = 'none';
      }, 240);
    }

    updateSectionBadges();
    renderCurrentClass();
    renderSchedule();
    if (typeof window.renderSubjectList === 'function') {
      window.renderSubjectList();
    }
    if (typeof window.renderArchivosList === 'function') {
      window.renderArchivosList();
    }
    autoInitMateriaView();
    renderIndexAvisos();
  }

  function promptChangeSection() {
    const modalBackdrop = document.getElementById('section-modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.style.display = 'flex';
      modalBackdrop.style.animation = 'fadeIn 0.25s ease forwards';
    } else {
      const nueva = currentSection === 'A' ? 'B' : 'A';
      if (confirm(`¿Deseas cambiar a la Sección ${nueva}?`)) {
        selectSection(nueva);
      }
    }
  }

  function updateSectionBadges() {
    const badges = document.querySelectorAll('.active-section-letter');
    badges.forEach((el) => {
      el.textContent = currentSection ? currentSection : '-';
    });
  }

  // ----------------------------------------------------
  // 2. SISTEMA "AHORA" Y "DESPUÉS" CON CUENTA REGRESIVA
  // ----------------------------------------------------
  function getCurrentTimeInfo() {
    const now = simulatedTime ? new Date(simulatedTime) : new Date();
    const day = now.getDay(); // 0 = Dom, 1 = Lun, ..., 5 = Vie, 6 = Sáb
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentTimeStr = `${hours}:${minutes}`;
    const totalCurrentSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    return { now, day, currentTimeStr, hours: now.getHours(), minutes: now.getMinutes(), seconds: now.getSeconds(), totalCurrentSec };
  }

  function findClassForTime(day, timeStr, section, totalCurrentSec) {
    if (day < 1 || day > 5) {
      return { claseActual: null, siguienteClase: null, minutosParaTerminar: null, minutosParaSiguiente: null, porcentajeCompletado: 0 };
    }

    const data = (typeof DataStore !== 'undefined') ? DataStore.getActiveData() : GRUPO_415_DATA;
    const clasesDelDia = data.horarioSemanal.filter((item) => {
      const matchDia = item.dia === day;
      const matchSec = item.seccion === null || item.seccion === section;
      return matchDia && matchSec;
    });

    clasesDelDia.sort((a, b) => a.inicio.localeCompare(b.inicio));

    let claseActual = null;
    let siguienteClase = null;
    let minutosParaTerminar = null;
    let minutosParaSiguiente = null;
    let porcentajeCompletado = 0;

    const [curH, curM] = timeStr.split(':').map(Number);
    const curTotalMin = curH * 60 + curM;

    for (let i = 0; i < clasesDelDia.length; i++) {
      const c = clasesDelDia[i];
      const [iniH, iniM] = c.inicio.split(':').map(Number);
      const [finH, finM] = c.fin.split(':').map(Number);
      const iniTotalMin = iniH * 60 + iniM;
      const finTotalMin = finH * 60 + finM;

      if (curTotalMin >= iniTotalMin && curTotalMin < finTotalMin) {
        claseActual = c;
        minutosParaTerminar = Math.max(0, finTotalMin - curTotalMin);
        const duracionTotalSec = (finTotalMin - iniTotalMin) * 60;
        const transcurridoSec = Math.max(0, totalCurrentSec - (iniTotalMin * 60));
        porcentajeCompletado = Math.min(100, Math.max(0, Math.round((transcurridoSec / duracionTotalSec) * 100)));
      } else if (curTotalMin < iniTotalMin && !siguienteClase) {
        siguienteClase = c;
        minutosParaSiguiente = iniTotalMin - curTotalMin;
      }
    }

    return { claseActual, siguienteClase, minutosParaTerminar, minutosParaSiguiente, porcentajeCompletado };
  }

  function renderCurrentClass() {
    const blockEl = document.getElementById('live-class-block');
    if (!blockEl) return;

    const data = (typeof DataStore !== 'undefined') ? DataStore.getActiveData() : GRUPO_415_DATA;
    const { day, currentTimeStr, totalCurrentSec } = getCurrentTimeInfo();
    const sec = currentSection || 'A';
    const { claseActual, siguienteClase, minutosParaTerminar, minutosParaSiguiente, porcentajeCompletado } = findClassForTime(day, currentTimeStr, sec, totalCurrentSec);

    const titleEl = document.getElementById('current-class-name');
    const timeEl = document.getElementById('current-class-time');
    const roomEl = document.getElementById('current-class-room');
    const pillEl = document.getElementById('current-status-pill');
    const nextAlertEl = document.getElementById('next-class-alert');

    // 11. SISTEMA "AHORA" Y "DESPUÉS"
    if (claseActual) {
      blockEl.classList.add('is-active');
      const materiaInfo = data.materias.find((m) => m.id === claseActual.materiaId);
      const nombreMateria = materiaInfo ? materiaInfo.nombre : claseActual.materiaId;
      const linkMateria = materiaInfo ? materiaInfo.slug : '#';

      titleEl.innerHTML = `
        <div style="font-size:var(--text-micro); color:var(--c-cempasuchil); font-weight:800; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:2px;">
          # AHORA
        </div>
        <a href="${linkMateria}">${nombreMateria}</a>
      `;
      timeEl.textContent = `${claseActual.inicio} - ${claseActual.fin}`;
      
      roomEl.innerHTML = `
        <span>Salón: <strong>${claseActual.salon}</strong> (Sec. ${sec})</span>
        <span class="countdown-tag" style="background:var(--c-cempasuchil-soft); padding:3px 8px; border-radius:var(--radius-pill);">
          ⏳ Termina en ${minutosParaTerminar} min
        </span>
      `;
      
      pillEl.innerHTML = `<span class="live-dot"></span> EN VIVO`;

      let progWrap = document.getElementById('class-progress-wrap');
      if (!progWrap) {
        progWrap = document.createElement('div');
        progWrap.id = 'class-progress-wrap';
        progWrap.className = 'class-progress-bar-wrap';
        progWrap.innerHTML = `<div class="class-progress-fill" id="class-progress-fill" style="width: ${porcentajeCompletado}%;"></div>`;
        blockEl.appendChild(progWrap);
      } else {
        const fill = document.getElementById('class-progress-fill');
        if (fill) fill.style.width = `${porcentajeCompletado}%`;
      }
    } else {
      // 12. ESTADO ENTRE CLASES
      blockEl.classList.remove('is-active');
      const progWrap = document.getElementById('class-progress-wrap');
      if (progWrap) progWrap.remove();

      let detalle = 'Revisa tu horario para consultar la próxima sesión';

      if (day === 0 || day === 6) {
        detalle = 'Fin de Semana · Próxima jornada el Lunes a las 07:00';
      } else if (currentTimeStr < '07:00') {
        detalle = 'La primera clase inicia a las 07:00';
      } else if (currentTimeStr >= '13:40') {
        detalle = 'Clases concluidas por hoy en el turno matutino';
      }

      titleEl.innerHTML = `
        <div style="font-size:var(--text-micro); color:var(--c-hueso-tertiary); font-weight:800; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:2px;">
          # AHORA
        </div>
        <span>Sin clase</span>
      `;
      timeEl.textContent = currentTimeStr;
      roomEl.textContent = detalle;
      pillEl.innerHTML = `<span style="width:7px; height:7px; border-radius:50%; background:var(--c-hueso-tertiary); display:inline-block;"></span> Pausa`;
    }

    // BLOQUE "DESPUÉS"
    if (nextAlertEl) {
      if (siguienteClase && minutosParaSiguiente !== null) {
        const matSig = data.materias.find((m) => m.id === siguienteClase.materiaId);
        nextAlertEl.style.display = 'flex';
        nextAlertEl.innerHTML = `
          <div>
            <span style="font-size:var(--text-micro); font-weight:800; text-transform:uppercase; letter-spacing:0.1em; display:block; color:var(--c-oro);"># DESPUÉS</span>
            <strong><a href="${matSig ? matSig.slug : '#'}">${matSig ? matSig.nombre : siguienteClase.materiaId}</a></strong>
            <span style="opacity:0.8; font-size:var(--text-micro);"> · Salón ${siguienteClase.salon}</span>
          </div>
          <strong style="color:var(--c-hueso); font-family:var(--font-family-mono); font-size:var(--text-caption);">Comienza en ${minutosParaSiguiente} min</strong>
        `;
      } else {
        nextAlertEl.style.display = 'none';
      }
    }
  }

  function initClockAndCurrentClass() {
    renderCurrentClass();
    setInterval(() => {
      renderCurrentClass();
      if (currentScheduleTab === 'diario') {
        updateDailyScheduleHighlights();
      }
    }, 1000);
  }

  // ----------------------------------------------------
  // 3. HORARIO: INDICADOR VISUAL "ESTOY AQUÍ" & 5 ESTADOS
  // ----------------------------------------------------
  let currentScheduleTab = 'diario';
  let selectedWeekDay = 1;

  function initScheduleTabs() {
    const tabBtns = document.querySelectorAll('.schedule-tabs .tab-btn');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentScheduleTab = btn.dataset.tab;
        renderSchedule();
      });
    });

    const nowDay = new Date().getDay();
    selectedWeekDay = nowDay >= 1 && nowDay <= 5 ? nowDay : 1;
    renderSchedule();
  }

  function renderSchedule() {
    const container = document.getElementById('schedule-view-container');
    if (!container) return;

    const sec = currentSection || 'A';
    const { day, currentTimeStr } = getCurrentTimeInfo();

    if (currentScheduleTab === 'diario') {
      renderDailyView(container, day >= 1 && day <= 5 ? day : 1, sec, currentTimeStr);
    } else if (currentScheduleTab === 'semanal') {
      renderWeeklyView(container, sec);
    } else if (currentScheduleTab === 'mensual') {
      renderMonthlyView(container);
    }
  }

  function renderDailyView(container, targetDay, sec, currentTimeStr) {
    const data = (typeof DataStore !== 'undefined') ? DataStore.getActiveData() : GRUPO_415_DATA;
    const nombresDias = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const clases = data.horarioSemanal.filter(
      (c) => c.dia === targetDay && (c.seccion === null || c.seccion === sec)
    );
    clases.sort((a, b) => a.inicio.localeCompare(b.inicio));

    const [curH, curM] = currentTimeStr.split(':').map(Number);
    const curTotalMin = curH * 60 + curM;

    let html = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span style="font-size:var(--text-callout); font-weight:700; color:var(--c-cempasuchil);">
          ${nombresDias[targetDay]} (Sección ${sec})
        </span>
        <span style="font-size:var(--text-micro); color:var(--c-hueso-tertiary);">
          ${clases.length} sesiones
        </span>
      </div>
      <div class="timeline-list">
    `;

    if (clases.length === 0) {
      html += `
        <div class="empty-state">
          <div class="empty-state-text">Sin clases programadas este día</div>
          <div class="empty-state-sub">Disfruta tu jornada libre.</div>
        </div>
      `;
    } else {
      let markerRendered = false;
      const isToday = targetDay === new Date().getDay();

      for (let i = 0; i < clases.length; i++) {
        const c = clases[i];
        const mat = data.materias.find((m) => m.id === c.materiaId);
        const nombre = mat ? mat.nombre : c.materiaId;
        const slug = mat ? mat.slug : '#';

        const [iniH, iniM] = c.inicio.split(':').map(Number);
        const [finH, finM] = c.fin.split(':').map(Number);
        const iniTotalMin = iniH * 60 + iniM;
        const finTotalMin = finH * 60 + finM;

        let estado = 'futura';
        let badgeHtml = '';

        if (!isToday) {
          estado = 'futura';
        } else if (curTotalMin >= finTotalMin) {
          estado = 'pasada';
          badgeHtml = `<span class="state-badge badge-pasada">✓ Concluida</span>`;
        } else if (curTotalMin >= iniTotalMin && curTotalMin < finTotalMin) {
          estado = 'actual';
          const restante = finTotalMin - curTotalMin;
          badgeHtml = `<span class="state-badge badge-actual">● AHORA · Quedan ${restante}m</span>`;
        } else if (curTotalMin < iniTotalMin) {
          if (!markerRendered) {
            estado = 'siguiente';
            const faltan = iniTotalMin - curTotalMin;
            badgeHtml = `<span class="state-badge badge-siguiente">▲ Siguiente en ${faltan}m</span>`;
          } else {
            estado = 'futura';
          }
        }

        if (isToday && !markerRendered) {
          if (estado === 'actual') {
            html += `
              <div class="timeline-now-marker">
                <span class="timeline-now-dot"></span>
                <span>AHORA (${currentTimeStr}) — ESTOY AQUÍ EN CLASE</span>
              </div>
            `;
            markerRendered = true;
          } else if (curTotalMin < iniTotalMin) {
            html += `
              <div class="timeline-now-marker" style="background:var(--c-copal-surface); border-color:var(--c-copal-border); color:var(--c-hueso);">
                <span class="timeline-now-dot" style="background:var(--c-oro); box-shadow:0 0 8px var(--c-oro);"></span>
                <span>POSICIÓN ACTUAL (${currentTimeStr}) — INTERMEDIO</span>
              </div>
            `;
            markerRendered = true;
          }
        }

        html += `
          <a href="${slug}" class="timeline-item state-${estado}" id="timeline-item-${c.id}">
            <div class="timeline-time">${c.inicio} - ${c.fin}</div>
            <div class="timeline-details">
              <div class="timeline-subject">${nombre}</div>
              <div class="timeline-room">Salón ${c.salon}</div>
              ${badgeHtml}
            </div>
            <div class="timeline-chevron">›</div>
          </a>
        `;
      }

      if (isToday && !markerRendered && curTotalMin >= 13 * 60 + 40) {
        html += `
          <div class="timeline-now-marker" style="background:var(--c-copal-surface); border-color:var(--c-copal-border); color:var(--c-hueso-secondary);">
            <span class="timeline-now-dot" style="background:var(--c-copal);"></span>
            <span>JORNADA CONCLUIDA POR HOY (${currentTimeStr})</span>
          </div>
        `;
      }
    }

    html += `</div>`;
    container.innerHTML = html;
  }

  function updateDailyScheduleHighlights() {
    const container = document.getElementById('schedule-view-container');
    if (!container || currentScheduleTab !== 'diario') return;
    const { day, currentTimeStr } = getCurrentTimeInfo();
    const sec = currentSection || 'A';
    renderDailyView(container, day >= 1 && day <= 5 ? day : 1, sec, currentTimeStr);
  }

  function renderWeeklyView(container, sec) {
    const data = (typeof DataStore !== 'undefined') ? DataStore.getActiveData() : GRUPO_415_DATA;
    const dias = [
      { id: 1, nombre: 'Lunes', corto: 'Lun' },
      { id: 2, nombre: 'Martes', corto: 'Mar' },
      { id: 3, nombre: 'Miércoles', corto: 'Mié' },
      { id: 4, nombre: 'Jueves', corto: 'Jue' },
      { id: 5, nombre: 'Viernes', corto: 'Vie' }
    ];

    let html = `<div class="week-day-selector">`;
    dias.forEach((d) => {
      const isActive = d.id === selectedWeekDay;
      const count = data.horarioSemanal.filter(
        (c) => c.dia === d.id && (c.seccion === null || c.seccion === sec)
      ).length;

      html += `
        <button class="day-pill-btn ${isActive ? 'active' : ''}" data-day="${d.id}">
          <span class="day-short">${d.corto}</span>
          <span class="day-hours">${count} hrs</span>
        </button>
      `;
    });
    html += `</div><div id="weekly-selected-day-container"></div>`;
    container.innerHTML = html;

    const buttons = container.querySelectorAll('.day-pill-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedWeekDay = parseInt(btn.dataset.day, 10);
        renderWeeklyView(container, sec);
      });
    });

    const dayContainer = document.getElementById('weekly-selected-day-container');
    if (dayContainer) {
      renderDailyView(dayContainer, selectedWeekDay, sec, getCurrentTimeInfo().currentTimeStr);
    }
  }

  function renderMonthlyView(container) {
    const data = (typeof DataStore !== 'undefined') ? DataStore.getActiveData() : GRUPO_415_DATA;
    const eventos = data.eventosCalendario || [];

    let eventosHtml = '';
    eventos.forEach((ev) => {
      eventosHtml += `
        <div class="cycle-date-item">
          <div>
            <strong>${ev.titulo}</strong>
            <div style="font-size:var(--text-micro); color:var(--c-hueso-tertiary);">${ev.descripcion}</div>
          </div>
          <span style="font-family:var(--font-family-mono); font-size:var(--text-micro); color:var(--c-oro);">${ev.fecha}</span>
        </div>
      `;
    });

    const html = `
      <div class="monthly-view-block">
        <div class="monthly-head">
          <span class="monthly-title">Calendario Escolar 2026-2027 ENP</span>
          <a href="calendario.html" style="font-size:var(--text-micro); color:var(--c-cempasuchil); font-weight:700;">Ver todo ›</a>
        </div>
        <div class="cycle-dates-list">
          ${eventosHtml}
        </div>
      </div>
    `;
    container.innerHTML = html;
  }

  // ----------------------------------------------------
  // 4. FAVORITOS DE MATERIAS
  // ----------------------------------------------------
  function getFavoritos() {
    const s = getStorage();
    if (!s) return [];
    try {
      return JSON.parse(s.getItem(STORAGE_KEY_FAVORITOS)) || [];
    } catch (e) {
      return [];
    }
  }

  function toggleFavorito(materiaId) {
    const s = getStorage();
    if (!s) return;
    let favs = getFavoritos();
    if (favs.includes(materiaId)) {
      favs = favs.filter((id) => id !== materiaId);
      mostrarToast('Eliminado de favoritas');
    } else {
      favs.push(materiaId);
      mostrarToast('Añadido a materias favoritas ★');
    }
    s.setItem(STORAGE_KEY_FAVORITOS, JSON.stringify(favs));
    initFavoritosBar();
    if (typeof window.renderSubjectList === 'function') {
      window.renderSubjectList();
    }
  }

  function initFavoritosBar() {
    const container = document.getElementById('favoritos-quick-bar');
    if (!container) return;
    const favs = getFavoritos();
    if (favs.length === 0) {
      container.style.display = 'none';
      return;
    }

    const data = (typeof DataStore !== 'undefined') ? DataStore.getActiveData() : GRUPO_415_DATA;
    let html = `
      <div style="font-size:var(--text-micro); color:var(--c-oro); font-weight:700; margin-bottom:6px; display:flex; align-items:center; gap:4px;">
        ★ MATERIAS FAVORITAS:
      </div>
      <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:4px; scrollbar-width:none;">
    `;

    favs.forEach((id) => {
      const mat = data.materias.find((m) => m.id === id);
      if (mat) {
        html += `
          <a href="${mat.slug}" class="section-pill-btn" style="flex:0 0 auto; height:34px; padding:0 12px; font-size:var(--text-caption);">
            ${mat.nombre}
          </a>
        `;
      }
    });

    html += `</div>`;
    container.innerHTML = html;
    container.style.display = 'block';
  }

  // ----------------------------------------------------
  // 5. REGISTRO DE LECTURA Y PUNTOS DE NOVEDAD (●)
  // ----------------------------------------------------
  function getMateriasLeidas() {
    const s = getStorage();
    if (!s) return [];
    try {
      return JSON.parse(s.getItem(STORAGE_KEY_LEIDOS)) || [];
    } catch (e) {
      return [];
    }
  }

  function marcarMateriaLeida(materiaId) {
    const s = getStorage();
    if (!s) return;
    let leidas = getMateriasLeidas();
    if (!leidas.includes(materiaId)) {
      leidas.push(materiaId);
      s.setItem(STORAGE_KEY_LEIDOS, JSON.stringify(leidas));
    }
  }

  function autoMarkCurrentPageAsRead() {
    const path = window.location.pathname;
    const data = (typeof DataStore !== 'undefined') ? DataStore.getActiveData() : GRUPO_415_DATA;
    const mat = data.materias.find((m) => path.endsWith(m.slug));
    if (mat) {
      marcarMateriaLeida(mat.id);
    }
  }

  function tieneNovedadSinLeer(materiaId) {
    const data = (typeof DataStore !== 'undefined') ? DataStore.getActiveData() : GRUPO_415_DATA;
    const sec = currentSection || 'A';
    const tareas = data.tareas.filter((t) => t.materiaId === materiaId && (t.seccion === 'Todas' || t.seccion === sec));
    const archivos = data.archivos.filter((a) => a.materiaId === materiaId && (a.seccion === 'Todas' || a.seccion === sec));
    const tieneContenido = tareas.length > 0 || archivos.length > 0;
    if (!tieneContenido) return false;

    const leidas = getMateriasLeidas();
    return !leidas.includes(materiaId);
  }

  // ----------------------------------------------------
  // 6. DETECCIÓN DE CONECTIVIDAD OFFLINE / ONLINE
  // ----------------------------------------------------
  function initConnectivityWatcher() {
    function updateOnlineStatus() {
      let banner = document.getElementById('offline-notice-banner');
      if (!navigator.onLine) {
        if (!banner) {
          banner = document.createElement('div');
          banner.id = 'offline-notice-banner';
          banner.style.cssText = 'position:fixed; top:calc(var(--sat) + 4px); left:50%; transform:translateX(-50%); background:rgba(42,45,52,0.92); border:1px solid var(--c-copal-line); border-radius:var(--radius-pill); padding:5px 14px; font-size:var(--text-micro); color:var(--c-oro); z-index:350; backdrop-filter:blur(10px); box-shadow:0 4px 16px rgba(0,0,0,0.6);';
          document.body.appendChild(banner);
        }
        const data = (typeof DataStore !== 'undefined') ? DataStore.getActiveData() : GRUPO_415_DATA;
        const fechaHora = data.ultimaActualizacion ? new Date(data.ultimaActualizacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'reciente';
        banner.innerHTML = `📡 Sin conexión — Modo local activo (Última sincronización: ${fechaHora})`;
        banner.style.display = 'block';
      } else if (banner) {
        banner.style.display = 'none';
      }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
  }

  // ----------------------------------------------------
  // 7. PWA SERVICE WORKER & MANIFEST
  // ----------------------------------------------------
  function initPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then((reg) => {
          console.log('[PWA] Service Worker registrado con éxito:', reg.scope);
        }).catch((err) => {
          console.log('[PWA] Error en registro de Service Worker:', err);
        });
      });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      const installBtn = document.getElementById('pwa-install-btn');
      if (installBtn) {
        installBtn.style.display = 'inline-flex';
        installBtn.addEventListener('click', () => {
          if (deferredInstallPrompt) {
            deferredInstallPrompt.prompt();
            deferredInstallPrompt.userChoice.then(() => {
              deferredInstallPrompt = null;
              installBtn.style.display = 'none';
            });
          }
        });
      }
    });
  }

  // ----------------------------------------------------
  // 8. BANNERS TEMPORALES
  // ----------------------------------------------------
  function initBanners() {
    const dock = document.getElementById('banner-dock');
    if (!dock) return;

    const data = (typeof DataStore !== 'undefined') ? DataStore.getActiveData() : GRUPO_415_DATA;
    const hayTareasReales = data.tareas && data.tareas.length > 0;
    if (hayTareasReales) {
      showTaskBanner(dock);
    }

    setTimeout(() => {
      showBestOf415Banner(dock);
    }, 4500);
  }

  function showTaskBanner(dock) {
    const banner = document.createElement('div');
    banner.className = 'dynamic-banner';
    banner.innerHTML = `
      <div class="banner-content" onclick="window.location.href='centro-de-control.html'" style="cursor:pointer;">
        <div class="banner-icon-badge banner-task-badge">⚡</div>
        <div class="banner-text-wrap">
          <div class="banner-title">Revisa el Centro de Control</div>
          <div class="banner-sub">Hay tareas.</div>
        </div>
      </div>
      <div class="banner-actions">
        <button class="banner-action-btn" id="pause-task-banner">⏸ Pausar</button>
        <button class="banner-close-btn" id="close-task-banner" aria-label="Cerrar">✕</button>
      </div>
      <div class="banner-timer-bar" id="task-banner-timer"></div>
    `;

    dock.appendChild(banner);
    let isPaused = false;
    const timerBar = banner.querySelector('#task-banner-timer');
    const pauseBtn = banner.querySelector('#pause-task-banner');
    const closeBtn = banner.querySelector('#close-task-banner');

    timerBar.style.transition = 'width 3s linear';
    requestAnimationFrame(() => { timerBar.style.width = '0%'; });

    let dismissTimeout = setTimeout(() => { dismiss(); }, 3000);

    function dismiss() {
      banner.style.animation = 'slideDownBanner 0.3s ease reverse forwards';
      setTimeout(() => banner.remove(), 280);
    }

    pauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isPaused = !isPaused;
      if (isPaused) {
        clearTimeout(dismissTimeout);
        pauseBtn.textContent = '▶ Reanudar';
        timerBar.style.transition = 'none';
      } else {
        pauseBtn.textContent = '⏸ Pausar';
        timerBar.style.transition = 'width 2s linear';
        timerBar.style.width = '0%';
        dismissTimeout = setTimeout(dismiss, 2000);
      }
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearTimeout(dismissTimeout);
      dismiss();
    });
  }

  function showBestOf415Banner(dock) {
    const banner = document.createElement('div');
    banner.className = 'dynamic-banner';
    banner.innerHTML = `
      <div class="banner-content" onclick="window.location.href='recuerdos-415.html'" style="cursor:pointer;">
        <div class="banner-icon-badge banner-memory-badge">✦</div>
        <div class="banner-text-wrap">
          <div class="banner-title">Lo mejor del 415</div>
          <div class="banner-sub">Recuerdos e historia del grupo</div>
        </div>
      </div>
      <div class="banner-actions">
        <button class="banner-action-btn" id="pause-best-banner">⏸ Pausar</button>
        <button class="banner-close-btn" id="close-best-banner" aria-label="Cerrar">✕</button>
      </div>
      <div class="banner-timer-bar" id="best-banner-timer" style="background:var(--c-oro);"></div>
    `;

    dock.appendChild(banner);
    let isPaused = false;
    const timerBar = banner.querySelector('#best-banner-timer');
    const pauseBtn = banner.querySelector('#pause-best-banner');
    const closeBtn = banner.querySelector('#close-best-banner');

    timerBar.style.transition = 'width 5s linear';
    requestAnimationFrame(() => { timerBar.style.width = '0%'; });

    let dismissTimeout = setTimeout(() => { dismiss(); }, 5000);

    function dismiss() {
      banner.style.animation = 'slideDownBanner 0.3s ease reverse forwards';
      setTimeout(() => banner.remove(), 280);
    }

    pauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isPaused = !isPaused;
      if (isPaused) {
        clearTimeout(dismissTimeout);
        pauseBtn.textContent = '▶ Reanudar';
        timerBar.style.transition = 'none';
      } else {
        pauseBtn.textContent = '⏸ Pausar';
        timerBar.style.transition = 'width 3s linear';
        timerBar.style.width = '0%';
        dismissTimeout = setTimeout(dismiss, 3000);
      }
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearTimeout(dismissTimeout);
      dismiss();
    });
  }

  // ----------------------------------------------------
  // 9. NAVEGACIÓN INFERIOR Y BUSCADOR
  // ----------------------------------------------------
  function initBottomNav() {
    const currentPath = window.location.pathname;
    const tabs = document.querySelectorAll('.bottom-nav-bar .nav-tab-item');
    tabs.forEach((tab) => {
      const href = tab.getAttribute('href');
      if (href && currentPath.endsWith(href)) {
        tab.classList.add('active');
      }
    });
  }

  function initSearch() {
    const searchInput = document.getElementById('subject-fast-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      filterSubjects(q);
    });
  }

  function filterSubjects(query) {
    const cards = document.querySelectorAll('.subject-item-entry');
    cards.forEach((card) => {
      const name = card.dataset.name.toLowerCase();
      const code = (card.dataset.code || '').toLowerCase();
      if (!query || name.includes(query) || code.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  function copiarFormatoRenombrado(textoFormato = '415_ApellidosDelAlumno_tarea00') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textoFormato).then(() => {
        mostrarToast(`Copiado: ${textoFormato}`);
      }).catch(() => {
        mostrarToast('Error al copiar');
      });
    } else {
      mostrarToast(`Formato: ${textoFormato}`);
    }
  }

  function copiarPromptIA() {
    const data = (typeof DataStore !== 'undefined') ? DataStore.getRawData() : GRUPO_415_DATA_DEFAULT;
    const promptTexto = data.promptResolucionEjercicios ? data.promptResolucionEjercicios.texto : '';
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
    let toast = document.getElementById('app-toast-box');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast-box';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = mensaje;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // ----------------------------------------------------
  // 10. VISTA DINÁMICA DE MATERIA: ACTUALIDAD E HISTORIAL
  // ----------------------------------------------------
  function renderIndexAvisos() {
    const container = document.getElementById('index-avisos-list');
    if (!container) return;
    const data = (typeof DataStore !== 'undefined') ? DataStore.getActiveData() : GRUPO_415_DATA;
    const sec = currentSection || 'A';
    const avisosActivos = (data.avisos || []).filter(function (av) {
      return (av.materiaId === 'general' || !av.materiaId) && (av.seccion === 'Todas' || av.seccion === sec);
    });
    if (avisosActivos.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔔</div><div class="empty-state-text">Sin avisos por el momento.</div><div class="empty-state-sub">Las notificaciones oficiales de la dirección y profesores aparecerán aquí.</div></div>';
      return;
    }
    container.innerHTML = avisosActivos.map(function (av) {
      return '<article class="cal-event-card type-institucional" style="margin-bottom:10px; border-left-color:var(--c-cempasuchil);"><div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span style="font-size:var(--text-micro); font-weight:800; color:var(--c-cempasuchil); text-transform:uppercase;">Vigente · Oficial</span><span style="font-size:var(--text-micro); color:var(--c-hueso-tertiary);">' + (av.fechaPublicacion || '') + '</span></div><h3 style="font-size:var(--text-headline); font-weight:700; color:var(--c-hueso); margin-bottom:4px;">' + av.titulo + '</h3><p style="font-size:var(--text-caption); color:var(--c-hueso-secondary); line-height:1.4;">' + av.contenido + '</p></article>';
    }).join('');
  }

  function autoInitMateriaView() {
    const container = document.getElementById('materia-dinamica-content');
    if (container) {
      renderMateriaView(container.dataset.materiaId);
    }
  }

  function renderMateriaView(targetMateriaId) {
    const container = document.getElementById('materia-dinamica-content');
    if (!container) return;
    const materiaId = targetMateriaId || container.dataset.materiaId;
    if (!materiaId) return;

    const sec = currentSection || 'A';
    const refDate = simulatedTime ? new Date(simulatedTime) : new Date();
    const data = (typeof DataStore !== 'undefined') ? DataStore.getRawData() : GRUPO_415_DATA_DEFAULT;
    const materia = data.materias.find((m) => m.id === materiaId);
    if (!materia) return;

    const contenido = DataStore.getContenidoMateria(materiaId, { seccion: sec, referenceDate: refDate });
    const actual = contenido.actual;
    const historial = contenido.historial;

    const totalHistorial = historial.avisos.length + historial.tareas.length + historial.examenes.length + historial.eventos.length + historial.archivos.length;

    let html = '';

    // 1. ESTADO DE LA MATERIA / BANNER SUPERIOR INFORMATIVO
    const hayPendientes = actual.tareas.length > 0 || actual.avisos.length > 0 || actual.examenes.length > 0 || actual.eventos.length > 0;
    if (hayPendientes) {
      let mensajePrincipal = '';
      if (actual.examenes.length > 0) {
        const ex = actual.examenes[0];
        mensajePrincipal = `📝 Próxima evaluación: <strong>${ex.titulo}</strong> (${ex.fecha})`;
      } else if (actual.tareas.length > 0) {
        const t = actual.tareas[0];
        mensajePrincipal = `⚡ Tarea pendiente: <strong>${t.titulo}</strong> (Entrega: ${t.fechaEntrega})`;
      } else if (actual.eventos.length > 0) {
        const ev = actual.eventos[0];
        mensajePrincipal = `🎭 Evento cultural: <strong>${ev.titulo}</strong> (${ev.fecha})`;
      } else if (actual.avisos.length > 0) {
        const av = actual.avisos[0];
        mensajePrincipal = `🔔 Aviso reciente: <strong>${av.titulo}</strong>`;
      }
      html += `
        <section class="subject-recent-highlight" aria-label="Lo más reciente">
          <div style="display:flex; align-items:center; gap:12px; min-width:0;">
            <span style="font-size:1.3rem; flex-shrink:0;">⚡</span>
            <div style="min-width:0;">
              <span style="font-size:var(--text-micro); color:var(--c-cempasuchil); font-weight:800; text-transform:uppercase; letter-spacing:0.1em; display:block;">Lo más importante hoy</span>
              <span style="font-size:var(--text-caption); color:var(--c-hueso); word-break:break-word;">${mensajePrincipal}</span>
            </div>
          </div>
        </section>
      `;
    } else {
      let etiquetaTitulo = 'Materia al corriente';
      let fraseVacia = `Sin tareas ni avisos urgentes en la Sección ${sec}.`;
      let iconoVacio = '✓';

      if (materiaId === 'ingles' && sec === 'A') {
        etiquetaTitulo = 'English IV · Section A';
        fraseVacia = '“Take a break. This space will be filled soon.”';
        iconoVacio = '☕';
      } else if (materiaId === 'orientacion-educativa' && sec === 'A') {
        etiquetaTitulo = 'Orientación Educativa IV · Sección A';
        fraseVacia = '“Descansa. Por ahora no hay pendientes aquí. Pronto esta bandeja volverá a llenarse.”';
        iconoVacio = '🌱';
      }

      html += `
        <section class="subject-recent-highlight is-clear" aria-label="${etiquetaTitulo}">
          <div style="display:flex; align-items:center; gap:12px; min-width:0;">
            <span style="font-size:1.3rem; color:var(--c-oro); flex-shrink:0;">${iconoVacio}</span>
            <div style="min-width:0;">
              <span style="font-size:var(--text-micro); color:var(--c-oro); font-weight:800; text-transform:uppercase; letter-spacing:0.1em; display:block;">${etiquetaTitulo}</span>
              <span style="font-size:var(--text-caption); color:var(--c-hueso-secondary); font-weight:600; word-break:break-word;">${fraseVacia}</span>
            </div>
          </div>
        </section>
      `;
    }

    // AVISO EXCLUSIVO PARA SECCIÓN B (Solo si la materia tiene Sección B, el usuario está en B, y esa sección no tiene información)
    if (typeof DataStore !== 'undefined' && DataStore.debeMostrarAvisoSeccionB(materiaId, sec)) {
      html += `
        <section class="section-b-help-card" style="margin-bottom:20px; padding:18px 20px; background:linear-gradient(145deg, rgba(62,28,107,0.85) 0%, rgba(27,11,46,0.96) 100%); border:1px solid var(--c-oro-border); border-radius:var(--radius-lg); box-shadow:0 8px 24px rgba(10,4,20,0.45); box-sizing:border-box;">
          <div style="display:flex; align-items:flex-start; gap:12px; margin-bottom:12px;">
            <span style="font-size:1.6rem; flex-shrink:0; line-height:1;">📢</span>
            <div style="min-width:0;">
              <span style="font-size:var(--text-micro); font-weight:800; color:var(--c-oro); text-transform:uppercase; letter-spacing:0.1em; display:block; margin-bottom:4px;">
                Aviso para Sección B
              </span>
              <p style="font-size:var(--text-body); color:var(--c-hueso); font-weight:600; line-height:1.45; margin:0; word-break:break-word;">
                Encardomy by Shaminket no cuenta con información de esta sección. Si tú la tienes, puedes apoyarnos.
              </p>
            </div>
          </div>
          <button type="button" class="section-pill-btn" onclick="ColaboracionSeccionB.abrir('${materia.nombre}', '${materia.id}')" style="width:100%; justify-content:center; background:var(--c-oro); color:var(--c-obsidiana); font-weight:800; border:none; height:44px; border-radius:var(--radius-pill); cursor:pointer; font-size:var(--text-caption);">
            <span>🤝 Ayúdanos con esta sección ›</span>
          </button>
        </section>
      `;
    }

    // 2. CASO ESPECIAL: HOJAS MEMBRETADAS (GEOGRAFÍA)
    if (materiaId === 'geografia') {
      html += `
        <section style="margin-bottom:20px; background:linear-gradient(135deg, rgba(229,169,60,0.14) 0%, rgba(11,12,16,0.85) 100%); border:1px solid var(--c-oro-border); border-radius:var(--radius-md); padding:16px; box-sizing:border-box;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
            <span style="font-size:var(--text-micro); font-weight:800; color:var(--c-oro); text-transform:uppercase; letter-spacing:0.08em;">
              Material de Geografía
            </span>
            <span style="font-size:var(--text-callout); font-weight:800; color:var(--c-oro);">$30 pesos</span>
          </div>
          <h3 style="margin:0 0 6px 0; font-size:var(--text-headline); color:var(--c-hueso); font-weight:700;">
            Recuerda tener listas tus hojas membretadas
          </h3>
          <p style="margin:0 0 12px 0; font-size:var(--text-caption); color:var(--c-hueso-secondary); line-height:1.4;">
            Si todavía no las tienes, puedes conseguirlas por $30 pesos mediante Encardomy y solicitar que te las lleven.
          </p>
          <button class="section-pill-btn" onclick="abrirModalHojas()" style="width:100%; justify-content:center; background:var(--c-oro); color:var(--c-obsidiana); font-weight:800; border:none;">
            Solicitar Hojas Membretadas ›
          </button>
        </section>
      `;
    }

    // 3. CASO ESPECIAL: PROMPT IA (HISTORIA)
    if (materiaId === 'historia') {
      html += `
        <section style="margin-bottom:20px; background:rgba(229,169,60,0.1); border:1px solid var(--c-oro-border); border-radius:var(--radius-md); padding:16px; box-sizing:border-box;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
            <span style="font-size:var(--text-micro); font-weight:800; color:var(--c-oro); text-transform:uppercase; letter-spacing:0.08em;">
              Herramienta Académica Exclusiva
            </span>
            <span style="font-size:var(--text-micro); background:var(--c-oro-soft); color:var(--c-oro); padding:2px 8px; border-radius:var(--radius-pill); font-weight:800;">Prompt IA</span>
          </div>
          <h3 style="margin:0 0 6px 0; font-size:var(--text-headline); color:var(--c-hueso); font-weight:700;">
            Prompt Maestro para Resolver Ejercicios con IA
          </h3>
          <p style="margin:0 0 12px 0; font-size:var(--text-caption); color:var(--c-hueso-secondary); line-height:1.4;">
            Copia este prompt y pégalo en cualquier inteligencia artificial adjuntando tus ejercicios para resolverlos paso a paso.
          </p>
          <button class="section-pill-btn" onclick="App415.copiarPromptIA ? App415.copiarPromptIA() : copiarPromptGlobal()" style="width:100%; justify-content:center; background:var(--c-oro); color:var(--c-obsidiana); font-weight:800; border:none;">
            📋 Copiar Prompt al Portapapeles ›
          </button>
        </section>
      `;
    }

    // 4. EXÁMENES ACTIVOS
    if (actual.examenes.length > 0) {
      html += `
        <section style="margin-bottom:22px;">
          <div class="section-head-row">
            <h2 class="section-title">Próximos Exámenes</h2>
            <span style="font-size:var(--text-micro); color:var(--c-cempasuchil); font-weight:700;">${actual.examenes.length} Programado${actual.examenes.length > 1 ? 's' : ''}</span>
          </div>
      `;
      actual.examenes.forEach((ex) => {
        html += `
          <article class="cal-event-card type-evaluacion" style="margin-bottom:10px; border-left-color:var(--c-cempasuchil); background:rgba(243,107,42,0.1);">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px; flex-wrap:wrap; gap:4px;">
              <span style="font-size:var(--text-micro); font-weight:800; color:var(--c-cempasuchil); text-transform:uppercase;">Próxima Evaluación</span>
              <span style="font-size:var(--text-micro); font-family:var(--font-family-mono); color:var(--c-oro); font-weight:700;">${ex.fecha}</span>
            </div>
            <h3 style="font-size:var(--text-headline); font-weight:700; color:var(--c-hueso); margin-bottom:4px; word-break:break-word;">${ex.titulo}</h3>
            <p style="font-size:var(--text-caption); color:var(--c-hueso-secondary); line-height:1.4; word-break:break-word;">${ex.descripcion}</p>
          </article>
        `;
      });
      html += `</section>`;
    }

    // 5. TAREAS ACTIVAS
    if (actual.tareas.length > 0) {
      html += `
        <section style="margin-bottom:22px;">
          <div class="section-head-row">
            <h2 class="section-title">Tareas Pendientes</h2>
            <span style="font-size:var(--text-micro); color:var(--c-cempasuchil); font-weight:700;">${actual.tareas.length} Activa${actual.tareas.length > 1 ? 's' : ''}</span>
          </div>
      `;
      actual.tareas.forEach((t) => {
        html += `
          <div class="task-card-active" style="padding:16px 18px; background:rgba(42,45,52,0.35); border-radius:var(--radius-md); border-left:3px solid var(--c-cempasuchil); margin-bottom:12px; width:100%; box-sizing:border-box;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px; gap:8px;">
              <h3 style="font-size:var(--text-headline); font-weight:700; color:var(--c-hueso); word-break:break-word;">${t.titulo}</h3>
              <span style="font-size:var(--text-micro); background:var(--c-cempasuchil); color:var(--c-obsidiana); padding:2px 8px; border-radius:var(--radius-pill); font-weight:800; flex-shrink:0;">Activa</span>
            </div>
            <p style="font-size:var(--text-body); color:var(--c-hueso-secondary); line-height:1.45; margin-bottom:10px; word-break:break-word;">${t.indicaciones}</p>
            <div style="font-size:var(--text-caption); color:var(--c-oro); display:flex; justify-content:space-between; flex-wrap:wrap; gap:6px;">
              <span>Entrega: <strong>${t.fechaEntrega}</strong></span>
              <span>Registrada: <strong>${t.fechaPublicacion || ''}</strong></span>
            </div>
          </div>
        `;
      });
      html += `</section>`;
    }

    // 6. AVISOS ACTIVOS
    if (actual.avisos.length > 0) {
      html += `
        <section style="margin-bottom:22px;">
          <div class="section-head-row">
            <h2 class="section-title">Avisos de la Materia</h2>
            <span style="font-size:var(--text-micro); color:var(--c-cempasuchil); font-weight:700;">${actual.avisos.length} Vigente${actual.avisos.length > 1 ? 's' : ''}</span>
          </div>
      `;
      actual.avisos.forEach((av) => {
        html += `
          <article class="cal-event-card type-institucional" style="margin-bottom:10px; border-left-color:var(--c-cempasuchil);">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px; flex-wrap:wrap; gap:4px;">
              <span style="font-size:var(--text-micro); font-weight:800; color:var(--c-cempasuchil); text-transform:uppercase;">Vigente</span>
              <span style="font-size:var(--text-micro); color:var(--c-hueso-tertiary);">${av.fechaPublicacion || ''}</span>
            </div>
            <h3 style="font-size:var(--text-headline); font-weight:700; color:var(--c-hueso); margin-bottom:4px; word-break:break-word;">${av.titulo}</h3>
            <p style="font-size:var(--text-caption); color:var(--c-hueso-secondary); line-height:1.4; word-break:break-word;">${av.contenido}</p>
          </article>
        `;
      });
      html += `</section>`;
    }

    // 7. EVENTOS
    const eventosMateria = actual.eventos || [];
    const eventosFuturosCalendario = (data.eventosCalendario || []).filter((ev) => {
      if (ev.materiaId && ev.materiaId !== materiaId) return false;
      const c = DataStore.clasificarElemento(ev, 'evento', refDate);
      return c.esActual;
    });
    const todosEventos = [...eventosMateria];
    eventosFuturosCalendario.forEach(ev => {
      if (!todosEventos.some(e => e.id === ev.id)) {
        todosEventos.push(ev);
      }
    });

    if (todosEventos.length > 0) {
      html += `
        <section style="margin-bottom:22px;">
          <div class="section-head-row">
            <h2 class="section-title">Próximos Eventos</h2>
            <span style="font-size:var(--text-micro); color:var(--c-cempasuchil); font-weight:700;">${todosEventos.length} Evento${todosEventos.length > 1 ? 's' : ''}</span>
          </div>
      `;
      todosEventos.forEach((ev) => {
        if (ev.id === 'evento-don-juan-tenorio') {
          const gcalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('Don Juan Tenorio Clásico - Teatro Xola Julio Prieto') + '&dates=20261017T160000Z/20261017T180000Z&details=' + encodeURIComponent('Puesta en escena de Don Juan Tenorio Clásico de José Zorrilla. Dirección: Félix Maldonado. Compañía: SKENIKA. Costo: $300. Informes: 55 22 99 89 49. Asistencia sugerida Grupo 415 Lengua Española ENP 4.') + '&location=' + encodeURIComponent('Teatro Xola Julio Prieto, Eje 4 Sur 809, Col. del Valle, Benito Juárez, CDMX');
          html += `
            <div class="theatrical-poster-card" style="margin-bottom:20px; background:linear-gradient(145deg, rgba(42,45,52,0.6) 0%, rgba(11,12,16,0.95) 100%); border:1px solid var(--c-oro-border); border-radius:var(--radius-lg); padding:18px; box-shadow:0 8px 32px var(--c-oro-glow); box-sizing:border-box;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:6px;">
                <span style="font-size:var(--text-micro); font-weight:800; color:var(--c-oro); background:var(--c-oro-soft); padding:3px 10px; border-radius:var(--radius-pill); text-transform:uppercase; letter-spacing:0.1em;">
                  🎭 Puesta en Escena · Lengua Española
                </span>
                <span style="font-family:var(--font-family-mono); font-size:var(--text-micro); color:var(--c-oro); font-weight:700;">17/Oct/2026</span>
              </div>

              <div style="margin-bottom:14px;">
                <h3 style="font-size:var(--text-title1); font-weight:800; color:var(--c-hueso); margin-bottom:4px; font-family:Georgia, serif; letter-spacing:0.04em;">
                  Don Juan Tenorio Clásico
                </h3>
                <p style="font-size:var(--text-callout); color:var(--c-oro); font-style:italic; margin-bottom:12px;">
                  SKENIKA · Dirección: Félix Maldonado · Texto: José Zorrilla
                </p>

                <div style="display:grid; grid-template-columns:1fr; gap:6px; font-size:var(--text-caption); color:var(--c-hueso-secondary); margin-bottom:14px; background:rgba(11,12,16,0.5); padding:12px 14px; border-radius:var(--radius-md); border:1px solid var(--c-copal-line);">
                  <div>📍 <strong>Lugar:</strong> Teatro Xola • Julio Prieto (Eje 4 Sur 809, Col. del Valle)</div>
                  <div>🗓 <strong>Fecha y Hora:</strong> Sábado 17 de octubre de 2026 · 10:00 AM</div>
                  <div>🎟 <strong>Costo:</strong> $300 pesos</div>
                  <div>📞 <strong>Informes y reservaciones:</strong> 55 22 99 89 49</div>
                </div>
              </div>

              <div style="display:flex; flex-direction:column; gap:10px;">
                <a href="${gcalUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="justify-content:center; background:var(--c-cempasuchil); color:var(--c-obsidiana); font-weight:800; font-size:var(--text-body); height:46px; border-radius:var(--radius-pill); text-decoration:none; display:flex; align-items:center;">
                  <span>📅 Agregar a Google Calendar ›</span>
                </a>

                <div style="padding:12px 14px; background:rgba(42,45,52,0.3); border-radius:var(--radius-md); border:1px solid var(--c-copal-line); font-size:var(--text-caption); color:var(--c-hueso-secondary); line-height:1.4;">
                  <strong style="color:var(--c-oro);">🎟 Venta y Reserva de Boletos:</strong> Para esta función escolar, los boletos ($300 pesos) se gestionan directamente por teléfono/WhatsApp de la producción:
                  <div style="margin-top:8px; display:flex; gap:8px;">
                    <a href="tel:5522998949" class="section-pill-btn" style="flex:1; justify-content:center; height:38px; color:var(--c-oro); border-color:var(--c-oro-border);">
                      <span>📞 55 22 99 89 49</span>
                    </a>
                    <a href="https://wa.me/525522998949?text=Hola,%20solicito%20informes%20y%20boletos%20para%20Don%20Juan%20Tenorio%20el%2017%20de%20octubre%20en%20el%20Teatro%20Xola" target="_blank" rel="noopener noreferrer" class="section-pill-btn" style="flex:1; justify-content:center; height:38px; color:#25D366; border-color:rgba(37,211,102,0.3);">
                      <span>💬 WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          `;
        } else {
          html += `
            <div class="cal-event-card type-${ev.tipo || 'academico'}" style="margin-bottom:10px;">
              <span class="cal-date-pill" style="font-family:var(--font-family-mono); font-size:var(--text-micro); color:var(--c-oro); font-weight:700; padding:2px 6px; border-radius:var(--radius-pill); background:var(--c-oro-soft); display:inline-block; margin-bottom:4px;">🗓 ${ev.fecha}</span>
              <h3 style="font-size:var(--text-headline); font-weight:700; color:var(--c-hueso); margin-bottom:2px; word-break:break-word;">${ev.titulo}</h3>
              <p style="font-size:var(--text-caption); color:var(--c-hueso-secondary); word-break:break-word;">${ev.descripcion}</p>
            </div>
          `;
        }
      });
      html += `</section>`;
    }

    // 8. RECURSOS Y ARCHIVOS RELEVANTES
    if (actual.archivos.length > 0) {
      html += `
        <section style="margin-bottom:22px;">
          <div class="section-head-row">
            <h2 class="section-title">Recursos y Archivos Oficiales</h2>
            <span style="font-size:var(--text-micro); color:var(--c-cempasuchil); font-weight:700;">${actual.archivos.length} Documento${actual.archivos.length > 1 ? 's' : ''}</span>
          </div>
      `;
      actual.archivos.forEach((ar) => {
        html += `
          <article class="pdf-file-card" style="margin-bottom:12px;">
            <div class="pdf-header-row">
              <span class="pdf-code-tag">${ar.codigo}</span>
              <span style="font-size:var(--text-micro); color:var(--c-hueso-tertiary);">${ar.categoria || 'Documento'}</span>
            </div>
            <h3 class="pdf-title">${ar.nombre}</h3>
            <p class="pdf-desc">${ar.descripcion}</p>
            <div class="pdf-meta-row">
              <span>📅 ${ar.fecha}</span>
              <span>•</span>
              <span>💾 ${ar.tamano}</span>
              <span>•</span>
              <span>📑 ${ar.paginas} páginas</span>
            </div>
            <div class="pdf-actions-row">
              <a href="${ar.url}" target="_blank" rel="noopener noreferrer" class="btn-open-pdf">
                <span>↗ Abrir en Google Drive</span>
              </a>
            </div>
          </article>
        `;
      });
      html += `</section>`;
    }

    // 9. ACCESO AL HISTORIAL DE LA MATERIA
    html += `
      <section class="subject-history-gate">
        <div class="history-gate-box">
          <div>
            <span class="history-gate-badge">📁 Memoria Académica</span>
            <h3 class="history-gate-title">Historial de ${materia.nombre}</h3>
            <p class="history-gate-desc">
              Consulta tareas anteriores, avisos archivados, exámenes realizados y recursos históricos de esta materia (${totalHistorial} registro${totalHistorial === 1 ? '' : 's'} archivado${totalHistorial === 1 ? '' : 's'}).
            </p>
          </div>
          <a href="historial.html?materia=${materia.id}" class="btn-history-gate">
            <span>Ver Historial de la Materia ›</span>
          </a>
        </div>
      </section>
    `;

    container.innerHTML = html;
  }

  function setSimulatedTime(dateStr) {
    simulatedTime = dateStr ? new Date(dateStr) : null;
    renderCurrentClass();
    renderSchedule();
    autoInitMateriaView();
    renderIndexAvisos();
    if (typeof window.renderSubjectList === 'function') {
      window.renderSubjectList();
    }
  }

  return {
    init,
    selectSection,
    promptChangeSection,
    getCurrentSection: () => currentSection,
    copiarFormatoRenombrado,
    copiarPromptIA,
    setSimulatedTime,
    getSimulatedTime: () => simulatedTime,
    toggleFavorito,
    getFavoritos,
    marcarMateriaLeida,
    tieneNovedadSinLeer,
    renderMateriaView,
    autoInitMateriaView,
    mostrarToast
  };
})();

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', App415.init);
}
