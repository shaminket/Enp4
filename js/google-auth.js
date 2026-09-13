/**
 * ====================================================================
 * SISTEMA OFICIAL GOOGLE IDENTITY SERVICES (GIS / OAUTH 2.0)
 * Cliente: 937668093594-a7gjlcmhqdkspmljg4buaclj4c4esh4l.apps.googleusercontent.com
 * Plataforma: Cuatreros del 415 • ENP 4 UNAM (shaminket)
 * ====================================================================
 */

const GOOGLE_CLIENT_ID = "937668093594-a7gjlcmhqdkspmljg4buaclj4c4esh4l.apps.googleusercontent.com";
const STORAGE_USER_KEY = "enp4_google_user";
const STORAGE_SECTION_KEY = "enp4_user_section";

/**
 * Decodifica de forma segura un token JWT de Google sin librerías externas
 * @param {string} token - Token JWT devuelto por Google
 * @returns {object|null} - Payload decodificado con datos del usuario
 */
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error al decodificar JWT de Google:", error);
    return null;
  }
}

/**
 * Obtiene el usuario almacenado en localStorage si la sesión está activa
 * @returns {object|null}
 */
function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Obtiene la sección guardada del usuario
 * @returns {'A'|'B'|'all'|null}
 */
function getStoredSection() {
  return localStorage.getItem(STORAGE_SECTION_KEY) || null;
}

/**
 * Callback oficial que recibe la credencial de Google Identity Services
 * @param {object} response - Objeto con response.credential (JWT)
 */
function handleGoogleCredentialResponse(response) {
  if (!response || !response.credential) {
    console.warn("Respuesta de Google sin credencial válida.");
    return;
  }

  const payload = parseJwt(response.credential);
  if (!payload) {
    alert("No se pudo procesar la credencial de Google.");
    return;
  }

  const userData = {
    id: payload.sub,
    name: payload.name || "Estudiante 415",
    given_name: payload.given_name || (payload.name ? payload.name.split(" ")[0] : "Estudiante"),
    email: payload.email || "",
    picture: payload.picture || "assets/escudo-unam-original.png",
    hd: payload.hd || null, // Dominio institucional (ej. comunidad.unam.mx)
    loginTimestamp: Date.now()
  };

  // Guardar en localStorage de forma persistente
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
  console.log("Sesión de Google iniciada exitosamente para:", userData.name);

  // Actualizar la interfaz
  const section = getStoredSection();
  updateAuthInterface(userData, section);

  // Si aún no ha seleccionado sección, mostrar el modal de onboarding
  if (!section) {
    showSectionOnboardingModal(userData);
  } else {
    applyDynamicSectionFilter(section);
  }
}

/**
 * Cierra la sesión de Google del usuario y restablece el botón
 */
function logoutGoogleUser() {
  try {
    localStorage.removeItem(STORAGE_USER_KEY);
    // Deshabilitar la selección automática de Google para permitir cambiar de cuenta
    if (window.google && google.accounts && google.accounts.id) {
      google.accounts.id.disableAutoSelect();
    }
  } catch (err) {
    console.warn("Aviso al cerrar sesión:", err);
  }

  updateAuthInterface(null, null);
  applyDynamicSectionFilter("all");
  console.log("Sesión cerrada correctamente.");

  // Re-renderizar los botones de login
  renderGoogleSignInButtons();
}

/**
 * Actualiza la barra de navegación con los datos del usuario o el botón de login
 * @param {object|null} user
 * @param {string|null} section
 */
