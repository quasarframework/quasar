---
title: App Icons for (BEX)
desc: How to manage the app icons for a Quasar Browser Extension (BEX).
---

This build target includes the icons required for browser extensions. You need all of them - and if you discover one that is new or missing, please open an issue.

```
src-bex/
  icons/
     icon-16x16.png   // Favicon on extension pages
     icon-48x48.png   // Extension management page
     icon-128x128.png // Installation and web store
```

<img src="https://cdn.quasar.dev/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px" />

## The Icon Genie

::: tip
We highly recommend using our official [Icon Genie](https://github.com/quasarframework/app-extension-icon-genie/) app extension, because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When you change this source file (or some of the extension's settings) the icons will be automatically rebuilt on the next dev or build command.
:::
