// src/sw.js - Version corrigée pour Serwist v8+
import { Serwist } from '@serwist/sw';

// Vérifiez que le manifest existe
const manifest = self.__SW_MANIFEST || [];

const serwist = new Serwist({
  precacheEntries: manifest,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.destination === 'document',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
        },
      },
    },
    {
      urlPattern: ({ request }) => 
        request.destination === 'style' || 
        request.destination === 'script' ||
        request.destination === 'worker',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
        },
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
        },
      },
    },
    {
      urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes pour les APIs
        },
      },
    },
  ],
});

// Ajoutez votre gestionnaire offline personnalisé
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) return cachedResponse;
          
          const response = await fetch(event.request);
          return response;
        } catch (error) {
          // Retourne la page offline si disponible
          const offlineResponse = await caches.match('/offline.html');
          if (offlineResponse) return offlineResponse;
          
          // Sinon retourne une réponse simple
          return new Response('Vous êtes hors ligne', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' },
          });
        }
      })()
    );
  }
});

// Initialise Serwist
serwist.addEventListeners();