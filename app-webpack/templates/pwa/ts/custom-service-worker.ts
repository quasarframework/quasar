/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxPluginMode is set to "InjectManifest"
 */

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

import { precacheAndRoute } from 'workbox-precaching';

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);
