/**
 * SISTEMA GLOBAL DE ADAPTACIÓN AUTOMÁTICA Y ENRUTAMIENTO DINÁMICO
 * GRUPO 415 — PREPA 4 UNAM
 * 
 * Gestiona de forma continua y reactiva las cinco experiencias especializadas:
 * 1. Móvil       → archivos base: *.html       (e.g. index.html, fisica.html)
 * 2. Tablet      → archivos:      ipad-*.html  (e.g. ipad-index.html, ipad-fisica.html)
 * 3. Computadora → archivos:      mac-*.html   (e.g. mac-index.html, mac-fisica.html)
 * 4. Gran Formato→ archivos:      imac-*.html  (e.g. imac-index.html, imac-fisica.html)
 * 5. Plegable    → archivos:      duo-*.html   (e.g. duo-index.html, duo-fisica.html)
 * 
 * Reglas de Arquitectura:
 * - Ejecución inmediata en <head> antes del renderizado visual para evitar parpadeos.
 * - Limpieza canónica iterativa de prefijos (duo-, imac-, mac-, ipad-) para evitar acumulaciones.
 * - Prevención estricta de loops infinitos (si currentExp === detectedExp -> NO REDIRECCIONAR).
 * - Preservación rigurosa de página actual, query strings y fragmentos hash.
 * - Detección por capacidades físicas reales (viewport, pantalla, touch, pointer, hover, DPR).
 */

