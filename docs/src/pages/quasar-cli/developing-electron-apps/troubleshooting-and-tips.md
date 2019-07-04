---
title: Troubleshooting and Tips
desc: Tips and tricks for a Quasar desktop app with Electron.
---

## Upgrading to Electron v5+
If you are upgrading from Electron < 5 then you will need to edit your `src-electron/main-process/main.js` at this location:

```js
mainWindow = new BrowserWindow({
  width: 1000,
  height: 600,
  useContentSize: true,

  /**********************
   * ADD THE FOLLOWING: *
   **********************/
  webPreferences: {
    nodeIntegration: true
  }
})
```

## $q.electron
While you are developing with Electron Mode, you can access `this.$q.electron` in your Vue files. This is an alias to the `electron` Object when imported.

Example:

```js
export default {
  methods: {
    minimize () {
      this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize()

      // equivalent to:
      const { remote } = require('electron')
      remote.BrowserWindow.getFocusedWindow().minimize()
    }
  }
}
```

## Read & Write Local Files
One great benefit of using Electron is the ability to access the user's file system. This enables you to read and write files on the local system. To help avoid Chromium restrictions and writing to your application's internal files, make sure to make use of electron's APIs, specifically the app.getPath(name) function. This helper method can get you file paths to system directories such as the user's desktop, system temporary files, etc.

We can use the userData directory, which is reserved specifically for our application, so we can have confidence other programs or other user interactions should not tamper with this file space.

```
import path from 'path'
import { remote } from 'electron'

const filePath = path.join(remote.app.getPath('userData'), '/some.file')
```

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
