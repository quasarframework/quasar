---
title: Electron Live Updates
desc: (@quasar/app-vite) How to update Quasar Electron renderer files without shipping a full desktop binary.
---

Electron live updates let an installed desktop app download a new renderer bundle and load it on the next app start. This is useful for JavaScript, HTML, CSS and static asset fixes that do not require a new signed installer.

This does not replace your normal Electron binary update flow. Changes to `/src-electron/electron-main`, preload scripts, native dependencies, Electron itself, package metadata, code signing or installer configuration still require a new desktop release.

One open-source option is [`@capgo/electron-updater`](https://www.npmjs.com/package/@capgo/electron-updater). It stores downloaded bundles in Electron's user data directory, exposes a limited update API through the preload bridge and can roll back a bundle if your app does not confirm that it started correctly. The manual flow below does not require a hosted account; you provide an HTTPS metadata endpoint and storage for the bundle zips.

## Installation

The updater is used by the Electron main and preload scripts, so install it from your Electron folder:

```bash
cd src-electron
```

```tabs
<<| bash Yarn |>>
$ yarn add @capgo/electron-updater
<<| bash NPM |>>
$ npm install --save @capgo/electron-updater
<<| bash PNPM |>>
$ pnpm add @capgo/electron-updater
<<| bash Bun |>>
$ bun add @capgo/electron-updater
```

## Main process

Create one updater instance in `/src-electron/electron-main.js`, initialize it with the BrowserWindow and use it to load the current production bundle. In development, keep loading the Quasar dev server.

```js /src-electron/electron-main file
import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import {
  ElectronUpdater,
  setupEventForwarding,
  setupIPCHandlers
} from '@capgo/electron-updater'

const updater = new ElectronUpdater({
  appId: 'com.example.desktop',
  autoUpdate: false,
  statsUrl: ''
})

async function createWindow() {
  const mainWindow = new BrowserWindow({
    // ...
    webPreferences: {
      contextIsolation: true,
      preload: path.join(import.meta.dirname, 'electron-preload.cjs')
    }
  })

  await updater.initialize(
    mainWindow,
    path.join(import.meta.dirname, 'index.html')
  )

  setupIPCHandlers(updater)
  setupEventForwarding(updater, mainWindow)

  if (import.meta.env.QUASAR_DEV) {
    await mainWindow.loadURL(import.meta.env.QUASAR_APP_URL)
  } else {
    await mainWindow.loadFile(updater.getCurrentBundlePath())
  }
}

void app.whenReady().then(() => {
  createWindow()
})
```

The `appId` should be a stable identifier for your desktop app. The example disables automatic checks so your app can decide when to ask your own update endpoint for a new bundle.

## Preload script

Expose the updater API from `/src-electron/electron-preload.js`. Keep any existing Quasar runtime bridge code.

```js /src-electron/electron-preload file
import { contextBridge } from 'electron'
import { exposeUpdaterAPI } from '@capgo/electron-updater/preload'
import { quasarRuntime } from '#q-app/electron/preload'

contextBridge.exposeInMainWorld('quasarRuntime', quasarRuntime)
exposeUpdaterAPI()
```

## Renderer process

Call `notifyAppReady()` after the UI has started. This tells the updater that the current bundle is valid. If this is not called within the configured timeout, the updater treats the bundle as failed and rolls back.

```js
if (import.meta.env.QUASAR_ELECTRON_MODE) {
  await window.electronUpdater?.notifyAppReady()
}
```

For a manual self-hosted flow, fetch your own update metadata, download the zip and queue it for the next app start:

```js
const syncUpdate = async () => {
  const updater = window.electronUpdater

  if (!updater) {
    return
  }

  const response = await fetch(
    'https://updates.example.com/desktop/latest.json'
  )

  if (!response.ok) {
    return
  }

  const update = await response.json()

  if (!update?.url || !update?.version) {
    return
  }

  const bundle = await updater.download({
    url: update.url,
    version: update.version,
    checksum: update.checksum
  })

  await updater.next({ id: bundle.id })
}
```

Your endpoint can be a simple JSON file or API response:

```json
{
  "version": "1.0.1",
  "url": "https://updates.example.com/desktop/1.0.1.zip",
  "checksum": "SHA256_CHECKSUM"
}
```

If you want to apply an update immediately after your own confirmation UI, use `set(...)` instead of `next(...)`:

```js
await updater.set({ id: bundle.id })
```

## Publishing updates

Build the Electron app without packaging it into an installer:

```bash
$ quasar build -m electron --skip-pkg
```

The renderer files are created in `/dist/electron/UnPackaged`. Stage the files that belong to the web bundle, such as `index.html`, `assets/` and any files copied from `/public`, then create a zip with the CLI:

```bash
$ npx @capgo/cli@latest bundle zip --path dist/electron/live-update
```

The folder passed to `bundle zip` must contain `index.html` at its root. Upload the generated zip to your own HTTPS storage and update your metadata endpoint to point at it.

::: warning
Serve update metadata and bundles over HTTPS, keep checksums enabled and only publish renderer changes through live updates. Any change that affects Electron main/preload code or the packaged app should go through your signed desktop release process.
:::

## Hosted option

If you do not want to run the update API, bundle storage, channels, rollbacks and analytics yourself, [Capgo Cloud](https://capgo.app/) provides a managed hosted option for the same updater package. You can start with the self-hosted flow above and move to the hosted service later if you prefer managed infrastructure.
