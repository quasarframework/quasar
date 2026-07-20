---
title: Frameless Electron Window
description: (@quasar/app-vite) How to hide the window frame in a Quasar desktop app.
canonical: https://quasar.dev/quasar-cli-vite/developing-electron-apps/frameless-electron-window
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

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

Resolving the window from `event.sender` ensures that each renderer controls only its own window. If your app loads remote content or accepts navigation away from its packaged UI, also [validate the sender of every IPC message](/quasar-cli-vite/developing-electron-apps/electron-security-concerns#checklist-security-recommendations) before performing privileged actions.

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

Interactive children must not trigger dragging. [QBtn](/vue-components/button) is excluded automatically; add `q-electron-drag--exception` to other interactive children.

Example of adding an exception to an icon:

```html
<q-bar class="q-electron-drag">
  <q-icon name="map" class="q-electron-drag--exception" />

  <div>My title</div>
</q-bar>
```

### Minimize, maximize and close app

**Example: Full example**

Source: [StatusBar.vue](../../../examples/frameless-electron-window/StatusBar.vue)

````vue
<template>
  <div class="q-pa-md">
    <!--
      Anything after view="lHh lpr lFf" is only needed
      so we can display this example in the documentation

      Remove this part: container style="height: 400px" class="shadow-2 rounded-borders"
    -->
    <q-layout
      view="lHh lpr lFf"
      container
      style="height: 400px"
      class="shadow-2 rounded-borders"
    >
      <q-header elevated>
        <q-bar class="q-electron-drag">
          <q-icon name="laptop_chromebook" />
          <div>Google Chrome</div>

          <q-space />

          <q-btn dense flat icon="minimize" @click="minimize" />
          <q-btn dense flat icon="crop_square" @click="toggleMaximize" />
          <q-btn dense flat icon="close" @click="closeApp" />
        </q-bar>

        <div class="q-pa-sm q-pl-md row items-center">
          <div class="cursor-pointer non-selectable">
            File
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section>Open...</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>New</q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable>
                  <q-item-section>Preferences</q-item-section>
                  <q-item-section side>
                    <q-icon name="keyboard_arrow_right" />
                  </q-item-section>

                  <q-menu anchor="top end" self="top start">
                    <q-list>
                      <q-item v-for="n in 3" :key="n" dense clickable>
                        <q-item-section>Submenu Label</q-item-section>
                        <q-item-section side>
                          <q-icon name="keyboard_arrow_right" />
                        </q-item-section>
                        <q-menu auto-close anchor="top end" self="top start">
                          <q-list>
                            <q-item v-for="n in 3" :key="n" dense clickable>
                              <q-item-section>3rd level Label</q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>

                <q-separator />

                <q-item clickable v-close-popup @click="closeApp">
                  <q-item-section>Quit</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>

          <div class="q-ml-md cursor-pointer non-selectable">
            Edit
            <q-menu auto-close>
              <q-list dense style="min-width: 100px">
                <q-item clickable>
                  <q-item-section>Cut</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Copy</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Paste</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable>
                  <q-item-section>Select All</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>
        </div>
      </q-header>

      <q-page-container>
        <q-page class="q-pa-md">
          <p v-for="n in 15" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil
            praesentium molestias a adipisci, dolore vitae odit, quidem
            consequatur optio voluptates asperiores pariatur eos numquam rerum
            delectus commodi perferendis voluptate?
          </p>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
// We guard the Electron API calls with the optional chaining JS operator,
// but this is only needed if we build same app with other Quasar Modes
// as well (SPA/PWA/Cordova/SSR...)

function minimize() {
  window.myWindowAPI?.minimize()
}

function toggleMaximize() {
  window.myWindowAPI?.toggleMaximize()
}

function closeApp() {
  window.myWindowAPI?.close()
}
</script>
````

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

    <q-btn dense flat icon="minimize" @click="minimize" />
    <q-btn dense flat icon="crop_square" @click="toggleMaximize" />
    <q-btn dense flat icon="close" @click="closeApp" />
  </q-bar>
</template>

<script setup>
  const isElectron = import.meta.env.QUASAR_ELECTRON_MODE
  // ...
</script>
```
