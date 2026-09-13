/**
 * CUATREROS DEL 415 • TABLET ENGINE (BENTO GRID)
 * Flip Cards modulares in-place, Split-View, Semáforo y Auth
 */

(function () {
  'use strict';

  const TABLET_SCHEDULE = {
    1: [ // Lunes
      {
        time: "07:00 - 07:50",
        subject: "Geografía",
        room: "A-104",
        prof: "Profra. Silvia Mendoza",
        hwTag: "🔴 4 Noticias",
        hwFront: "4 Noticias en equipo (1 hoja dividida en 4 cuadrantes)",
        hwBack: "• Social, Económico, Político, Natural.<br>• Pluma negra, orden alfabético por apellidos.<br>• Elige hoja quien inicie más cerca de la A.<br>• Hojas membretadas opcionales en Encardomy ($50 / 10 piezas)."
      },
      {
        time: "07:50 - 08:40",
        subject: "Física III",
        room: "B-116",
        prof: "Profra. Gabriela Reyna",
        hwTag: null,
        hwFront: "Teoría de satélites y cinemática",
        hwBack: "• Revisión de cuaderno y ejercicios.<br>• Recordatorio: Viernes práctica en Lab A-302 con bata blanca obligatoria."
      },
      {
        time: "08:40 - 09:30",
        subject: "Física III",
        room: "B-109",
        prof: "Profra. Gabriela Reyna",
        hwTag: null,
        hwFront: "Teoría y resolución de problemas",
        hwBack: "• Segunda hora continua de Física.<br>• Llevar calculadora científica."
      },
      {
        time: "09:30 - 10:20",
        subject: "Inglés IV (Sec. A)",
        room: "B-318 (Mediateca)",
        prof: "Profra. Idiomas",
        hwTag: "🔵 Mediateca B-318",
        hwFront: "📍 Asistencia obligatoria en Mediateca",
        hwBack: "• No ir a C-306 este lunes.<br>• Llevar audífonos propios con cable 3.5mm.<br>• Tareas anteriores de examen archivadas."
      },
      {
        time: "10:20 - 12:00",
        subject: "Lengua Española",
        room: "B-112",
        prof: "Profra. María Vázquez",
        hwTag: "🔵 Hojas pospuestas",
        hwFront: "Lectura y redacción de textos",
        hwBack: "• ¿No conseguiste las hojas en La Gomita? ¡Tranquiii!! Ya no son para el lunes.<br>• Espera indicaciones en el aula.<br>• Novela Wyatt y buzón escolar disponibles."
      },
      {
        time: "12:00 - 12:50",
        subject: "Orientación IV (Sec. A)",
        room: "B-110",
        prof: "Tutoría Institucional",
        hwTag: "🔴 2 Tareas + Historia",
        hwFront: "Materiales y 2 Tareas UNAM",
        hwBack: "• Materiales: Post-it, plumones y carpeta de raya.<br>• Tarea 1: 10 datos históricos UNAM/ENP.<br>• Tarea 2: 5 personajes (sin Gabino Barreda).<br>• Entrega de Historia pendientes límite 12:50."
      }
    ],
    2: [ // Martes
      {
        time: "07:00 - 08:40",
        subject: "Matemáticas IV",
        room: "B-112",
        prof: "Prof. Saúl Quintana",
        hwTag: null,
        hwFront: "Álgebra y Funciones Polinomiales",
        hwBack: "• Revisión de ejercicios de factorización.<br>• Cuaderno al corriente con apuntes de clase."
      },
      {
        time: "08:40 - 09:30",
        subject: "Dibujo II (Sec. A)",
        room: "B-008",
        prof: "Taller de Dibujo",
        hwTag: "🟡 Paisaje Líneas",
        hwFront: "Lámina: Paisaje con líneas",
        hwBack: "• En impresión 2 o en el libro oficial.<br>• Traer corrección de lámina de puntillismo."
      },
      {
        time: "09:30 - 10:20",
        subject: "Informática",
        room: "I-108",
        prof: "Laboratorio Cómputo",
        hwTag: "🟡 Exposiciones",
        hwFront: "Metodología de exposición 1+3=1",
        hwBack: "• Preparación en equipo.<br>• Eq 1 y 2 inician el 22 de septiembre."
      },
      {
        time: "10:20 - 11:10",
        subject: "Lógica",
        room: "B-206",
        prof: "Colegio de Filosofía",
        hwTag: "🟡 3 Tareas",
        hwFront: "Tipos de frases y casos Gettier",
        hwBack: "• 1) Identificar tipos de frases.<br>• 2) Corrección ejercicios ($30/$70).<br>• 3) Caso de Gettier en epistemología."
      },
      {
        time: "12:00 - 12:50",
        subject: "Prevención Violencias",
        room: "B-109",
        prof: "Cultura de Paz",
        hwTag: "🔵 Clave 8000",
        hwFront: "Convivencia Escolar y Derechos Humanos",
        hwBack: "• Análisis de protocolos UNAM.<br>• Violentómetro escolar y cultura comunitaria."
      }
    ],
    3: [ // Miércoles
      {
        time: "07:00 - 07:50",
        subject: "Geografía",
        room: "A-104",
        prof: "Profra. Silvia Mendoza",
        hwTag: null,
        hwFront: "Cartografía y Espacio Geográfico",
        hwBack: "• Trabajo con mapas continentales y husos horarios.<br>• Traer colores y regla."
      },
      {
        time: "07:50 - 09:30",
        subject: "Lógica",
        room: "B-108",
        prof: "Colegio de Filosofía",
        hwTag: null,
        hwFront: "Formalización y Tablas de Verdad",
        hwBack: "• Análisis de conectivos lógicos y falacias formales."
      },
      {
        time: "09:30 - 10:20",
        subject: "Inglés IV (Sec. A)",
        room: "C-306",
        prof: "Idiomas",
        hwTag: null,
        hwFront: "Grammar & Reading Comprehension",
        hwBack: "• Clase ordinaria en Edificio C."
      },
      {
        time: "10:20 - 11:10",
        subject: "Dibujo II (Sec. A)",
        room: "B-008",
        prof: "Taller Dibujo",
        hwTag: null,
        hwFront: "Revisión de Portafolio",
        hwBack: "• Firma de láminas aprobadas."
      },
      {
        time: "11:10 - 12:50",
        subject: "Lengua Española",
        room: "B-112",
        prof: "Profra. María Vázquez",
        hwTag: null,
        hwFront: "Sintaxis y Redacción",
        hwBack: "• Preparación de ensayos y lectura guiada."
      }
    ],
    4: [ // Jueves
      {
        time: "07:00 - 08:40",
        subject: "Matemáticas IV",
        room: "B-109",
        prof: "Prof. Saúl Quintana",
        hwTag: null,
        hwFront: "Sistemas de Ecuaciones Lineales",
        hwBack: "• Métodos algebraicos y determinantes."
      },
      {
        time: "08:40 - 09:30",
        subject: "Lengua Española",
        room: "B-110",
        prof: "Profra. María Vázquez",
        hwTag: null,
        hwFront: "Tipología Textual",
        hwBack: "• Salón B-110."
      }
    ],
    5: [ // Viernes
      {
        time: "07:50 - 08:40",
        subject: "Historia Universal III",
        room: "B-117",
        prof: "Colegio de Historia",
        hwTag: "🔴 Planisferio Obligatorio",
        hwFront: "Geopolítica del Siglo XX",
        hwBack: "• Llevar planisferio con nombres numerado 1-136.<br>• Actividad cartográfica de bloques mundiales."
      },
      {
        time: "08:40 - 09:30",
        subject: "Matemáticas IV",
        room: "B-117",
        prof: "Prof. Saúl Quintana",
        hwTag: null,
        hwFront: "Modelación de problemas reales",
        hwBack: "• Evaluación formativa continua."
      },
      {
        time: "09:30 - 10:20",
        subject: "Inglés IV (Sec. A)",
        room: "C-306",
        prof: "Idiomas",
        hwTag: null,
        hwFront: "Communication Skills",
        hwBack: "• Edificio C 3er Piso."
      },
      {
        time: "10:20 - 11:10",
        subject: "Prevención Violencias",
        room: "B-108",
        prof: "Cultura de Paz",
        hwTag: null,
        hwFront: "Estrategias de Mediación",
        hwBack: "• Salón B-108."
      },
      {
        time: "11:10 - 12:00",
        subject: "Educación Física IV",
        room: "GIM1",
        prof: "Acondicionamiento Físico",
        hwTag: "🟡 Tarea Condición Física",
        hwFront: "Componentes de la Actividad Física",
        hwBack: "• Responder: Qué es condición física, capacidades condicionales y coordinativas.<br>• Uniforme blanco obligatorio."
      },
      {
        time: "12:00 - 12:50",
        subject: "Física III",
        room: "B-115",
        prof: "Profra. Gabriela Reyna",
        hwTag: null,
        hwFront: "Preparación previa de laboratorio",
        hwBack: "• Salón B-115."
      },
      {
        time: "12:50 - 13:40",
        subject: "Física III (Laboratorio)",
        room: "Lab A-302",
        prof: "Profra. Gabriela Reyna",
        hwTag: "🔵 Bata Obligatoria",
        hwFront: "Práctica Experimental",
        hwBack: "• Laboratorio A-302.<br>• Sin bata blanca NO se permite el acceso por norma de seguridad."
      }
    ]
  };

  let selectedDay = 1;

  // Renderizar tarjetas con giro in-place (Flip Cards)
  function renderTabletSchedule(dayNum) {
    selectedDay = dayNum;
    const container = document.getElementById('tabletFlipGrid');
    if (!container) return;

    // Actualizar botones de día
    document.querySelectorAll('.day-tab-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.getAttribute('data-day')) === dayNum);
    });

    const classes = TABLET_SCHEDULE[dayNum] || TABLET_SCHEDULE[1];
    container.innerHTML = '';

    classes.forEach(c => {
      const hasHw = Boolean(c.hwTag);
      const card = document.createElement('div');
      card.className = 'flip-card-wrapper';
      card.innerHTML = `
        <div class="flip-card-inner" onclick="toggleFlip(this)">
          <!-- Frente -->
          <div class="flip-card-front ${hasHw ? 'has-hw' : ''}">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <span style="font-size:0.75rem; color:#94a3b8; font-weight:800; font-variant-numeric:tabular-nums;">⏰ ${c.time}</span>
                <h4 style="font-size:1.05rem; font-weight:900; color:#fff; margin-top:2px;">${c.subject}</h4>
              </div>
              <span style="background:rgba(0,122,255,0.2); color:#60a5fa; border:1px solid #007AFF; font-size:0.72rem; font-weight:900; padding:2px 7px; border-radius:6px;">${c.room}</span>
            </div>
            
            <p style="font-size:0.82rem; color:#cbd5e1; line-height:1.4; margin:0.4rem 0;">${c.hwFront}</p>

            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.7rem; color:#94a3b8;">${c.prof}</span>
              <span class="flip-hint-badge">🔄 Toca para girar</span>
            </div>
          </div>

          <!-- Reverso (Detalles y Tarea In-place) -->
          <div class="flip-card-back">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem;">
                <span style="font-size:0.74rem; font-weight:900; color:var(--unam-gold-bright); text-transform:uppercase;">Detalles de Asignatura</span>
                <span style="font-size:0.72rem; color:#cbd5e1;">${c.room}</span>
              </div>
              <h5 style="font-size:0.96rem; font-weight:900; margin-bottom:0.4rem;">${c.subject}</h5>
              <div style="font-size:0.8rem; line-height:1.45; color:#f1f5f9;">${c.hwBack}</div>
            </div>
            <div style="text-align:right;">
              <span class="flip-hint-badge" style="justify-content:flex-end;">🔄 Toca para regresar</span>
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }
  window.renderTabletSchedule = renderTabletSchedule;

  function toggleFlip(innerEl) {
    innerEl.classList.toggle('flipped');
  }
  window.toggleFlip = toggleFlip;

  // Actualizar reloj y semáforo
  function updateTabletClock() {
    const now = new Date();
    const clockEl = document.getElementById('tabletClock');
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    }

    // Cuenta regresiva Carmesí
    const target = new Date(2026, 8, 14, 12, 50, 0);
    const diff = target - now;
    const countEl = document.getElementById('tabletCrimsonCounter');
    if (countEl) {
      if (diff <= 0) {
        countEl.textContent = "Plazo concluido 12:50";
      } else {
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        countEl.textContent = `${hrs}h ${mins}m ${secs}s restantes`;
      }
    }
  }

  // Auth Modal
  function initTabletAuth() {
    const btn = document.getElementById('btnTabletAuth');
    const overlay = document.getElementById('tabletAuthOverlay');
    const closeBtn = document.getElementById('btnCloseTabletAuth');

    if (btn && overlay) {
      btn.addEventListener('click', () => overlay.classList.add('active'));
    }
    if (closeBtn && overlay) {
      closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
      });
    }

    const saved = localStorage.getItem('cuatreros_user_profile');
    if (saved && btn) {
      try {
        const u = JSON.parse(saved);
        btn.textContent = `👤 ${u.name}`;
      } catch (e) {}
    }
  }

  function simulateGoogleLogin() {
    const mockUser = {
      name: "Alumno Cuatrero",
      email: "alumno0415@comunidad.unam.mx",
      provider: "google_identity"
    };
    localStorage.setItem('cuatreros_auth_token', "jwt_google_tablet_mock");
    localStorage.setItem('cuatreros_user_profile', JSON.stringify(mockUser));

    const btn = document.getElementById('btnTabletAuth');
    if (btn) btn.textContent = `👤 ${mockUser.name}`;

    alert("¡Autenticación con Google UNAM completada con éxito!");
    document.getElementById('tabletAuthOverlay').classList.remove('active');
  }
  window.simulateGoogleLogin = simulateGoogleLogin;

  function handleTabletEmailLogin(e) {
    e.preventDefault();
    const email = document.getElementById('tabEmailInput').value;
    const mockUser = { name: email.split('@')[0], email: email, provider: "credentials" };
    localStorage.setItem('cuatreros_auth_token', "jwt_credentials_tablet");
    localStorage.setItem('cuatreros_user_profile', JSON.stringify(mockUser));

    const btn = document.getElementById('btnTabletAuth');
    if (btn) btn.textContent = `👤 ${mockUser.name}`;

    alert(`¡Sesión iniciada como ${mockUser.name}!`);
    document.getElementById('tabletAuthOverlay').classList.remove('active');
  }
  window.handleTabletEmailLogin = handleTabletEmailLogin;

  // Onboarding para Tableta
  function checkTabletOnboarding() {
    if (localStorage.getItem('cuatreros_tablet_onboarded') === null) {
      setTimeout(() => {
        alert("¡Bienvenido al Modo Bento Grid para Tableta! Toca cualquier materia del horario para girar la tarjeta en su mismo lugar (Flip Card) y usa el Split-View para estudiar y revisar salones simultáneamente.");
        localStorage.setItem('cuatreros_tablet_onboarded', 'true');
      }, 800);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderTabletSchedule(1);
    updateTabletClock();
    setInterval(updateTabletClock, 1000);
    initTabletAuth();
    checkTabletOnboarding();
  });

})();
