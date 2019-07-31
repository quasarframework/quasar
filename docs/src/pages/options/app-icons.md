---
title: App Icons
desc: How to manage all the required icons of a Quasar app.
---

You love the Quasar logo probably as much as the team does, but you just spent what feels like a lifetime making your own pixel-perfect representation of the soul of your application.

There are many different situations where your icon might be seen: In the browser tab, on the desktop and even in an App Store.

And so now you need your logo in about 80 different sizes with representative names, arcane formats, placed in the right folders and probably some proper `<xml>` declarations for Cordova too. Even if you know exactly what you are doing, this is tedious and error prone. However, if you are using the Quasar CLI, your life is easy and care-free - because Quasar and the **Icon Genie** app-extension make it dead simple.

We have collected all the important information here: [Quasar CLI > App icons](/quasar-cli/app-icons) - but if you just want to "set it and forget it", here's what you need to know:

## Icon Genie

Check out the [Icon Genie repository](https://github.com/quasarframework/app-extension-icon-genie/blob/dev/README.md) for explicit details about how it works, or just dive in and install it into your project like [any app extension](/app-extensions/introduction):

```bash
$ quasar ext add @quasar/icon-genie
```

It will ask you to tell it where it can find the source image (1240x1240) and which minification strategy you want to use. Then when you run `$ quasar dev`  - it will produce the right icons and put them in all the right places for you, no matter what `--mode` you are using; if you are just serving an HMR locally or producing final assets with `build`.

### Not using Quasar CLI yet?

You'll have to convert, resize, name and place your files wherever they are, and depending on how you build your application that could be anywhere.

For devs in this situation, we provide the option for you to install the Icon Genie globally as an npm module and use it to just produce the icons you need:

```bash
$ npm install --global @quasar/app-extension-icon-genie
$ icongenie -p=kitchensink -s=icon-1280x1280.png -t=./outputFolder -m=pngquant
```

Full details about this type of usage can be found at the app-extension repository.
