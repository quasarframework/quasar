---
title: Upgrade guide on Electron
desc: (@quasar/app-vite) Upgrading instructions when dealing with Electron in Quasar.
scope:
  oldStructure:
    l: src-electron
    c:
    - l: icons
      e: Icons of your app for all platforms
      c:
      - l: icon.icns
        e: Icon file for Darwin (MacOS) platform
      - l: icon.ico
        e: Icon file for win32 (Windows) platform
      - l: linux-512x512.png
        e: Icon file for Linux platform (when using electron-builder)
    - l: main-process
      c:
      - l: electron-preload.js
        e: Electron preload script (injects Node.js stuff into renderer thread)
      - l: electron-main.dev.js
        e: Main thread code (preceded by dev code only)
      - l: electron-main.js
        e: Main thread code (production code)
  newStructure:
    l: src-electron
    c:
    - l: icons
      e: Icons of your app for all platforms
      c:
      - l: icon.icns
        e: Icon file for Darwin (MacOS) platform
      - l: icon.ico
        e: Icon file for win32 (Windows) platform
      - l: icon.png
        e: Tray icon file for all platforms (especially Linux)
    - l: electron-preload.js
      e: "(or .ts) Electron preload script (injects Node.js stuff into renderer thread)"
    - l: electron-main.js
      e: "(or .ts) Main thread code"
---

## Upgrading Electron
When you add the Electron mode in a Quasar project for the first time you will get the latest version of the Electron package. At some point in time, you will want to upgrade the Electron version.

Before upgrading Electron, please consult its release notes. Are there breaking changes?

```bash
# from the root of your Quasar project
$ yarn upgrade electron@latest
# or: npm install electron@latest
```

## Upgrading from Quasar v1
The Electron mode for Quasar v2 is an almost complete overhaul of the previous version, significantly improving the developer experience. Some of the changes here are required in order to ensure compatibility with the latest developments in the Electron world (so bulletproofing for upcoming upstream changes).

### High overview of the improvements

* **Out of the box support for Typescript**. Just rename electron-main.js and electron-preload.js to electron-main.ts and electron-preload.ts.
* Support for Electron 11 and preparing out of the box support for upcoming changes in Electron 12+ (without you needing to change anything in the future). One of changes are that we'll be using `contextIsolation` instead of the deprecated `Node Integration`.
* The preload script no longer has the old limitations. You can import other js files with a relative path because the script is now bundled and passed through Babel (so you can use the `import X from Y` syntax too). You can also enable linting for it.
* You can enable linting for the main thread and the preload script too.
* We've removed the default electron-main.dev.js support as it seems that it's not needed anymore. However, you can add it back by creating it and referencing it from electron-main (it's no longer detected by Quasar CLI automatically -- because we don't need to; more on this later).

### The /src-electron folder

The **old** structure was:

<doc-tree :def="scope.oldStructure" />

The **NEW** structure is:

<doc-tree :def="scope.newStructure" />

Notice that there's no `electron-main.dev.js` file anymore (not needed anymore) and that the `electron-preload/main.js` files need to be moved directly under `/src-electron`.

### The electron-main.js file
In order for us to be forward compatible with future versions of Electron, you'll need to do some small (but important!) changes:

```js
// OLD way
mainWindow = new BrowserWindow({
  // ...
  webPreferences: {
    nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
    nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,
    // preload: path.resolve(__dirname, 'electron-preload.js')
  }
})

// NEW way
mainWindow = new BrowserWindow({
  // ...
  webPreferences: {
    // we enable contextIsolation (Electron 12+ has it enabled by default anyway)
    contextIsolation: true,
    // we use a new way to reference the preload script
    // (it's going to be needed, so add it and create the file if it's not there already)
    preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
  }
})
```

### The electron-preload.js file
You will need this file if you don't have it already. So create it if it's missing. Without it you won't be able to use the power of Node.js in your renderer thread.

More info: [preload script](/quasar-cli-vite/developing-electron-apps/electron-preload-script).

::: danger
You will need to transfer all the Node.js stuff away from your renderer thread (the UI code from /src) and into the preload script. Provide the same functionality through the `contextBridge` as seen below.
:::

This is the default content of `electron-preload.js`:

```js
/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > "dependencies" and NOT in "devDependencies"
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   const { contextBridge } = require('electron')
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */
```

### quasar.config.js changes

```js
// OLD way
electron: {
  // it's gone now (upcoming upstream breaking change)
  // replaced by a change in electron-main.js documented earlier
  nodeIntegration: true, // remove me!

  // remove:
  chainWebpack (chain) { /* ... */ },

  // remove:
  extendWebpack (cfg) { /* ... */ }
}

// NEW way
electron: {
  // New!
  inspectPort: 5858,

  // New!
  extendElectronMainConf (cfg) {
    // do something with Esbuild config
    // for the Electron Main thread
  },

  // New!
  extendElectronPreloadConf (cfg) {
    // do something with Esbuild config
    // for the Electron Preload thread
  }
}
```

### Renderer thread (/src)
The [$q object](/options/the-q-object) no longer contains the `electron` property. You will need to use the [preload script](/quasar-cli-vite/developing-electron-apps/electron-preload-script) to access it and provide it to the renderer thread.

Furthermore, the [openURL](/quasar-utils/other-utils#open-external-url) util can no longer tap into Electron to open a new window. You will need to provide your own util from the preload script.

::: danger
You will need to transfer all the Node.js stuff away from your renderer thread (the UI code from /src) and into the preload script. Provide the same functionality through the `contextBridge` as seen in the preload script section above.
:::

### Browser Devtools
You may also want the following code in your electron-main.js to auto-open devtools while on dev mode (or prod with debugging enabled) and to disable devtools on production builds (without debugging enabled):

```js
function createWindow () {
  mainWindow = new BrowserWindow({ /* ... */ })

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  }
  else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }
}
```
