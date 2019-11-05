---
title: App Icons for SSR
desc: How to manage the app icons for a Quasar server-side rendered app.
---

This build target includes a variety of special icons for individual browsers and operating systems. You need all of them - and if you discover one that is new or missing, please open an issue.

```
src/
  statics/
     app-logo-128x128.png
     icons/
        apple-icon-120x120.png
        apple-icon-152x152.png
        apple-icon-167x167.png
        apple-icon-180x180.png
        favicon-16x16.png
        favicon-32x32.png
        favicon-96x96.png
        favicon.ico
        icon-128x128.png
        icon-192x192.png
        icon-256x256.png
        icon-384x384.png
        icon-512x512.png
        ms-icon-144x144.png
        safari-pinned-tab.svg
```

<img src="https://cdn.quasar.dev/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px" />

## The Icon Genie

::: tip
We highly recommend using our official [Icon Genie](https://github.com/quasarframework/app-extension-icon-genie/) app extension, because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When you change this source file (or some of the extension's settings) the icons will be automatically rebuilt on the next dev or build command.
:::
