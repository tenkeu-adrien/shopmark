// src/sw.js
import { installSerwist, defaultCache } from '@serwist/sw';

// Installer Serwist avec les options modernes
installSerwist({
  precacheEntries: self.__WB_MANIFEST, // injecté automatiquement par @serwist/next
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,         // cache par défaut fourni par Serwist
  disableDevLogs: true,                 // supprime les logs en dev
});

// Gestion simple de l'offline
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      }).catch(() => caches.match('/offline')) // fallback offline si nécessaire
    );
  }
});
