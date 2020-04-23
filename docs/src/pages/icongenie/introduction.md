---
title: Icon Genie CLI
desc: A Quasar tool for generating all your App's icons and splashscreens in 100+ formats.
---

You love the Quasar logo probably as much as the team does, but you just spent what feels like a lifetime making your own pixel-perfect representation of the soul of your application.

There are many different situations where your icon might be seen: in the browser tab, on the desktop, on the home screen of a mobile phone and even in an App Store. Then there are splashscreens that you'll want to create.

And so now you need your logo in about 100+ different sizes with representative names, arcane formats, placed in the right folders and probably some proper `<xml>` declarations for Cordova too. Even if you know exactly what you are doing, this is a tedious and error prone task. However, to make your life easy and care-free, we've built the Icon Genie CLI tool to make all this process **dead simple**.

<img src="https://cdn.quasar.dev/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px" />

## How it helps you

::: tip
We highly recommend using the Icon Genie CLI for your Quasar CLI generated projects, because it consumes a source icon and automatically clones, scales, minifies and places the icons and splashscreens in the appropriate directories for you. When needed, it also tells you what tags you'll need to add to your /src/index.template.html file.
:::

## Requirements

This tool was built by us especially **with the Quasar CLI projects structure in mind**. If you have your project folder built with another CLI, you'll seriously need to explore Icon Genie profile files.
