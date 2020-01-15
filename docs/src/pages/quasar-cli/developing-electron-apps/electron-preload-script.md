---
title: Electron Preload Script
badge: "@quasar/app v1.5+"
desc: How to handle Electron Node Integration with an Electron Preload script with Quasar CLI.
---

As of "@quasar/app" v1.5+, you can benefit from an Electron preload script, which is very useful when you have [Node Integration](/quasar-cli/developing-electron-apps/node-integration) turned off.

This preload script can allow you to inject Nodejs stuff into the "window" global from the rendered thread (UI). This script will run in the browser, before your rendered thread. Regardless of your Node Integration setting, this file will have access to Nodejs. So be careful what you do with it!

## How to enable it
In `/src-electron/main-process/` folder, create a file and name it `electron-preload.js`. Fill it with your preload code. Then edit `/src-electron/main-process/electron-main.js`, near the "webPreferences" section:

```js
// file: /src-electron/main-process/electron-main.js

// Add this at the top:
import path from 'path'

// ...

function createWindow () {
  // ...
  mainWindow = new BrowserWindow({
    // ...
    webPreferences: {
      nodeIntegration: QUASAR_NODE_INTEGRATION,

      // HERE IS THE MAGIC:
      preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })
```

::: warning
The name `electron-preload.js` cannot be changed, otherwise Quasar will not detect it and your production build will fail.
:::

Example of `/src-electron/main-process/electron-preload.js` content:

```js
window.electron = require('electron')
```

## Limitations on electron-preload.js
1. This file is not transpiled by Babel.
2. This file is not going through any linting.
3. You cannot import files with a relative path from it, as it is copied as-is into the final app bundle.
4. You need to have this file already created before starting up the "quasar dev" command, otherwise any changes in it will not trigger a reload.

