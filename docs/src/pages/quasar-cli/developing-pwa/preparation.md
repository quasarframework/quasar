---
title: Preparation for PWA
desc: How to add PWA mode with Quasar CLI.
related:
  - /quasar-cli/quasar-conf-js
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

A new folder will appear in your project folder (which is explained in detail on the [Configuring PWA](/quasar-cli/developing-pwa/configuring-pwa) page):

```bash
.
└── src-pwa/
    ├── register-service-worker.js  # (or .ts) App-code *managing* service worker
    └── custom-service-worker.js    # (or .ts) Optional custom service worker file
                                    #               (InjectManifest mode ONLY)
```

Both files are going to be detailed in the next pages, but the high overview is:

* The `register-service-worker.[js|ts]` file is part of the UI code and communicates with the service worker.
* When using InjectManifest, you can write your own custom service worker (`custom-service-worker.[js|ts]`).
