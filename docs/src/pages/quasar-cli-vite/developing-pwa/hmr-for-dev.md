---
title: Hot Module Reload for PWA
desc: (@quasar/app-vite) How to manage HMR (Hot Module Reload) with Quasar PWA.
---

**When in develop mode** (not production), having a Service Worker installed and running will mess with the HMR (Hot Module Reload). However, the browser can be configured to bypass for network instead of using the Service Worker's cache.

![Making HMR work for PWA](https://cdn.quasar.dev/img/pwa-hmr.png)

When your development activity does not include configuring the Service Worker (like when editing the "/src-pwa/register-service-worker.js" file), then you can safely trigger the `$ quasar dev -m spa` (instead of `$ quasar dev -m pwa`) command to avoid the extra hassle of paying attention to the effects of the Service Worker -- which sometimes may get in the way.

::: warning
The development server by default uses a bare minimum Service Worker precaching only the public folder. Working offline will not be available.
:::
