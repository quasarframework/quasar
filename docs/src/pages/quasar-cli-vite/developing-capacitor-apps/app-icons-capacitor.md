---
title: App Icons for Capacitor
desc: (@quasar/app-vite) How to manage the app icons for a Quasar hybrid mobile app with Capacitor.
scope:
  tree:
    l: '.'
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
                          - l: mipmap-anydpi-v26
                            c:
                              - l: ic_launcher.xml
                              - l: ic_launcher_round.xml
                          - l: mipmap-mdpi
                            c:
                              - l: ic_launcher.png
                              - l: ic_launcher_background.png
                              - l: ic_launcher_foreground.png
                              - l: ic_launcher_monochrome.png
                              - l: ic_launcher_round.png
                          - l: mipmap-hdpi
                            c:
                              - l: ic_launcher.png
                              - l: ic_launcher_background.png
                              - l: ic_launcher_foreground.png
                              - l: ic_launcher_monochrome.png
                              - l: ic_launcher_round.png
                          - l: mipmap-xhdpi
                            c:
                              - l: ic_launcher.png
                              - l: ic_launcher_background.png
                              - l: ic_launcher_foreground.png
                              - l: ic_launcher_monochrome.png
                              - l: ic_launcher_round.png
                          - l: mipmap-xxhdpi
                            c:
                              - l: ic_launcher.png
                              - l: ic_launcher_background.png
                              - l: ic_launcher_foreground.png
                              - l: ic_launcher_monochrome.png
                              - l: ic_launcher_round.png
                          - l: mipmap-xxxhdpi
                            c:
                              - l: ic_launcher.png
                              - l: ic_launcher_background.png
                              - l: ic_launcher_foreground.png
                              - l: ic_launcher_monochrome.png
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
                          - l: AppIcon-512@2x.png
                          - l: AppIcon-512@2x-dark.png
                          - l: AppIcon-512@2x-tinted.png
                          - l: Contents.json
                      - l: Splash.imageset
                        c:
                          - l: Contents.json
                          - l: splash-2732x2732-1.png
                          - l: splash-2732x2732-2.png
                          - l: splash-2732x2732.png
---

Capacitor is one of the most complicated of all of the build targets as far as icons go, because not only do you need to place the icons in specific folders, you also need to register them in config files for both platforms (Android, iOS).

If you discover one file that is new or missing, please [open an issue](https://github.com/quasarframework/quasar/issues).

> [!NOTE]
> **Native projects only.** The icons are written inside `/src-capacitor/android` and `/src-capacitor/ios`, so a platform gets its assets only after it was added to the Capacitor project (which happens on the first `quasar dev`/`build` for that target).

<llm-exclude reason="decoration">
<img alt="IconGenie logo" src="/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px">
</llm-exclude>

## Icon Genie CLI

> [!TIP]
> We highly recommend using the [Icon Genie CLI](/icongenie/introduction), because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When needed, it also tells you what tags you'll need to add to your /index.html file.

Quickly bootstrap the necessary images with Icon Genie CLI. For a complete list of options, please visit the [Icon Genie CLI](/icongenie/command-list) command list page.

```bash
icongenie generate -m capacitor -i /path/to/source/icon.png [-b /path/to/background.png]
```

What gets generated for Capacitor mode:

- **Android adaptive icon**: the `ic_launcher_foreground` layer (your icon, fitted to the safe zone of the 108dp canvas), the `ic_launcher_background` layer (the `--background` image, or a flat `--png-color` fill) and the `ic_launcher_monochrome` layer for Android 13+ themed icons (the shape of your icon, or of `--icon-monochrome`), plus the `ic_launcher` and `ic_launcher_round` icons that pre Android 8 launchers show. The adaptive icon XML files in `mipmap-anydpi-v26` are updated to point to the generated layers.
- **Android splash screens**: the portrait and landscape `splash.png` drawables for every density.
- **iOS app icon**: the single 1024px `AppIcon-512@2x.png` that Xcode 14+ requires, plus the dark (transparent background) and tinted (grayscale) variants for the iOS 18+ appearances.
- **iOS splash screens**: the three `Splash.imageset` images (1x, 2x, 3x). The `Contents.json` of each image set is updated to list the generated files.

Add `--splashscreen-dark-color <hex>` to also generate the dark variants of the splash screens: Android `night` resources (`drawable-night`, `drawable-port-night-*`, `drawable-land-night-*`) and iOS images registered for the dark appearance. They use the `--background-dark` image when specified (the `--background` one otherwise). Without the param, no dark variants are generated and any previously generated ones are removed.

The `@capacitor/splash-screen` plugin gets installed into `/src-capacitor` if it is not already, as it is the one displaying the splash screens.

> [!NOTE]
> **Android splash screen scaling.** On Android 12+ the launch splash is the system's icon-based one and the `splash.png` drawables are only painted when your app calls the plugin's `show()`. The plugin would stretch them (`FIT_XY`), so `defineCapacitorConfig` defaults the plugin's `androidScaleType` to `CENTER_CROP`, which the generated images are composed for (icon centered, background covering).

## Manual instructions

Unless you are using the Icon Genie app extension, these are the files that you need to replace:

<DocTree :def="scope.tree" />
