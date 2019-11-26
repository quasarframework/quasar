---
title: Electron Node Integration
desc: How to handle Electron Node Integration with Quasar CLI.
---

Electron node integration refers to the ability of accessing Node.js resources from within the "renderer" thread (the UI). It is enabled by default in Quasar CLI, although Electron is encouraging developers to turn it off as a security precaution.

As of "@quasar/app" v1.3.0+, you can turn off the node integration.

## What won't work when turning it off
If you turn off the node integration, then in the renderer thread you won't be able to:

* Import Node.js packages (like "fs", "path", "electron"). Using "require" will trigger an error.
* Use `__statics` ([more info](/quasar-cli/developing-electron-apps/electron-static-assets)).
* Use `this.$q.electron` (as an alias to `electron` Object) in your .vue files.

Example of what you WON'T be able to do:

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

## How to turn it off
Should you want to disable the node integration then you must edit two files:

1. Open /quasar.conf.js and add the following:

```js
// file: /quasar.conf.js
electron: {
  nodeIntegration: false
}
```

2. From your main thread file (/src-electron/main-process/main.js):

```js
// file: /src-electron/main-process/main.js

mainWindow = new BrowserWindow({
  // ..

  webPreferences: {
    nodeIntegration: false
  }
})
```

::: warning
Please remember to keep the configuration from the two places above in sync, otherwise you will encounter errors.
:::
