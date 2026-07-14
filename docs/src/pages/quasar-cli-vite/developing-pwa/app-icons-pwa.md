---
title: App Icons for PWA
desc: (@quasar/app-vite) How to manage the app icons for a Quasar Progressive Web App.
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
          - l: apple-launch-1320x2868.png
          - l: apple-launch-1260x2736.png
          - l: apple-launch-1206x2622.png
          - l: apple-launch-1290x2796.png
          - l: apple-launch-1179x2556.png
          - l: apple-launch-1284x2778.png
          - l: apple-launch-1170x2532.png
          - l: apple-launch-1080x2340.png
          - l: apple-launch-1242x2688.png
          - l: apple-launch-1125x2436.png
          - l: apple-launch-828x1792.png
          - l: apple-launch-1242x2208.png
          - l: apple-launch-750x1334.png
          - l: apple-launch-2064x2752.png
          - l: apple-launch-2048x2732.png
          - l: apple-launch-1668x2420.png
          - l: apple-launch-1668x2388.png
          - l: apple-launch-1640x2360.png
          - l: apple-launch-1668x2224.png
          - l: apple-launch-1620x2160.png
          - l: apple-launch-1488x2266.png
          - l: apple-launch-1536x2048.png
---

This build target includes a variety of special icons for individual browsers and operating systems. You need all of them - and if you discover one that is new or missing, please [open an issue](https://github.com/quasarframework/quasar/issues).

<img src="/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px">

## Icon Genie CLI

::: tip
We highly recommend using the [Icon Genie CLI](/icongenie/introduction), because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When needed, it also tells you what tags you'll need to add to your /index.html file.
:::

Quickly bootstrap the necessary images with Icon Genie CLI. For a complete list of options, please visit the [Icon Genie CLI](/icongenie/command-list) command list page.

```bash
icongenie generate -m pwa -i /path/to/source/icon.png [-b /path/to/background.png]
```

## Manual instructions

<DocTree :def="scope.pwaTree" />

The required HTML code that goes into `/index.html` to reference the above files (notice not all files need to be manually referenced as Quasar CLI automatically injects the other PWA ones):

```html
<link rel="icon" type="image/ico" href="icons/favicon.ico" />
<link
  rel="icon"
  type="image/png"
  sizes="128x128"
  href="icons/favicon-128x128.png"
/>
<link
  rel="icon"
  type="image/png"
  sizes="96x96"
  href="icons/favicon-96x96.png"
/>
<link
  rel="icon"
  type="image/png"
  sizes="32x32"
  href="icons/favicon-32x32.png"
/>
<link
  rel="icon"
  type="image/png"
  sizes="16x16"
  href="icons/favicon-16x16.png"
/>
<!-- iPhone 17 Pro Max, 16 Pro Max -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3)"
  href="icons/apple-launch-1320x2868.png"
/>
<!-- iPhone 17 Air -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3)"
  href="icons/apple-launch-1260x2736.png"
/>
<!-- iPhone 17 Pro, 17, 16 Pro -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3)"
  href="icons/apple-launch-1206x2622.png"
/>
<!-- iPhone 16 Plus, 15 Pro Max, 15 Plus, 14 Pro Max -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)"
  href="icons/apple-launch-1290x2796.png"
/>
<!-- iPhone 16, 15 Pro, 15, 14 Pro -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)"
  href="icons/apple-launch-1179x2556.png"
/>
<!-- iPhone 14 Plus, 13 Pro Max, 12 Pro Max -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)"
  href="icons/apple-launch-1284x2778.png"
/>
<!-- iPhone 17e, 16e, 14, 13 Pro, 13, 12 Pro, 12 -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
  href="icons/apple-launch-1170x2532.png"
/>
<!-- iPhone 13 mini, 12 mini -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 360px) and (device-height: 780px) and (-webkit-device-pixel-ratio: 3)"
  href="icons/apple-launch-1080x2340.png"
/>
<!-- iPhone 11 Pro Max, XS Max -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
  href="icons/apple-launch-1242x2688.png"
/>
<!-- iPhone 11 Pro, X, XS -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
  href="icons/apple-launch-1125x2436.png"
/>
<!-- iPhone 11, XR -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
  href="icons/apple-launch-828x1792.png"
/>
<!-- iPhone 8 Plus, 7 Plus, 6s Plus, 6 Plus -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)"
  href="icons/apple-launch-1242x2208.png"
/>
<!-- iPhone 8, 7, 6s, 6, SE (2nd & 3rd gen) -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
  href="icons/apple-launch-750x1334.png"
/>
<!-- iPad Pro 13" (M4) -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2)"
  href="icons/apple-launch-2064x2752.png"
/>
<!-- iPad Pro 12.9", iPad Air 13" (M2) -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
  href="icons/apple-launch-2048x2732.png"
/>
<!-- iPad Pro 11" (M4) -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 834px) and (device-height: 1210px) and (-webkit-device-pixel-ratio: 2)"
  href="icons/apple-launch-1668x2420.png"
/>
<!-- iPad Pro 11" (M1/M2) -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
  href="icons/apple-launch-1668x2388.png"
/>
<!-- iPad 11" (11th gen), iPad 10.9" (10th gen), iPad Air 11" (M2), iPad Air 10.9" -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2)"
  href="icons/apple-launch-1640x2360.png"
/>
<!-- iPad Pro 10.5", iPad Air 3rd Gen -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
  href="icons/apple-launch-1668x2224.png"
/>
<!-- iPad 10.2" (7th, 8th, 9th gen) -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2)"
  href="icons/apple-launch-1620x2160.png"
/>
<!-- iPad Mini (6th & 7th gen) -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2)"
  href="icons/apple-launch-1488x2266.png"
/>
<!-- iPad Mini (up to 5th gen), iPad Air 9.7", iPad 9.7" -->
<link
  rel="apple-touch-startup-image"
  media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
  href="icons/apple-launch-1536x2048.png"
/>
```
