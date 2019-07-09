---
title: Proton Build Commands
desc: The Quasar CLI list of commands when developing or building a desktop app with Proton.
---
[Quasar CLI](/start/quasar-cli) makes it incredibly simple to develop or build the final distributables from your source code.

## Developing
```bash
$ quasar dev -m proton

# ..or the longer form:
$ quasar dev --mode proton
```

It opens up a Proton window. You have HMR for the renderer process, and the native Console.

Check how you can tweak Webpack config Object for the Main Process on the [Configuring Proton](/quasar-cli/developing-proton-apps/configuring-proton) page.

## Building for Production
```bash
$ quasar build -m proton

# ..or the longer form:
$ quasar build --mode proton
```

It builds your app for production and then uses rust-packager to pack it into an executable. Check how to configure this on [Configuring Proton](/quasar-cli/developing-electron-apps/configuring-proton) page.
