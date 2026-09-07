/* ==========================================================
   LÓGICA JAVASCRIPT GLOBAL: CUATREROS DEL 415
   ========================================================== */

let activeSection = 'all';

function filterBySection(section, btn) {
  activeSection = section;
  document.querySelectorAll('.filter-pills-row .f-pill-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  filterAll();
}

function filterAll() {
  const selectElem = document.getElementById('materiaFilterSelect');
  if (!selectElem) return;
  const selectedSubject = selectElem.value;
  const classCards = document.querySelectorAll('.class-item');

  classCards.forEach(card => {
    const itemSubj = card.getAttribute('data-subj');
    const itemSec = card.getAttribute('data-sec');

    const matchSec = (activeSection === 'all') || (itemSec === 'both') || (itemSec === activeSection);
    const matchSubj = (selectedSubject === 'all') || (itemSubj === selectedSubject);

    if (matchSec && matchSubj) {
      card.classList.remove('is-hidden');
      card.style.display = 'block';
    } else {
      card.classList.add('is-hidden');
      card.style.display = 'none';
    }
  });
}

// Modal de Soporte WhatsApp en 2 Pasos
function openSupportDialog() {
  const modal = document.getElementById('supportModalBackdrop');
  if (modal) modal.classList.add('is-open');
}

function closeSupportDialog() {
  const modal = document.getElementById('supportModalBackdrop');
  if (modal) {
    modal.classList.remove('is-open');
    setTimeout(goToStep1, 300);
  }
}

function onBackdropClick(e) {
  if (e.target.id === 'supportModalBackdrop') {
    closeSupportDialog();
  }
}

function goToStep2() {
  const s1 = document.getElementById('dialogStep1');
  const s2 = document.getElementById('dialogStep2');
  const d1 = document.getElementById('trackDot1');
  const d2 = document.getElementById('trackDot2');
  if (s1 && s2 && d1 && d2) {
    s1.classList.remove('active');
    s2.classList.add('active');
    d1.classList.remove('active');
    d2.classList.add('active');
  }
}

function goToStep1() {
  const s1 = document.getElementById('dialogStep1');
  const s2 = document.getElementById('dialogStep2');
  const d1 = document.getElementById('trackDot1');
  const d2 = document.getElementById('trackDot2');
  if (s1 && s2 && d1 && d2) {
    s2.classList.remove('active');
    s1.classList.add('active');
    d2.classList.remove('active');
    d1.classList.add('active');
  }
}

// Función para copiar prompts al portapapeles
function copyPrompt(elementId, btnElement) {
  const textElem = document.getElementById(elementId);
  if (!textElem) return;
  const textToCopy = textElem.innerText || textElem.textContent;

  navigator.clipboard.writeText(textToCopy).then(() => {
    const originalHTML = btnElement.innerHTML;
    btnElement.innerHTML = '<span>✅ ¡Copiado al portapapeles!</span>';
    btnElement.style.background = '#22c55e';
    btnElement.style.color = '#ffffff';

    setTimeout(() => {
      btnElement.innerHTML = originalHTML;
      btnElement.style.background = '';
      btnElement.style.color = '';
    }, 2800);
  }).catch(err => {
    console.error('Error al copiar:', err);
    alert('No se pudo copiar automáticamente. Por favor selecciónalo y cópialo manualmente.');
  });
}
