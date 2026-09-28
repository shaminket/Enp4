/**
 * SERVICE WORKER — SISTEMA DIGITAL 415 (PWA)
 * Soporte sin conexión para horario, selección A/B y materias previamente visitadas
 */

const CACHE_NAME = 'grupo-415-v2.2';

const CORE_ASSETS = [
  './',
  './index.html',
  './centro-de-control.html',
  './historial.html',
  './calendario.html',
  './notificaciones.html',
  './buscar.html',
  './archivos.html',
  './herramientas-pdf.html',
  './recuerdos-415.html',
  './ayuda.html',
  './legal.html',
  './css/tokens.css',
  './css/main.css',
  './css/muertos.css',
  './js/data.js',
  './js/app.js',
  './js/effects.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW 415] Precaching de activos esenciales');
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('[SW 415] Advertencia precaching:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW 415] Limpiando caché obsoleta:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia Network-First con Cache-Fallback
self.addEventListener('fetch', (event) => {
  // Ignorar solicitudes no GET o widgets externos de PDF24
  if (event.request.method !== 'GET' || event.request.url.includes('pdf24.org')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Clonar y almacenar respuesta fresca
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Si no hay red, servir desde caché local
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Si solicita navegación HTML y no está en caché, servir index
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
