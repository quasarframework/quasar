---
title: App Icons for Electron
desc: How to manage the app icons for a Desktop Quasar app.
---

These images are used to display the icon of the application in the desktop operating system in the tray, on the desktop, in the file-browser and in relevant stores. The `icon.ico` file is for Windows and `icon.icns` is for MacOS. If you discover any that are missing, please file an issue.

```
src-electron/
  icons/
    icon.ico
    icon.icns
    icon.png
    linux-16x16.png
    linux-24x24.png
    linux-32x32.png
    linux-48x48.png
    linux-64x64.png
    linux-96x96.png
    linux-128x128.png
    linux-512x512.png
    Square30x30Logo.png
    Square44x44Logo.png
    Square71x71Logo.png
    Square89x89Logo.png
    Square107x107Logo.png
    Square142x142Logo.png
    Square150x150Logo.png
    Square284x284Logo.png
    Square310x310Logo.png
    StoreLogo.png
```

<img src="https://cdn.quasar.dev/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px" />

## The Icon Genie

::: tip
We highly recommend using our official [Icon Genie](https://github.com/quasarframework/app-extension-icon-genie/) app extension, because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When you change this source file (or some of the extension's settings) the icons will be automatically rebuilt on the next dev or build command.
:::
