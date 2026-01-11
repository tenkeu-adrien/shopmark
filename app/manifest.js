// app/manifest.ts
// import type { MetadataRoute } from 'next'

export default function manifest() {
  return {
    name: 'SHOPMARK',
    short_name: 'SHOPMARK',
    description: 'Votre marketplace premium',
    start_url: '/',
    display: 'standalone', // Mode plein écran comme une app native
    background_color: '#000000', // Couleur d'arrière-plan au démarrage
    theme_color: '#f59e0b', // Couleur de la barre de statut (Android)
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      // Ajoutez d'autres tailles si nécessaire
    ],
  }
}