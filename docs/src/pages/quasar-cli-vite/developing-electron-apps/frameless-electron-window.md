---
title: Frameless Electron Window
desc: (@quasar/app-vite) How to hide the window frame in a Quasar desktop app.
examples: frameless-electron-window
related:
  - /vue-components/bar
---

A nice combo is to use frameless Electron window along with [QBar](/vue-components/bar) component. Here's why.

## Main process

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

function getSenderWindow(event) {
  const win = BrowserWindow.fromWebContents(event.sender)

  return event.senderFrame === win?.webContents.mainFrame ? win : undefined
}

app.whenReady().then(async () => {
  registerWindowControls() // <-- call this before createWindow()
  createWindow()
  // ...
})
```

Resolving the window from `event.sender` ensures that each renderer controls only its own window. If your app loads remote content or accepts navigation away from its packaged UI, also [validate the sender of every IPC message](/quasar-cli-vite/developing-electron-apps/electron-security-concerns#expose-narrow-preload-apis) before performing privileged actions.

### The preload script

Expose the window API to the renderer process through `/src-electron/electron-preload`:

```js /src-electron/electron-preload
import { contextBridge, ipcRenderer } from 'electron'

// notice "myWindowAPI" (can be anything as long as we reference
// the same name that we use in the renderer process)
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

## Renderer process

### Handling window dragging

A frameless window needs a draggable region. Use the `q-electron-drag` and `q-electron-drag--exception` Quasar CSS helper classes.

```html
<q-bar class="q-electron-drag"> ... </q-bar>
```

The class allows the user to drag the window from that region.

Interactive children must not trigger dragging. [QBtn](/vue-components/button) is excluded automatically, and so is overlay content (menus, dialogs, notifications, tooltips) that would otherwise be unclickable where it overlaps the drag region (v2.26.1+); add `q-electron-drag--exception` to other interactive children.

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
<template>
  <q-bar v-if="isElectron" class="q-electron-drag">
    <q-icon name="laptop_chromebook" />
    <div>Google Chrome</div>

    <q-space />

    <q-btn aria-label="Minimize" dense flat icon="minimize" @click="minimize" />
    <q-btn
      aria-label="Maximize"
      dense
      flat
      icon="crop_square"
      @click="toggleMaximize"
    />
    <q-btn aria-label="Close" dense flat icon="close" @click="closeApp" />
  </q-bar>
</template>

<script setup>
  const isElectron = import.meta.env.QUASAR_ELECTRON_MODE
  // ...
</script>
```
