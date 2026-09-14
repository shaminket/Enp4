/**
 * MATERIAS UNICORNIO • CONTROLADOR DEDICADO PARA ASIGNATURAS
 * js/materia.js - Exclusivo para páginas de materias
 */

(function initMateriaEngine() {
  window.showTab = function(tabKey) {
    const isDesktop = window.innerWidth >= 900;
    const targetPane = document.getElementById(`pane_${tabKey}`);
    const targetBtn = document.getElementById(`btnTab_${tabKey}`);

    if (isDesktop) {
      // En Mac / tableta horizontal: todos los paneles están visibles, hacemos scroll suave al panel
      if (targetPane) {
        targetPane.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      // En móvil: alternar visibilidad de pestañas
      document.querySelectorAll('.mat-section-pane').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.mat-tab-btn').forEach(b => b.classList.remove('active-blue'));

      if (targetPane) targetPane.classList.add('active');
      if (targetBtn) targetBtn.classList.add('active-blue');
    }
  };

  // Auto-activación según hash o sessionStorage
  window.addEventListener('DOMContentLoaded', () => {
    const hash = (window.location.hash || '').replace('#', '');
    const pathParts = window.location.pathname.split('/');
    const currentFile = pathParts[pathParts.length - 1].replace('.html', '').replace('-movil', '');
    const storedTab = sessionStorage.getItem(`openTab_${currentFile}`);

    const activeTab = (hash === 'regalos' || storedTab === 'regalos') ? 'regalos' :
                      (hash === 'avisos' || storedTab === 'avisos') ? 'avisos' : 'tareas';

    if (storedTab) {
      sessionStorage.removeItem(`openTab_${currentFile}`);
    }

    if (window.innerWidth < 900) {
      showTab(activeTab);
    }
  });

  // Manejador del modal de pedidos WhatsApp
  window.openOrderModal = function(modalId = 'orderModal') {
    const m = document.getElementById(modalId);
    if (m) m.classList.add('active');
  };

  window.closeOrderModal = function(modalId = 'orderModal') {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove('active');
  };

  window.sendOrderWa = function(itemTitle, qty, price) {
    closeOrderModal();
    const phone = "525571985641";
    const text = `Hola, ocupo que me lleves ${qty} ${itemTitle} (${price}) para la clase del Grupo 0415.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };
})();
