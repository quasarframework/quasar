---
title: Frameless Electron Window
desc: How to hide the window frame in a Quasar desktop app.
related:
  - /vue-components/bar
---

A nice combo is to use frameless Electron window along with [QBar](/vue-components/bar) component. Here's why.

## Setting frameless window
In your `src-electron/main-process/electron-main.js` file we will make an edit to these lines:

```js
mainWindow = new BrowserWindow({
  width: 1000,
  height: 600,
  useContentSize: true,
  frame: false // <-- add this
})
```

## Handling window dragging
When we use a frameless window (only frameless!) we also need a way for the user to be able to move the app window around the screen. You can use `q-electron-drag` and `q-electron-drag--exception` Quasar CSS helper classes for this.

```html
<q-bar class="q-electron-drag">
  ...
</q-bar>
```

What this does is that it allows the user to drag the app window when clicking, holding and simultaneously dragging the mouse on the screen.

While this is a good feature, you must also take into account that you'll need to specify some exceptions. There may be elements in your custom statusbar that you do not want to trigger the window dragging. By default, [QBtn](/vue-components/button) is **excepted from this behavior** (no need to do anything for this). Should you want to add exceptions to any children of the element having `q-electron-drag` class, you can attach the `q-electron-drag--exception` CSS class to them.

Example of adding an exception to an icon:

```html
<q-bar class="q-electron-drag">
  <q-icon name="map" class="q-electron-drag--exception" />

  <div>My title</div>
</q-bar>
```

## Minimize, maximize and close app

<doc-example title="Full example" file="frameless-electron-window/StatusBar" />

In the example above, notice that we add `q-electron-drag` to our QBar and we also add handlers for the minimize, maximize and close app buttons by using the Electron API:

```js
// some .vue file

// we guard the Electron API calls, but this
// is only needed if we build same app with other
// Quasar Modes as well (SPA/PWA/Cordova/SSR...)

export default {
  // ...

  methods: {
    minimize () {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize()
      }
    },

    maximize () {
      if (process.env.MODE === 'electron') {
        const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow()

        if (win.isMaximized()) {
          win.unmaximize()
        } else {
          win.maximize()
        }
      }
    },

    close () {
      if (process.env.MODE === 'electron') {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().close()
      }
    }
  }
}
```
