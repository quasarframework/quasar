---
title: App Icons
desc: Managing all the App icons and splashscreens in a Quasar app.
---

If you were to target all platforms that Quasar currently supports, you will need to make 100+ different files of 4 different media types (png, ico, icns and svg). If you just use a tool like Gimp, Photoshop or Affinity Designer, you will find that these files are rather large and the process of making them and naming them is prone to operator error. You will probably want to compress the PNG files at least, and also remove unnecessary app-metadata from the SVG.

<img src="https://cdn.quasar.dev/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px" />

## Icon Genie CLI

::: tip
We highly recommend using the Icon Genie CLI, because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When needed, it also tells you what tags you'll need to add to your /src/index.template.html file.
:::
