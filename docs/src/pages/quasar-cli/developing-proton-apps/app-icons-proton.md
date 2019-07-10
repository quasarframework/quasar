---
title: App Icons for Proton
desc: How to manage the app icons for a Quasar Proton app.
---

These images are used to display the icon of the application in the desktop operating system in the tray, on the desktop, in the file-browser and in relevant stores. The `icon.ico` file is for Windows and `icon.icns` is for MacOS. If you discover any that are missing, please file an issue.

The `Cargo.toml` file is where you define these icons, and they are then injected into the binaries with `cargo-builder`.

``` 
icon = ["icons/32x32.png", "icons/128x128.png", "icons/128x128@2x.png", "icons/icon.icns", "icons/icon.ico"]
```


```
src-proton/
  Cargo.toml              # define the icons here
  icons/
    32x32.png
    128x128.png
    128x128@2x.png        
    icon.ico              # for Windows MSI
    icon.icns             # for MacOS .app
```

<img src="https://cdn.quasar.dev/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px" />

## The Icon Genie

::: tip
We highly recommend using our official [Icon Genie](https://github.com/quasarframework/app-extension-icon-genie/) app extension, because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When you change this source file (or some of the extension's settings) the icons will be automatically rebuilt on the next dev or build command.
:::
