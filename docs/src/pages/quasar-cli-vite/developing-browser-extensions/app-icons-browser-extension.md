---
title: App Icons for (BEX)
desc: (@quasar/app-vite) How to manage the app icons for a Quasar Browser Extension (BEX).
scope:
  tree:
    l: src-bex
    c:
    - l: icons
      c:
      - l: icon-16x16.png
        e: Favicon on extension pages
      - l: icon-48x48.png
        e: Extension management page
      - l: icon-128x128.png
        e: Installation and web store
---

This build target includes the icons required for browser extensions. You need all of them - and if you discover one that is new or missing, please [open an issue](https://github.com/quasarframework/quasar/issues).

<img src="https://cdn.quasar.dev/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px" />

## Icon Genie CLI

::: tip
We highly recommend using the [Icon Genie CLI](/icongenie/introduction), because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When needed, it also tells you what tags you'll need to add to your /index.html file.
:::

Quickly bootstrap the necessary images with Icon Genie CLI. For a complete list of options, please visit the [Icon Genie CLI](/icongenie/command-list) command list page.

```bash
$ icongenie generate -m bex -i /path/to/source/icon.png
```

## Manual instructions

<doc-tree :def="scope.tree" />
