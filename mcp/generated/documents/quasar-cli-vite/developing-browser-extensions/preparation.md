---
title: Preparation for BEX
description: (@quasar/app-vite) How to add the Browser Extension (BEX) mode into a Quasar app.
canonical: https://quasar.dev/quasar-cli-vite/developing-browser-extensions/preparation
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

Quasar CLI selects the browser-extension build target through the mode and target arguments passed to `quasar dev` and `quasar build`.

## Add Quasar BEX Mode

In order to build a BEX, we first need to add the BEX mode to our Quasar project:

```bash
quasar mode add bex
```

If you want to jump right in and start developing, you can skip the "quasar mode" command and issue:

```bash
quasar dev -m bex -T [chrome|firefox]
# default target is "chrome", so -T can be omitted
```

This will add BEX mode automatically, if it is missing, by creating the `/src-bex` folder into your project.

::: tip
The `src-bex` folder is just a standard browser extension folder so you are free to use it as you would any other browser extension project folder. Please refer to supported Browser Extension documentation to learn more.

- [Google Chrome Browser Extension Documentation](https://developer.chrome.com/extensions)
- [Firefox Browser Extension Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- **Other Chromium Based Browsers** - Refer to their specific documentation.

:::

## The Anatomy of "/src-bex"

The new folder has the following structure:

- src-bex
  - assets
    - content.css — CSS file which is auto injected into the consuming webpage via the manifest.json
  - icons — Icons of your app for all platforms
    - icon-128x128.png — Icon file at 128px x 128px
    - icon-16x16.png — Icon file at 16px x 16px
    - icon-48x48.png — Icon file at 48px x 48px
  - _locales/ — Optional BEX locales files that you might define in manifest
  - manifest.json — The browser extension manifest file
  - background.js — (or .ts) Standard background script BEX file (auto injected via manifest.json)
  - my-content-script.js — (or .ts) Standard content script BEX file - auto injected via manifest.json (you can have multiple content scripts)
  - package.json — helps install BEX only deps directly under /src-bex
  - bex-end.d.ts — TypeScript only

The next section will discuss these in more detail.
