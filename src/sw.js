import { defaultCache } from '@serwist/next/worker';
import { Serwist } from '@serwist/sw';


const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

// Ton propre cache offline par exemple
serwist.addEventListeners();