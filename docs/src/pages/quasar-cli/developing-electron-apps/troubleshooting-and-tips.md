---
title: Troubleshooting and Tips
desc: Tips and tricks for a Quasar desktop app with Electron.
---

## Debugging Main Process
When running your application in development you may have noticed a message from the main process mentioning a remote debugger. Ever since the release of electron@^1.7.2, remote debugging over the Inspect API was introduced and can be easily accessed by opening the provided link with Google Chrome or through another debugger that can remotely attach to the process using the default port of 5858, such as Visual Studio Code.

```bash
┏ Electron -------------------

  Debugger listening on port 5858.
  Warning: This is an experimental feature and could change at any time.
  To start debugging, open the following URL in Chrome:
      chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:5858/22271e96-df65-4bab-9207-da8c71117641

┗ ----------------------------
```

## Application does not open on Windows with Dark Theme
Some Chrome DevTools Extensions do not play well with Windows Dark Theme on electron 6+. Quasar offers a workaround in the default `electron-main.js`, that removes the `DevTools Extensions` before starting the application.

```javascript
import { app, BrowserWindow, nativeTheme } from 'electron'

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }
```

Please follow [electron bug report](https://github.com/electron/electron/issues/19468) for more details.
