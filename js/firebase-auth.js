/**
 * ====================================================================
 * SISTEMA DE USUARIOS, GOOGLE AUTH & ONBOARDING EN FIRESTORE
 * Plataforma: Cuatreros del 415 • ENP 4 UNAM (shaminket)
 * ====================================================================
 * 
 * Reglas Estratégicas:
 * 1. Acceso público total: Funciona 100% sin sesión iniciada.
 * 2. Login exclusivo con Google (Firebase Auth).
 * 3. Bienvenida personalizada con nombre del perfil de Google.
 * 4. Onboarding de primera sesión: Modal que guarda 'Sección A' o 'Sección B' en Firestore.
 * 5. Filtrado dinámico automático de contenidos de la sección.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
// ====================================================================
// 1. CONFIGURACIÓN DE FIREBASE (Reemplaza con tus valores del proyecto)
// ====================================================================
// Nota: Tu Project Number de Google Cloud es 937668093594.
// Los valores de apiKey, projectId y appId los obtienes en:
// Firebase Console > Configuración del Proyecto > General > Tus Apps (Web </>)
const firebaseConfig = {
  apiKey: "AIzaSy_TU_API_KEY_AQUI",
  authDomain: "cuatreros-415.firebaseapp.com",
  projectId: "cuatreros-415",
  storageBucket: "cuatreros-415.appspot.com",
  messagingSenderId: "937668093594",
  appId: "1:937668093594:web:TU_APP_ID_AQUI"
};

let app, auth, db, googleProvider;
let isConfigured = false;

try {
  if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("TU_API_KEY")) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    isConfigured = true;
  } else {
    console.info("ℹ️ Firebase Auth: Modo demostración activo. Pega tus credenciales en js/firebase-auth.js para activar la conexión en vivo.");
  }
} catch (e) {
  console.warn("Aviso al inicializar Firebase:", e);
}

// Estado global de la sesión
let currentUser = null;
let userSection = null;

// ====================================================================
// 2. FUNCIONES DE AUTENTICACIÓN (LOGIN & LOGOUT)
// ====================================================================

/**
 * Iniciar sesión con Google usando popup
 */
export async function loginWithGoogle() {
  if (!isConfigured || !auth) {
    alert("🔑 Para conectar tu cuenta real de Google, pega tus llaves de Firebase en js/firebase-auth.js.\n\n¡Mientras tanto, puedes probar la selección de sección y el filtrado dinámico a continuación!");
    currentUser = { uid: "demo-user-415", displayName: "Estudiante 415", email: "alumno@prepa4.unam.mx", photoURL: "assets/escudo-unam-original.png" };
    showOnboardingModal();
    return;
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("Sesión iniciada con éxito:", user.displayName);
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    if (error.code !== 'auth/popup-closed-by-user') {
      alert("No se pudo iniciar sesión con Google: " + error.message);
    }
  }
}

/**
 * Cerrar sesión
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    localStorage.removeItem("enp4_user_section");
    applyDynamicSectionFilter('all');
    console.log("Sesión cerrada.");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}

/**
 * Permitir al usuario cambiar su sección en cualquier momento
 */
export function openChangeSectionModal() {
  showOnboardingModal();
}

// ====================================================================
// 3. ONBOARDING & FIRESTORE (GUARDADO DE SECCIÓN A / B)
// ====================================================================

/**
 * Guarda la sección elegida en Firestore y actualiza el estado local
 */
export async function saveUserSection(section) {
  if (!currentUser) return;

  try {
    const userDocRef = doc(db, "users", currentUser.uid);
    await setDoc(userDocRef, {
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      email: currentUser.email,
      photoURL: currentUser.photoURL,
      section: section,
      updatedAt: serverTimestamp()
    }, { merge: true });

    userSection = section;
    localStorage.setItem("enp4_user_section", section);

    hideOnboardingModal();
    updateNavbarUI(currentUser, section);
    applyDynamicSectionFilter(section);
  } catch (error) {
    console.error("Error guardando sección en Firestore:", error);
    // Fallback a localStorage si falla la conexión a Firestore
    userSection = section;
    localStorage.setItem("enp4_user_section", section);
    hideOnboardingModal();
    updateNavbarUI(currentUser, section);
    applyDynamicSectionFilter(section);
  }
}

