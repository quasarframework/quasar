---
title: Electron Accessing Files
desc: (@quasar/app-vite) How to access files in a Quasar desktop app.
scope:
  distTree:
    l: dist-electron/UnPackaged
    c:
      - l: electron-assets
        e: '/src-electron/electron-assets copied as-is'
        c:
          - l: icons/
            e: 'Electron app icons'
      - l: electron-main.js
      - l: electron-preload.cjs
      - l: '...contents of /public copied as-is'
---

## The problem

The main process and preload scripts are bundled with Rolldown, and their output locations differ between development and production. Paths derived from a source-file location therefore do not reliably identify `/public` or `/src-electron/electron-assets` in both environments.

<DocTree :def="scope.distTree" />

## The solution

Quasar CLI provides runtime helpers for referencing these directories in both environments.

Notice the following sections:

```js /src-electron/electron-main file
import {
  registerQuasarRuntime,
  resolveElectronAssetsPath
} from '#q-app/electron/main'

async function createWindow() {
  const mainWindow = new BrowserWindow({
    icon: resolveElectronAssetsPath('icons/icon.png') // Windows and Linux
    // ...
  })
  // ...
}

app.whenReady().then(() => {
  registerQuasarRuntime()
  // ...
})
```

```js /src-electron/electron-preload file
import { contextBridge } from 'electron'
import { quasarRuntime } from '#q-app/electron/preload'

// you can rename the exposed prop name 'quasarRuntime' to anything
contextBridge.exposeInMainWorld('quasarRuntime', quasarRuntime)
```

This exposes `quasarRuntime` to the renderer as `window.quasarRuntime`.

You can choose another property name or expose only the helpers your renderer needs.

### API for electron-main

Usage:

```js
import {
  registerQuasarRuntime,
  resolveElectronAssetsPath
  // ...
} from '#q-app/electron/main'
```

What you can import:

```js
/**
 * Resolves the path to the electron-assets directory, adapting to
 * development or production environments.
 * @param args Path segments to join to the base electron-assets path
 * @returns The fully resolved path
 */
export declare function resolveElectronAssetsPath(...args: string[]): string;

/**
 * The resolved path to the electron-assets directory, determined at runtime
 */
export declare const electronAssetsDir: string;

/**
 * Resolves the path to the public directory, adapting to
 * development or production environments.
 * @param args Path segments to join to the base public path
 * @returns The fully resolved path
 */
export declare function resolvePublicPath(...args: string[]): string;

/**
 * The resolved path to the public directory, determined at runtime
 */
export declare const publicDir: string;

/**
 * Registers IPC handlers for the Quasar Electron runtime.
 * This allows the preload script and renderer process to request
 * resolved asset and public paths synchronously via `ipcRenderer.sendSync`.
 */
export declare function registerQuasarRuntime(): void;
```

### API for electron-preload

Usage:

```js
import {
  quasarRuntime
  // ...
} from '#q-app/electron/preload'
```

What you can import:

```js
/**
 * Synchronously requests the main process to resolve the path to the
 * electron-assets directory.
 * @param args Path segments to join to the base electron-assets path
 * @returns The fully resolved path
 */
export declare function resolveElectronAssetsPath(...args: string[]): string;

/**
 * The resolved path to the electron-assets directory, determined at runtime
 */
export declare const electronAssetsDir: string;

/**
 * Synchronously requests the main process to resolve the path to the
 * public directory.
 * @param args Path segments to join to the base public path
 * @returns The fully resolved path
 */
export declare function resolvePublicPath(...args: string[]): string;

/**
 * The resolved path to the public directory, determined at runtime
 */
export declare const publicDir: string;

/**
 * An object grouping the synchronous path resolution utilities.
 */
export declare const quasarRuntime: {
  electronAssetsDir: string;
  resolveElectronAssetsPath: typeof resolveElectronAssetsPath;

  publicDir: string;
  resolvePublicPath: typeof resolvePublicPath;
};
```

### Usage in the renderer process (`/src`)

```js
window.quasarRuntime.resolvePublicPath('my-file')
```

## Read and write local files

Treat packaged application files as read-only. Use Electron's `app.getPath(name)` for writable locations such as the application-specific `userData` directory, and perform filesystem operations in the main process.

Expose a narrow IPC operation rather than a path or unrestricted filesystem API. For example:

```js /src-electron/electron-main
import { app, ipcMain } from 'electron'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export function registerPreferencesHandler(mainWindow) {
  ipcMain.handle('preferences:load', async event => {
    if (event.senderFrame !== mainWindow.webContents.mainFrame) {
      throw new Error('Untrusted IPC sender')
    }

    const filename = path.join(app.getPath('userData'), 'preferences.json')

    try {
      return JSON.parse(await readFile(filename, 'utf8'))
    } catch (error) {
      if (error.code === 'ENOENT') return {}
      throw error
    }
  })
}
```

Call `registerPreferencesHandler(mainWindow)` after creating the trusted window. Remove the handler with `ipcMain.removeHandler('preferences:load')` if that window and its handlers are recreated during the same application session.

```js /src-electron/electron-preload
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('preferencesAPI', {
  load: () => ipcRenderer.invoke('preferences:load')
})
```

For applications with multiple or remote windows, keep a separate allowlist for each operation or validate `event.senderFrame.url` with the URL parser. Merely checking that a window exists is not sufficient.
