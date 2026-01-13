// src/sw.js    ← corrige comme ceci :

import { installSerwist, defaultCache } from '@serwist/sw';

installSerwist({
  precacheEntries: self.__SW_MANIFEST,   // ← ICI le changement important !
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  disableDevLogs: true,
});

// Le reste peut rester pareil
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => cachedResponse || fetch(event.request))
        .catch(() => caches.match('/offline'))
    );
  }
});