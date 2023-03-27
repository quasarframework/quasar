---
title: App Icons for PWA
desc: (@quasar/app-webpack) How to manage the app icons for a Quasar Progressive Web App.
scope:
  pwaTree:
    l: public
    c:
    - l: favicon.ico
    - l: icons
      c:
      - l: favicon-128x128.png
      - l: favicon-96x96.png
      - l: favicon-32x32.png
      - l: favicon-16x16.png
      - l: icon-128x128.png
        e: for the PWA manifest
      - l: icon-192x192.png
        e: for the PWA manifest
      - l: icon-256x256.png
        e: for the PWA manifest
      - l: icon-384x384.png
        e: for the PWA manifest
      - l: icon-512x512.png
        e: for the PWA manifest
      - l: ms-icon-144x144.png
      - l: safari-pinned-tab.svg
      - l: apple-icon-120x120.png
      - l: apple-icon-152x152.png
      - l: apple-icon-167x167.png
      - l: apple-icon-180x180.png
      - l: apple-icon-828x1792.png
      - l: apple-icon-1125x2436.png
      - l: apple-icon-1242x2688.png
      - l: apple-icon-750x1334.png
      - l: apple-icon-1242x2208.png
      - l: apple-icon-640x1136.png
      - l: apple-icon-1536x2048.png
      - l: apple-icon-1668x2224.png
      - l: apple-icon-1668x2388.png
      - l: apple-icon-2048x2732.png
---

This build target includes a variety of special icons for individual browsers and operating systems. You need all of them - and if you discover one that is new or missing, please [open an issue](https://github.com/quasarframework/quasar/issues).

<img src="https://cdn.quasar.dev/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px" />

## Icon Genie CLI

::: tip
We highly recommend using the [Icon Genie CLI](/icongenie/introduction), because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When needed, it also tells you what tags you'll need to add to your /src/index.template.html file.
:::

Quickly bootstrap the necessary images with Icon Genie CLI. For a complete list of options, please visit the [Icon Genie CLI](/icongenie/command-list) command list page.

```bash
$ icongenie generate -m pwa -i /path/to/source/icon.png [-b /path/to/background.png]
```

## Manual instructions

<doc-tree :def="scope.pwaTree" />

The required HTML code that goes into `/src/index.template.html` to reference the above files (notice not all files need to be manually referenced as Quasar CLI automatically injects the other PWA ones):

```html
<link rel="icon" type="image/ico" href="icons/favicon.ico">
<link rel="icon" type="image/png" sizes="128x128" href="icons/favicon-128x128.png">
<link rel="icon" type="image/png" sizes="96x96" href="icons/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="icons/favicon-16x16.png">
<!-- iPhone XR -->
<link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" href="icons/apple-launch-828x1792.png">
<!-- iPhone X, XS -->
<link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" href="icons/apple-launch-1125x2436.png">
<!-- iPhone XS Max -->
<link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" href="icons/apple-launch-1242x2688.png">
<!-- iPhone 8, 7, 6s, 6 -->
<link rel="apple-touch-startup-image" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" href="icons/apple-launch-750x1334.png">
<!-- iPhone 8 Plus, 7 Plus, 6s Plus, 6 Plus -->
<link rel="apple-touch-startup-image" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)" href="icons/apple-launch-1242x2208.png">
<!-- iPhone 5 -->
<link rel="apple-touch-startup-image" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" href="icons/apple-launch-640x1136.png">
<!-- iPad Mini, Air, 9.7" -->
<link rel="apple-touch-startup-image" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" href="icons/apple-launch-1536x2048.png">
<!-- iPad Pro 10.5" -->
<link rel="apple-touch-startup-image" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" href="icons/apple-launch-1668x2224.png">
<!-- iPad Pro 11" -->
<link rel="apple-touch-startup-image" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" href="icons/apple-launch-1668x2388.png">
<!-- iPad Pro 12.9" -->
<link rel="apple-touch-startup-image" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" href="icons/apple-launch-2048x2732.png">
```
