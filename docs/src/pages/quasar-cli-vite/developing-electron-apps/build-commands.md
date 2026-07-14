---
title: Electron Build Commands
desc: (@quasar/app-vite) The Quasar CLI list of commands when developing or building a desktop app.
scope:
  distTree:
    l: dist-electron
    c:
      - l: Packaged
        e: 'Packaged by @electron/packager or electron-builder'
      - l: UnPackaged
        c:
          - l: assets/...
            e: 'Vite compiled /src assets'
          - l: electron-assets
            e: '/src-electron/electron-assets copied as-is'
            c:
              - l: icons/
                e: 'Electron app icons'
          - l: node_modules/
          - l: index.html
          - l: package.json
          - l: electron-main.js
          - l: electron-preload.cjs
            e: '(Electron has only CJS support for the preload scripts)'
          - l: '...contents of /public'
---

## Developing

```bash
quasar dev -m electron

# ..or the longer form:
quasar dev --mode electron

# passing extra parameters and/or options to
# underlying "electron" executable:
quasar dev -m electron -- --force-device-scale-factor=1
# when on Windows and using Powershell:
quasar dev -m electron '--' --force-device-scale-factor=1
```

It opens up an Electron window with dev-tools included. You have HMR for the renderer process and changes to main process are also picked up (but the latter restarts the Electron window on each change).

Check how you can tweak Rolldown config Object for the Main Process and the Preload script on the [Configuring Electron](/quasar-cli-vite/developing-electron-apps/configuring-electron) page.

### Chrome DevTools

While in dev mode, hit the following combination (while your app window has focus):

- macOS: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

### Vuejs Devtools

Should you want to also access Vue Devtools for the renderer thread:

```bash
quasar dev -m electron --devtools
```

## Building for Production

```bash
quasar build -m electron

# ..or the longer form:
quasar build --mode electron
```

It builds your app for production and then uses @electron/packager to pack it into an executable. Check how to configure this on [Configuring Electron](/quasar-cli-vite/developing-electron-apps/configuring-electron) page.

If you want a production build with debugging enabled for the UI code:

```bash
quasar build -m electron -d

# ..or the longer form
quasar build -m electron --debug
```

Here is the folder structure of the outcome:

<DocTree :def="scope.distTree" />

### A note for non-Windows users

If you want to build for Windows with a custom icon using a non-Windows platform, you must have [wine](https://www.winehq.org/) installed. [More Info](https://github.com/electron-userland/electron-packager#building-windows-apps-from-non-windows-platforms).

## Publishing (electron-builder only)

```bash
quasar build -m electron -P always

# ..or the longer form:
quasar build --mode electron --publish always
```

You can specify using `electron-builder` to build your app either directly on the command line (`--bundler builder`) or by setting it explicitly within the `quasar.config` file at `electron.bundler`. This flag has no effect when using `@electron/packager`.

Currently (June 2019) supported publishing destinations include GitHub, Bintray, S3, Digital Ocean Spaces, or a generic HTTPS server. More information, including how to create valid publishing instructions, can be found [here](https://www.electron.build/configuration/publish).

Valid options for `-P` are "onTag", "onTagOrDraft", "always" and "never" which are explained at the above link. In addition, you must have valid `publish` configuration instructions in your `quasar.config` file at `electron.builder`.

A very basic configuration to publish a Windows EXE setup file to Amazon S3 might look like this:

```js /quasar.config file
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
