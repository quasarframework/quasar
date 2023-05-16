---
title: Electron Preload Script
desc: (@quasar/app-webpack) How to handle Electron Node Integration with an Electron Preload script with Quasar CLI.
---

For security reasons, the renderer thread (your UI code from `/src`) does not have access to the Node.js stuff. However, you can run Node.js code and bridge it to the renderer thread through an Electron Preload script located at `/src-electron/electron-preload.[js|ts]`. Use `contextBridge` (from the `electron` package) to expose the stuff that you need for your UI.

Since the preload script runs from Node.js, be careful what you do with it and what you expose to the renderer thread!

## How to use it
In `/src-electron/` folder, there is a file named `electron-preload.js`. Fill it with your preload code.

Make sure that your `/src-electron/electron-main.[js|ts]` has the following (near the "webPreferences" section):

```js
// file: /src-electron/electron-main.[js|ts]

// Add this at the top:
import path from 'path'

// ...

function createWindow () {
  // ...
  mainWindow = new BrowserWindow({
    // ...
    webPreferences: {
      // HERE IS THE MAGIC:
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })
```

Example of `/src-electron/electron-preload.[js|ts]` content:

```js
// example which injects window.myAPI.doAThing() into the renderer
// thread (/src/*)

const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  doAThing: () => {}
})
```

::: warning
1. Be aware that this file runs in a Node.js context.
2. If you import anything from node_modules, then make sure that the package is specified in /package.json > "dependencies" and NOT in "devDependencies".
:::

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

Now, `loadPreferences` is available globally in your javascript code (ie: `window.myAPI.loadPreferences`).

::: warning
Make sure to pick names which do not colide with existing `Window` keys.
:::

Using the above code with an `invoke` to `load-prefs` in the main thread would have code like this:

```js
ipcMain.handle('myAPI:load-prefs', () => {
  return {
    // object that contains preferences
  }
})
```

## Custom path to the preload script
Should you wish to change the location of the preload script (and/or even the main thread file) then edit the `/quasar.config` file:

```
// should you wish to change default files
sourceFiles: {
  electronMain: 'src-electron/electron-main.js',
  electronPreload: 'src-electron/electron-preload.js'
}
```
