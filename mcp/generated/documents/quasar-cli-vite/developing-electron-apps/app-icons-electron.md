---
title: App Icons for Electron
description: (@quasar/app-vite) How to manage the app icons for a Desktop Quasar app.
canonical: https://quasar.dev/quasar-cli-vite/developing-electron-apps/app-icons-electron
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

These images represent your application in the operating system, including the desktop, file browser, taskbar or dock, tray, and relevant stores. The `icon.ico` file is for Windows, `icon.icns` is for macOS, and `icon.png` is used where a PNG is required. If you discover any that are missing, please [open an issue](https://github.com/quasarframework/quasar/issues).

<img src="/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px">

## Icon Genie CLI

::: tip
We highly recommend using the [Icon Genie CLI](/icongenie/introduction), because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When needed, it also tells you what tags you'll need to add to your /index.html file.
:::

Quickly bootstrap the necessary images with Icon Genie CLI. For a complete list of options, please visit the [Icon Genie CLI](/icongenie/command-list) command list page.

```bash
icongenie generate -m electron -i /path/to/source/icon.png
```

## Manual instructions

- src-electron
  - electron-assets
    - icons
      - icon.ico
      - icon.icns
      - icon.png
