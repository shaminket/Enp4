/**
 * CENTRO DE CONTROL UNICORNIO • CONTROLADOR DEDICADO
 * js/centro-control.js - Exclusivo para centro-control.html
 */

(function initCentroControl() {
  let activeCluster = 'all';
  let activeSort = 'default';

  // 1. FILTRO DE BÚSQUEDA EN TIEMPO REAL
  window.filterSubjects = function(q) {
    const query = (q || '').toLowerCase().trim();
    const cards = document.querySelectorAll('.cc-subject-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      const cluster = card.getAttribute('data-cluster') || 'all';

      const matchesQuery = !query || text.includes(query);
      const matchesCluster = (activeCluster === 'all' || cluster === activeCluster);

      if (matchesQuery && matchesCluster) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const badge = document.getElementById('subjectCountBadge');
    if (badge) {
      badge.textContent = `${visibleCount} materias encontradas`;
    }
  };

  // 2. FILTRAR POR CLÚSTER FUNCIONAL
  window.filterByCluster = function(clusterKey) {
    activeCluster = clusterKey;
    document.querySelectorAll('.cc-cluster-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cluster') === clusterKey);
    });

    const searchInput = document.getElementById('subjectSearchInput');
    filterSubjects(searchInput ? searchInput.value : '');
  };

  // 3. ORDENAR MATERIAS (A-Z VS ACTUALIZADAS PRIMERO)
  window.setSortMode = function(mode) {
    activeSort = mode;
    const btnDef = document.getElementById('btnSortDefault');
    const btnAlpha = document.getElementById('btnSortAlpha');

    if (btnDef) btnDef.classList.toggle('active', mode === 'default');
    if (btnAlpha) btnAlpha.classList.toggle('active', mode === 'alpha');

    const grid = document.getElementById('subjectsGrid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.cc-subject-card'));

    if (mode === 'alpha') {
      cards.sort((a, b) => {
        const titleA = (a.querySelector('.cc-card-title') || {}).textContent || '';
        const titleB = (b.querySelector('.cc-card-title') || {}).textContent || '';
        return titleA.localeCompare(titleB, 'es', { sensitivity: 'base' });
      });
    } else {
      // Prioridad a destacadas y actualizadas
      cards.sort((a, b) => {
        const rankA = a.classList.contains('featured-card') ? 3 : (a.classList.contains('has-active-update') ? 2 : 1);
        const rankB = b.classList.contains('featured-card') ? 3 : (b.classList.contains('has-active-update') ? 2 : 1);
        return rankB - rankA;
      });
    }

    cards.forEach(c => grid.appendChild(c));
  };

  // 4. ATAJOS DE TECLADO RÁPIDOS
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === '0' || e.key === 'Escape') filterByCluster('all');
    if (e.key === '1') filterByCluster('ciencias');
    if (e.key === '2') filterByCluster('humanidades');
    if (e.key === '3') filterByCluster('idiomas');
    if (e.key === '4') filterByCluster('arte');
  });

})();
