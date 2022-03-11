---
title: App Icons for Capacitor
desc: How to manage the app icons for a Quasar hybrid mobile app with Capacitor.
---


Capacitor is one of the most complicated of all of the build targets as far as icons go, because not only do you need to place the icons in specific folders, you also need to register them in config files for both platforms (Android, iOS).

If you discover one file that is new or missing, please [open an issue](https://github.com/quasarframework/quasar/issues).

<img src="https://cdn.quasar.dev/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px" />

## Icon Genie CLI

::: tip
We highly recommend using the [Icon Genie CLI](/icongenie/introduction), because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When needed, it also tells you what tags you'll need to add to your /src/index.template.html file.
:::

Quickly bootstrap the necessary images with Icon Genie CLI. For a complete list of options, please visit the [Icon Genie CLI](/icongenie/command-list) command list page.

```bash
$ icongenie generate -m capacitor -i /path/to/source/icon.png [-b /path/to/background.png]
```

Depending on what packager (electron-packager or electron-builder) you will be using, please see their docs on how to hook the icons.

## Manual instructions

Unless you are using the Icon Genie app extension, these are the files that you need to replace:

```
.
├── android
│   └── app
│       └── src
│           └── main
│               └── res
│                   ├── drawable
│                   │   └── splash.png
│                   ├── drawable-land-hdpi
│                   │   └── splash.png
│                   ├── drawable-land-mdpi
│                   │   └── splash.png
│                   ├── drawable-land-xhdpi
│                   │   └── splash.png
│                   ├── drawable-land-xxhdpi
│                   │   └── splash.png
│                   ├── drawable-land-xxxhdpi
│                   │   └── splash.png
│                   ├── drawable-port-hdpi
│                   │   └── splash.png
│                   ├── drawable-port-mdpi
│                   │   └── splash.png
│                   ├── drawable-port-xhdpi
│                   │   └── splash.png
│                   ├── drawable-port-xxhdpi
│                   │   └── splash.png
│                   ├── drawable-port-xxxhdpi
│                   │   └── splash.png
│                   ├── mipmap-hdpi
│                   │   ├── ic_launcher.png
│                   │   ├── ic_launcher_foreground.png
│                   │   └── ic_launcher_round.png
│                   ├── mipmap-mdpi
│                   │   ├── ic_launcher.png
│                   │   ├── ic_launcher_foreground.png
│                   │   └── ic_launcher_round.png
│                   ├── mipmap-xhdpi
│                   │   ├── ic_launcher.png
│                   │   ├── ic_launcher_foreground.png
│                   │   └── ic_launcher_round.png
│                   ├── mipmap-xxhdpi
│                   │   ├── ic_launcher.png
│                   │   ├── ic_launcher_foreground.png
│                   │   └── ic_launcher_round.png
│                   └── mipmap-xxxhdpi
│                       ├── ic_launcher.png
│                       ├── ic_launcher_foreground.png
│                       └── ic_launcher_round.png
└── ios
    └── App
        └── App
            └── Assets.xcassets
                ├── AppIcon.appiconset
                │   ├── AppIcon-20x20@1x.png
                │   ├── AppIcon-20x20@2x-1.png
                │   ├── AppIcon-20x20@2x.png
                │   ├── AppIcon-20x20@3x.png
                │   ├── AppIcon-29x29@1x.png
                │   ├── AppIcon-29x29@2x-1.png
                │   ├── AppIcon-29x29@2x.png
                │   ├── AppIcon-29x29@3x.png
                │   ├── AppIcon-40x40@1x.png
                │   ├── AppIcon-40x40@2x-1.png
                │   ├── AppIcon-40x40@2x.png
                │   ├── AppIcon-40x40@3x.png
                │   ├── AppIcon-512@2x.png
                │   ├── AppIcon-60x60@2x.png
                │   ├── AppIcon-60x60@3x.png
                │   ├── AppIcon-76x76@1x.png
                │   ├── AppIcon-76x76@2x.png
                │   └── AppIcon-83.5x83.5@2x.png
                └── Splash.imageset
                    ├── splash-2732x2732-1.png
                    ├── splash-2732x2732-2.png
                    └── splash-2732x2732.png
```
