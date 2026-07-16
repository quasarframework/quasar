---
title: PWA with TypeScript
desc: (@quasar/app-vite) How to use TypeScript with Quasar PWA
---

When you add PWA mode to a TypeScript project (`quasar mode add pwa`), Quasar scaffolds the service worker inside `/src-pwa/sw/` with its own `tsconfig.json` so the WebWorker context is type-checked independently from the rest of the app.

The `/src-pwa/sw/tsconfig.json` is a thin pointer to a generated config in `.quasar/`:

```json /src-pwa/sw/tsconfig.json
{
  "extends": "../../.quasar/tsconfig.pwa-sw.json"
}
```

The generated `.quasar/tsconfig.pwa-sw.json` handles the WebWorker lib swap and scopes `include`/`exclude` to the SW folder. To customize it, it's recommended to use the `pwa.extendPWASwTsConfig` hook in `quasar.config.ts` instead of editing `src-pwa/sw/tsconfig.json` directly:

```ts /quasar.config.ts
pwa: {
  /**
   * Extend the generated `.quasar/tsconfig.pwa-sw.json` file.
   *
   * NOT async! Can directly modify the "config" parameter or
   * return a new one that will be merged with the default one.
   */
  extendPWASwTsConfig (tsConfig) {
    tsConfig.compilerOptions!.lib!.push('WebWorker.AsyncIterable')
  }
}
```

`register-sw.ts` stays at the `/src-pwa/` root because it runs in the main thread and gets bundled into the app along with `/src` (via Vite). Anything inside `/src-pwa/sw/` is built separately by Rolldown for the service worker context. Add more SW-only modules inside `sw/` and import them from `custom-sw.ts`, and add main-thread modules directly under `src-pwa/` or import from `/src` as needed.

## How the type-check works

TypeScript does NOT pick up nested `tsconfig.json` files when running `tsc`/`vue-tsc` against the project root. It applies the root compiler options to every file in `include`. To prevent type errors on service worker code (e.g. `ServiceWorkerGlobalScope.skipWaiting` not existing under the DOM lib), Quasar CLI adds `/src-pwa/sw/` in `.quasar/tsconfig.json > excludes` when PWA mode is installed.

The IDE language server still applies `/src-pwa/sw/tsconfig.json` to files inside that folder (TS treats a nested tsconfig as a separate project), so you still get correct autocomplete and inline diagnostics there.

## Type-checking the service worker in dev/build

Because the SW is excluded from the root project, the `vite-plugin-checker` instance running `vue-tsc` will not check it. To get inline SW diagnostics on `quasar dev`/`quasar build`, add a `typescript` entry to your `vite-plugin-checker` config in `quasar.config.ts`:

```ts /quasar.config.ts
build: {
  vitePlugins: [
    [
      'vite-plugin-checker',
      {
        vueTsc: true,
        typescript: {
          tsconfigPath: './src-pwa/sw/tsconfig.json'
        }
        // ...
      },
      { server: false }
    ]
  ]
}
```

A convenient `typecheck` script in `package.json` is a common pattern:

```json /package.json
{
  "scripts": {
    "typecheck": "vue-tsc --noEmit && tsc -p src-pwa/sw/tsconfig.json --noEmit"
  }
}
```

## Migrating an existing PWA folder to TypeScript

If you added PWA mode while the project was still JavaScript and later switched to TypeScript, the `/src-pwa/` folder won't get re-scaffolded. Convert it by hand:

1. Rename `/src-pwa/register-sw.js` -> `/src-pwa/register-sw.ts`.
2. Create `/src-pwa/sw/` and move `/src-pwa/custom-sw.js` -> `/src-pwa/sw/custom-sw.ts` (also rename the extension).
3. Create `/src-pwa/sw/tsconfig.json` with the contents shown above.
4. Add the SW typing declaration at the top of `custom-sw.ts` (see "Default service worker contents" below) and apply any other TS-specific code adjustments.
5. (Optional) Wire the `typescript` entry into `vite-plugin-checker` and/or add a `typecheck` script as shown above.

## Default service worker contents

```ts /src-pwa/sw/custom-sw.ts
/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config file > pwa > workboxMode is set to "InjectManifest"
 */

import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute
} from 'workbox-precaching'

declare const self: ServiceWorkerGlobalScope & typeof globalThis

void self.skipWaiting()
clientsClaim()

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)

cleanupOutdatedCaches()

if (import.meta.env.QUASAR_PROD) {
  // Non-SSR/SSG fallbacks to index.html
  // Production SSR/SSG fallbacks to offline.html (except for dev)
  registerRoute(
    new NavigationRoute(
      createHandlerBoundToURL(import.meta.env.QUASAR_PWA_FALLBACK_HTML),
      {
        denylist: [
          new RegExp(import.meta.env.QUASAR_PWA_SERVICE_WORKER_REGEX),
          /workbox-(.)*\.js$/
        ]
      }
    )
  )
}
```
