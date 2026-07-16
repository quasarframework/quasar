---
title: Electron Security Concerns
desc: (@quasar/app-vite) Security practices for a Quasar desktop app with Electron.
---

Electron applications combine web content with native desktop capabilities. A renderer vulnerability such as cross-site scripting can therefore have more serious consequences than the same vulnerability in a normal browser.

Start with Electron's current [security checklist](https://www.electronjs.org/docs/latest/tutorial/security) and reassess it whenever Electron is upgraded or the application begins loading new content.

## Keep the renderer isolated

Follow Electron's complete [security checklist](https://www.electronjs.org/docs/latest/tutorial/security). In particular:

1. Keep Electron current so your application receives Chromium, Node.js, and Electron security fixes.
2. Load packaged local content whenever possible. If remote content is unavoidable, use secure transport and never enable Node.js integration for it.
3. Keep `contextIsolation` and renderer sandboxing enabled. Use a [preload script](/quasar-cli-vite/developing-electron-apps/electron-preload-script) to expose narrow, task-specific functions rather than raw Electron or Node.js APIs.
4. Define a restrictive Content Security Policy. Do not disable `webSecurity`, enable `allowRunningInsecureContent`, or enable unnecessary experimental/Blink features.
5. Handle permission requests explicitly and deny permissions your application does not require.
6. Restrict navigation and new-window creation. Validate URLs before passing them to `shell.openExternal`.
7. Validate the sender of every IPC message before performing privileged work. Never expose unrestricted `ipcRenderer.send`, `ipcRenderer.invoke`, filesystem, shell, or process APIs to renderer code.
8. Avoid `<webview>` where possible. If it is required, verify its options and do not enable popups.
9. Prefer a custom protocol over `file://` for packaged content when your application requires a stronger origin model.
10. Review Electron fuses before distribution to disable capabilities your application does not use.

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

### Publish checksums

When you publish application binaries, publish their cryptographic checksums through a trusted channel so users can verify downloaded files.

### Audit dependencies

Use your package manager's audit tooling and an automated dependency scanner. Review reported vulnerabilities in the context of your application, update affected packages, and keep the lockfile under version control.

### Harden the build

Protect release credentials, pin dependencies through the lockfile, review dependency changes, and produce releases from a controlled build environment.

### Pay to get hacked

Somebody smart might have hacked your project (or an underlying library). If you are making money with this app, consider getting a [Hacker One](https://hackerone.com) account and running a constant bounty award. At least you'll be able to convince the hacker to be ethical and NOT sell the exploit to your competitor.

### Get help

You may feel overwhelmed, because the awesomeness of Electron brings with it a great many headaches that you never wanted to think about. If this is the case, consider [reaching out](mailto:razvan.stoenescu@gmail.com) and getting expert support for the review, audit and hardening of your app by the team of seasoned devs that brought you the Quasar Framework.
