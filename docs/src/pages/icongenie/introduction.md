---
title: Icon Genie CLI
desc: A Quasar tool for generating all your app's icons and splashscreens in 100+ formats.
---

You love the default Quasar logo, probably as much as the team does, but you just spent what feels like a lifetime making your own pixel-perfect representation of the soul of your application and now you want to replace that logo with your own!

There are many different situations where your icon might be seen: in the browser tab, on the desktop, on the home screen of a mobile phone and even in an app store. Then there are splashscreens to create in all the various device sizes and orientations.

This means you need your logo in about 100+ different sizes with representative names, arcane formats, placed in the correct folders and probably some proper `<xml>` declarations for Cordova too. Even if you know exactly what you're doing, this is a tedious and error-prone task. To make your life easy and care-free, we've built the Icon Genie CLI tool to make this exhausting process **dead simple**.

<img src="https://cdn.quasar.dev/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px" />

## How it helps you

::: tip
We highly recommend using the Icon Genie CLI **for your Quasar CLI-generated projects** because it consumes a source icon and automatically clones, scales, minifies and places the icons and splashscreens in the appropriate directories for you. When needed, it also tells you what tags you'll need to add to your /src/index.template.html file.
:::

## Requirements

This tool was built by the Quasar Team especially **with the Quasar CLI project structure in mind**. If you build your project folder with another CLI, you should explore Icon Genie [profile files](/icongenie/profile-files).
