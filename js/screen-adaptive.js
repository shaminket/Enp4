/**
 * CUATREROS DEL 415 • ADAPTADOR DINÁMICO DE PANTALLA
 * Detecta automáticamente en Mac/PC el movimiento, redimensionamiento
 * y resolución de pantalla, adaptando el ecosistema en tiempo real.
 */

(function initScreenAdaptiveEngine() {
  'use strict';

  // Si el usuario forzó manualmente una vista específica mediante ?force=1, respetamos su elección
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('force') === '1' || urlParams.get('force') === 'desktop' || urlParams.get('force') === 'mobile') {
    return;
  }

  // Identificar página actual
  const path = window.location.pathname;
  const isDesktopPage = path.endsWith('desktop.html') || path.includes('desktop');
  const isTabletPage = path.endsWith('tablet.html') || path.includes('tablet');
  const isMobilePage = path.endsWith('mobile.html') || path.includes('mobile');
  const isIndexDispatcher = path.endsWith('index.html') || path.endsWith('/') || path.endsWith('enp4') || path.endsWith('enp4/');

  let resizeTimer = null;
  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;

  // Determinar la vista óptima según el ancho del viewport
  function getTargetView(w) {
    if (w < 768) {
      return 'mobile.html';
    } else if (w >= 768 && w <= 1024) {
      return 'tablet.html';
    } else {
      return 'desktop.html';
    }
  }

  // Notificador visual sutil estilo macOS (Toast de Telemetría)
  function showAdaptiveToast(message, icon) {
    let toast = document.getElementById('adaptiveScreenToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'adaptiveScreenToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(30px);
        background: rgba(0, 22, 40, 0.92);
        border: 1.5px solid rgba(213, 159, 15, 0.6);
        color: #ffffff;
        padding: 0.65rem 1.4rem;
        border-radius: 999px;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
        font-size: 0.85rem;
        font-weight: 800;
        letter-spacing: 0.3px;
        display: flex;
        align-items: center;
        gap: 0.6rem;
        box-shadow: 0 12px 35px rgba(0,0,0,0.6), 0 0 20px rgba(0, 122, 255, 0.3);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        z-index: 999999;
        opacity: 0;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        pointer-events: none;
      `;
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span style="font-size: 1.1rem;">${icon}</span> <span>${message}</span>`;
    // Activar animación
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      if (toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(30px)';
      }
    }, 2200);
  }

  // Evaluar y adaptar la vista al tamaño actual de la pantalla
  function evaluateAndAdapt(forceNotice = false) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const targetFile = getTargetView(w);

    // Si estamos en el index despachador
    if (isIndexDispatcher) {
      window.location.replace(targetFile + window.location.search + window.location.hash);
      return;
    }

    // Comprobar si se cruzó el umbral de una vista a otra
    let needsRedirect = false;
    if (targetFile === 'mobile.html' && !isMobilePage) {
      needsRedirect = true;
    } else if (targetFile === 'tablet.html' && !isTabletPage) {
      needsRedirect = true;
    } else if (targetFile === 'desktop.html' && !isDesktopPage) {
      needsRedirect = true;
    }

    if (needsRedirect) {
      const icon = targetFile === 'desktop.html' ? '🖥️' : (targetFile === 'tablet.html' ? '📟' : '📱');
      const label = targetFile === 'desktop.html' ? 'Modo Panorámico Mac' : (targetFile === 'tablet.html' ? 'Modo Tableta Bento' : 'Modo Móvil Pasillo');
      showAdaptiveToast(`Adaptando a ${label} (${w}px)...`, icon);

      setTimeout(() => {
        const search = window.location.search;
        const hash = window.location.hash;
        window.location.replace(targetFile + search + hash);
      }, 280);
    } else if (forceNotice) {
      const icon = isDesktopPage ? '🖥️' : (isTabletPage ? '📟' : '📱');
      showAdaptiveToast(`Pantalla adaptada (${w}x${h}px)`, icon);
    }
  }

  // Listener en vivo de cambio de tamaño con debounce suave
  window.addEventListener('resize', function onWindowResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Solo actuar si hubo un cambio real de dimensiones
      if (Math.abs(w - lastWidth) > 15 || Math.abs(h - lastHeight) > 25) {
        lastWidth = w;
        lastHeight = h;
        evaluateAndAdapt(false);
      }
    }, 220);
  }, { passive: true });

  // Listener para cambio de orientación (MacBook rotated, iPad, monitores rotados)
  window.addEventListener('orientationchange', function onOrientationChange() {
    setTimeout(() => {
      evaluateAndAdapt(true);
    }, 300);
  });

  // Notificación inicial sutil al cargar en Mac
  window.addEventListener('DOMContentLoaded', () => {
    // Si la página cargada no corresponde al ancho de la ventana, corregir de inmediato
    const w = window.innerWidth;
    const targetFile = getTargetView(w);
    if ((targetFile === 'mobile.html' && !isMobilePage) ||
        (targetFile === 'tablet.html' && !isTabletPage) ||
        (targetFile === 'desktop.html' && !isDesktopPage)) {
      evaluateAndAdapt(false);
    }
  });

  // Exponer API global para pruebas o inspección
  window.CuatrerosAdaptive = {
    evaluate: evaluateAndAdapt,
    showToast: showAdaptiveToast
  };

})();
