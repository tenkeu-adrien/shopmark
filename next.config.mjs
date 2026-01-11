/** @type {import('next').NextConfig} */

import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'src/sw.js',           // tu vas créer ce fichier
  swDest: 'public/sw.js',
  cacheOnNavigation: true,
  additionalPrecacheEntries: [
    { url: '/offline', revision: 'v1' } // page offline optionnelle
  ],
  disable: process.env.NODE_ENV === 'development',
})
const nextConfig = {};

export default withSerwist(nextConfig);
