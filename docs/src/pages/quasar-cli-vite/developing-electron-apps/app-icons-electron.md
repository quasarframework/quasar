---
title: App Icons for Electron
desc: (@quasar/app-vite) How to manage the app icons for a Desktop Quasar app.
scope:
  tree:
    l: src-electron
    c:
      - l: electron-assets
        c:
          - l: icons
            c:
              - l: icon.ico
              - l: icon.icns
              - l: icon.png
---

These images represent your application in the operating system, including the desktop, file browser, taskbar or dock, tray, and relevant stores. The `icon.ico` file is for Windows, `icon.icns` is for macOS, and `icon.png` is used where a PNG is required. If you discover any that are missing, please [open an issue](https://github.com/quasarframework/quasar/issues).

<img alt="IconGenie logo" src="/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px">

## Icon Genie CLI

::: tip
We highly recommend using the [Icon Genie CLI](/icongenie/introduction), because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When needed, it also tells you what tags you'll need to add to your /index.html file.
:::

Quickly bootstrap the necessary images with Icon Genie CLI. For a complete list of options, please visit the [Icon Genie CLI](/icongenie/command-list) command list page.

```bash
icongenie generate -m electron -i /path/to/source/icon.png
```

## Manual instructions

<DocTree :def="scope.tree" />