// ====================================================================
// 4. OBSERVADOR DEL ESTADO DE AUTENTICACIÓN
// ====================================================================

if (isConfigured && auth) {
  onAuthStateChanged(auth, async (user) => {
  currentUser = user;

  if (user) {
    // Usuario autenticado: consultar perfil en Firestore
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().section) {
        userSection = userDoc.data().section;
        localStorage.setItem("enp4_user_section", userSection);
        updateNavbarUI(user, userSection);
        applyDynamicSectionFilter(userSection);
      } else {
        // Primera vez o sin sección configurada -> Onboarding
        updateNavbarUI(user, null);
        showOnboardingModal();
      }
    } catch (err) {
      console.warn("Firestore offline o error de lectura, usando caché local:", err);
      const cachedSection = localStorage.getItem("enp4_user_section");
      if (cachedSection) {
        userSection = cachedSection;
        updateNavbarUI(user, userSection);
        applyDynamicSectionFilter(userSection);
      } else {
        showOnboardingModal();
      }
    }
  } else {
    // Visitante público sin sesión
    userSection = null;
    updateNavbarUI(null, null);
    applyDynamicSectionFilter('all');
  }
});
} else {
  // Si Firebase aún no tiene llaves, leer sección guardada en localStorage si existe
  window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("enp4_user_section");
    if (saved) {
      userSection = saved;
      applyDynamicSectionFilter(saved);
    }
  });
}

// ====================================================================
// 5. FILTRADO DINÁMICO DE CONTENIDO (SECCIÓN A vs SECCIÓN B)
// ====================================================================

/**
 * Filtra los elementos HTML según la sección del alumno
 * @param {'A' | 'B' | 'all'} section
 */
export function applyDynamicSectionFilter(section) {
  const currentSec = section || 'all';

  // 1. Filtrar elementos con atributo data-sec
  const secElements = document.querySelectorAll('[data-sec]');
  secElements.forEach(el => {
    const itemSec = el.getAttribute('data-sec');
    if (currentSec === 'all' || itemSec === 'both' || itemSec === currentSec) {
      el.classList.remove('user-filtered-out');
      el.style.display = '';
    } else {
      el.classList.add('user-filtered-out');
      el.style.display = 'none';
    }
  });

  // 2. Filtrar clases utilitarias
  document.querySelectorAll('.section-only-a').forEach(el => {
    if (currentSec === 'B') {
      el.classList.add('user-filtered-out');
      el.style.display = 'none';
    } else {
      el.classList.remove('user-filtered-out');
      el.style.display = '';
    }
  });

  document.querySelectorAll('.section-only-b').forEach(el => {
    if (currentSec === 'A') {
      el.classList.add('user-filtered-out');
      el.style.display = 'none';
    } else {
      el.classList.remove('user-filtered-out');
      el.style.display = '';
    }
  });

  // 3. Sincronizar botones de filtro existentes en el Horario si existen
  if (typeof window.filterBySection === 'function') {
    const targetBtn = document.querySelector(`.f-pill-btn[onclick*="${currentSec}"]`);
    window.filterBySection(currentSec, targetBtn);
  }

  // 4. Si existe función de render en index-movil.html, re-renderizar
  if (typeof window.renderSchedule === 'function') {
    window.activeSectionFilter = currentSec;
    window.renderSchedule();
  }

  console.log(`Filtro dinámico aplicado: Sección ${currentSec}`);
}

// ====================================================================
// 6. ACTUALIZACIÓN VISUAL DE LA BARRA DE NAVEGACIÓN
// ====================================================================

