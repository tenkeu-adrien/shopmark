// src/sw.js - Version corrigée pour Serwist v8+
import { Serwist } from '@serwist/sw';

// Version du cache - INCRÉMENTER à chaque changement important
const CACHE_VERSION = 'v2-fees-20percent';

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
        cacheName: `pages-${CACHE_VERSION}`,
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 1 jour au lieu de 30 jours
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
        cacheName: `static-resources-${CACHE_VERSION}`,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 jours au lieu de 30
        },
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: `images-${CACHE_VERSION}`,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours OK pour les images
        },
      },
    },
    {
      urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
      handler: 'NetworkFirst',
      options: {
        cacheName: `api-cache-${CACHE_VERSION}`,
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes pour les APIs
        },
      },
    },
  ],
});

// Gestionnaire pour nettoyer les anciens caches lors de l'activation
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation - Nettoyage des anciens caches');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Supprimer tous les caches qui ne correspondent pas à la version actuelle
            const isOldCache = !cacheName.includes(CACHE_VERSION);
            if (isOldCache) {
              console.log('[SW] Suppression du cache obsolète:', cacheName);
            }
            return isOldCache;
          })
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      console.log('[SW] Nettoyage terminé - Version:', CACHE_VERSION);
      // Prendre le contrôle immédiatement
      return self.clients.claim();
    })
  );
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

// Message pour notifier les clients d'une nouvelle version
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

// Initialise Serwist
serwist.addEventListeners();