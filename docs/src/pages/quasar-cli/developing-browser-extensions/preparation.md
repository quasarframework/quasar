---
title: Preparation for BEX
desc: How to add the Browser Extension (BEX) mode into a Quasar app.
---

The difference between building a SPA, Mobile App, Electron App, BEX or SSR is simply determined by the "mode" parameter in "quasar dev" and "quasar build" commands.

## 1. Add Quasar BEX Mode
In order to build a BEX, we first need to add the BEX mode to our Quasar project:

```bash
$ quasar mode add bex
```

If you want to jump right in and start developing, you can skip the "quasar mode" command and issue:

```bash
$ quasar dev -m bex
```

This will add BEX mode automatically, if it is missing adding a `src-bex` folder to your project.

:::tip
The `src-bex` folder is just a standard browser extension folder so you are free to use it as you would any other browser extension project folder. Please refer to supported Browser Extension documentation to learn more.

* [Mozilla FireFox Browser Extension Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
* [Google Chrome Browser Extension Documentation](https://developer.chrome.com/extensions)
* **Other Chromium Based Browsers** - Refer to their specific documentation.
:::

## 2. Understand The Anatomy Of `src-bex`

The new folder has the following structure:
```bash
.
└── src-bex/
    ├── css                    # CSS to use in the Browser Context
    |   ├── content-css.css       # CSS file which is auto injected into the consuming webpage via the manifest.json
    ├── icons/                 # Icons of your app for all platforms
    |   ├── icon-16x16.png         # Icon file at 16px x 16px
    |   ├── icon-48x48.png         # Icon file at 48px x 48px
    |   └── icon-128x128.png       # Icon file at 128px x 128px
    ├── js/                    # Javascript files used within the context of the BEX.
    |   ├── background.js         # Standard background script BEX file - auto injected via manifest.json
    |   ├── background-hooks.js   # Background script with a hook into the BEX communication layer
    |   ├── content-hooks.js      # Content script script with a hook into the BEX communication layer
    |   ├── content-script.js     # Standard content script BEX file - auto injected via manifest.json
    |   └── dom-hooks.js          # JS file which is injected into the DOM with a hook into the BEX communication layer
    └── www/                   # Compiled BEX source - compiled from /src (Quasar app)
    └── manifest.json          # Main thread code for production
```

The next section will discuss these in more detail.