function updateAuthInterface(user, section) {
  const desktopContainer = document.getElementById("authNavContainer");
  const mobileContainer = document.getElementById("authNavContainerMobile");

  [desktopContainer, mobileContainer].forEach(container => {
    if (!container) return;

    if (user) {
      const firstName = user.given_name || user.name.split(" ")[0];
      const avatar = user.picture || "assets/escudo-unam-original.png";
      const currentSec = section || getStoredSection();
      const secLabel = currentSec ? `Sec. ${currentSec}` : "Sin Sec.";
      const secClass = currentSec ? `sec-${currentSec.toLowerCase()}` : "sec-none";

      container.innerHTML = `
        <div class="google-user-profile-bar" title="Sesión activa: ${user.email}">
          <img src="${avatar}" alt="Avatar" class="google-avatar-img" referrerpolicy="no-referrer" onerror="this.src='assets/escudo-unam-original.png'">
          <span class="google-user-name">¡Hola, <strong>${firstName}</strong>!</span>
          <span class="user-sec-pill ${secClass}" onclick="openChangeSectionModal()" title="Clic para cambiar de sección" style="cursor: pointer;">
            ${secLabel}
          </span>
          <button type="button" onclick="logoutGoogleUser()" class="btn-google-logout" title="Cerrar sesión">
            Salir
          </button>
        </div>
      `;
    } else {
      // Mostrar contenedor para renderizar el botón oficial
      container.innerHTML = `
        <div class="google-signin-btn-box" id="${container.id === 'authNavContainerMobile' ? 'g_id_signin_mobile' : 'g_id_signin'}"></div>
      `;
    }
  });

  if (user) {
    applyDynamicSectionFilter(section || getStoredSection() || "all");
  }
}

/**
 * Renderiza los botones oficiales de Google con estilo oscuro minimalista
 */
function renderGoogleSignInButtons() {
  if (getStoredUser()) return; // Si ya hay sesión activa, no renderizar botones

  if (!window.google || !google.accounts || !google.accounts.id) {
    return;
  }

  // Inicializar Google Identity Services
  try {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
      context: "signin"
    });
  } catch (e) {
    console.error("Error al inicializar google.accounts.id:", e);
    return;
  }

  // 1. Botón para barra de navegación Escritorio
  const desktopBtn = document.getElementById("g_id_signin");
  if (desktopBtn) {
    desktopBtn.innerHTML = "";
    google.accounts.id.renderButton(desktopBtn, {
      type: "standard",
      theme: "filled_black",
      size: "medium",
      shape: "pill",
      text: "signin_with",
      logo_alignment: "left",
      locale: "es"
    });
  }

  // 2. Botón para barra de navegación Móvil
  const mobileBtn = document.getElementById("g_id_signin_mobile");
  if (mobileBtn) {
    mobileBtn.innerHTML = "";
    google.accounts.id.renderButton(mobileBtn, {
      type: "standard",
      theme: "filled_black",
      size: "small",
      shape: "pill",
      text: "signin",
      logo_alignment: "left",
      locale: "es"
    });
  }
}

/**
 * Espera la carga de la librería oficial de Google Identity Services
 */
function initGoogleIdentityServices() {
  const currentUser = getStoredUser();
  const currentSection = getStoredSection();

  // Si el usuario ya tiene sesión persistente en localStorage, renderizar su perfil de inmediato
  if (currentUser) {
    updateAuthInterface(currentUser, currentSection);
  }

  // Polling para inicializar cuando la librería de Google cargue
  let attempts = 0;
  const checkGoogleLoaded = setInterval(() => {
    attempts++;
    if (window.google && google.accounts && google.accounts.id) {
      clearInterval(checkGoogleLoaded);
      renderGoogleSignInButtons();
    } else if (attempts > 60) { // 6 segundos de tiempo límite
      clearInterval(checkGoogleLoaded);
      console.warn("Tiempo de espera para cargar Google Identity Services agotado.");
    }
  }, 100);
}

// ====================================================================
// MODAL DE ONBOARDING Y SELECCIÓN DE SECCIÓN (A / B)
// ====================================================================

