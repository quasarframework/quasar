---
title: Configuring PWA
desc: (@quasar/app-vite) How to manage your Progressive Web Apps with Quasar CLI.
related:
  - /quasar-cli-vite/quasar-config-js
---

## Service Worker
Adding PWA mode to a Quasar project means a new folder will be created: `/src-pwa`, which contains PWA specific files:

```bash
.
└── src-pwa/
    ├── register-service-worker.js  # (or .ts) UI code *managing* service worker
    ├── manifest.json               # Your PWA manifest file
    └── custom-service-worker.js    # (or .ts) Optional custom service worker file
                                    #               (injectManifest mode ONLY)
```

You can freely edit these files. Notice a few things:

1. `register-service-worker.[js|ts]` is automatically imported into your app (like any other /src file). It registers the service worker (created by Workbox or your custom one, depending on workbox plugin mode -- quasar.config.js > pwa > workboxPluginMode) and you can listen for Service Worker's events. You can use ES6 code.
2. `custom-service-worker.[js|ts]` will be your service worker file ONLY if workbox plugin mode is set to "injectManifest" (quasar.config.js > pwa > workboxMode: 'injectManifest'). Otherwise, Quasar and Workbox will create a service-worker file for you.
3. It makes sense to run [Lighthouse](https://developers.google.com/web/tools/lighthouse/) tests on production builds only.

::: tip
Read more on `register-service-worker.[js|ts]` and how to interact with the Service Worker on [Handling Service Worker](/quasar-cli-vite/developing-pwa/handling-service-worker) documentation page.
:::

## quasar.config.js
This is the place where you can configure Workbox behavior and also tweak your manifest.json.

```js
pwa: {
  workboxMode: 'generateSW', // or 'injectManifest'
  injectPwaMetaTags: true,
  swFilename: 'sw.js',
  manifestFilename: 'manifest.json',
  useCredentialsForManifestTag: false,
  extendGenerateSWOptions (cfg) {}
  extendInjectManifestOptions (cfg) {},
  extendManifestJson (json) {}
  extendPWACustomSWConf (esbuildConf) {}
}

sourceFiles: {
  pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
  pwaServiceWorker: 'src-pwa/custom-service-worker',
  pwaManifestFile: 'src-pwa/manifest.json',
}
```

Should you want to tamper with the Vite config for UI in /src:

```js
// quasar.config.js
module.exports = function (ctx) {
  return {
    build: {
      extendViteConf (viteConf) {
        if (ctx.mode.pwa) {
          // do something with ViteConf
        }
      }
    }
  }
}
```

More information: [Workbox](https://developers.google.com/web/tools/workbox).

## Picking Workbox mode

There are two Workbox operating modes: **generateSW** (default) and **injectManifest**.

Setting the mode that you want to use is done through quasar.config.js:

```js
// quasar.config.js

pwa: {
  workboxMode: 'generateSW',
  extendGenerateSWOptions (cfg) {
    // configure workbox on generateSW
  }
}

pwa: {
  workboxMode: 'injectManifest',
  extendInjectManifestOptions (cfg) {
    // configure workbox on injectManifest
  }
}
```

### generateSW

When to use generateSW:

* You want to precache files.
* You have simple runtime configuration needs (e.g. the configuration allows you to define routes and strategies).

When NOT to use generateSW:

* You want to use other Service Worker features (i.e. Web Push).
* You want to import additional scripts or add additional logic.

::: tip
Please check the available workboxOptions for this mode on [Workbox website](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW).
:::

### InjectManifest

When to use InjectManifest:

* You want more control over your service worker.
* You want to precache files.
* You have more complex needs in terms of routing.
* You would like to use your service worker with other APIs (e.g. Web Push).

When NOT to use InjectManifest:

* You want the easiest path to adding a service worker to your site.

::: tip TIPS
* If you want to use this mode, you will have to write the service worker (`/src-pwa/custom-service-worker.[js|ts]`) file by yourself.
* Please check the available workboxOptions for this mode on [Workbox website](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.injectManifest).
:::

The following snippet is the default code for a custom service worker (`/src-pwa/custom-service-worker.[js|ts]`) which mimics the behavior of `generateSW` mode:

```js
/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'

self.skipWaiting()
clientsClaim()

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)

cleanupOutdatedCaches()

// Non-SSR fallback to index.html
// Production SSR fallback to offline.html (except for dev)
if (process.env.MODE !== 'ssr' || process.env.PROD) {
  registerRoute(
    new NavigationRoute(
      createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
      { denylist: [/sw\.js$/, /workbox-(.)*\.js$/] }
    )
  )
}

```

## Configuring Manifest File
The Manifest file is located at `/src-pwa/manifest.json`. You can freely edit it.

Should you need to change it dynamically at build time, you can do so by editing `/quasar.config.js`:

```js
// quasar.config.js
pwa: {
  extendManifestJson (json) {
    // tamper with the json
  }
}
```

Please read about the [manifest config](https://developer.mozilla.org/en-US/docs/Web/Manifest) before diving in.

::: warning
Note that you don't need to edit your index.html file (generated from `/index.html`) to link to the manifest file. Quasar CLI takes care of embedding the right things for you.
::::

::: tip
If your PWA is behind basic auth or requires an Authorization header, set quasar.config.js > pwa > useCredentialsForManifestTag to `true` to include `crossorigin="use-credentials"` on the manifest.json meta tag.
::::

## PWA Checklist
More info: [PWA Checklist](https://web.dev/pwa-checklist/)

::: danger
Do not run [Lighthouse](https://developers.google.com/web/tools/lighthouse/) on your development build because at this stage the code is intentionally not optimized and contains embedded source maps (among many other things). See the [Testing and Auditing](/quasar-cli-vite/testing-and-auditing) section of these docs for more information.
:::

## Reload & Update Automatically

For those who don't want to manually reload the page when the service worker is updated **and are using the default generateSW workbox mode**, Quasar CLI has configured Workbox to activate it at once. Should you need to disable this behavior:

```js
// quasar.config.js
pwa: {
  extendGenerateSWOptions (cfg) {
    cfg.skipWaiting = false
    cfg.clientsClaim = false
  }
}
```