var DeviceRouter = (function () {
  'use strict';

  const STORAGE_KEY_REDIRECT_TS = 'device_router_last_redirect_ts';
  const STORAGE_KEY_REDIRECT_COUNT = 'device_router_redirect_count';
  const STORAGE_KEY_LAST_TARGET = 'device_router_last_target';

  let isNavigating = false;
  let resizeDebounceTimer = null;
  let isInitialized = false;

  /**
   * Obtiene la dimensión y métricas reales del viewport y la pantalla
   */
  function getMetrics() {
    const width = (typeof window !== 'undefined' ? window.innerWidth : 0) || 
                  (typeof document !== 'undefined' && document.documentElement ? document.documentElement.clientWidth : 0) || 
                  (typeof screen !== 'undefined' ? screen.width : 1024);
    const height = (typeof window !== 'undefined' ? window.innerHeight : 0) || 
                   (typeof document !== 'undefined' && document.documentElement ? document.documentElement.clientHeight : 0) || 
                   (typeof screen !== 'undefined' ? screen.height : 768);
    const screenWidth = (typeof screen !== 'undefined' ? screen.width : width) || width;
    const screenHeight = (typeof screen !== 'undefined' ? screen.height : height) || height;

    const minDimension = Math.min(width, height);
    const maxDimension = Math.max(width, height);
    const minScreenDim = Math.min(screenWidth, screenHeight);
    const maxScreenDim = Math.max(screenWidth, screenHeight);

    const dpr = (typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1;
    const isLandscape = width > height;

    return {
      width,
      height,
      minDimension,
      maxDimension,
      minScreenDim,
      maxScreenDim,
      dpr,
      isLandscape
    };
  }

  /**
   * Evalúa capacidades de interacción (touch, pointer, hover)
   */
  function getInputCapabilities() {
    if (typeof window === 'undefined') {
      return {
        hasTouch: false,
        maxTouchPoints: 0,
        pointerCoarse: false,
        pointerFine: true,
        hoverNone: false,
        hoverHover: true,
        hasFoldableSegments: false
      };
    }

    const hasTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    const maxTouchPoints = navigator.maxTouchPoints || 0;

    const pointerCoarse = window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : false;
    const pointerFine = window.matchMedia ? window.matchMedia('(pointer: fine)').matches : false;
    const hoverNone = window.matchMedia ? window.matchMedia('(hover: none)').matches : false;
    const hoverHover = window.matchMedia ? window.matchMedia('(hover: hover)').matches : false;

    // Viewport segments de CSS para dispositivos plegables (iPhone Duo)
    const hasDualSegmentsH = window.matchMedia ? window.matchMedia('(horizontal-viewport-segments: 2)').matches : false;
    const hasDualSegmentsV = window.matchMedia ? window.matchMedia('(vertical-viewport-segments: 2)').matches : false;
    const hasFoldableSegments = hasDualSegmentsH || hasDualSegmentsV;

    return {
      hasTouch,
      maxTouchPoints,
      pointerCoarse,
      pointerFine,
      hoverNone,
      hoverHover,
      hasFoldableSegments
    };
  }

  /**
   * Analiza el entorno del sistema y User-Agent como señal secundaria
   */
  function parseUserAgent() {
    if (typeof navigator === 'undefined') {
      return {};
    }

    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';

    // Smart TV / Pantallas gigantes
    const isTV = /SmartTV|Tizen|Web0S|BRAVIA|NetCast|AppleTV|Android TV|GoogleTV|HbbTV|LargeScreen/i.test(ua);

    // Detección explícita de iPhone Duo o dispositivo plegable
    const isDuoExplicit = /iPhoneDuo|iPhone Duo|iPhone.*Fold|AppleDuo|Foldable/i.test(ua);

    // iPadOS moderno (reporta MacIntel pero con maxTouchPoints > 1)
    const isIPadOS = platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    const isExplicitIPad = /iPad/i.test(ua);
    const isIPhone = /iPhone|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isAndroidTablet = isAndroid && !/Mobile/i.test(ua);
    const isAndroidPhone = isAndroid && /Mobile/i.test(ua);
    const isWindows = /Windows NT/i.test(ua);
    const isMacDesktop = (platform === 'MacIntel' || /Macintosh|Mac OS X/i.test(ua)) && (!navigator.maxTouchPoints || navigator.maxTouchPoints === 0);
    const isLinuxDesktop = /X11; Linux x86_64/i.test(ua) && (!navigator.maxTouchPoints || navigator.maxTouchPoints === 0);

    return {
      ua,
      platform,
      isTV,
      isDuoExplicit,
      isIPadOS,
      isExplicitIPad,
      isIPhone,
      isAndroid,
      isAndroidTablet,
      isAndroidPhone,
      isWindows,
      isMacDesktop,
      isLinuxDesktop
    };
  }

  /**
   * Lee la sobreescritura manual (?force=duo, ?force=large, ?force=desktop, ?force=tablet, ?force=mobile)
   * Solo es válida si viene explícitamente en el URL actual
   */
  function getForcedExperience() {
    try {
      if (typeof window !== 'undefined' && window.location && window.location.search) {
        const urlParams = new URLSearchParams(window.location.search);
        let force = urlParams.get('force');
        if (force) {
          force = force.toLowerCase();
          if (force === 'duo' || force === 'fold' || force === 'foldable') return 'duo';
          if (force === 'imac' || force === 'large' || force === 'tv') return 'large';
          if (force === 'mac') return 'desktop';
          if (force === 'ipad') return 'tablet';
          if (force === 'phone') return 'mobile';
          if (force === 'duo' || force === 'large' || force === 'desktop' || force === 'tablet' || force === 'mobile') {
            return force;
          }
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Determina la experiencia correspondiente al archivo actualmente abierto en el navegador
   * Returns: 'duo' | 'large' | 'desktop' | 'tablet' | 'mobile'
   */
  function getCurrentExperience() {
    const fullPath = (typeof window !== 'undefined' && window.location ? window.location.pathname : '') || '';
    let filename = fullPath.substring(fullPath.lastIndexOf('/') + 1) || 'index.html';
    if (filename.startsWith('duo-')) return 'duo';
    if (filename.startsWith('imac-')) return 'large';
    if (filename.startsWith('mac-')) return 'desktop';
    if (filename.startsWith('ipad-')) return 'tablet';
    return 'mobile';
  }

  /**
   * Obtiene el nombre de archivo canónico base despojando TODOS los prefijos acumulados
   * Ejemplo: 'duo-fisica.html'       -> 'fisica.html'
   *          'mac-mac-fisica.html'   -> 'fisica.html'
   *          'imac-geografia.html'   -> 'geografia.html'
   *          'ipad-index.html'       -> 'index.html'
   *          'index.html'            -> 'index.html'
   */
  function getCanonicalBaseName(fullPath) {
    const pathStr = fullPath || (typeof window !== 'undefined' && window.location ? window.location.pathname : 'index.html');
    let filename = pathStr.substring(pathStr.lastIndexOf('/') + 1) || 'index.html';
    
    // Remover recursivamente cualquier prefijo para garantizar que nunca existan duplicados
    while (/^(duo-|imac-|mac-|ipad-)/.test(filename)) {
      filename = filename.replace(/^(duo-|imac-|mac-|ipad-)/, '');
    }

    if (!filename || filename === '') {
      filename = 'index.html';
    }
    return filename;
  }

  /**
   * FUNCIÓN CENTRAL DE DETECCIÓN MULTIDIMENSIONAL (detectExperience)
   * Clasifica el contexto en: 'duo' | 'large' | 'desktop' | 'tablet' | 'mobile'
   */
  function detectExperience() {
    // 0. Si hay sobreescritura manual en la URL actual, respetarla
    const forced = getForcedExperience();
    if (forced) return forced;

    const currentExp = getCurrentExperience();
    const m = getMetrics();
    const input = getInputCapabilities();
    const ua = parseUserAgent();

    // 1. REGLA: HARDWARE PLEGABLE (iPHONE DUO)
    // Segmentos de CSS duales activos o UA explícito
    if (input.hasFoldableSegments || ua.isDuoExplicit) {
      return 'duo';
    }

    // Continuidad en iPhone Duo:
    // Si ya estamos en duo-*.html y el dispositivo sigue siendo táctil, se mantiene en duo-*
    if (currentExp === 'duo') {
      if ((input.pointerFine && input.hoverHover && !input.hasTouch && m.width >= 1200) || ua.isTV) {
        if (m.width >= 1800 || ua.isTV) return 'large';
        return 'desktop';
      }
      return 'duo';
    }

    // 2. REGLA: SMART TV
    if (ua.isTV && m.width >= 960) {
      return 'large';
    }

    // 3. REGLA: DISPOSITIVOS MÓVILES (TELÉFONOS)
    // Ancho menor a 560px, o teléfono con touch y dimensión mínima menor a 540px
    if (m.width < 560) {
      return 'mobile';
    }

    if ((ua.isIPhone || ua.isAndroidPhone) && m.minDimension < 580) {
      return 'mobile';
    }

    // 4. REGLA: TABLETS (iPad, iPadOS, Android Tablet)
    const isTabletHardware = ua.isIPadOS || ua.isExplicitIPad || ua.isAndroidTablet ||
                             (input.hasTouch && input.maxTouchPoints >= 2 && m.minDimension >= 540 && m.minDimension <= 1366 && !input.pointerFine);

    if (isTabletHardware) {
      if (m.width >= 1800 && input.pointerFine && !input.hasTouch) {
        return 'large';
      }
      if (m.width > 1500 && input.pointerFine && !input.hasTouch) {
        return 'desktop';
      }
      return 'tablet';
    }

    // 5. REGLA: GRAN FORMATO (iMac 24"/27", Studio Display, Pro Display XDR, 4K/5K/6K, Smart TV, Ultrawide)
    // Ancho >= 1800px, o pantalla ultrawide (proporción >= 2.0 y ancho >= 1700px)
    const isUltrawide = (m.width / (m.height || 1) >= 1.95) && m.width >= 1700;
    if (isUltrawide) {
      return 'large';
    }

    if (m.width >= 1800 && m.height >= 850 && (input.pointerFine || input.hoverHover || ua.isMacDesktop || ua.isWindows || ua.isLinuxDesktop)) {
      return 'large';
    }

    if (m.screenWidth >= 2560 && m.width >= 1800) {
      return 'large';
    }

    // 6. REGLA: COMPUTADORAS DE ESCRITORIO Y LAPTOPS (MacBook, iMac ventana normal, PC Windows, Linux)
    // Señales: macOS desktop, Windows, Linux, o puntero fino con hover (mouse / trackpad)
    if (ua.isMacDesktop || ua.isWindows || ua.isLinuxDesktop || (input.pointerFine && input.hoverHover && !input.hasTouch)) {
      if (m.width >= 560) {
        return 'desktop';
      }
      return 'mobile';
    }

    // 7. FALLBACK POR VIEWPORT DIMENSIONS
    if (m.width >= 1800) {
      return 'large';
    } else if (m.width >= 1024) {
      return 'desktop';
    } else if (m.width >= 560) {
      return 'tablet';
    }

    return 'mobile';
  }

  /**
   * Obtiene la ruta equivalente conservando la misma página base
   */
  function getEquivalentPage(currentPath, targetExperience) {
    const baseName = getCanonicalBaseName(currentPath);
    let targetFilename = baseName;

    if (targetExperience === 'duo') {
      targetFilename = 'duo-' + baseName;
    } else if (targetExperience === 'large') {
      targetFilename = 'imac-' + baseName;
    } else if (targetExperience === 'desktop') {
      targetFilename = 'mac-' + baseName;
    } else if (targetExperience === 'tablet') {
      targetFilename = 'ipad-' + baseName;
    } else {
      targetFilename = baseName;
    }

    const currentFilename = (currentPath || '').substring((currentPath || '').lastIndexOf('/') + 1) || 'index.html';
    const isDifferent = currentFilename !== targetFilename;

    return {
      baseName,
      targetFilename,
      currentFilename,
      isDifferent
    };
  }

  /**
   * Control de seguridad anti-bucles con cooldown
   */
  function canRedirect(targetFilename) {
    if (isNavigating) return false;

    try {
      const now = Date.now();
      const lastTs = parseInt(sessionStorage.getItem(STORAGE_KEY_REDIRECT_TS) || '0', 10);
      const lastTarget = sessionStorage.getItem(STORAGE_KEY_LAST_TARGET) || '';
      let count = parseInt(sessionStorage.getItem(STORAGE_KEY_REDIRECT_COUNT) || '0', 10);

      // Si pasaron más de 5 segundos, se reinicia el contador
      if (now - lastTs > 5000) {
        count = 0;
      }

      // Si intentamos redirigir al mismo archivo en menos de 500ms, ignorar
      if (lastTarget === targetFilename && (now - lastTs) < 500) {
        return false;
      }

      // Máximo 10 redirecciones en ráfaga antes de pausar
      if (count >= 10) {
        console.warn('[DeviceRouter] Límite de redirecciones alcanzado para proteger la sesión.');
        return false;
      }

      sessionStorage.setItem(STORAGE_KEY_REDIRECT_TS, String(now));
      sessionStorage.setItem(STORAGE_KEY_REDIRECT_COUNT, String(count + 1));
      sessionStorage.setItem(STORAGE_KEY_LAST_TARGET, targetFilename);
      return true;
    } catch (e) {
      return true;
    }
  }

  /**
   * Sincroniza la experiencia activa con las condiciones actuales
   */
  function syncExperience() {
    if (typeof window === 'undefined' || !window.location) return false;

    const currentExp = getCurrentExperience();
    const detectedExp = detectExperience();

    // Si ya estamos en la experiencia correcta, NO redirigir (Estricta prevención anti-loop)
    if (currentExp === detectedExp) {
      return false;
    }

    const currentPath = window.location.pathname || '';
    const equiv = getEquivalentPage(currentPath, detectedExp);

    if (equiv.isDifferent) {
      if (canRedirect(equiv.targetFilename)) {
        isNavigating = true;
        const search = window.location.search || '';
        const hash = window.location.hash || '';
        const destination = equiv.targetFilename + search + hash;

        console.info(`[DeviceRouter] Adaptación automática (${currentExp} → ${detectedExp}): Redirigiendo a ${destination}`);
        window.location.replace(destination);
        return true;
      }
    }

    return false;
  }

  /**
   * Enrutamiento inicial explícito
   */
  function route() {
    return syncExperience();
  }

  /**
   * Manejador con debounce para cambios continuos de tamaño (resize / split view / zoom)
   */
  function handleContinuousChange() {
    if (resizeDebounceTimer) {
      clearTimeout(resizeDebounceTimer);
    }
    resizeDebounceTimer = setTimeout(() => {
      syncExperience();
    }, 250);
  }

  /**
   * Inicializa observadores y listeners dinámicos continuos
   */
  function initDynamicWatchers() {
    if (isInitialized || typeof window === 'undefined') return;
    isInitialized = true;

    // Escucha continua de redimensionamiento de ventana
    window.addEventListener('resize', handleContinuousChange, { passive: true });

    // Escucha continua de rotación física
    window.addEventListener('orientationchange', () => {
      setTimeout(() => syncExperience(), 120);
    }, { passive: true });

    // ResizeObserver sobre el elemento raíz
    if (typeof ResizeObserver !== 'undefined' && document.documentElement) {
      try {
        const ro = new ResizeObserver(() => {
          handleContinuousChange();
        });
        ro.observe(document.documentElement);
      } catch (e) {}
    }
  }

  // AUTO-EJECUCIÓN INMEDIATA AL PARSEAR EL SCRIPT EN <head>
  // 1. Evaluación inmediata síncrona para redirigir antes de pintar la UI
  syncExperience();

  // 2. Registro de watchers al cargar DOM
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        initDynamicWatchers();
      });
    } else {
      initDynamicWatchers();
    }
  }

  return {
    getMetrics: getMetrics,
    getInputCapabilities: getInputCapabilities,
    parseUserAgent: parseUserAgent,
    getCurrentExperience: getCurrentExperience,
    getCanonicalBaseName: getCanonicalBaseName,
    detectExperience: detectExperience,
    getEquivalentPage: getEquivalentPage,
    syncExperience: syncExperience,
    route: route,
    initDynamicWatchers: initDynamicWatchers,
    _resetNavigationState: function () { isNavigating = false; }
  };
})();

if (typeof window !== 'undefined') {
  window.DeviceRouter = DeviceRouter;
}
