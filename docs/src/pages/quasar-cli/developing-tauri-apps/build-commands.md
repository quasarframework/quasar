---
title: Tauri Build Commands
desc: The Quasar CLI list of commands when developing or building a desktop app with Tauri.
---
[Quasar CLI](/start/quasar-cli) makes it incredibly simple to develop or build the final distributables from your source code.

## Developing
```bash
$ quasar dev -m tauri

# ..or the longer form:
$ quasar dev --mode tauri
```

It opens up a Tauri window. You have HMR for the renderer process, and the native Console.

Check how you can tweak Webpack config Object for the Main Process on the [Configuring Tauri](/quasar-cli/developing-tauri-apps/configuring-tauri) page.

## Building for Production
```bash
$ quasar build -m tauri

# ..or the longer form:
$ quasar build --mode tauri
```

It builds your app for production and then uses rust-packager to pack it into an executable. Check how to configure this on [Configuring Tauri](/quasar-cli/developing-electron-apps/configuring-tauri) page.
