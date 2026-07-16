---
title: Preparation for PWA
desc: (@quasar/app-vite) How to add PWA mode with Quasar CLI.
related:
  - /quasar-cli-vite/quasar-config-file
scope:
  tree:
    l: src-pwa
    c:
      - l: register-sw.js
        e: '(or .ts) UI code *managing* service worker (main thread)'
      - l: manifest.json
        e: Your PWA manifest file
      - l: package.json
        e: 'helps install PWA only deps directly under /src-pwa'
      - l: sw
        e: 'Service worker context (WebWorker)'
        c:
          - l: custom-sw.js
            e: '(or .ts) Optional custom service worker file (InjectManifest mode ONLY)'
          - l: tsconfig.json
            e: 'TypeScript only - WebWorker lib, scoped to /src-pwa/sw/'
---

Quasar CLI selects the PWA build target through the mode argument passed to `quasar dev` and `quasar build`.

In order to build a PWA, we first need to add the PWA mode to our Quasar project:

```bash
quasar mode add pwa
```

If you want to jump right in and start developing, you can skip the "quasar mode" command and issue:

```bash
quasar dev -m pwa
```

This will add PWA mode automatically, if it is missing.

A new folder will appear in your project folder (which is explained in detail on the [Configuring PWA](/quasar-cli-vite/developing-pwa/configuring-pwa) page):

<DocTree :def="scope.tree" />

All the files above are going to be detailed in the next pages, but the high overview is:

- The `register-sw.js` file is part of the UI code and communicates with the service worker.
- The `manifest.json` is the PWA manifest file.
- When using InjectManifest, you can write your own custom service worker (`sw/custom-sw.js`). It lives in `/src-pwa/sw/`, code runs in WebWorker context (no DOM), and compiled separately from the rest of the app.

Should you want to use different filenames, you can do so by editing the `/quasar.config` file:

```js /quasar.config file
sourceFiles: {
  pwaRegisterServiceWorker: 'src-pwa/register-sw',
  pwaServiceWorker: 'src-pwa/sw/custom-sw',
  pwaManifestFile: 'src-pwa/manifest.json',
}
```
