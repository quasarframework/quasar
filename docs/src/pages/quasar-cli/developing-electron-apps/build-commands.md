---
title: Electron Build Commands
---
[Quasar CLI](/start/quasar-cli) makes it incredibly simple to develop or build the final distributables from your source code.

## Developing
```bash
$ quasar dev -m electron

# ..or the longer form:
$ quasar dev --mode electron
```

It opens up an Electron window with dev-tools included. You have HMR for the renderer process and changes to main process are also picked up (but the latter restarts the Electron window on each change).

Check how you can tweak Webpack config Object for the Main Process on the [Configuring Electron](/quasar-cli/developing-electron-apps/configuring-electron) page.

## Building for Production
```bash
$ quasar build -m electron

# ..or the longer form:
$ quasar build --mode electron
```

It builds your app for production and then uses electron-packager to pack it into an executable. Check how to configure this on [Configuring Electron](/quasar-cli/developing-electron-apps/configuring-electron) page.

### A note for non-Windows users
If you want to build for Windows with a custom icon using a non-Windows platform, you must have [wine](https://www.winehq.org/) installed. [More Info](https://github.com/electron-userland/electron-packager#building-windows-apps-from-non-windows-platforms).
