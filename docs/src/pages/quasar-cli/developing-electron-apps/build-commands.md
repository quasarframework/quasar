---
title: Electron Build Commands
desc: The Quasar CLI list of commands when developing or building a desktop app.
---
[Quasar CLI](/start/quasar-cli) makes it incredibly simple to develop or build the final distributables from your source code.

## Developing
```bash
$ quasar dev -m electron

# ..or the longer form:
$ quasar dev --mode electron

# passing extra parameters and/or options to
# underlying "electron" executable:
$ quasar dev -m electron -- --no-sandbox --disable-setuid-sandbox
```

It opens up an Electron window with dev-tools included. You have HMR for the renderer process and changes to main process are also picked up (but the latter restarts the Electron window on each change).

Check how you can tweak Webpack config Object for the Main Process and the Preload script on the [Configuring Electron](/quasar-cli/developing-electron-apps/configuring-electron) page.

### Chrome DevTools
While in dev mode, hit the following combination (while your app window has focus):
- macOS: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

### Vuejs Devtools
Should you want to also access Vue Devtools for the renderer thread:

```bash
$ quasar dev -m electron --devtools
```

## Building for Production
```bash
$ quasar build -m electron

# ..or the longer form:
$ quasar build --mode electron
```

It builds your app for production and then uses electron-packager to pack it into an executable. Check how to configure this on [Configuring Electron](/quasar-cli/developing-electron-apps/configuring-electron) page.

If you want a production build with debugging enabled for the UI code:

```bash
$ quasar build -m electron -d

# ..or the longer form
$ quasar build -m electron --debug
```

### A note for non-Windows users
If you want to build for Windows with a custom icon using a non-Windows platform, you must have [wine](https://www.winehq.org/) installed. [More Info](https://github.com/electron-userland/electron-packager#building-windows-apps-from-non-windows-platforms).

## Publishing (electron-builder only)
```bash
$ quasar build -m electron -P always

# ..or the longer form:
$ quasar build --mode electron --publish always
```

You can specify using `electron-builder` to build your app either directly on the command line (`--bundler builder`) or by setting it explicitly within `quasar.conf.js` at `electron.bundler`. This flag has no effect when using `electron-packager`.

Currently (June 2019) supported publishing destinations include GitHub, Bintray, S3, Digital Ocean Spaces, or a generic HTTPS server. More information, including how to create valid publishing instructions, can be found [here](https://www.electron.build/configuration/publish).

Valid options for `-P` are "onTag", "onTagOrDraft", "always" and "never" which are explained at the above link. In addition, you must have valid `publish` configuration instructions in your `quasar.conf.js` at `electron.builder`.

A very basic configuration to publish a Windows EXE setup file to Amazon S3 might look like this:

```js
// quasar.conf.js

electron: {
  bundler: 'builder', // set here instead of using command line flag --bundler
  builder: {
    appId: 'com.electron.myelectronapp',
    win: {
      target: 'nsis'
    },
    publish: {
      'provider': 's3',
      'bucket': 'myS3bucket'
    }
  }
```