function updateNavbarUI(user, section) {
  const navContainer = document.getElementById('authNavContainer');
  if (!navContainer) return;

  if (user) {
    const firstName = (user.displayName || "Compañero").split(" ")[0];
    const photo = user.photoURL || "assets/escudo-unam-original.png";
    const secBadge = section 
      ? `<span class="user-sec-pill sec-${section.toLowerCase()}">Sec. ${section}</span>`
      : `<span class="user-sec-pill" style="background:#fef08a; color:#854d0e;">Sin Sección</span>`;

    navContainer.innerHTML = `
      <div class="user-auth-badge">
        <img src="${photo}" alt="Avatar" class="user-avatar-circle" referrerpolicy="no-referrer">
        <span>¡Hola, <strong>${firstName}</strong>!</span>
        ${secBadge}
        <button onclick="window.enp4Auth.openChangeSectionModal()" class="btn-change-sec" title="Cambiar mi sección">Cambiar</button>
        <button onclick="window.enp4Auth.logoutUser()" class="btn-auth-logout" title="Cerrar sesión">Salir</button>
      </div>
    `;
  } else {
    // Botón de Google Sign-In público
    navContainer.innerHTML = `
      <button onclick="window.enp4Auth.loginWithGoogle()" class="btn-google-login">
        <svg viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        <span>Acceder con Google</span>
      </button>
    `;
  }
}

// ====================================================================
// 7. MODAL DE ONBOARDING
// ====================================================================

function showOnboardingModal() {
  let modal = document.getElementById('onboardingModalBackdrop');
  if (!modal) {
    createOnboardingModalDOM();
    modal = document.getElementById('onboardingModalBackdrop');
  }
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
  }
}

function hideOnboardingModal() {
  const modal = document.getElementById('onboardingModalBackdrop');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
  }
}

function createOnboardingModalDOM() {
  const modalDiv = document.createElement('div');
  modalDiv.id = 'onboardingModalBackdrop';
  modalDiv.className = 'onboarding-overlay';
  modalDiv.innerHTML = `
    <div class="onboarding-card">
      <span class="onboarding-badge">Configuración de Perfil</span>
      <h3 class="onboarding-title">¿A qué sección perteneces?</h3>
      <p class="onboarding-subtitle">
        Selecciona tu sección asignada para adaptar automáticamente tu horario, materias y salones de clase:
      </p>

      <div class="onboarding-sections-grid">
        <button onclick="window.enp4Auth.saveUserSection('A')" class="btn-select-section-card sec-a-card">
          <span class="section-card-icon">🔵</span>
          <span class="section-card-name">Sección A</span>
          <span class="section-card-details">Dibujo B-008 &bull; Inglés C-306<br>Orientación B-110</span>
        </button>

        <button onclick="window.enp4Auth.saveUserSection('B')" class="btn-select-section-card sec-b-card">
          <span class="section-card-icon">🟡</span>
          <span class="section-card-name">Sección B</span>
          <span class="section-card-details">Dibujo C-201 &bull; Inglés C-205<br>Orientación B-112</span>
        </button>
      </div>

      <button onclick="window.enp4Auth.saveUserSection('all')" class="onboarding-skip-btn">
        Ver ambas secciones (Vista completa)
      </button>
    </div>
  `;
  document.body.appendChild(modalDiv);
}

// ====================================================================
// 8. INICIALIZACIÓN GLOBAL EN WINDOW
// ====================================================================

window.enp4Auth = {
  loginWithGoogle,
  logoutUser,
  openChangeSectionModal,
  saveUserSection,
  applyDynamicSectionFilter
};

// Inyectar contenedor de Auth en la barra de navegación si no existe
window.addEventListener('DOMContentLoaded', () => {
  const navMenus = document.querySelectorAll('.nav-links-menu');
  navMenus.forEach(menu => {
    if (!document.getElementById('authNavContainer')) {
      const authDiv = document.createElement('div');
      authDiv.id = 'authNavContainer';
      authDiv.style.display = 'inline-flex';
      authDiv.style.alignItems = 'center';
      menu.appendChild(authDiv);
      updateNavbarUI(currentUser, userSection);
    }
  });
});
