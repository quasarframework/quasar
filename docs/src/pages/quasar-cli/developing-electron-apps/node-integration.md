---
title: Electron Node Integration
desc: How to handle Electron Node Integration with Quasar CLI.
---

Enabling Node Integration is a security concern. Do it only if you are aware of the risks. Starting with `@quasar/app` v1.3.0, nodeIntegration (and also accessing `this.$q.electron`) has been disabled by default.

## Enabling and $q.electron
Should you want to have access to `this.$q.electron` in your Vue files, you need to do 2 things:

1. Set /quasar.conf.js > electron > injectIntoQ to `true`
2. Enable Electron nodeIntegration (from your main thread, as seen below)

```js
// src-electron/main-process/main.js

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

Essentially, `this.$q.electron` is an alias to the `electron` Object when imported.

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
