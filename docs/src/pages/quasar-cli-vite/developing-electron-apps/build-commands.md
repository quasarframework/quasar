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

It opens an Electron window. The default template also opens renderer DevTools. The renderer supports HMR; changing a main or preload source rebuilds it and restarts Electron.

Arguments after `--` are forwarded to Electron. The sandbox-disabling arguments above illustrate forwarding syntax, but should only be used when a constrained environment requires them and after considering the security impact.

See [Configuring Electron](/quasar-cli-vite/developing-electron-apps/configuring-electron) to extend the Rolldown configurations for the main process and preload scripts.

### Chrome DevTools

While in dev mode, hit the following combination (while your app window has focus):

- macOS: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

### Vue DevTools

To load Vue DevTools for the renderer process:

```bash
quasar dev -m electron --devtools
```

## Building for Production

```bash
quasar build -m electron

# ..or the longer form:
quasar build --mode electron
```

It builds the application and packages it with the configured bundler. The default is `@electron/packager`; select `electron-builder` when you need its installer, signing, or publishing features. See [Configuring Electron](/quasar-cli-vite/developing-electron-apps/configuring-electron).

If you want a production build with debugging enabled for the UI code:

```bash
quasar build -m electron -d

# ..or the longer form
quasar build -m electron --debug
```

Here is the folder structure of the outcome:

<DocTree :def="scope.distTree" />

### Cross-platform packaging

Packaging, signing, and native dependencies impose host-platform restrictions. For example, signing a macOS application requires macOS, and packaging Windows resources from another platform may require Wine. Check the selected bundler's platform requirements and build each target on a matching host or CI runner when signing or native modules are involved.

## Publishing (electron-builder only)

```bash
quasar build -m electron -P always

# ..or the longer form:
quasar build --mode electron --publish always
```

Select `electron-builder` on the command line (`--bundler builder`) or in `quasar.config` at `electron.bundler`. The publish option only applies to `electron-builder`.

Valid values for `-P` are `onTag`, `onTagOrDraft`, `always`, and `never`. Configure a supported provider in `quasar.config > electron > builder > publish`; see the current [electron-builder publishing documentation](https://www.electron.build/docs/publish/).

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
      provider: 's3',
      bucket: 'myS3bucket'
    }
  }
}
```
