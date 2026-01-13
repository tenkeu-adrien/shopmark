// next.config.mjs  (ou .js)
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'src/sw.js',           // ← tu peux même passer à .ts si tu veux du typage
  swDest: 'public/sw.js',
  cacheOnNavigation: true,
  additionalPrecacheEntries: [
    { url: '/offline', revision: null }, // ou 'v1' si tu veux forcer un refresh
  ],
  disable: process.env.NODE_ENV === 'development',
  // Option très utile pour éviter beaucoup de surprises :
  // injectionPoint: '__SW_MANIFEST',     // ← explicite (par défaut c'est déjà ça)
});

const nextConfig = {
  reactStrictMode: true,
  // swcMinify est DEPRECATED dans Next 15 → on le retire
  // (Next utilise SWC par défaut maintenant, plus besoin de cette option)
};

export default withSerwist(nextConfig);