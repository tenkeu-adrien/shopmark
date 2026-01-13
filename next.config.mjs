// next.config.js
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'src/sw.js',      // ton fichier source SW
  swDest: 'public/sw.js',  // destination finale du SW
  cacheOnNavigation: true, 
  additionalPrecacheEntries: [
    { url: '/offline', revision: 'v1' } // page offline optionnelle
  ],
  disable: process.env.NODE_ENV === 'development', // désactive en dev
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,  // minification rapide pour Next.js
};

export default withSerwist(nextConfig);
