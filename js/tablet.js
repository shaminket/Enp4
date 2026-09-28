/**
 * CONTROLADOR DE EXPERIENCIA TABLET — GRUPO 415 (PREPA 4 UNAM)
 * Arquitectura desacoplada: Consume DataStore de js/data.js como fuente única de verdad.
 * Diseñado específicamente para iPad mini, iPad Pro 11"/13" y Samsung Galaxy Tab S9/S10 Ultra.
 * Persistencia de estado durante rotación y navegación fluida entre vistas.
 */

const TabletApp415 = (function () {
  'use strict';

  // Claves de almacenamiento
  const STORAGE_KEY_SECTION = 'seccion_415_active';
  const STORAGE_KEY_LAST_VIEW = 'tablet_415_active_view';
  const STORAGE_KEY_LAST_SUBJECT = 'tablet_415_selected_subject';

  // Estado reactivo de la aplicación tablet
  let state = {
    activeView: 'dashboard', // 'dashboard' | 'materias' | 'horario' | 'archivos' | 'herramientas' | 'evento-tenorio'
    selectedSubjectId: 'lengua-espanola',
    activeSection: 'A',
    subjectTab: 'resumen', // 'resumen' | 'avisos' | 'tareas' | 'examenes' | 'eventos' | 'archivos' | 'historial'
    searchQuery: '',
    sidebarOpen: false
  };

  /**
   * Obtiene la fuente de datos unificada
   */
  function getData() {
    if (typeof DataStore !== 'undefined' && typeof DataStore.getActiveData === 'function') {
      return DataStore.getActiveData();
    }
    return typeof GRUPO_415_DATA_DEFAULT !== 'undefined' ? GRUPO_415_DATA_DEFAULT : { materias: [], horarioSemanal: [], tareas: [], avisos: [], examenes: [], eventosCalendario: [], archivos: [] };
  }

  /**
   * Inicialización global de la experiencia tablet
   */
  function init() {
    // 1. Cargar preferencias persistentes
    const savedSec = localStorage.getItem(STORAGE_KEY_SECTION);
    if (savedSec === 'A' || savedSec === 'B') {
      state.activeSection = savedSec;
    } else {
      state.activeSection = 'A';
      localStorage.setItem(STORAGE_KEY_SECTION, 'A');
    }

    const savedView = sessionStorage.getItem(STORAGE_KEY_LAST_VIEW);
    if (savedView) state.activeView = savedView;

    const savedSub = sessionStorage.getItem(STORAGE_KEY_LAST_SUBJECT);
    if (savedSub) state.selectedSubjectId = savedSub;

    // 2. Vincular listeners de UI globales
    setupEventListeners();

    // 3. Renderizar componentes
    updateSectionButtons();
    renderView();
    renderInspector();
    startClockAndLiveTracker();
    initAmbientCanvas();

    console.info('[TabletApp415] Experiencia Tablet inicializada correctamente.');
  }

  /**
   * Configuración de eventos de navegación e interactividad
   */
  function setupEventListeners() {
    // Botones de sección en Sidebar
    const btnSecA = document.getElementById('tablet-btn-sec-a');
    const btnSecB = document.getElementById('tablet-btn-sec-b');
    if (btnSecA) btnSecA.addEventListener('click', () => setSection('A'));
    if (btnSecB) btnSecB.addEventListener('click', () => setSection('B'));

    // Botones de navegación en Sidebar
    const navItems = document.querySelectorAll('.tablet-nav-item');
    navItems.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const view = btn.dataset.view;
        if (view) {
          e.preventDefault();
          setView(view);
          if (window.innerWidth <= 900) {
            closeSidebar();
          }
        }
      });
    });

    // Toggle de Sidebar para modo portrait
    const toggleBtn = document.getElementById('tablet-sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleSidebar);
    }

    // Buscador interactivo
    const searchInput = document.getElementById('tablet-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        renderView();
      });
    }

    // Rotación y redimensionado de pantalla
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
  }

  /**
   * Manejador de rotación (garantiza persistencia estricta de estado)
   */
  function handleOrientationChange() {
    // Pequeño timeout para permitir que el motor de render actualice innerWidth
    setTimeout(() => {
      handleResize();
    }, 150);
  }

  function handleResize() {
    const isLandscape = window.innerWidth > window.innerHeight;
    const sidebar = document.getElementById('tablet-sidebar');
    if (isLandscape && sidebar) {
      sidebar.classList.remove('is-open');
      state.sidebarOpen = false;
    }
    // Re-renderizado suave del inspector o vista si cambian columnas
    renderInspector();
  }

  function toggleSidebar() {
    state.sidebarOpen = !state.sidebarOpen;
    const sidebar = document.getElementById('tablet-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('is-open', state.sidebarOpen);
    }
  }

  function closeSidebar() {
    state.sidebarOpen = false;
    const sidebar = document.getElementById('tablet-sidebar');
    if (sidebar) sidebar.classList.remove('is-open');
  }

  /**
   * Cambia la sección activa (A o B) y actualiza reactivamente toda la UI
   */
  function setSection(sec) {
    if (sec !== 'A' && sec !== 'B') return;
    state.activeSection = sec;
    localStorage.setItem(STORAGE_KEY_SECTION, sec);
    updateSectionButtons();
    renderView();
    renderInspector();
  }

  function updateSectionButtons() {
    const btnA = document.getElementById('tablet-btn-sec-a');
    const btnB = document.getElementById('tablet-btn-sec-b');
    if (btnA && btnB) {
      btnA.classList.toggle('active', state.activeSection === 'A');
      btnB.classList.toggle('active', state.activeSection === 'B');
    }
  }

  /**
   * Cambia de vista principal
   */
  function setView(viewName) {
    state.activeView = viewName;
    sessionStorage.setItem(STORAGE_KEY_LAST_VIEW, viewName);

    // Actualizar clase activa en Sidebar
    const navItems = document.querySelectorAll('.tablet-nav-item');
    navItems.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    renderView();
  }

  /**
   * Selecciona una materia para la vista Split-View
   */
  function selectSubject(materiaId) {
    state.selectedSubjectId = materiaId;
    state.subjectTab = 'resumen';
    sessionStorage.setItem(STORAGE_KEY_LAST_SUBJECT, materiaId);
    if (state.activeView !== 'materias') {
      setView('materias');
    } else {
      renderMateriasView();
    }
  }

  /**
   * Renderizador orquestador según la vista activa
   */
  function renderView() {
    const container = document.getElementById('tablet-stage-body');
    const titleEl = document.getElementById('tablet-view-title');
    if (!container) return;

    switch (state.activeView) {
      case 'dashboard':
        if (titleEl) titleEl.innerHTML = '✦ Centro de Control · Grupo 415';
        renderDashboard(container);
        break;
      case 'materias':
        if (titleEl) titleEl.innerHTML = '📚 Materias Académicas';
        renderMateriasView(container);
        break;
      case 'horario':
        if (titleEl) titleEl.innerHTML = '📅 Horario Semanal Completo';
        renderHorarioView(container);
        break;
      case 'archivos':
        if (titleEl) titleEl.innerHTML = '📄 Recursos y Lecturas Oficiales';
        renderArchivosView(container);
        break;
      case 'herramientas':
        if (titleEl) titleEl.innerHTML = '🛠 Herramientas y Materiales';
        renderHerramientasView(container);
        break;
      case 'evento-tenorio':
        if (titleEl) titleEl.innerHTML = '🎭 Don Juan Tenorio Clásico';
        renderEventoTenorioView(container);
        break;
      default:
        renderDashboard(container);
    }
  }

  // ----------------------------------------------------
  // VISTA 1: DASHBOARD / CENTRO DE CONTROL INTEGRAL
  // ----------------------------------------------------
  function renderDashboard(container) {
    const data = getData();
    const sec = state.activeSection;
    const refDate = new Date();

    // 1. Tareas activas (con filtro de sección)
    const tareasActivas = data.tareas.filter((t) => {
      if (t.seccion !== 'Todas' && t.seccion !== sec) return false;
      const c = DataStore.clasificarElemento(t, 'tarea', refDate);
      return c.esActual;
    });

    // 2. Avisos actuales
    const avisosActivos = data.avisos.filter((av) => {
      if (av.seccion !== 'Todas' && av.seccion !== sec) return false;
      const c = DataStore.clasificarElemento(av, 'aviso', refDate);
      return c.esActual;
    });

    // 3. Exámenes próximos
    const examenesProximos = data.examenes.filter((ex) => {
      if (ex.seccion !== 'Todas' && ex.seccion !== sec) return false;
      const c = DataStore.clasificarElemento(ex, 'examen', refDate);
      return c.esActual;
    });

    let html = `
      <!-- HERO PRINCIPAL CON CLASE EN VIVO (AHORA Y DESPUÉS) -->
      <section class="tablet-live-hero" id="tablet-dashboard-hero">
        <!-- Contenido inyectado dinámicamente por liveTracker -->
        <div id="tablet-hero-dynamic-content">Cargando horario en vivo...</div>
      </section>

      <!-- SECCIÓN DE ACCESO RÁPIDO Y ALERTAS ACADÉMICAS -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px;">
        
        <!-- Tarjeta de Tareas Activas -->
        <div style="background:var(--c-tablet-panel); border:1px solid var(--c-tablet-border); border-radius:var(--tablet-radius-panel); padding:20px; display:flex; flex-direction:column; gap:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:0.75rem; font-weight:800; color:var(--c-cempasuchil); text-transform:uppercase; letter-spacing:0.1em; display:flex; align-items:center; gap:6px;">
              <span>⚡</span> Tareas Vigentes (${tareasActivas.length})
            </div>
            <button class="tablet-section-btn" onclick="TabletApp415.setView('materias')" style="font-size:0.75rem; color:var(--c-oro);">Ver todas ›</button>
          </div>
    `;

    if (tareasActivas.length === 0) {
      html += `
        <div style="padding:20px; text-align:center; color:var(--c-hueso-tertiary); font-size:0.85rem;">
          ✓ Sin tareas pendientes en la Sección ${sec}.
        </div>
      `;
    } else {
      tareasActivas.forEach((t) => {
        const mat = data.materias.find((m) => m.id === t.materiaId);
        const matNombre = mat ? mat.nombre : t.materiaId;
        html += `
          <div style="background:rgba(42,45,52,0.4); border-left:3px solid var(--c-cempasuchil); border-radius:var(--radius-sm); padding:14px 16px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="font-size:0.72rem; font-weight:800; color:var(--c-cempasuchil); text-transform:uppercase;">${matNombre}</span>
              <span style="font-size:0.72rem; color:var(--c-oro); font-family:var(--font-family-mono);">${t.fechaEntrega}</span>
            </div>
            <h4 style="margin:0 0 6px 0; font-size:0.95rem; font-weight:700; color:var(--c-hueso);">${t.titulo}</h4>
            <p style="margin:0; font-size:0.82rem; color:var(--c-hueso-secondary); line-height:1.4;">${t.indicaciones}</p>
          </div>
        `;
      });
    }

    html += `
        </div>

        <!-- Tarjeta de Avisos Relevantes -->
        <div style="background:var(--c-tablet-panel); border:1px solid var(--c-tablet-border); border-radius:var(--tablet-radius-panel); padding:20px; display:flex; flex-direction:column; gap:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:0.75rem; font-weight:800; color:var(--c-oro); text-transform:uppercase; letter-spacing:0.1em; display:flex; align-items:center; gap:6px;">
              <span>🔔</span> Avisos y Convocatorias (${avisosActivos.length})
            </div>
          </div>
    `;

    if (avisosActivos.length === 0) {
      html += `
        <div style="padding:20px; text-align:center; color:var(--c-hueso-tertiary); font-size:0.85rem;">
          Sin avisos docentes urgentes hoy.
        </div>
      `;
    } else {
      avisosActivos.forEach((av) => {
        html += `
          <div style="background:rgba(42,45,52,0.4); border-left:3px solid var(--c-oro); border-radius:var(--radius-sm); padding:14px 16px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="font-size:0.72rem; font-weight:800; color:var(--c-oro); text-transform:uppercase;">${av.materiaId.toUpperCase()}</span>
              <span style="font-size:0.72rem; color:var(--c-hueso-tertiary);">${av.fechaPublicacion || ''}</span>
            </div>
            <h4 style="margin:0 0 4px 0; font-size:0.95rem; font-weight:700; color:var(--c-hueso);">${av.titulo}</h4>
            <p style="margin:0; font-size:0.82rem; color:var(--c-hueso-secondary); line-height:1.4;">${av.contenido}</p>
          </div>
        `;
      });
    }

    html += `
        </div>
      </div>

      <!-- DOCK DE CONTEXTO PARA TABLETS EN PORTRAIT O PANTALLAS COMPACTAS -->
      <div class="tablet-inspector-portrait-dock">
        <!-- Don Juan Tenorio Clásico Highlight -->
        ${renderTheatricalCardHtml()}
      </div>

      <!-- MATRIZ DE MATERIAS OFICIALES (12 MATERIAS) -->
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="margin:0; font-size:1.1rem; font-weight:800; color:var(--c-hueso);">
            Asignaturas del 415 · Sección ${sec}
          </h3>
          <span style="font-size:0.78rem; color:var(--c-hueso-tertiary);">12 asignaturas SiHo oficiales</span>
        </div>
        <div class="tablet-subjects-grid">
    `;

    // Filtro de búsqueda
    const filteredMaterias = data.materias.filter((m) => {
      if (!state.searchQuery) return true;
      return m.nombre.toLowerCase().includes(state.searchQuery) || m.clave.includes(state.searchQuery);
    });

    filteredMaterias.forEach((m) => {
      const { actual } = (typeof DataStore !== 'undefined' && DataStore.getContenidoMateria) ? DataStore.getContenidoMateria(m.id, sec, refDate) : { actual: { tareas: [], avisos: [], examenes: [], archivos: [] } };
      const hasPending = actual.tareas.length > 0 || actual.avisos.length > 0 || actual.examenes.length > 0;
      let statusLabel = hasPending ? 'Pendientes activos' : 'Al corriente';
      let statusClass = hasPending ? 'active' : 'clear';

      if (m.id === 'ingles' && sec === 'A') {
        statusLabel = 'Take a break ☕';
        statusClass = 'clear';
      } else if (m.id === 'orientacion-educativa' && sec === 'A') {
        statusLabel = 'Bandeja en pausa 🌱';
        statusClass = 'clear';
      }

      html += `
        <div class="tablet-subject-card" onclick="TabletApp415.selectSubject('${m.id}')" role="button" tabindex="0">
          <div class="tablet-subject-card-head">
            <span class="tablet-subject-code">Clave ${m.clave}</span>
            <span class="tablet-subject-status-pill ${statusClass}">${statusLabel}</span>
          </div>
          <div class="tablet-subject-name">${m.nombre}</div>
          <div class="tablet-subject-salones">
            ${m.salones.join(' · ')}
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
    updateHeroClass();
  }

  // ----------------------------------------------------
  // VISTA 2: MATERIAS (SPLIT-VIEW EXCLUSIVO DE TABLET)
  // ----------------------------------------------------
  function renderMateriasView(container) {
    if (!container) container = document.getElementById('tablet-stage-body');
    if (!container) return;

    const data = getData();
    const sec = state.activeSection;
    const refDate = new Date();
    const currentMateria = data.materias.find((m) => m.id === state.selectedSubjectId) || data.materias[0];

    let html = `
      <div style="display:grid; grid-template-columns: 280px 1fr; gap:20px; align-items:start;">
        
        <!-- COLUMNA IZQUIERDA: SELECTOR DE MATERIAS CON BADGES -->
        <div style="background:var(--c-tablet-panel); border:1px solid var(--c-tablet-border); border-radius:var(--tablet-radius-panel); padding:16px; display:flex; flex-direction:column; gap:8px;">
          <div style="font-size:0.7rem; font-weight:800; color:var(--c-hueso-tertiary); text-transform:uppercase; letter-spacing:0.1em; padding:4px 8px;">
            Seleccionar Materia (Sec. ${sec})
          </div>
    `;

    data.materias.forEach((m) => {
      const isSelected = m.id === currentMateria.id;
      const { actual } = (typeof DataStore !== 'undefined' && DataStore.getContenidoMateria) ? DataStore.getContenidoMateria(m.id, sec, refDate) : { actual: { tareas: [], avisos: [], examenes: [], archivos: [] } };
      const count = actual.tareas.length + actual.avisos.length + actual.examenes.length;

      html += `
        <div 
          onclick="TabletApp415.selectSubject('${m.id}')"
          style="
            display:flex; justify-content:space-between; align-items:center; padding:12px 14px; border-radius:var(--radius-sm); cursor:pointer;
            background: ${isSelected ? 'rgba(255, 122, 0, 0.15)' : 'transparent'};
            border: 1px solid ${isSelected ? 'var(--c-cempasuchil-border)' : 'transparent'};
            color: ${isSelected ? 'var(--c-hueso)' : 'var(--c-hueso-secondary)'};
            font-weight: ${isSelected ? '700' : '600'};
            transition: all 0.2s;
          "
        >
          <div style="font-size:0.9rem; line-height:1.2;">${m.nombre}</div>
          ${count > 0 ? `<span style="font-size:0.7rem; background:var(--c-cempasuchil); color:var(--c-obsidiana); font-weight:800; padding:2px 6px; border-radius:var(--radius-pill);">${count}</span>` : ''}
        </div>
      `;
    });

    html += `
        </div>

        <!-- COLUMNA DERECHA: WORKSPACE DE LA MATERIA SELECCIONADA -->
        <div class="tablet-subject-workspace">
          
          <!-- Encabezado de la materia -->
          <div class="tablet-workspace-header">
            <div>
              <div style="font-size:0.72rem; font-weight:800; color:var(--c-cempasuchil); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:4px;">
                Asignatura Oficial · Clave ${currentMateria.clave}
              </div>
              <h2 style="margin:0 0 6px 0; font-size:1.6rem; font-weight:800; color:var(--c-hueso);">
                ${currentMateria.nombre}
              </h2>
              <p style="margin:0; font-size:0.88rem; color:var(--c-hueso-secondary); line-height:1.4;">
                ${currentMateria.descripcionCorta} · Salones: ${currentMateria.salones.join(', ')}
              </p>
            </div>
            
            <div style="display:flex; gap:8px;">
              <span class="tablet-section-btn active" style="font-size:0.75rem;">Sección ${sec}</span>
            </div>
          </div>

          <!-- Pestañas internas de la materia -->
          <div class="tablet-tabs-row">
            <button class="tablet-tab-btn ${state.subjectTab === 'resumen' ? 'active' : ''}" onclick="TabletApp415.setSubjectTab('resumen')">✦ Lo Reciente</button>
            <button class="tablet-tab-btn ${state.subjectTab === 'avisos' ? 'active' : ''}" onclick="TabletApp415.setSubjectTab('avisos')">🔔 Avisos</button>
            <button class="tablet-tab-btn ${state.subjectTab === 'tareas' ? 'active' : ''}" onclick="TabletApp415.setSubjectTab('tareas')">⚡ Tareas</button>
            <button class="tablet-tab-btn ${state.subjectTab === 'examenes' ? 'active' : ''}" onclick="TabletApp415.setSubjectTab('examenes')">📝 Exámenes</button>
            <button class="tablet-tab-btn ${state.subjectTab === 'archivos' ? 'active' : ''}" onclick="TabletApp415.setSubjectTab('archivos')">📄 Recursos PDF</button>
            <button class="tablet-tab-btn ${state.subjectTab === 'historial' ? 'active' : ''}" onclick="TabletApp415.setSubjectTab('historial')">🏛 Historial</button>
          </div>

          <!-- Contenido de la pestaña activa de la materia -->
          <div id="tablet-subject-tab-content">
            ${renderSubjectTabContent(currentMateria.id, sec, refDate)}
          </div>

        </div>

      </div>
    `;

    container.innerHTML = html;
  }

  function setSubjectTab(tabName) {
    state.subjectTab = tabName;
    const content = document.getElementById('tablet-subject-tab-content');
    if (content) {
      content.innerHTML = renderSubjectTabContent(state.selectedSubjectId, state.activeSection, new Date());
    }
    // Actualizar botones de pestaña
    const btns = document.querySelectorAll('.tablet-tab-btn');
    btns.forEach(b => {
      b.classList.toggle('active', b.textContent.toLowerCase().includes(tabName));
    });
  }

  function renderSubjectTabContent(materiaId, sec, refDate) {
    const data = getData();
    const { actual, historial } = (typeof DataStore !== 'undefined' && DataStore.getContenidoMateria) ? DataStore.getContenidoMateria(materiaId, sec, refDate) : { actual: { tareas: [], avisos: [], examenes: [], archivos: [] }, historial: { tareas: [], avisos: [], examenes: [], archivos: [] } };

    // Caso Especial: Inglés A
    if (materiaId === 'ingles' && sec === 'A' && (state.subjectTab === 'resumen' || state.subjectTab === 'tareas')) {
      return `
        <div style="padding:32px 24px; background:rgba(42,45,52,0.3); border-radius:var(--radius-md); text-align:center; border:1px dashed var(--c-copal-line);">
          <div style="font-size:2rem; margin-bottom:8px;">☕</div>
          <h3 style="margin:0 0 6px 0; color:var(--c-oro); font-size:1.15rem; font-weight:700;">English IV · Section A</h3>
          <p style="margin:0; color:var(--c-hueso-secondary); font-size:0.95rem; font-style:italic;">“Take a break. This space will be filled soon.”</p>
          <div style="font-size:0.75rem; color:var(--c-hueso-tertiary); margin-top:8px;">No hay tareas ni avisos urgentes en la Sección A.</div>
        </div>
      `;
    }

    // Caso Especial: Orientación Educativa A
    if (materiaId === 'orientacion-educativa' && sec === 'A' && (state.subjectTab === 'resumen' || state.subjectTab === 'tareas')) {
      return `
        <div style="padding:32px 24px; background:rgba(42,45,52,0.3); border-radius:var(--radius-md); text-align:center; border:1px dashed var(--c-copal-line);">
          <div style="font-size:2rem; margin-bottom:8px;">🌱</div>
          <h3 style="margin:0 0 6px 0; color:var(--c-oro); font-size:1.15rem; font-weight:700;">Orientación Educativa IV · Sección A</h3>
          <p style="margin:0; color:var(--c-hueso-secondary); font-size:0.95rem; font-style:italic;">“Descansa. Por ahora no hay pendientes aquí. Pronto esta bandeja volverá a llenarse.”</p>
        </div>
      `;
    }

    // PESTAÑA: RESUMEN / LO RECIENTE
    if (state.subjectTab === 'resumen') {
      let out = '';

      // Aviso especial Sección B si aplica
      if (typeof DataStore !== 'undefined' && DataStore.debeMostrarAvisoSeccionB(materiaId, sec)) {
        const mat = data.materias.find(function (m) { return m.id === materiaId; });
        const matNom = mat ? mat.nombre : materiaId;
        out += `
          <div style="background:linear-gradient(145deg, rgba(62,28,107,0.85) 0%, rgba(27,11,46,0.96) 100%); border:1px solid var(--c-oro-border); border-radius:var(--radius-md); padding:18px 20px; margin-bottom:16px; box-shadow:0 8px 24px rgba(10,4,20,0.45);">
            <div style="display:flex; align-items:flex-start; gap:12px; margin-bottom:12px;">
              <span style="font-size:1.5rem; line-height:1;">📢</span>
              <div>
                <span style="font-size:0.72rem; font-weight:800; color:var(--c-oro); text-transform:uppercase; letter-spacing:0.08em; display:block; margin-bottom:4px;">
                  Aviso para Sección B
                </span>
                <p style="margin:0; font-size:0.92rem; color:var(--c-hueso); font-weight:600; line-height:1.45;">
                  Encardomy by Shaminket no cuenta con información de esta sección. Si tú la tienes, puedes apoyarnos.
                </p>
              </div>
            </div>
            <button type="button" class="tablet-section-btn active" onclick="ColaboracionSeccionB.abrir('${matNom}', '${materiaId}')" style="width:100%; height:40px; justify-content:center; font-size:0.85rem; font-weight:800;">
              🤝 Ayúdanos con esta sección ›
            </button>
          </div>
        `;
      }
      
      // Aviso comercial de Geografía si aplica
      if (materiaId === 'geografia') {
        out += `
          <div style="background:linear-gradient(135deg, rgba(229,169,60,0.15) 0%, rgba(11,12,16,0.85) 100%); border:1px solid var(--c-oro-border); border-radius:var(--radius-md); padding:18px 20px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span style="font-size:0.7rem; font-weight:800; color:var(--c-oro); text-transform:uppercase;">Material de Clase</span>
              <span style="font-size:0.85rem; font-weight:800; color:var(--c-oro);">$30 pesos</span>
            </div>
            <h4 style="margin:0 0 6px 0; font-size:1.05rem; color:var(--c-hueso); font-weight:700;">Recuerda tener listas tus hojas membretadas.</h4>
            <p style="margin:0 0 12px 0; font-size:0.85rem; color:var(--c-hueso-secondary); line-height:1.4;">
              Si todavía no las tienes, puedes conseguirlas por $30 pesos mediante Encardomy y solicitar que te las lleven.
            </p>
            <button class="tablet-section-btn active" onclick="TabletApp415.abrirModalHojas()">Solicitar Hojas Membretadas ›</button>
          </div>
        `;
      }

      // Prompt de IA en Historia si aplica
      if (materiaId === 'historia') {
        out += `
          <div style="background:rgba(229,169,60,0.1); border:1px solid var(--c-oro-border); border-radius:var(--radius-md); padding:18px 20px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span style="font-size:0.7rem; font-weight:800; color:var(--c-oro); text-transform:uppercase;">Herramienta Académica Exclusiva</span>
              <span style="font-size:0.7rem; background:var(--c-oro-soft); color:var(--c-oro); padding:2px 8px; border-radius:var(--radius-pill); font-weight:800;">Prompt IA</span>
            </div>
            <h4 style="margin:0 0 6px 0; font-size:1.05rem; color:var(--c-hueso); font-weight:700;">Prompt Maestro para Resolver Ejercicios con IA</h4>
            <p style="margin:0 0 12px 0; font-size:0.82rem; color:var(--c-hueso-secondary); line-height:1.4;">
              Copia este prompt y pégalo en cualquier inteligencia artificial adjuntando tus ejercicios. Los resolverá paso a paso respetando estrictamente las instrucciones.
            </p>
            <button class="tablet-section-btn active" onclick="TabletApp415.copiarPromptIA()">📋 Copiar Prompt al Portapapeles ›</button>
          </div>
        `;
      }

      // Evento de Don Juan Tenorio si es Lengua Española
      if (materiaId === 'lengua-espanola') {
        out += renderTheatricalCardHtml();
      }

      // Tareas y avisos de la materia
      if (actual.tareas.length === 0 && actual.avisos.length === 0 && actual.examenes.length === 0) {
        out += `
          <div style="padding:28px; text-align:center; color:var(--c-hueso-tertiary); font-size:0.9rem; background:rgba(42,45,52,0.25); border-radius:var(--radius-md);">
            ✓ Materia al corriente. Sin tareas ni avisos asignados por el momento.
          </div>
        `;
      } else {
        if (actual.examenes.length > 0) {
          actual.examenes.forEach(ex => {
            out += `
              <div style="background:rgba(243,107,42,0.12); border-left:3px solid var(--c-cempasuchil); border-radius:var(--radius-sm); padding:14px; margin-bottom:10px;">
                <span style="font-size:0.7rem; font-weight:800; color:var(--c-cempasuchil); text-transform:uppercase;">Próxima Evaluación</span>
                <h4 style="margin:4px 0; font-size:1rem; color:var(--c-hueso);">${ex.titulo} (${ex.fecha})</h4>
                <p style="margin:0; font-size:0.82rem; color:var(--c-hueso-secondary);">${ex.descripcion}</p>
              </div>
            `;
          });
        }
        if (actual.tareas.length > 0) {
          actual.tareas.forEach(t => {
            out += `
              <div style="background:rgba(42,45,52,0.4); border-left:3px solid var(--c-cempasuchil); border-radius:var(--radius-sm); padding:14px; margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                  <span style="font-size:0.7rem; font-weight:800; color:var(--c-cempasuchil); text-transform:uppercase;">Tarea Activa</span>
                  <span style="font-size:0.72rem; color:var(--c-oro); font-family:var(--font-family-mono);">${t.fechaEntrega}</span>
                </div>
                <h4 style="margin:0 0 4px 0; font-size:1rem; color:var(--c-hueso);">${t.titulo}</h4>
                <p style="margin:0; font-size:0.82rem; color:var(--c-hueso-secondary);">${t.indicaciones}</p>
              </div>
            `;
          });
        }
        if (actual.avisos.length > 0) {
          actual.avisos.forEach(av => {
            out += `
              <div style="background:rgba(42,45,52,0.4); border-left:3px solid var(--c-oro); border-radius:var(--radius-sm); padding:14px; margin-bottom:10px;">
                <span style="font-size:0.7rem; font-weight:800; color:var(--c-oro); text-transform:uppercase;">Aviso</span>
                <h4 style="margin:4px 0; font-size:1rem; color:var(--c-hueso);">${av.titulo}</h4>
                <p style="margin:0; font-size:0.82rem; color:var(--c-hueso-secondary);">${av.contenido}</p>
              </div>
            `;
          });
        }
      }
      return out;
    }

    // PESTAÑA: HISTORIAL
    if (state.subjectTab === 'historial') {
      const items = [...historial.tareas, ...historial.avisos, ...historial.examenes];
      if (items.length === 0) {
        return `<div style="padding:28px; text-align:center; color:var(--c-hueso-tertiary); font-size:0.9rem;">Sin registros anteriores archivados.</div>`;
      }
      let hHtml = '<div style="display:flex; flex-direction:column; gap:10px;">';
      items.forEach(it => {
        hHtml += `
          <div style="padding:12px 14px; background:rgba(42,45,52,0.25); border-radius:var(--radius-sm); border:1px solid var(--c-tablet-border);">
            <div style="font-size:0.7rem; color:var(--c-hueso-tertiary); text-transform:uppercase;">${it.codigo || 'Registro concluido'}</div>
            <div style="font-size:0.92rem; font-weight:700; color:var(--c-hueso); margin:2px 0;">${it.titulo}</div>
            <div style="font-size:0.8rem; color:var(--c-hueso-secondary);">${it.indicaciones || it.contenido || it.descripcion || ''}</div>
          </div>
        `;
      });
      hHtml += '</div>';
      return hHtml;
    }

    return `<div style="padding:28px; text-align:center; color:var(--c-hueso-tertiary); font-size:0.9rem;">Información al corriente.</div>`;
  }

  // ----------------------------------------------------
  // VISTA 3: HORARIO INTEGRAL (PANORÁMICO SEMANAL)
  // ----------------------------------------------------
  function renderHorarioView(container) {
    if (!container) container = document.getElementById('tablet-stage-body');
    if (!container) return;

    const data = getData();
    const sec = state.activeSection;
    const now = new Date();
    const currentDay = now.getDay(); // 1 = Lun, ..., 5 = Vie

    const dias = [
      { id: 1, nombre: 'Lunes' },
      { id: 2, nombre: 'Martes' },
      { id: 3, nombre: 'Miércoles' },
      { id: 4, nombre: 'Jueves' },
      { id: 5, nombre: 'Viernes' }
    ];

    let html = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <p style="margin:0; font-size:0.9rem; color:var(--c-hueso-secondary);">
          Matriz completa de 30 horas semanales según SiHo oficial (Turno Matutino: 07:00 a 13:40).
        </p>
        <span class="tablet-section-btn active" style="font-size:0.75rem;">Sección ${sec}</span>
      </div>
      <div class="tablet-schedule-matrix">
    `;

    dias.forEach(d => {
      const isToday = d.id === currentDay;
      const sesiones = data.horarioSemanal.filter(c => c.dia === d.id && (c.seccion === null || c.seccion === sec));
      sesiones.sort((a, b) => a.inicio.localeCompare(b.inicio));

      html += `
        <div class="tablet-schedule-day-col ${isToday ? 'is-today' : ''}">
          <div class="tablet-schedule-day-head">
            <span>${d.nombre}</span>
            <span style="font-size:0.7rem; opacity:0.8;">${sesiones.length} hrs</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:8px;">
      `;

      sesiones.forEach(s => {
        const mat = data.materias.find(m => m.id === s.materiaId);
        const matNombre = mat ? mat.nombre : s.materiaId;
        html += `
          <div class="tablet-schedule-session-card" onclick="TabletApp415.selectSubject('${s.materiaId}')" style="cursor:pointer;">
            <div style="font-family:var(--font-family-mono); font-size:0.68rem; color:var(--c-oro); font-weight:700;">
              ${s.inicio} - ${s.fin}
            </div>
            <strong style="color:var(--c-hueso);">${matNombre}</strong>
            <span style="color:var(--c-hueso-tertiary); font-size:0.72rem;">Salón ${s.salon}</span>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  // ----------------------------------------------------
  // VISTA 4: ARCHIVOS Y RECURSOS OFICIALES
  // ----------------------------------------------------
  function renderArchivosView(container) {
    if (!container) container = document.getElementById('tablet-stage-body');
    if (!container) return;

    const data = getData();
    const archivos = data.archivos || [];

    let html = `
      <div style="margin-bottom:12px;">
        <p style="margin:0; font-size:0.9rem; color:var(--c-hueso-secondary);">
          Biblioteca central de documentos, lecturas y calendarios con acceso directo a Google Drive.
        </p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:18px;">
    `;

    archivos.forEach(ar => {
      html += `
        <div style="background:var(--c-tablet-panel); border:1px solid var(--c-tablet-border); border-radius:var(--tablet-radius-panel); padding:20px; display:flex; flex-direction:column; justify-content:space-between; gap:12px;">
          <div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span style="font-family:var(--font-family-mono); font-size:0.7rem; color:var(--c-oro); font-weight:700;">${ar.codigo}</span>
              <span style="font-size:0.7rem; color:var(--c-hueso-tertiary);">${ar.categoria || 'PDF'}</span>
            </div>
            <h4 style="margin:0 0 6px 0; font-size:1.05rem; color:var(--c-hueso); font-weight:700;">${ar.nombre}</h4>
            <p style="margin:0; font-size:0.82rem; color:var(--c-hueso-secondary); line-height:1.4;">${ar.descripcion}</p>
          </div>
          <div style="border-top:1px solid var(--c-tablet-border); padding-top:12px; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.75rem; color:var(--c-hueso-tertiary);">${ar.tamano} · ${ar.paginas} págs</span>
            <a href="${ar.url}" target="_blank" rel="noopener noreferrer" class="tablet-section-btn active" style="text-decoration:none; font-size:0.75rem;">
              ↗ Abrir Drive
            </a>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  // ----------------------------------------------------
  // VISTA 5: HERRAMIENTAS Y MATERIALES
  // ----------------------------------------------------
  function renderHerramientasView(container) {
    if (!container) container = document.getElementById('tablet-stage-body');
    if (!container) return;

    let html = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(360px, 1fr)); gap:20px;">
        
        <!-- Tarjeta de Hojas Membretadas -->
        <div style="background:var(--c-tablet-panel); border:1px solid var(--c-oro-border); border-radius:var(--tablet-radius-panel); padding:24px; display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.75rem; font-weight:800; color:var(--c-oro); text-transform:uppercase; letter-spacing:0.1em;">
              📜 Material de Clase · Geografía
            </span>
            <span style="font-size:1rem; font-weight:800; color:var(--c-oro);">$30 pesos</span>
          </div>
          <div>
            <h3 style="margin:0 0 8px 0; font-size:1.25rem; font-weight:800; color:var(--c-hueso);">
              Recuerda tener listas tus hojas membretadas.
            </h3>
            <p style="margin:0; font-size:0.88rem; color:var(--c-hueso-secondary); line-height:1.45;">
              Si todavía no las tienes, puedes conseguirlas por <strong>$30 pesos</strong> mediante Encardomy y solicitar que te las lleven.
            </p>
          </div>
          <button class="tablet-section-btn active" onclick="TabletApp415.abrirModalHojas()" style="height:44px; font-size:0.9rem;">
            Pedir Hojas Membretadas ($30) ›
          </button>
        </div>

        <!-- Tarjeta de Prompt Maestro para Resolver Ejercicios -->
        <div style="background:var(--c-tablet-panel); border:1px solid var(--c-tablet-border); border-radius:var(--tablet-radius-panel); padding:24px; display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.75rem; font-weight:800; color:var(--c-cempasuchil); text-transform:uppercase; letter-spacing:0.1em;">
              🎁 Regalo 415 · Herramienta IA
            </span>
            <span style="font-size:0.7rem; background:var(--c-cempasuchil-soft); color:var(--c-cempasuchil); padding:3px 8px; border-radius:var(--radius-pill); font-weight:800;">Reutilizable</span>
          </div>
          <div>
            <h3 style="margin:0 0 8px 0; font-size:1.25rem; font-weight:800; color:var(--c-hueso);">
              Prompt Maestro para Resolver Ejercicios con IA
            </h3>
            <p style="margin:0; font-size:0.88rem; color:var(--c-hueso-secondary); line-height:1.45;">
              Copia este prompt y pégalo en ChatGPT, Claude o Gemini adjuntando la fotografía o archivo de tus ejercicios para obtener el procedimiento paso a paso.
            </p>
          </div>
          <button class="tablet-section-btn active" onclick="TabletApp415.copiarPromptIA()" style="height:44px; font-size:0.9rem;">
            📋 Copiar Prompt al Portapapeles ›
          </button>
        </div>

      </div>
    `;

    container.innerHTML = html;
  }

  // ----------------------------------------------------
  // VISTA 6: EVENTO CULTURAL DON JUAN TENORIO
  // ----------------------------------------------------
  function renderEventoTenorioView(container) {
    if (!container) container = document.getElementById('tablet-stage-body');
    if (!container) return;

    let html = `
      <div style="max-width:800px; margin:0 auto; width:100%;">
        ${renderTheatricalCardHtml()}
      </div>
    `;
    container.innerHTML = html;
  }

  // ----------------------------------------------------
  // COMPONENTES AUXILIARES: CARTEL TEATRAL (SIN IMAGEN)
  // ----------------------------------------------------
  function renderTheatricalCardHtml() {
    const gcalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('Don Juan Tenorio Clásico - Teatro Xola Julio Prieto') + '&dates=20261017T160000Z/20261017T180000Z&details=' + encodeURIComponent('Puesta en escena de Don Juan Tenorio Clásico de José Zorrilla. Dirección: Félix Maldonado. Compañía: SKENIKA. Costo: $300. Informes: 55 22 99 89 49. Asistencia sugerida Grupo 415 Lengua Española ENP 4.') + '&location=' + encodeURIComponent('Teatro Xola Julio Prieto, Eje 4 Sur 809, Col. del Valle, Benito Juárez, CDMX');

    return `
      <div class="tablet-theatrical-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.7rem; font-weight:800; color:var(--c-oro); background:var(--c-oro-soft); padding:3px 10px; border-radius:var(--radius-pill); text-transform:uppercase; letter-spacing:0.1em;">
            🎭 Puesta en Escena · Lengua Española
          </span>
          <span style="font-family:var(--font-family-mono); font-size:0.75rem; color:var(--c-oro); font-weight:700;">17/Oct/2026</span>
        </div>

        <div>
          <h3 style="margin:0 0 4px 0; font-size:1.35rem; font-weight:800; color:var(--c-hueso); font-family:Georgia, serif; letter-spacing:0.02em;">
            Don Juan Tenorio Clásico
          </h3>
          <p style="margin:0 0 12px 0; font-size:0.85rem; color:var(--c-oro); font-style:italic;">
            SKENIKA · Dirección: Félix Maldonado · Texto: José Zorrilla
          </p>

          <div style="background:rgba(11,12,16,0.6); border:1px solid var(--c-copal-line); border-radius:var(--radius-sm); padding:12px 14px; font-size:0.82rem; color:var(--c-hueso-secondary); line-height:1.5; display:flex; flex-direction:column; gap:4px;">
            <div>📍 <strong>Lugar:</strong> Teatro Xola • Julio Prieto (Eje 4 Sur 809, Col. del Valle, CDMX)</div>
            <div>🗓 <strong>Fecha y Hora:</strong> Sábado 17 de octubre de 2026 · 10:00 AM</div>
            <div>🎟 <strong>Costo:</strong> $300 pesos</div>
            <div>📞 <strong>Informes y reservaciones:</strong> 55 22 99 89 49</div>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          <a href="${gcalUrl}" target="_blank" rel="noopener noreferrer" class="tablet-section-btn active" style="text-decoration:none; text-align:center; height:42px; display:flex; align-items:center; justify-content:center; font-size:0.85rem;">
            📅 Agregar a Google Calendar ›
          </a>

          <div style="background:rgba(42,45,52,0.3); border-radius:var(--radius-sm); padding:10px 12px; font-size:0.78rem; color:var(--c-hueso-secondary); line-height:1.4;">
            <strong style="color:var(--c-oro);">🎟 Venta y Reserva de Boletos:</strong> Para esta función matutina escolar, la adquisición de boletos ($300 pesos) se realiza directamente por teléfono o en taquilla del teatro (sin intermediarios de terceros):
            <div style="margin-top:8px; display:flex; gap:8px;">
              <a href="tel:5522998949" class="tablet-section-btn" style="flex:1; text-align:center; text-decoration:none; font-size:0.75rem; border:1px solid var(--c-oro-border); color:var(--c-oro);">
                📞 55 22 99 89 49
              </a>
              <a href="https://wa.me/525522998949?text=Hola,%20solicito%20informes%20y%20boletos%20para%20Don%20Juan%20Tenorio%20el%2017%20de%20octubre%20en%20el%20Teatro%20Xola" target="_blank" rel="noopener noreferrer" class="tablet-section-btn" style="flex:1; text-align:center; text-decoration:none; font-size:0.75rem; border:1px solid rgba(37,211,102,0.4); color:#25D366;">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ----------------------------------------------------
  // INSPECTOR DERECHO (CONTEXTO SIMULTÁNEO EN TABLET GRANDE/MEDIANA)
  // ----------------------------------------------------
  function renderInspector() {
    const inspector = document.getElementById('tablet-inspector');
    if (!inspector) return;

    // Si la orientación es portrait o ancho < 900px, el inspector permanece oculto por CSS
    if (window.innerWidth <= 900 || window.innerHeight > window.innerWidth) {
      return;
    }

    const data = getData();
    const sec = state.activeSection;

    let html = `
      <div>
        <div class="tablet-inspector-heading">Evento Cultural Destacado</div>
        ${renderTheatricalCardHtml()}
      </div>

      <div style="background:var(--c-tablet-panel); border:1px solid var(--c-tablet-border); border-radius:var(--radius-md); padding:16px; display:flex; flex-direction:column; gap:10px;">
        <div class="tablet-inspector-heading" style="color:var(--c-cempasuchil);">Próxima Evaluación</div>
        <div>
          <div style="font-size:0.72rem; color:var(--c-cempasuchil); font-weight:800; text-transform:uppercase;">Física III</div>
          <h4 style="margin:2px 0 4px; font-size:0.95rem; color:var(--c-hueso);">Examen Parcial</h4>
          <p style="margin:0; font-size:0.8rem; color:var(--c-hueso-secondary);">Lunes 28 de septiembre de 2026</p>
        </div>
      </div>

      <div style="background:var(--c-tablet-panel); border:1px solid var(--c-oro-border); border-radius:var(--radius-md); padding:16px; display:flex; flex-direction:column; gap:10px;">
        <div class="tablet-inspector-heading">Hojas Membretadas ($30)</div>
        <p style="margin:0; font-size:0.8rem; color:var(--c-hueso-secondary); line-height:1.4;">
          Solicita tus hojas membretadas para Geografía mediante Encardomy.
        </p>
        <button class="tablet-section-btn active" onclick="TabletApp415.abrirModalHojas()" style="font-size:0.75rem;">
          Solicitar por WhatsApp ›
        </button>
      </div>
    `;

    inspector.innerHTML = html;
  }

  // ----------------------------------------------------
  // TRACKER DE CLASES EN VIVO Y RELOJ CONTINUO
  // ----------------------------------------------------
  function startClockAndLiveTracker() {
    updateHeroClass();
    updateMiniFooterClock();

    setInterval(() => {
      updateHeroClass();
      updateMiniFooterClock();
    }, 1000);
  }

  function updateMiniFooterClock() {
    const clockEl = document.getElementById('tablet-mini-clock');
    if (!clockEl) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;
  }

  function updateHeroClass() {
    const targetEl = document.getElementById('tablet-hero-dynamic-content');
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

    // Buscar clase activa y siguiente
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
        <div class="tablet-live-hero-grid">
          <div class="tablet-live-now-col">
            <div class="tablet-live-badge-row">
              <span class="tablet-badge-now">● AHORA EN CLASE</span>
              <span style="font-family:var(--font-family-mono); font-size:0.8rem; color:var(--c-oro); font-weight:700;">${claseActual.inicio} - ${claseActual.fin}</span>
            </div>
            <div class="tablet-live-subject-name">${matNombre}</div>
            <div class="tablet-live-meta-row">
              <span>Salón: <strong>${claseActual.salon}</strong> (Sec. ${sec})</span>
              <span>⏳ Quedan <strong>${minutosTerminar} minutos</strong></span>
            </div>
            <div class="tablet-progress-bar-wrap">
              <div class="tablet-progress-bar-fill" style="width: ${porcentaje}%;"></div>
            </div>
          </div>

          <div class="tablet-live-next-col">
            <div style="font-size:0.68rem; font-weight:800; color:var(--c-oro); text-transform:uppercase; letter-spacing:0.1em;">
              # DESPUÉS
            </div>
            ${siguienteClase ? `
              <div style="font-size:1.05rem; font-weight:700; color:var(--c-hueso);">
                ${(data.materias.find(m => m.id === siguienteClase.materiaId) || {}).nombre || siguienteClase.materiaId}
              </div>
              <div style="font-size:0.8rem; color:var(--c-hueso-secondary);">
                Salón ${siguienteClase.salon} · Inicia en <strong>${minutosSiguiente} min</strong> (${siguienteClase.inicio})
              </div>
            ` : `
              <div style="font-size:0.85rem; color:var(--c-hueso-tertiary);">
                No hay más clases programadas para esta jornada.
              </div>
            `}
          </div>
        </div>
      `;
    } else {
      let detalle = 'Revisa tu horario completo para consultar la siguiente jornada.';
      if (day === 0 || day === 6) {
        detalle = 'Fin de Semana · Próxima jornada el Lunes a las 07:00 AM';
      } else if (curTimeStr < '07:00') {
        detalle = 'La primera clase del día comienza a las 07:00 AM';
      } else if (curTimeStr >= '13:40') {
        detalle = 'Jornada escolar concluida por hoy en el turno matutino.';
      }

      targetEl.innerHTML = `
        <div class="tablet-live-hero-grid">
          <div class="tablet-live-now-col">
            <div class="tablet-live-badge-row">
              <span style="font-size:0.68rem; font-weight:800; background:rgba(247,244,238,0.1); color:var(--c-hueso); padding:3px 10px; border-radius:var(--radius-pill); text-transform:uppercase;">
                ⏸ Pausa / Sin clase
              </span>
              <span style="font-family:var(--font-family-mono); font-size:0.8rem; color:var(--c-hueso-tertiary); font-weight:700;">${curTimeStr}</span>
            </div>
            <div class="tablet-live-subject-name" style="font-size:1.4rem;">Intermedio / Fuera de horario</div>
            <div style="font-size:0.85rem; color:var(--c-hueso-secondary);">${detalle}</div>
          </div>

          <div class="tablet-live-next-col">
            <div style="font-size:0.68rem; font-weight:800; color:var(--c-oro); text-transform:uppercase; letter-spacing:0.1em;">
              # PRÓXIMA SESIÓN
            </div>
            ${siguienteClase ? `
              <div style="font-size:1.05rem; font-weight:700; color:var(--c-hueso);">
                ${(data.materias.find(m => m.id === siguienteClase.materiaId) || {}).nombre || siguienteClase.materiaId}
              </div>
              <div style="font-size:0.8rem; color:var(--c-hueso-secondary);">
                Salón ${siguienteClase.salon} · Inicia en <strong>${minutosSiguiente} min</strong> (${siguienteClase.inicio})
              </div>
            ` : `
              <div style="font-size:0.85rem; color:var(--c-hueso-tertiary);">
                Consulta el calendario anual para próximas fechas de examen.
              </div>
            `}
          </div>
        </div>
      `;
    }
  }

  // ----------------------------------------------------
  // MODAL HOJAS MEMBRETADAS (ENCARDOMY $30)
  // ----------------------------------------------------
  function abrirModalHojas() {
    const modal = document.getElementById('tablet-modal-hojas');
    if (modal) {
      modal.style.display = 'flex';
      const inp = document.getElementById('tablet-input-nombre-apellidos');
      if (inp) setTimeout(() => inp.focus(), 150);
    }
  }

  function cerrarModalHojas() {
    const modal = document.getElementById('tablet-modal-hojas');
    if (modal) modal.style.display = 'none';
  }

  function confirmarEnvioHojasWhatsApp() {
    const inp = document.getElementById('tablet-input-nombre-apellidos');
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

  // ----------------------------------------------------
  // COPIAR PROMPT DE IA
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // TOAST DE NOTIFICACIÓN TÁCTIL
  // ----------------------------------------------------
  function mostrarToast(mensaje) {
    let t = document.getElementById('tablet-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'tablet-toast';
      t.style.cssText = 'position:fixed; bottom:calc(var(--sab, 0px) + 24px); left:50%; transform:translateX(-50%); background:rgba(42,45,52,0.95); border:1px solid var(--c-oro-border); color:var(--c-hueso); padding:10px 22px; border-radius:var(--radius-pill); font-size:0.85rem; font-weight:700; z-index:300; box-shadow:0 8px 30px rgba(0,0,0,0.6); backdrop-filter:blur(16px); pointer-events:none; transition:opacity 0.25s, transform 0.25s;';
      document.body.appendChild(t);
    }
    t.textContent = mensaje;
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateX(-50%) translateY(8px)';
    }, 2500);
  }

  // ----------------------------------------------------
  // CANVAS AMBIENTAL SUAVE DE DÍA DE MUERTOS
  // ----------------------------------------------------
  function initAmbientCanvas() {
    const canvas = document.getElementById('tablet-ambient-canvas');
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
    const count = 28;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
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
    setView,
    setSection,
    selectSubject,
    setSubjectTab,
    abrirModalHojas,
    cerrarModalHojas,
    confirmarEnvioHojasWhatsApp,
    copiarPromptIA,
    mostrarToast
  };
})();

// Inicializar al cargar el DOM si estamos en ipad-index.html
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('ipad-index.html')) {
      TabletApp415.init();
    }
  });
}
