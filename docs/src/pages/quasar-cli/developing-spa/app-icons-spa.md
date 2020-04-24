---
title: App Icons for SPA
desc: How to manage the app icons for a Quasar Single Page Application.
---

This build target includes a variety of special icons for individual browsers and operating systems. You need all of them - and if you discover one that is new or missing, please [open an issue](https://github.com/quasarframework/quasar/issues).

<img src="https://cdn.quasar.dev/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px" />

## Icon Genie CLI

::: tip
We highly recommend using the [Icon Genie CLI](/icongenie/introduction), because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When needed, it also tells you what tags you'll need to add to your /src/index.template.html file.
:::

Quickly bootstrap the necessary images with Icon Genie CLI. For a complete list of options, please visit the [Icon Genie CLI](/icongenie/command-list) command list page.

```bash
$ icongenie generate -m spa -i /path/to/source/icon.png
```

## Manual instructions

```
src/
  statics/
     icons/
        favicon.ico
        favicon-128x128.png
        favicon-96x96.png
        favicon-32x32.png
        favicon-16x16.png
```

The required HTML code that goes into `/src/index.template.html` to reference the above files:

```html
<link rel="icon" type="image/ico" href="statics/icons/favicon.ico">
<link rel="icon" type="image/png" sizes="128x128" href="statics/icons/favicon-128x128.png">
<link rel="icon" type="image/png" sizes="96x96" href="statics/icons/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="32x32" href="statics/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="statics/icons/favicon-16x16.png">
```

