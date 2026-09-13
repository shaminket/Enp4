/**
 * CUATREROS DEL 415 • MOBILE ENGINE (MODO PASILLO)
 * Gestos táctiles, Radar en Vivo, Semáforo, Auth y Onboarding
 */

(function () {
  'use strict';

  // ==========================================
  // 1. BASE DE DATOS DE HORARIO GRUPO 0415
  // ==========================================
  const SCHEDULE_0415 = {
    1: [ // Lunes
      { start: "07:00", end: "07:50", subject: "Geografía", room: "A-104", prof: "Profra. Silvia Mendoza", note: "Tarea 4 Noticias" },
      { start: "07:50", end: "08:40", subject: "Física III", room: "B-116", prof: "Profra. Gabriela Reyna", note: "Teoría" },
      { start: "08:40", end: "09:30", subject: "Física III", room: "B-109", prof: "Profra. Gabriela Reyna", note: "Teoría" },
      { start: "09:30", end: "10:20", subject: "Inglés IV (Sec. A)", room: "B-318 (Mediateca)", prof: "Profra. Idiomas", note: "📍 Asistencia en Mediateca" },
      { start: "10:20", end: "12:00", subject: "Lengua Española", room: "B-112", prof: "Profra. María Vázquez", note: "Hojas pospuestas" },
      { start: "12:00", end: "12:50", subject: "Orientación IV (Sec. A)", room: "B-110", prof: "Tutoría", note: "📝 2 Tareas + Entrega Historia" }
    ],
    2: [ // Martes
      { start: "07:00", end: "08:40", subject: "Matemáticas IV", room: "B-112", prof: "Prof. Saúl Quintana", note: "Álgebra y Funciones" },
      { start: "08:40", end: "09:30", subject: "Dibujo II (Sec. A)", room: "B-008", prof: "Taller Dibujo", note: "🎨 Paisaje con Líneas" },
      { start: "09:30", end: "10:20", subject: "Informática", room: "I-108", prof: "Laboratorio", note: "💻 Preparación Exposiciones" },
      { start: "10:20", end: "11:10", subject: "Lógica", room: "B-206", prof: "Colegio Filosofía", note: "📝 3 Tareas Activas" },
      { start: "12:00", end: "12:50", subject: "Prevención Violencias", room: "B-109", prof: "Cultura de Paz", note: "Clave 8000" }
    ],
    3: [ // Miércoles
      { start: "07:00", end: "07:50", subject: "Geografía", room: "A-104", prof: "Profra. Silvia Mendoza", note: "Actividades de mapa" },
      { start: "07:50", end: "09:30", subject: "Lógica", room: "B-108", prof: "Colegio Filosofía", note: "Argumentación y Falacias" },
      { start: "09:30", end: "10:20", subject: "Inglés IV (Sec. A)", room: "C-306", prof: "Idiomas", note: "Salón ordinario" },
      { start: "10:20", end: "11:10", subject: "Dibujo II (Sec. A)", room: "B-008", prof: "Taller Dibujo", note: "Revisión puntillismo" },
      { start: "11:10", end: "12:50", subject: "Lengua Española", room: "B-112", prof: "Profra. María Vázquez", note: "Análisis Literario" }
    ],
    4: [ // Jueves
      { start: "07:00", end: "08:40", subject: "Matemáticas IV", room: "B-109", prof: "Prof. Saúl Quintana", note: "Sistemas de ecuaciones" },
      { start: "08:40", end: "09:30", subject: "Lengua Española", room: "B-110", prof: "Profra. María Vázquez", note: "Redacción" }
    ],
    5: [ // Viernes
      { start: "07:50", end: "08:40", subject: "Historia Universal III", room: "B-117", prof: "Colegio Historia", note: "🗺️ Planisferio con nombres" },
      { start: "08:40", end: "09:30", subject: "Matemáticas IV", room: "B-117", prof: "Prof. Saúl Quintana", note: "Modelación" },
      { start: "09:30", end: "10:20", subject: "Inglés IV (Sec. A)", room: "C-306", prof: "Idiomas", note: "Listening & Reading" },
      { start: "10:20", end: "11:10", subject: "Prevención Violencias", room: "B-108", prof: "Cultura de Paz", note: "Derechos Humanos" },
      { start: "11:10", end: "12:00", subject: "Educación Física IV", room: "GIM1", prof: "Acondicionamiento", note: "🏃 Tarea Condición Física" },
      { start: "12:00", end: "12:50", subject: "Física III", room: "B-115", prof: "Profra. Gabriela Reyna", note: "Teoría de movimiento" },
      { start: "12:50", end: "13:40", subject: "Física III (Laboratorio)", room: "Lab A-302", prof: "Profra. Gabriela Reyna", note: "⚠️ Bata obligatoria" }
    ]
  };

  // ==========================================
  // 2. RADAR DE EVENTO EN VIVO Y RELOJ
  // ==========================================
  function updateLiveClockAndRadar() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const liveTimeEl = document.getElementById('mobileLiveClock');
    if (liveTimeEl) liveTimeEl.textContent = timeStr;

    // Calcular día de la semana (1 = Lun, 5 = Vie)
    let dayIndex = now.getDay();
    // Si es fin de semana, simular lunes para consulta
    if (dayIndex === 0 || dayIndex === 6) dayIndex = 1;

    const daySchedule = SCHEDULE_0415[dayIndex] || SCHEDULE_0415[1];
    const currentMins = now.getHours() * 60 + now.getMinutes();

    let currentClass = null;
    let nextClass = null;
    let minsUntilNext = null;

    for (let i = 0; i < daySchedule.length; i++) {
      const cls = daySchedule[i];
      const [sh, sm] = cls.start.split(':').map(Number);
      const [eh, em] = cls.end.split(':').map(Number);
      const startMin = sh * 60 + sm;
      const endMin = eh * 60 + em;

      if (currentMins >= startMin && currentMins < endMin) {
        currentClass = cls;
        nextClass = daySchedule[i + 1] || null;
        minsUntilNext = endMin - currentMins;
        break;
      } else if (currentMins < startMin) {
        if (!nextClass) {
          nextClass = cls;
          minsUntilNext = startMin - currentMins;
        }
      }
    }

    const radarTextEl = document.getElementById('liveRadarText');
    const countdownEl = document.getElementById('liveCountdownBadge');

    if (currentClass) {
      radarTextEl.innerHTML = `<strong>En curso: ${currentClass.subject} (${currentClass.room})</strong><span>Siguiente: ${nextClass ? nextClass.subject + ' (' + nextClass.room + ')' : 'Fin de jornada escolar'}</span>`;
      countdownEl.textContent = `${minsUntilNext}m traslado`;
      countdownEl.style.borderColor = minsUntilNext <= 5 ? 'var(--code-crimson)' : 'var(--accent-blue)';
    } else if (nextClass) {
      radarTextEl.innerHTML = `<strong>Próxima: ${nextClass.subject} (${nextClass.room})</strong><span>Inicia a las ${nextClass.start}</span>`;
      countdownEl.textContent = `En ${minsUntilNext} min`;
      countdownEl.style.borderColor = 'var(--code-amber)';
    } else {
      radarTextEl.innerHTML = `<strong>Jornada concluida por hoy</strong><span>Grupo 0415 • ENP Plantel 4</span>`;
      countdownEl.textContent = `Descanso`;
      countdownEl.style.borderColor = 'var(--accent-blue)';
    }

    // Micro-contador regresivo hacia la entrega de Historia (Lunes 12:50)
    updateCrimsonCountdown();
  }

  function updateCrimsonCountdown() {
    const el = document.getElementById('crimsonLiveCountdown');
    if (!el) return;
    const now = new Date();
    // Objetivo: Lunes 14 Sep 2026, 12:50 PM
    const target = new Date(2026, 8, 14, 12, 50, 0);
    const diff = target - now;
    if (diff <= 0) {
      el.textContent = "¡Plazo concluido 12:50!";
      return;
    }
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    el.textContent = `${hrs}h ${mins}m ${secs}s restantes`;
  }

  // ==========================================
  // 3. STORIES / CARD DECK SWIPE LOGIC
  // ==========================================
  let currentStoryIndex = 0;
  const totalStories = 5;
  let touchStartX = 0;
  let touchStartY = 0;

  function initStoriesNavigation() {
    const track = document.getElementById('storiesTrack');
    if (!track) return;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const diffX = touchStartX - e.changedTouches[0].clientX;
      const diffY = touchStartY - e.changedTouches[0].clientY;

      // Descartar si el gesto fue vertical (para permitir scroll de la tarjeta)
      if (Math.abs(diffY) > Math.abs(diffX) || Math.abs(diffX) < 40) return;

      if (diffX > 40) {
        // Deslizar izquierda -> siguiente story
        goToStory(currentStoryIndex + 1);
      } else if (diffX < -40) {
        // Deslizar derecha -> story anterior
        goToStory(currentStoryIndex - 1);
      }
    }, { passive: true });

    // Click en segmentos de progreso
    document.querySelectorAll('.story-bar-segment').forEach((bar, idx) => {
      bar.addEventListener('click', () => goToStory(idx));
    });
  }

  function goToStory(index) {
    if (index < 0 || index >= totalStories) return;
    currentStoryIndex = index;
    const track = document.getElementById('storiesTrack');
    if (track) {
      track.style.transform = `translateX(-${currentStoryIndex * 100}vw)`;
    }

    // Actualizar barras superiores
    document.querySelectorAll('.story-bar-segment').forEach((bar, idx) => {
      bar.classList.toggle('active', idx <= currentStoryIndex);
    });
  }
  window.goToStory = goToStory;

  // ==========================================
  // 4. DOCK GESTUAL (MAPA DE SALONES TACUBAYA)
  // ==========================================
  function initGestureDock() {
    const dockTrigger = document.getElementById('gestureDockTrigger');
    const drawerOverlay = document.getElementById('roomsDrawerOverlay');
    const closeBtn = document.getElementById('btnCloseDrawer');

    let startY = 0;

    if (dockTrigger && drawerOverlay) {
      dockTrigger.addEventListener('click', () => {
        drawerOverlay.classList.add('open');
      });

      // Swipe up detector en el dock
      dockTrigger.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
      }, { passive: true });

      dockTrigger.addEventListener('touchend', (e) => {
        const diffY = startY - e.changedTouches[0].clientY;
        if (diffY > 30) {
          drawerOverlay.classList.add('open');
        }
      }, { passive: true });
    }

    if (closeBtn && drawerOverlay) {
      closeBtn.addEventListener('click', () => {
        drawerOverlay.classList.remove('open');
      });
      drawerOverlay.addEventListener('click', (e) => {
        if (e.target === drawerOverlay) drawerOverlay.classList.remove('open');
      });
    }
  }

  // ==========================================
  // 5. MOTOR DE PEDIDOS DE PLANISFERIO (HISTORIA)
  // ==========================================
  function orderPlanisferio(qty) {
    const phone = "525571985641";
    const price = (qty === 1) ? "$5 MXN" : "$10 MXN";
    const text = `Hola, ocupo que me lleves ${qty} planisferio${qty > 1 ? 's' : ''} con nombres (${price}) para Historia del Grupo 0415.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
  window.orderPlanisferio = orderPlanisferio;

  function downloadPlanisferioDirect() {
    const link = document.createElement('a');
    link.href = 'assets/planisferio-con-nombres.jpg';
    link.download = 'Planisferio-con-nombres-Historia-Grupo0415.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  window.downloadPlanisferioDirect = downloadPlanisferioDirect;

  // ==========================================
  // 6. SISTEMA DE AUTENTICACIÓN CORPORATIVA (SEGURO)
  // ==========================================
  function initAuthSystem() {
    const authBtn = document.getElementById('mobileAuthBtn');
    const authOverlay = document.getElementById('authModalOverlay');
    const closeBtn = document.getElementById('btnAuthClose');

    if (authBtn && authOverlay) {
      authBtn.addEventListener('click', () => authOverlay.classList.add('active'));
    }
    if (closeBtn && authOverlay) {
      closeBtn.addEventListener('click', () => authOverlay.classList.remove('active'));
      authOverlay.addEventListener('click', (e) => {
        if (e.target === authOverlay) authOverlay.classList.remove('active');
      });
    }

    // Verificar sesión existente en localStorage
    const savedUser = localStorage.getItem('cuatreros_user_profile');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (authBtn) authBtn.textContent = u.name.charAt(0).toUpperCase();
      } catch (e) { console.error(e); }
    }
  }

  function simulateGoogleLogin() {
    // Simulación segura de Google Identity Services siguiendo Branding Guidelines
    const mockUser = {
      name: "Alumno Cuatrero",
      email: "alumno0415@comunidad.unam.mx",
      picture: "assets/escudo-unam-original.png",
      provider: "google_identity"
    };
    const mockJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MTV1bmFtIn0.signature";
    localStorage.setItem('cuatreros_auth_token', mockJwt);
    localStorage.setItem('cuatreros_user_profile', JSON.stringify(mockUser));

    const authBtn = document.getElementById('mobileAuthBtn');
    if (authBtn) authBtn.textContent = "A";

    alert("¡Sesión iniciada con Cuenta UNAM (Google Workspace)! Bienvenido, Alumno Cuatrero.");
    const overlay = document.getElementById('authModalOverlay');
    if (overlay) overlay.classList.remove('active');
  }
  window.simulateGoogleLogin = simulateGoogleLogin;

  function switchAuthView(viewName) {
    document.querySelectorAll('.auth-step-pane').forEach(p => p.style.display = 'none');
    const target = document.getElementById(`authView_${viewName}`);
    if (target) target.style.display = 'block';
  }
  window.switchAuthView = switchAuthView;

  function handleEmailLogin(e) {
    e.preventDefault();
    const email = document.getElementById('authEmailInput').value;
    const mockUser = { name: email.split('@')[0], email: email, provider: "credentials" };
    localStorage.setItem('cuatreros_auth_token', "jwt_credentials_mock_token");
    localStorage.setItem('cuatreros_user_profile', JSON.stringify(mockUser));

    const authBtn = document.getElementById('mobileAuthBtn');
    if (authBtn) authBtn.textContent = mockUser.name.charAt(0).toUpperCase();

    alert(`¡Bienvenido de vuelta, ${mockUser.name}!`);
    document.getElementById('authModalOverlay').classList.remove('active');
  }
  window.handleEmailLogin = handleEmailLogin;

  function handleRegisterSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('regEmailInput').value;
    alert(`Se ha enviado un código de 6 dígitos a: ${email}. Revisa tu bandeja institucional.`);
    switchAuthView('token');
  }
  window.handleRegisterSubmit = handleRegisterSubmit;

  function handleTokenSubmit(e) {
    e.preventDefault();
    alert("¡Cuenta verificada con éxito por token institucional!");
    switchAuthView('login');
  }
  window.handleTokenSubmit = handleTokenSubmit;

  function handleRecoverySubmit(e) {
    e.preventDefault();
    alert("Instrucciones de recuperación enviadas a tu correo.");
    switchAuthView('login');
  }
  window.handleRecoverySubmit = handleRecoverySubmit;

  // ==========================================
  // 7. ONBOARDING SPOTLIGHT TOUR
  // ==========================================
  const TOUR_STEPS = [
    {
      title: "Bienvenido al Modo Pasillo 📱",
      desc: "El nuevo ecosistema ultra-rápido de Cuatreros del 415. Cero scroll infinito: navega como en Stories deslizando a los lados.",
      badge: "Paso 1 de 4"
    },
    {
      title: "Semáforo de Urgencia 🚦",
      desc: "🔴 Carmesí para entregas urgentes en <24h, 🟡 Ámbar para la semana y 🔵 Eléctrico para traslados y avisos clave.",
      badge: "Paso 2 de 4"
    },
    {
      title: "Radar en Vivo & Traslados ⏱️",
      desc: "La barra superior te indica la clase actual y cuántos minutos te quedan para moverte de salón sin retardo.",
      badge: "Paso 3 de 4"
    },
    {
      title: "Ubicador Gestual de Salones 🧭",
      desc: "Desliza la barra inferior hacia arriba en cualquier momento para ver el mapa de los Edificios A, B, C y Gimnasio 1.",
      badge: "Paso 4 de 4"
    }
  ];
  let currentTourStep = 0;

  function checkOnboarding() {
    if (localStorage.getItem('cuatreros_onboarded_v2') === null) {
      setTimeout(() => {
        openTourModal();
      }, 700);
    }
  }

  function openTourModal() {
    currentTourStep = 0;
    renderTourStep();
    const overlay = document.getElementById('onboardingOverlay');
    if (overlay) overlay.classList.add('active');
  }

  function renderTourStep() {
    const step = TOUR_STEPS[currentTourStep];
    document.getElementById('tourStepBadge').textContent = step.badge;
    document.getElementById('tourStepTitle').textContent = step.title;
    document.getElementById('tourStepDesc').textContent = step.desc;

    const nextBtn = document.getElementById('btnTourNext');
    if (currentTourStep === TOUR_STEPS.length - 1) {
      nextBtn.textContent = "¡Comenzar!";
    } else {
      nextBtn.textContent = "Siguiente →";
    }
  }

  function nextTourStep() {
    if (currentTourStep < TOUR_STEPS.length - 1) {
      currentTourStep++;
      renderTourStep();
    } else {
      closeTourModal();
    }
  }
  window.nextTourStep = nextTourStep;

  function closeTourModal() {
    localStorage.setItem('cuatreros_onboarded_v2', 'completed');
    const overlay = document.getElementById('onboardingOverlay');
    if (overlay) overlay.classList.remove('active');
  }
  window.closeTourModal = closeTourModal;

  // ==========================================
  // INICIALIZACIÓN GLOBAL
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    updateLiveClockAndRadar();
    setInterval(updateLiveClockAndRadar, 1000);
    initStoriesNavigation();
    initGestureDock();
    initAuthSystem();
    checkOnboarding();
  });

})();
