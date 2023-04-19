---
title: Frameless Electron Window
desc: (@quasar/app-vite) How to hide the window frame in a Quasar desktop app.
examples: frameless-electron-window
related:
  - /vue-components/bar
---

A nice combo is to use frameless Electron window along with [QBar](/vue-components/bar) component. Here's why.

## Main thread
### Setting frameless window
Firstly, install the `@electron/remote` dependency into your app.

```bash
$ yarn add @electron/remote
// or:
$ npm install @electron/remote
```

Then, in your `src-electron/main-process/electron-main.js` file, make some edits to these lines:

```js
// src-electron/main-process/electron-main.js

import { app, BrowserWindow, nativeTheme } from 'electron'
import { initialize, enable } from '@electron/remote/main' // <-- add this
import path from 'path'

initialize() // <-- add this

// ...

mainWindow = new BrowserWindow({
  width: 1000,
  height: 600,
  useContentSize: true,
  frame: false // <-- add this
  webPreferences: {
    sandbox: false // <-- to be able to import @electron/remote in preload script
    // ...
  }
})

enable(mainWindow.webContents) // <-- add this

mainWindow.loadURL(process.env.APP_URL)

// ...
```

Notice that we need to explicitly enable the remote module too. We'll be using it in the preload script to provide the renderer thread with the window minimize/maximize/close functionality.

### The preload script
Since we can't directly access Electron from within the renderer thread, we'll need to provide the necessary functionality through the electron preload script (`src-electron/main-process/electron-preload.js`). So we edit it to:

```js
// src-electron/main-process/electron-preload.js

import { contextBridge } from 'electron'
import { BrowserWindow } from '@electron/remote'

contextBridge.exposeInMainWorld('myWindowAPI', {
  minimize () {
    BrowserWindow.getFocusedWindow().minimize()
  },

  toggleMaximize () {
    const win = BrowserWindow.getFocusedWindow()

    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  },

  close () {
    BrowserWindow.getFocusedWindow().close()
  }
})
```

## Renderer thread
### Handling window dragging
When we use a frameless window (only frameless!) we also need a way for the user to be able to move the app window around the screen. You can use `q-electron-drag` and `q-electron-drag--exception` Quasar CSS helper classes for this.

```html
<q-bar class="q-electron-drag">
  ...
</q-bar>
```

What this does is that it allows the user to drag the app window when clicking, holding and simultaneously dragging the mouse on the screen.

While this is a good feature, you must also take into account that you'll need to specify some exceptions. There may be elements in your custom statusbar that you do not want to trigger the window dragging. By default, [QBtn](/vue-components/button) is **excepted from this behavior** (no need to do anything for this). Should you want to add exceptions to any children of the element having `q-electron-drag` class, you can attach the `q-electron-drag--exception` CSS class to them.

Example of adding an exception to an icon:

```html
<q-bar class="q-electron-drag">
  <q-icon name="map" class="q-electron-drag--exception" />

  <div>My title</div>
</q-bar>
```

### Minimize, maximize and close app

<doc-example title="Full example" file="StatusBar" />

In the example above, notice that we add `q-electron-drag` to our QBar and we also add handlers for the minimize, maximize and close app buttons by using the injected `window.myWindowAPI` Object (from the Electron preload script).

```js
// some .vue file

// We guard the Electron API calls, but this
// is only needed if we build same app with other
// Quasar Modes as well (SPA/PWA/Cordova/SSR...)

export default {
  setup () {
    // we rely upon
    function minimize () {
      if (process.env.MODE === 'electron') {
        window.myWindowAPI.minimize()
      }
    }

    function toggleMaximize () {
      if (process.env.MODE === 'electron') {
        window.myWindowAPI.toggleMaximize()
      }
    }

    function closeApp () {
      if (process.env.MODE === 'electron') {
        window.myWindowAPI.close()
      }
    }

    return { minimize, toggleMaximize, closeApp }
  }
}
```
