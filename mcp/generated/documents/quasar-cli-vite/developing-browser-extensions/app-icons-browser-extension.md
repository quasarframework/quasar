---
title: App Icons for BEX
description: (@quasar/app-vite) How to manage the app icons for a Quasar Browser Extension (BEX).
canonical: https://quasar.dev/quasar-cli-vite/developing-browser-extensions/app-icons-browser-extension
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

This build target includes three icon sizes used by the extension pages, browser extension manager, and extension stores. If you discover one that is new or missing, please [open an issue](https://github.com/quasarframework/quasar/issues).

<img src="/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px">

## Icon Genie CLI

::: tip
We highly recommend using the [Icon Genie CLI](/icongenie/introduction), because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When needed, it also tells you what tags you'll need to add to your /index.html file.
:::

Quickly bootstrap the necessary images with Icon Genie CLI. For a complete list of options, please visit the [Icon Genie CLI](/icongenie/command-list) command list page.

```bash
icongenie generate -m bex -i /path/to/source/icon.png
```

## Manual instructions

- src-bex
  - icons
    - icon-16x16.png — Favicon on extension pages
    - icon-48x48.png — Extension management page
    - icon-128x128.png — Installation and web store
