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

In your `src-electron/electron-main` file, make some edits to these lines:

```js /src-electron/electron-main file
import {
  // ...other imports
  ipcMain // <-- add this
} from 'electron'

function createWindow() {
  const mainWindow = new BrowserWindow({
    // ...other settings
    frame: false // <-- add this
  })

  // ...
}

// Add this function:
function registerWindowControls() {
  ipcMain.on('window:minimize', event => {
    BrowserWindow.fromWebContents(event.sender)?.minimize()
  })

  ipcMain.on('window:toggle-maximize', event => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) return

    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  })

  ipcMain.on('window:close', event => {
    BrowserWindow.fromWebContents(event.sender)?.close()
  })
}

app.whenReady().then(async () => {
  registerWindowControls() // <-- call this before createWindow()
  createWindow()
  // ...
})
```

Resolving the window from `event.sender` ensures that each renderer controls only its own window. If your app loads remote content or accepts navigation away from its packaged UI, also [validate the sender of every IPC message](/quasar-cli-vite/developing-electron-apps/electron-security-concerns#checklist-security-recommendations) before performing privileged actions.

### The preload script

We will expose our window API to the renderer thread through our `/src-electron/electron-preload` script:

```js /src-electron/electron-preload
import { contextBridge, ipcRenderer } from 'electron'

// notice "myWindowAPI" (can be anything as long as we reference
// the same name that we define here in the renderer thread)
contextBridge.exposeInMainWorld('myWindowAPI', {
  minimize() {
    ipcRenderer.send('window:minimize')
  },
  toggleMaximize() {
    ipcRenderer.send('window:toggle-maximize')
  },
  close() {
    ipcRenderer.send('window:close')
  }
})
```

## Renderer thread

### Handling window dragging

When we use a frameless window (only frameless!) we also need a way for the user to be able to move the app window around the screen. You can use `q-electron-drag` and `q-electron-drag--exception` Quasar CSS helper classes for this.

```html
<q-bar class="q-electron-drag"> ... </q-bar>
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

<DocExample title="Full example" file="StatusBar" />

In the example above, notice that we add `q-electron-drag` to our QBar and we also add handlers for the minimize, maximize and close app buttons by using the injected `window.myWindowAPI` Object (from the Electron preload script).

```js Some .vue file
// We guard the Electron API calls, but this
// is only needed if we build same app with other
// Quasar Modes as well (SPA/PWA/Cordova/SSR...)

export default {
  setup() {
    // we rely upon
    function minimize() {
      if (import.meta.env.QUASAR_ELECTRON_MODE) {
        window.myWindowAPI.minimize()
      }
    }

    function toggleMaximize() {
      if (import.meta.env.QUASAR_ELECTRON_MODE) {
        window.myWindowAPI.toggleMaximize()
      }
    }

    function closeApp() {
      if (import.meta.env.QUASAR_ELECTRON_MODE) {
        window.myWindowAPI.close()
      }
    }

    return { minimize, toggleMaximize, closeApp }
  }
}
```

We can also hide the header window bar for non-Electron Quasar modes:

```html
<q-bar v-if="isElectron" class="q-electron-drag">
  <q-icon name="laptop_chromebook" />
  <div>Google Chrome</div>

  <q-space />

  <q-btn dense flat icon="minimize" @click="minimize" />
  <q-btn dense flat icon="crop_square" @click="toggleMaximize" />
  <q-btn dense flat icon="close" @click="closeApp" />
</q-bar>

<script setup>
  const isElectron = import.meta.env.QUASAR_ELECTRON_MODE
  // ...
</script>
```
