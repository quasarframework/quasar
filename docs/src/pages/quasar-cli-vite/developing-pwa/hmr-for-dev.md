---
title: Hot Module Reload for PWA
desc: How to manage HMR (Hot Module Reload) with Quasar PWA.
---

**When in develop mode** (not production), having a Service Worker installed and running will mess with the HMR (Hot Module Reload). However, the browser can be configured to bypass for network instead of using the Service Worker's cache.

![Making HMR work for PWA](https://cdn.quasar.dev/img/pwa-hmr.png)

When your development activity does not include configuring the Service Worker (like when editing the "/src-pwa/register-service-worker.js" file), then you can safely trigger the `$ quasar dev -m spa` (instead of `$ quasar dev -m pwa`) command to avoid the extra hassle of paying attention to the effects of the Service Worker -- which sometimes may get in the way.

One more reason to dev in SPA mode (as described above) when not dealing directly with the development of the service worker is that you may bump into the following warning (which can be ignored and is described fully [here](https://github.com/GoogleChrome/workbox/issues/1790)):

> GenerateSW has been called multiple times, perhaps due to running webpack in --watch mode. The precache manifest generated after the first call may be inaccurate! Please see https://github.com/GoogleChrome/workbox/issues/1790 for more information.
