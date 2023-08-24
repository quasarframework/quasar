---
title: App Icons for Electron
desc: (@quasar/app-webpack) How to manage the app icons for a Desktop Quasar app.
scope:
  tree:
    l: src-electron
    c:
    - l: icons
      c:
      - l: icon.ico
      - l: icon.icns
      - l: icon.png
---

These images are used to display the icon of the application in the desktop operating system in the tray, on the desktop, in the file-browser and in relevant stores. The `icon.ico` file is for Windows and `icon.icns` is for MacOS. If you discover any that are missing, please [open an issue](https://github.com/quasarframework/quasar/issues).

<img src="https://cdn.quasar.dev/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px" />

## Icon Genie CLI

::: tip
We highly recommend using the [Icon Genie CLI](/icongenie/introduction), because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When needed, it also tells you what tags you'll need to add to your /src/index.template.html file.
:::

Quickly bootstrap the necessary images with Icon Genie CLI. For a complete list of options, please visit the [Icon Genie CLI](/icongenie/command-list) command list page.

```bash
$ icongenie generate -m electron -i /path/to/source/icon.png
```

## Manual instructions

<doc-tree :def="scope.tree" />
