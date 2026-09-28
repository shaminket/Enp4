/**
 * ENCARDOMY BY SHAMINKET — NOTIFICACIÓN DE RENOVACIÓN COMPLETA DEL SITIO
 * Experiencia visual animada adaptativa por dispositivo (Celular, Tablet, Mac, iMac, Duo).
 * Duración: 5 segundos con botón de Pausar / Continuar.
 * Vigencia de campaña: 3 días configurables en JavaScript (independiente de localStorage).
 * Conexión directa con el formulario unificado de Opciones y Sugerencias hacia WhatsApp oficial (+52 55 7198 5641).
 */

(function (root) {
  'use strict';

  const CONFIG = {
    // Campaña de 3 días: 27 al 30 de septiembre de 2026 (hora México -06:00)
    fechaInicio: '2026-09-27T00:00:00-06:00',
    fechaExpiracion: '2026-09-30T23:59:59-06:00',
    duracionSegundos: 5,
    storageKeyDismissed: 'encardomy_renovacion_v415_dismissed_session',
    whatsappOficial: '525571985641'
  };

  let fechaSimulada = null;
  let tiempoTotalMs = CONFIG.duracionSegundos * 1000;
  let tiempoRestanteMs = tiempoTotalMs;
  let enPausa = false;
  let intervaloTimer = null;
  let ultimoTimestamp = null;
  let bannerElement = null;
  let esVisible = false;

  /**
   * Determina si la campaña de renovación se encuentra activa en el rango de 3 días.
   * Admite fecha opcional para pruebas y simulaciones.
   */
  function estaActiva(fechaOpcional) {
    const targetDate = fechaOpcional
      ? (typeof fechaOpcional === 'string' ? new Date(fechaOpcional) : fechaOpcional)
      : (fechaSimulada ? new Date(fechaSimulada) : new Date());

    const tiempoActual = targetDate.getTime();
    const tiempoInicio = new Date(CONFIG.fechaInicio).getTime();
    const tiempoFin = new Date(CONFIG.fechaExpiracion).getTime();

    // Debe encontrarse estrictamente entre la fecha de publicación y la de expiración
    return tiempoActual >= tiempoInicio && tiempoActual <= tiempoFin;
  }

  /**
   * Detecta si la carga actual proviene de una recarga explícita del usuario
   */
  function esRecarga() {
    try {
      if (typeof performance !== 'undefined') {
        const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
        if (nav && nav.type === 'reload') return true;
        if (performance.navigation && performance.navigation.type === 1) return true;
      }
    } catch (e) {}
    return false;
  }

  /**
   * Genera el arte vectorial SVG de Encardomy adaptado para alta definición
   */
  function generarHeroArtSVG() {
    return `
      <svg class="renovacion-hero-art" viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración Encardomy 415 Renovado">
        <defs>
          <linearGradient id="renov-grad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4B1E82" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#1B0B2E" stop-opacity="0.95" />
          </linearGradient>
          <linearGradient id="renov-grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFF0A0" />
            <stop offset="50%" stop-color="#FFD100" />
            <stop offset="100%" stop-color="#FF7A00" />
          </linearGradient>
          <linearGradient id="renov-grad-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFD100" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#FFD100" stop-opacity="0" />
          </linearGradient>
          <filter id="renov-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#8E44ED" flood-opacity="0.4" />
          </filter>
        </defs>

        <!-- Halo brillante de fondo -->
        <circle cx="200" cy="160" r="130" fill="url(#renov-grad-glow)" />

        <!-- Tarjeta de fondo estilo ventana macOS / iPad -->
        <g filter="url(#renov-shadow)">
          <rect x="50" y="45" width="300" height="230" rx="24" fill="url(#renov-grad-bg)" stroke="url(#renov-grad-gold)" stroke-width="2" />
        </g>

        <!-- Barra superior de la ventana -->
        <rect x="50" y="45" width="300" height="34" rx="24" fill="rgba(255,255,255,0.06)" />
        <circle cx="75" cy="62" r="5" fill="#FF5F56" />
        <circle cx="92" cy="62" r="5" fill="#FFBD2E" />
        <circle cx="109" cy="62" r="5" fill="#27C93F" />
        <text x="200" y="66" text-anchor="middle" fill="#FFFFFF" opacity="0.8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700">ENCARDOMY 415 · V2026</text>

        <!-- Contenido central: Escudo y destellos -->
        <g transform="translate(140, 95)">
          <!-- Escudo / Corona 415 -->
          <path d="M60 10 L105 32 L95 90 C95 118 60 135 60 135 C60 135 25 118 25 90 L15 32 Z" fill="rgba(62,28,107,0.85)" stroke="url(#renov-grad-gold)" stroke-width="3" />
          <!-- Rayos solares interiores -->
          <circle cx="60" cy="65" r="28" fill="url(#renov-grad-gold)" opacity="0.9" />
          <path d="M60 48 L64 60 L76 60 L66 68 L70 80 L60 72 L50 80 L54 68 L44 60 L56 60 Z" fill="#1B0B2E" />
          <text x="60" y="112" text-anchor="middle" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="900" letter-spacing="1">PREPA 4</text>
        </g>

        <!-- Mini widgets decorativos a los lados -->
        <g transform="translate(68, 105)">
          <rect x="0" y="0" width="56" height="50" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,209,0,0.3)" stroke-width="1" />
          <text x="28" y="22" text-anchor="middle" font-size="14">⚡</text>
          <text x="28" y="38" text-anchor="middle" fill="#FFD100" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="800">EN VIVO</text>
        </g>

        <g transform="translate(276, 105)">
          <rect x="0" y="0" width="56" height="50" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,209,0,0.3)" stroke-width="1" />
          <text x="28" y="22" text-anchor="middle" font-size="14">📅</text>
          <text x="28" y="38" text-anchor="middle" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="800">HORARIO</text>
        </g>

        <g transform="translate(68, 175)">
          <rect x="0" y="0" width="56" height="50" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,209,0,0.3)" stroke-width="1" />
          <text x="28" y="22" text-anchor="middle" font-size="14">✨</text>
          <text x="28" y="38" text-anchor="middle" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="800">NUEVO</text>
        </g>

        <g transform="translate(276, 175)">
          <rect x="0" y="0" width="56" height="50" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,209,0,0.3)" stroke-width="1" />
          <text x="28" y="22" text-anchor="middle" font-size="14">📱</text>
          <text x="28" y="38" text-anchor="middle" fill="#2ECC71" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="800">MULTI-DISP</text>
        </g>

        <!-- Chispas doradas -->
        <circle cx="130" cy="40" r="3" fill="#FFD100" />
        <circle cx="270" cy="35" r="2.5" fill="#FF7A00" />
        <circle cx="360" cy="130" r="2" fill="#FFD100" />
        <circle cx="40" cy="180" r="3" fill="#FFF0A0" />
      </svg>
    `;
  }

  /**
   * Construye o recupera el elemento del DOM de la notificación
   */
  function asegurarBannerEnDOM() {
    let el = document.getElementById('encardomy-renovacion-banner');
    if (el) return el;

    el = document.createElement('div');
    el.id = 'encardomy-renovacion-banner';
    el.className = 'encardomy-renovacion-banner';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'Presentación de renovación completa del sitio');

    el.innerHTML = `
      <!-- Botón X muy evidente para cerrar fácilmente -->
      <button type="button" class="renovacion-btn-close" onclick="RenovacionNotificacion.cerrar()" aria-label="Cerrar presentación (Esc)">
        ✕
      </button>

      <div class="renovacion-container">
        <div class="renovacion-cell">
          <!-- Columna / Área Ilustración -->
          ${generarHeroArtSVG()}

          <!-- Columna / Área Contenido -->
          <div class="renovacion-content-block">
            <div class="renovacion-top-meta">
              <span class="renovacion-badge">✨ Nueva Versión 2026</span>
              <span id="renovacion-timer-text" class="renovacion-timer-badge" aria-live="polite">⏱ 5.0s</span>
              <button type="button" id="renovacion-btn-pause" class="renovacion-btn-pause" onclick="RenovacionNotificacion.togglePausa()" aria-label="Pausar cuenta regresiva de 5 segundos">
                ⏸ Pausar
              </button>
            </div>

            <h2 class="renovacion-title">
              ¡Esta página <span>se acaba de reinventar!</span>
            </h2>

            <p class="renovacion-desc">
              Explórala completa, porque hay mucho nuevo por descubrir. Encontrarás herramientas inteligentes, horarios en vivo, nuevas vistas y detalles diseñados para hacer mucho más fácil tu día a día.
            </p>

            <p class="renovacion-cierre">
              Échale un vistazo. Te va a encantar.
            </p>

            <div class="renovacion-actions">
              <button type="button" class="renovacion-btn-primary" onclick="RenovacionNotificacion.cerrar()">
                🚀 Explorar novedades ahora ›
              </button>
              <button type="button" class="renovacion-btn-suggestions" onclick="RenovacionNotificacion.abrirSugerencias()">
                💬 Opciones y sugerencias
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Barra de progreso regresiva -->
      <div class="renovacion-progress-track">
        <div id="renovacion-progress-fill" class="renovacion-progress-fill"></div>
      </div>
    `;

    document.body.appendChild(el);

    // Cierre accesible con tecla Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && esVisible) {
        cerrar();
      }
    });

    return el;
  }

  /**
   * Muestra la notificación con animación suave de entrada desde arriba
   */
  function mostrar() {
    if (!estaActiva()) {
      return false;
    }

    bannerElement = asegurarBannerEnDOM();
    bannerElement.style.display = 'block';
    bannerElement.classList.remove('exiting');
    bannerElement.classList.add('visible');
    esVisible = true;
    iniciarTemporizador();

    return true;
  }

  /**
   * Cierra suavemente la notificación desplazándola hacia arriba
   */
  function cerrar() {
    detenerTemporizador();

    if (bannerElement) {
      bannerElement.classList.remove('visible');
      bannerElement.classList.add('exiting');

      // Registrar cierre en sessionStorage para esta sesión de navegación
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(CONFIG.storageKeyDismissed, 'true');
        }
      } catch (e) {}

      setTimeout(function () {
        if (bannerElement) {
          bannerElement.classList.remove('exiting');
          bannerElement.style.display = 'none';
        }
        esVisible = false;
      }, 460);
    } else {
      esVisible = false;
    }
  }

  /**
   * Inicia o reinicia el temporizador de 5 segundos
   */
  function iniciarTemporizador() {
    detenerTemporizador();
    tiempoRestanteMs = tiempoTotalMs;
    enPausa = false;
    ultimoTimestamp = Date.now();
    actualizarUIControles();

    intervaloTimer = setInterval(function () {
      if (enPausa) return;

      const ahora = Date.now();
      const delta = ahora - ultimoTimestamp;
      ultimoTimestamp = ahora;

      tiempoRestanteMs = Math.max(0, tiempoRestanteMs - delta);

      // Actualizar barra de progreso y texto numérico
      const pct = (tiempoRestanteMs / tiempoTotalMs) * 100;
      const fillEl = document.getElementById('renovacion-progress-fill');
      const textEl = document.getElementById('renovacion-timer-text');

      if (fillEl) {
        fillEl.style.width = pct + '%';
      }
      if (textEl) {
        const seg = (tiempoRestanteMs / 1000).toFixed(1);
        textEl.textContent = `⏱ ${seg}s`;
      }

      // Al completar los 5 segundos, salir suavemente
      if (tiempoRestanteMs <= 0) {
        detenerTemporizador();
        cerrar();
      }
    }, 40);
  }

  function detenerTemporizador() {
    if (intervaloTimer) {
      clearInterval(intervaloTimer);
      intervaloTimer = null;
    }
  }

  /**
   * Pausa la cuenta regresiva temporalmente
   */
  function pausar() {
    enPausa = true;
    actualizarUIControles();
  }

  /**
   * Reanuda la cuenta regresiva desde donde se quedó
   */
  function continuar() {
    enPausa = false;
    ultimoTimestamp = Date.now();
    actualizarUIControles();
  }

  function togglePausa() {
    if (enPausa) {
      continuar();
    } else {
      pausar();
    }
  }

  function actualizarUIControles() {
    const btnPause = document.getElementById('renovacion-btn-pause');
    if (!btnPause) return;

    if (enPausa) {
      btnPause.innerHTML = '▶ Continuar';
      btnPause.setAttribute('aria-label', 'Continuar cuenta regresiva');
      btnPause.style.background = 'rgba(255, 209, 0, 0.25)';
      btnPause.style.borderColor = 'var(--c-oro, #FFD100)';
      btnPause.style.color = 'var(--c-oro, #FFD100)';
    } else {
      btnPause.innerHTML = '⏸ Pausar';
      btnPause.setAttribute('aria-label', 'Pausar cuenta regresiva');
      btnPause.style.background = 'rgba(255, 255, 255, 0.12)';
      btnPause.style.borderColor = 'rgba(255, 255, 255, 0.25)';
      btnPause.style.color = 'var(--c-hueso, #FFFFFF)';
    }
  }

  /**
   * Abre el formulario de sugerencias y opciones (WhatsApp)
   */
  function abrirSugerencias() {
    pausar();
    cerrar();

    if (typeof ColaboracionSeccionB !== 'undefined' && typeof ColaboracionSeccionB.abrirSugerencias === 'function') {
      ColaboracionSeccionB.abrirSugerencias({
        nombreMateria: 'General',
        materiaId: 'General'
      });
    }
  }

  /**
   * Permite simular una fecha para pruebas de expiración (Requisito 20)
   */
  function simularFecha(isoString) {
    fechaSimulada = isoString;
  }

  function restaurarFechaReal() {
    fechaSimulada = null;
  }

  /**
   * Inicialización automática al cargar la página
   */
  function init() {
    // Si es una recarga, limpiar el estado de cerrado para permitir que se muestre
    if (esRecarga()) {
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem(CONFIG.storageKeyDismissed);
        }
      } catch (e) {}
    }

    // Verificar expiración de 3 días
    if (!estaActiva()) {
      // Después de 3 días: NO debe volver a aparecer bajo ninguna circunstancia
      return;
    }

    // Verificar si el usuario ya la cerró en esta misma sesión de pestañas
    try {
      if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(CONFIG.storageKeyDismissed) === 'true') {
        return;
      }
    } catch (e) {}

    // Pequeño retardo para que la página renderice y se aprecie la entrada desde arriba
    setTimeout(function () {
      mostrar();
    }, 280);
  }

  // Ejecutar al cargar
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  const API = {
    CONFIG: CONFIG,
    estaActiva: estaActiva,
    mostrar: mostrar,
    cerrar: cerrar,
    pausar: pausar,
    continuar: continuar,
    togglePausa: togglePausa,
    abrirSugerencias: abrirSugerencias,
    simularFecha: simularFecha,
    restaurarFechaReal: restaurarFechaReal,
    esVisible: function () { return esVisible; },
    getTiempoRestante: function () { return tiempoRestanteMs; }
  };

  root.RenovacionNotificacion = API;
  if (typeof globalThis !== 'undefined') {
    globalThis.RenovacionNotificacion = API;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
