---
title: Electron Security Concerns
desc: (@quasar/app-vite) Security practices for a Quasar desktop app with Electron.
---

Electron applications combine web content with native desktop capabilities. A renderer vulnerability such as cross-site scripting can therefore have more serious consequences than the same vulnerability in a normal browser.

Start with Electron's current [security checklist](https://www.electronjs.org/docs/latest/tutorial/security) and reassess it whenever Electron is upgraded or the application begins loading new content.

## Keep the renderer isolated

Quasar's generated `BrowserWindow` keeps `contextIsolation` enabled. Current Electron versions also sandbox renderers by default and disable Node.js integration by default. Preserve those defaults:

```js /src-electron/electron-main
const mainWindow = new BrowserWindow({
  webPreferences: {
    contextIsolation: true,
    sandbox: true,
    nodeIntegration: false,
    preload: path.join(import.meta.dirname, 'electron-preload.cjs')
  }
})
```

Do not disable `webSecurity` or enable `allowRunningInsecureContent`, experimental Blink features, or Node.js integration to work around an application problem.

## Expose narrow preload APIs

Using `contextBridge` does not make an API safe by itself. Do not expose `ipcRenderer`, Node.js modules, or generic send/invoke methods to the renderer:

```js /src-electron/electron-preload
// Bad: renderer code can invoke arbitrary channels
contextBridge.exposeInMainWorld('electronAPI', {
  invoke: ipcRenderer.invoke
})

// Good: one operation with a fixed channel
contextBridge.exposeInMainWorld('preferencesAPI', {
  load: () => ipcRenderer.invoke('preferences:load')
})
```

Validate arguments in the main process and validate the sender of every IPC request before returning data or performing privileged work. Do not send Electron event objects back across the bridge.

## Control navigation and new windows

An Electron window should not navigate to arbitrary content. Limit navigation and new-window creation to an explicit allowlist, and validate a URL before passing it to `shell.openExternal`:

```js /src-electron/electron-main
mainWindow.webContents.on('will-navigate', event => {
  event.preventDefault()
})

mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  const parsed = new URL(url)

  if (parsed.protocol === 'https:' && parsed.hostname === 'example.com') {
    void shell.openExternal(parsed.href)
  }

  return { action: 'deny' }
})
```

If your application must display remote content, use HTTPS, keep Node.js integration disabled, keep context isolation and sandboxing enabled, restrict permissions with `session.setPermissionRequestHandler()`, and isolate that content from privileged local windows.

## Define a Content Security Policy

Use a restrictive Content Security Policy in `/index.html`. Add only the origins and directives the application actually requires:

```html /index.html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'"
/>
```

Development may require additional `connect-src` entries for the Quasar development server and WebSocket connection. Do not carry broad development exceptions into production.

## Store files in appropriate locations

Treat application resources as read-only after packaging. Store mutable application data under a path returned by Electron's `app.getPath()`, commonly `userData`, and perform filesystem operations in the main process. Validate paths and input received over IPC to prevent a renderer from reading or overwriting arbitrary files.

Use the operating system's credential storage or a well-reviewed secure-storage solution for secrets. Checksums detect accidental corruption but do not establish who published an artifact; use code signing for authenticity.

## Ship and maintain trusted builds

- Keep Electron and production dependencies on supported, patched versions.
- Lock and review dependency changes, and run the package manager's audit tooling in CI.
- Sign distributed Windows and macOS builds; notarize macOS releases where required.
- Deliver updates through HTTPS and verify signed update artifacts.
- Consider disabling unused [Electron fuses](https://www.electronjs.org/docs/latest/tutorial/fuses) during packaging.

See Electron's [code-signing guide](https://www.electronjs.org/docs/latest/tutorial/code-signing) and the selected packager's signing configuration for platform-specific requirements.

::: warning
Hiding DevTools is not a security boundary. Assume users can inspect and modify renderer code and keep all privileged authorization and validation in the main process.
:::
