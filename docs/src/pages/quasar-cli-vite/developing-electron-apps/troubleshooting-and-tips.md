---
title: Troubleshooting and Tips
desc: (@quasar/app-vite) Troubleshooting a Quasar desktop app with Electron.
---

## Browser Devtools

The generated main-process file opens renderer DevTools when `import.meta.env.QUASAR_DEBUG` is true. This includes development and production builds created with `quasar build --debug`.

```js /src-electron/electron-main
function createWindow () {
  const mainWindow = new BrowserWindow({ ... })

  if (import.meta.env.QUASAR_DEBUG) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  }
  else {
    // Production build without --debug
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }
}
```

Do not treat hiding DevTools as a security control. Secure the renderer even when a user can inspect or modify its local state.

## Debugging the main process

In development, Quasar starts Electron's main process with Node's `--inspect` option. Attach a Node-compatible debugger, such as the Chrome DevTools page at `chrome://inspect` or a JavaScript debugger in your editor.

```bash
Debugger listening on ws://127.0.0.1:5858/b285586a-6091-4c41-b6ea-0d389e6f9c93
For help, see: https://nodejs.org/en/docs/inspector
```

Set the preferred port with `quasar.config > electron > inspectPort`. Quasar uses the closest available port when that port is occupied.

## Native dependency fails to load

An error mentioning `NODE_MODULE_VERSION`, `Module did not self-register`, or a missing `.node` file usually means a native dependency was built for a different Node.js ABI, operating system, or architecture. Install it under `/src-electron`, rebuild it for the Electron version used by the project, and verify that the target architecture is supported. See Electron's [native Node modules guide](https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules/).

After upgrading Electron, rebuild native dependencies before diagnosing application code.

## Production build differs from development

Build without packaging to inspect the application that is passed to Packager or Builder:

```bash
quasar build -m electron --skip-pkg
```

The result is `/dist/electron/UnPackaged`. Check its generated `package.json`, main and preload output, installed production dependencies, and renderer console. Do not edit this directory directly; fix the source or configuration and rebuild.
