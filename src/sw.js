// src/sw.js
import { installSerwist, defaultCache } from '@serwist/sw';

// Installer Serwist avec les options modernes
installSerwist({
  precacheEntries: self.__WB_MANIFEST, // fichiers injectés automatiquement par @serwist/next
  skipWaiting: true,                    // remplace la version précédente
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,         // cache par défaut fourni par Serwist
});

// Exemple : ajouter des écouteurs pour le offline (optionnel)
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});
