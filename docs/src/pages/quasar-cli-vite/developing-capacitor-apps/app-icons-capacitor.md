---
title: App Icons for Capacitor
desc: (@quasar/app-vite) How to manage the app icons for a Quasar hybrid mobile app with Capacitor.
scope:
  tree:
    l: "."
    c:
    - l: android
      c:
      - l: app
        c:
        - l: src
          c:
          - l: main
            c:
            - l: res
              c:
              - l: drawable
                c:
                - l: splash.png
              - l: drawable-land-hdpi
                c:
                - l: splash.png
              - l: drawable-land-mdpi
                c:
                - l: splash.png
              - l: drawable-land-xhdpi
                c:
                - l: splash.png
              - l: drawable-land-xxhdpi
                c:
                - l: splash.png
              - l: drawable-land-xxxhdpi
                c:
                - l: splash.png
              - l: drawable-port-hdpi
                c:
                - l: splash.png
              - l: drawable-port-mdpi
                c:
                - l: splash.png
              - l: drawable-port-xhdpi
                c:
                - l: splash.png
              - l: drawable-port-xxhdpi
                c:
                - l: splash.png
              - l: drawable-port-xxxhdpi
                c:
                - l: splash.png
              - l: mipmap-hdpi
                c:
                - l: ic_launcher.png
                - l: ic_launcher_foreground.png
                - l: ic_launcher_round.png
              - l: mipmap-mdpi
                c:
                - l: ic_launcher.png
                - l: ic_launcher_foreground.png
                - l: ic_launcher_round.png
              - l: mipmap-xhdpi
                c:
                - l: ic_launcher.png
                - l: ic_launcher_foreground.png
                - l: ic_launcher_round.png
              - l: mipmap-xxhdpi
                c:
                - l: ic_launcher.png
                - l: ic_launcher_foreground.png
                - l: ic_launcher_round.png
              - l: mipmap-xxhdpi
                c:
                - l: ic_launcher.png
                - l: ic_launcher_foreground.png
                - l: ic_launcher_round.png
    - l: ios
      c:
      - l: App
        c:
        - l: App
          c:
          - l: Assets.xcassets
            c:
            - l: AppIcon.appiconset
              c:
              - l: AppIcon-20x20@1x.png
              - l: AppIcon-20x20@2x-1.png
              - l: AppIcon-20x20@2x.png
              - l: AppIcon-20x20@3x.png
              - l: AppIcon-29x29@1x.png
              - l: AppIcon-29x29@2x-1.png
              - l: AppIcon-29x29@2x.png
              - l: AppIcon-29x29@3x.png
              - l: AppIcon-40x40@1x.png
              - l: AppIcon-40x40@2x-1.png
              - l: AppIcon-40x40@2x.png
              - l: AppIcon-40x40@3x.png
              - l: AppIcon-512@2x.png
              - l: AppIcon-60x60@2x.png
              - l: AppIcon-60x60@3x.png
              - l: AppIcon-76x76@1x.png
              - l: AppIcon-76x76@2x.png
              - l: AppIcon-83.5x83.5@2x.png
            - l: Splash.imageset
              c:
              - l: splash-2732x2732-1.png
              - l: splash-2732x2732-2.png
              - l: splash-2732x2732.png
---


Capacitor is one of the most complicated of all of the build targets as far as icons go, because not only do you need to place the icons in specific folders, you also need to register them in config files for both platforms (Android, iOS).

If you discover one file that is new or missing, please [open an issue](https://github.com/quasarframework/quasar/issues).

<img src="https://cdn.quasar.dev/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px" />

## Icon Genie CLI

::: tip
We highly recommend using the [Icon Genie CLI](/icongenie/introduction), because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When needed, it also tells you what tags you'll need to add to your /index.html file.
:::

Quickly bootstrap the necessary images with Icon Genie CLI. For a complete list of options, please visit the [Icon Genie CLI](/icongenie/command-list) command list page.

```bash
$ icongenie generate -m capacitor -i /path/to/source/icon.png [-b /path/to/background.png]
```

Depending on what packager (electron-packager or electron-builder) you will be using, please see their docs on how to hook the icons.

## Manual instructions

Unless you are using the Icon Genie app extension, these are the files that you need to replace:

<doc-tree :def="scope.tree" />
