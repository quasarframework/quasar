---
title: Electron with TypeScript
desc: (@quasar/app-vite) How to use TypeScript with Electron in Quasar
---

When Electron mode is added to a TypeScript Quasar project, Quasar creates TypeScript main and preload sources automatically. To convert an existing JavaScript Electron workspace, rename the files under `/src-electron` from `.js` to `.ts` and address any TypeScript errors. The default source configuration omits extensions, so it resolves either form.

::: tip
`@electron/packager` and `electron-builder` export their configuration types from their own packages.
Since autocomplete into the `quasar.config` file relies on those types, properties `electron.packager` and `electron.builder` will be fully typed only after the respective package is installed.
You can force the installation of the selected bundler (depending on your `electron.bundler` option) by running a build command in Electron mode: `quasar build -m electron`
:::

Example of files in your `/src-electron` folder:

```js /src-electron/electron-main.ts
import { BrowserWindow, app } from 'electron'
import path from 'node:path'
import os from 'node:os'
import {
  registerQuasarRuntime,
  resolveElectronAssetsPath
} from '#q-app/electron/main'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

async function createWindow() {
  /**
   * Initial window options
   */
  const mainWindow = new BrowserWindow({
    icon: resolveElectronAssetsPath('icons/icon.png'), // Windows and Linux
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.join(import.meta.dirname, 'electron-preload.cjs')
    }
  })

  if (import.meta.env.QUASAR_DEV) {
    await mainWindow.loadURL(import.meta.env.QUASAR_APP_URL)
  } else {
    await mainWindow.loadFile('index.html')
  }

  if (import.meta.env.QUASAR_DEBUG) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools()
    })
  }
}

void app.whenReady().then(() => {
  registerQuasarRuntime()
  void createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})
```

```js /src-electron/electron-preload.ts
/**
 * This file is used specifically for security reasons.
 * Here you can securely expose privileged APIs into the renderer process
 * by leveraging Electron's contextBridge functionality and communicating
 * with the main process through Electron's inter-process communication (IPC).
 *
 * WARNING!
 * The preload script sandboxing offers limited access to a full Node.js environment.
 * Do NOT attempt to import packages from node_modules or use Node.js APIs directly in this file.
 * Instead, use IPC to communicate with the main process and access packages and Node.js
 * functionality there.
 *
 * Example of exposing window.myAPI.doAThing() to the renderer process:
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * Preload script documentation:
 * https://www.electronjs.org/docs/latest/tutorial/tutorial-preload
 */
import { contextBridge } from 'electron'
import { quasarRuntime } from '#q-app/electron/preload'

contextBridge.exposeInMainWorld('quasarRuntime', quasarRuntime)
```