function showSectionOnboardingModal(user) {
  let modal = document.getElementById("sectionOnboardingModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "sectionOnboardingModal";
    modal.className = "announcement-overlay";
    modal.style.display = "flex";
    modal.style.zIndex = "999999";
    modal.innerHTML = `
      <div class="onboarding-card-box">
        <span class="onboarding-badge-pill">✨ PERSONALIZACIÓN DEL GRUPO 0415</span>
        <h3 class="onboarding-title-text">¡Bienvenido, ${user ? (user.given_name || user.name) : "Compañero"}!</h3>
        <p class="onboarding-desc-text">
          Selecciona tu sección para adaptar tu horario en vivo, filtrar tus salones y avisos automáticamente:
        </p>

        <div class="onboarding-options-grid">
          <button type="button" onclick="saveUserSectionSelection('A')" class="btn-onboarding-sec sec-a-btn">
            <span class="sec-dot">🔵</span>
            <strong>Sección A</strong>
            <span class="sec-desc">Dibujo B-008 &bull; Inglés C-306<br>Orientación B-110</span>
          </button>

          <button type="button" onclick="saveUserSectionSelection('B')" class="btn-onboarding-sec sec-b-btn">
            <span class="sec-dot">🟡</span>
            <strong>Sección B</strong>
            <span class="sec-desc">Dibujo C-201 &bull; Inglés C-205<br>Orientación B-112</span>
          </button>
        </div>

        <button type="button" onclick="saveUserSectionSelection('all')" class="btn-onboarding-all">
          Ver ambas secciones sin filtrar
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  } else {
    modal.style.display = "flex";
  }
}

function closeSectionOnboardingModal() {
  const modal = document.getElementById("sectionOnboardingModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function saveUserSectionSelection(sec) {
  localStorage.setItem(STORAGE_SECTION_KEY, sec);
  closeSectionOnboardingModal();
  const user = getStoredUser();
  updateAuthInterface(user, sec);
  applyDynamicSectionFilter(sec);
}

function openChangeSectionModal() {
  const user = getStoredUser();
  showSectionOnboardingModal(user);
}

/**
 * Filtra los elementos de la página según la sección del alumno
 * @param {'A' | 'B' | 'all'} section
 */
function applyDynamicSectionFilter(section) {
  const currentSec = section || "all";

  // 1. Filtrar elementos con atributo data-sec en el horario semanal
  const secElements = document.querySelectorAll("[data-sec]");
  secElements.forEach(el => {
    const itemSec = el.getAttribute("data-sec");
    if (currentSec === "all" || itemSec === "both" || itemSec === currentSec) {
      el.style.display = "";
    } else {
      el.style.display = "none";
    }
  });

  // 2. Sincronizar botones de filtro existentes en el Horario de escritorio si existen
  if (typeof window.filterBySection === "function") {
    const targetBtn = document.querySelector(`.f-pill-btn[onclick*="${currentSec}"]`);
    if (targetBtn) {
      window.filterBySection(currentSec, targetBtn);
    }
  }

  // 3. Si existe función de render en index-movil.html, re-renderizar
  if (typeof window.renderSchedule === "function") {
    window.activeSectionFilter = currentSec;
    window.renderSchedule();
  }
}

// Escuchar cambios en el almacenamiento entre pestañas
window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_USER_KEY || e.key === STORAGE_SECTION_KEY) {
    const user = getStoredUser();
    const section = getStoredSection();
    updateAuthInterface(user, section);
    applyDynamicSectionFilter(section || "all");
  }
});

// Exponer en window para integración directa
window.enp4GoogleAuth = {
  clientId: GOOGLE_CLIENT_ID,
  parseJwt,
  getUser: getStoredUser,
  getSection: getStoredSection,
  logout: logoutGoogleUser,
  openChangeSectionModal,
  saveSection: saveUserSectionSelection,
  applyFilter: applyDynamicSectionFilter
};

window.logoutGoogleUser = logoutGoogleUser;
window.openChangeSectionModal = openChangeSectionModal;
window.saveUserSectionSelection = saveUserSectionSelection;

// Iniciar en DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGoogleIdentityServices);
} else {
  initGoogleIdentityServices();
}
