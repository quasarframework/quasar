---
title: App Icons for SPA
desc: (@quasar/app-vite) How to manage the app icons for a Quasar Single Page Application.
scope:
  spaTree:
    l: public
    c:
      - l: favicon.ico
      - l: icons
        c:
          - l: favicon-128x128.png
          - l: favicon-96x96.png
          - l: favicon-32x32.png
          - l: favicon-16x16.png
          - l: apple-icon-180x180.png
            e: Safari's Add to Home Screen / Add to Dock
---

This build target includes favicon formats and sizes used by different browsers and operating systems. Icon Genie generates the recommended set for you. If you discover one that is new or missing, please [open an issue](https://github.com/quasarframework/quasar/issues).

<llm-exclude reason="decoration">
<img alt="IconGenie logo" src="/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px">
</llm-exclude>

## Icon Genie CLI

> [!TIP]
> We highly recommend using the [Icon Genie CLI](/icongenie/introduction), because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When needed, it also tells you what tags you'll need to add to your `/index.html` file.

Quickly bootstrap the necessary images with Icon Genie CLI. For a complete list of options, please visit the [Icon Genie CLI](/icongenie/command-list) command list page.

```bash
icongenie generate -m spa -i /path/to/source/icon.png
```

## Manual instructions

<DocTree :def="scope.spaTree" />

The required HTML code that goes into `/index.html` to reference the above files:

```html
<link rel="icon" type="image/ico" href="favicon.ico" />
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
<link
  rel="apple-touch-icon"
  sizes="180x180"
  href="icons/apple-icon-180x180.png"
/>
```
