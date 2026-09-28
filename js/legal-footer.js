/**
 * FOOTER LEGAL GLOBAL ESTANDARIZADO — ENCARDOMY BY SHAMINKET
 * Inyecta o unifica el pie de página legal oficial en todas las experiencias
 * Requisitos: Nombre oficial, enlaces a los documentos legales obligatorios, responsive y sin scroll horizontal.
 */

(function () {
  'use strict';

  function asegurarFooterGlobal() {
    if (document.querySelector('.encardomy-global-footer')) {
      return; // Ya existe en la página
    }

    const path = window.location.pathname || '';
    const esEnSubcarpetaLegal = path.indexOf('/legal/') !== -1;
    const prefix = esEnSubcarpetaLegal ? '' : 'legal/';

    const footer = document.createElement('footer');
    footer.className = 'encardomy-global-footer';
    footer.setAttribute('role', 'contentinfo');
    footer.setAttribute('aria-label', 'Pie de página legal');

    footer.innerHTML = `
      <span class="encardomy-global-footer-brand">Encardomy by Shaminket · Prepa 4</span>
      <div class="encardomy-global-footer-links">
        <a href="${prefix}aviso-de-privacidad.html">Aviso de privacidad</a>
        <span>·</span>
        <a href="${prefix}terminos-y-condiciones.html">Términos y condiciones</a>
        <span>·</span>
        <a href="${prefix}cookies.html">Cookies</a>
        <span>·</span>
        <a href="${prefix}propiedad-intelectual.html">Propiedad intelectual</a>
        <span>·</span>
        <a href="${prefix}uso-responsable.html">Uso responsable</a>
        <span>·</span>
        <a href="${prefix}accesibilidad.html">Accesibilidad</a>
        <span>·</span>
        <a href="${prefix}contacto-legal.html">Contacto legal</a>
      </div>
      <div class="encardomy-global-footer-copy">
        Responsable: Diego Periañez Hernandez · Contacto: ENP4.SHAMINKET@gmail.com · enp4.shaminket.com<br>
        Última actualización: 27 de septiembre de 2026.
      </div>
    `;

    // Buscar el contenedor óptimo según la experiencia activa
    const stageBody = document.querySelector('.desktop-stage-body') ||
                      document.querySelector('.large-stage-body') ||
                      document.querySelector('.tablet-stage-body') ||
                      document.querySelector('.duo-stage-body') ||
                      document.querySelector('.duo-zone-main') ||
                      document.querySelector('.app-container') ||
                      document.querySelector('main');

    if (stageBody) {
      stageBody.appendChild(footer);
    } else if (document.body) {
      document.body.appendChild(footer);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', asegurarFooterGlobal);
  } else {
    asegurarFooterGlobal();
  }
})();
