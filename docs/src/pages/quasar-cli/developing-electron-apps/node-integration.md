---
title: Electron Node Integration
desc: How to handle Electron Node Integration with Quasar CLI.
---

Electron node integration refers to the ability of accessing Node.js resources from within the "renderer" thread (the UI). It is enabled by default in Quasar CLI, although Electron is encouraging developers to turn it off as a security precaution.

## What won't work when turning it off
If you turn off the node integration, then in the renderer thread you won't be able to:

* Import Node.js packages (like "fs", "path", "electron"). Using "require" will trigger an error.
* Use `__statics` ([more info](/quasar-cli/developing-electron-apps/electron-static-assets)).
* Use `$q.electron` (as an alias to `electron` Object) in your .vue files.

Example of what you WON'T be able to do:

```js
import { useQuasar } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()

    function minimize () {
      $q.electron.remote.BrowserWindow.getFocusedWindow().minimize()

      // equivalent to:
      const { remote } = require('electron')
      remote.BrowserWindow.getFocusedWindow().minimize()
    }
  }
}
```

However, if you will be using an [Electron preload script](/quasar-cli/developing-electron-apps/electron-preload-script), you can access Node from there, regardless if Node integration is turned on or off. So basically you can inject stuff into "window" global from there.

## How to turn it off
Should you want to disable the node integration then you must edit /quasar.conf.js:

```js
// file: /quasar.conf.js
electron: {
  nodeIntegration: false
}
```

::: tip
You can edit your main thread file to set `nodeIntegration: process.env.QUASAR_NODE_INTEGRATION`. The `QUASAR_NODE_INTEGRATION` env variable is injected by Quasar so that you'll have only one place to edit your Node Integration state: quasar.conf.js.
:::
