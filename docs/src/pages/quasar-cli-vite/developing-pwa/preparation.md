---
title: Preparation for PWA
desc: (@quasar/app-vite) How to add PWA mode with Quasar CLI.
related:
  - /quasar-cli-vite/quasar-config-js
scope:
  tree:
    l: src-pwa
    c:
    - l: register-service-worker.js
      e: "(or .ts) UI code *managing* service worker"
    - l: manifest.json
      e: Your PWA manifest file
    - l: custom-service-worker.js
      e: "(or .ts) Optional custom service worker file (injectManifest mode ONLY)"
---

We'll be using Quasar CLI to develop and build a PWA. The difference between building a SPA, Mobile App, Electron App, PWA or SSR is simply determined by the "mode" parameter in "quasar dev" and "quasar build" commands.

In order to build a PWA, we first need to add the PWA mode to our Quasar project:

```bash
$ quasar mode add pwa
```

If you want to jump right in and start developing, you can skip the "quasar mode" command and issue:

```bash
$ quasar dev -m pwa
```

This will add PWA mode automatically, if it is missing.

A new folder will appear in your project folder (which is explained in detail on the [Configuring PWA](/quasar-cli-vite/developing-pwa/configuring-pwa) page):

<doc-tree :def="scope.tree" />

All the files above are going to be detailed in the next pages, but the high overview is:

* The `register-service-worker.[js|ts]` file is part of the UI code and communicates with the service worker.
* The `manifest.json` is the PWA manifest file.
* When using InjectManifest, you can write your own custom service worker (`custom-service-worker.[js|ts]`).

Should you want to use different filenames, you can do so by editing `/quasar.config.js`:

```js
// quasar.config.js

sourceFiles: {
  pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
  pwaServiceWorker: 'src-pwa/custom-service-worker',
  pwaManifestFile: 'src-pwa/manifest.json',
}
```
