---
title: Electron Preload Script
desc: (@quasar/app-vite) How to expose a controlled Electron API to a Quasar renderer.
---

The renderer process (your UI code from `/src`) does not have direct access to Node.js or Electron APIs in Quasar's default secure configuration. Use the preload script at `/src-electron/electron-preload.js` (or `.ts`) and Electron's `contextBridge` to expose only the operations the UI needs.

The default renderer sandbox gives the preload script a limited API. Perform filesystem access and other privileged work in the main process, then expose purpose-built operations through IPC.

## How to use it

The generated `/src-electron/electron-preload.js` already exposes Quasar's runtime path helpers. Add your own bridge methods alongside it.

Make sure that your `/src-electron/electron-main.js` has the following (near the "webPreferences" section):

```js /src-electron/electron-main
// Add this at the top:
import path from 'node:path'

// ...

function createWindow () {
  // ...
  const mainWindow = new BrowserWindow({
    // ...
    webPreferences: {
      // HERE IS THE MAGIC (notice .cjs - NOT a mistake):
      preload: path.join(import.meta.dirname, "electron-preload.cjs")
    }
  })
```

Example of `/src-electron/electron-preload` content:

```js
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

## Security considerations

Just by using `contextBridge` does not automatically mean that everything you do is safe. For instance the code below is unsafe:

```js
// BAD code; DON'T!!
contextBridge.exposeInMainWorld('myAPI', {
  send: ipcRenderer.send
})
```

It directly exposes a powerful API without any kind of argument filtering. This would allow any website to send arbitrary IPC messages which you do not want to be possible. The correct way to expose IPC-based APIs would instead be to provide one method per IPC message.

```js
// Good code
contextBridge.exposeInMainWorld('myAPI', {
  loadPreferences: () => ipcRenderer.invoke('myAPI:load-prefs')
})
```

Now, `loadPreferences` is available to renderer code as `window.myAPI.loadPreferences()`.

::: warning
Choose a name that does not collide with an existing `Window` property.
:::

Handle the corresponding `load-prefs` invocation in the main process:

```js
ipcMain.handle('myAPI:load-prefs', () => {
  return {
    // object that contains preferences
  }
})
```

## Custom path to the preload script

Change the main-process source with `sourceFiles.electronMain`. Configure one or more preload sources with `electron.preloadScripts`; entries are relative to `/src-electron` and omit the extension:

```js /quasar.config file
sourceFiles: {
  electronMain: 'src-electron/electron-main'
},
electron: {
  preloadScripts: [ 'electron-preload', 'secondary-preload' ]
}
```
