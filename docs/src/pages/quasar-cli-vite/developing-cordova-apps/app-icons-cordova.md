---
title: App Icons for Cordova
desc: (@quasar/app-vite) How to manage the app icons for a Quasar hybrid mobile app with Cordova.
scope:
  tree:
    l: src-cordova
    c:
      - l: res
        c:
          - l: android
            c:
              - l: ldpi.png
              - l: ldpi-foreground.png
              - l: ldpi-background.png
              - l: ldpi-monochrome.png
              - l: mdpi.png
              - l: mdpi-foreground.png
              - l: mdpi-background.png
              - l: mdpi-monochrome.png
              - l: hdpi.png
              - l: hdpi-foreground.png
              - l: hdpi-background.png
              - l: hdpi-monochrome.png
              - l: xhdpi.png
              - l: xhdpi-foreground.png
              - l: xhdpi-background.png
              - l: xhdpi-monochrome.png
              - l: xxhdpi.png
              - l: xxhdpi-foreground.png
              - l: xxhdpi-background.png
              - l: xxhdpi-monochrome.png
              - l: xxxhdpi.png
              - l: xxxhdpi-foreground.png
              - l: xxxhdpi-background.png
              - l: xxxhdpi-monochrome.png
          - l: screen
            c:
              - l: android
                c:
                  - l: splashscreen.png
                    e: Android 12+ splash screen icon
              - l: ios
                c:
                  - l: Default@2x~universal~anyany.png
                  - l: Default@2x~universal~comany.png
                  - l: Default@2x~universal~comcom.png
                  - l: Default@3x~universal~anyany.png
                  - l: Default@3x~universal~anycom.png
                  - l: Default@3x~universal~comany.png
                  - l: Default@2x~universal~anyany~dark.png
                    e: with --splashscreen-dark-color
                  - l: Default@2x~universal~comany~dark.png
                    e: with --splashscreen-dark-color
                  - l: Default@2x~universal~comcom~dark.png
                    e: with --splashscreen-dark-color
                  - l: Default@3x~universal~anyany~dark.png
                    e: with --splashscreen-dark-color
                  - l: Default@3x~universal~anycom~dark.png
                    e: with --splashscreen-dark-color
                  - l: Default@3x~universal~comany~dark.png
                    e: with --splashscreen-dark-color
          - l: ios
            c:
              - l: icon.png
              - l: icon-dark.png
                e: dark appearance
              - l: icon-tinted.png
                e: tinted appearance
---

Cordova icons and splash screens are native resources declared in `/src-cordova/config.xml`. The set below targets `cordova-android` 11+ (adaptive icons and the Android 12 splash screen API) and `cordova-ios` 8+ (a single 1024px icon with dark and tinted variants).

If you discover one file that is new or missing, please [open an issue](https://github.com/quasarframework/quasar/issues).

<llm-exclude reason="decoration">
<img alt="IconGenie logo" src="/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px">
</llm-exclude>

## Icon Genie CLI

> [!TIP]
> We highly recommend using the [Icon Genie CLI](/icongenie/introduction), because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When needed, it also tells you what tags you'll need to add to your /index.html file.

Quickly bootstrap the necessary images with Icon Genie CLI. For a complete list of options, please visit the [Icon Genie CLI](/icongenie/command-list) command list page.

```bash
icongenie generate -m cordova -i /path/to/source/icon.png [-b /path/to/background.png]
```

## Manual instructions

Unless you are using Icon Genie CLI, replace the generated resources and keep their `config.xml` declarations aligned with the requirements of each installed Cordova platform.

What gets generated for Cordova mode:

- **Android adaptive icon** per density: the `foreground`, `background` and `monochrome` layers (108dp canvas) plus the legacy `src` icon (48dp) for pre Android 8 launchers.
- **Android splash screen**: a single 960px `splashscreen.png` (the adaptive icon at 240dp) declared through the `AndroidWindowSplashScreenAnimatedIcon` preference, with `AndroidWindowSplashScreenBackground` set to the splash screen color. The platform masks and animates it itself; the legacy `<splash>` images and `cordova-plugin-splashscreen` are no longer used, and Icon Genie removes them.
- **iOS app icon**: one 1024px `icon.png`, plus `icon-dark.png` (transparent background) and `icon-tinted.png` (grayscale) for the iOS 18+ dark and tinted appearances.
- **iOS launch storyboard images**: the six `~universal` images, plus their `~dark` variants when `--splashscreen-dark-color` is specified.

<DocTree :def="scope.tree" />

And here is part of what your config.xml should look like:

```xml
<platform name="android">
    <icon density="ldpi" src="res/android/ldpi.png"
          foreground="res/android/ldpi-foreground.png"
          background="res/android/ldpi-background.png"
          monochrome="res/android/ldpi-monochrome.png" />
    <icon density="mdpi" src="res/android/mdpi.png"
          foreground="res/android/mdpi-foreground.png"
          background="res/android/mdpi-background.png"
          monochrome="res/android/mdpi-monochrome.png" />
    <icon density="hdpi" src="res/android/hdpi.png"
          foreground="res/android/hdpi-foreground.png"
          background="res/android/hdpi-background.png"
          monochrome="res/android/hdpi-monochrome.png" />
    <icon density="xhdpi" src="res/android/xhdpi.png"
          foreground="res/android/xhdpi-foreground.png"
          background="res/android/xhdpi-background.png"
          monochrome="res/android/xhdpi-monochrome.png" />
    <icon density="xxhdpi" src="res/android/xxhdpi.png"
          foreground="res/android/xxhdpi-foreground.png"
          background="res/android/xxhdpi-background.png"
          monochrome="res/android/xxhdpi-monochrome.png" />
    <icon density="xxxhdpi" src="res/android/xxxhdpi.png"
          foreground="res/android/xxxhdpi-foreground.png"
          background="res/android/xxxhdpi-background.png"
          monochrome="res/android/xxxhdpi-monochrome.png" />
    <preference name="AndroidWindowSplashScreenAnimatedIcon" value="res/screen/android/splashscreen.png" />
    <preference name="AndroidWindowSplashScreenBackground" value="#ffffff" />
</platform>
<platform name="ios">
    <icon src="res/ios/icon.png" />
    <icon src="res/ios/icon-dark.png" foreground="true" />
    <icon src="res/ios/icon-tinted.png" monochrome="true" />
    <splash src="res/screen/ios/Default@2x~universal~anyany.png" />
    <splash src="res/screen/ios/Default@2x~universal~comany.png" />
    <splash src="res/screen/ios/Default@2x~universal~comcom.png" />
    <splash src="res/screen/ios/Default@3x~universal~anyany.png" />
    <splash src="res/screen/ios/Default@3x~universal~anycom.png" />
    <splash src="res/screen/ios/Default@3x~universal~comany.png" />
    <splash src="res/screen/ios/Default@2x~universal~anyany~dark.png" /> <!-- with --splashscreen-dark-color -->
    <splash src="res/screen/ios/Default@2x~universal~comany~dark.png" /> <!-- with --splashscreen-dark-color -->
    <splash src="res/screen/ios/Default@2x~universal~comcom~dark.png" /> <!-- with --splashscreen-dark-color -->
    <splash src="res/screen/ios/Default@3x~universal~anyany~dark.png" /> <!-- with --splashscreen-dark-color -->
    <splash src="res/screen/ios/Default@3x~universal~anycom~dark.png" /> <!-- with --splashscreen-dark-color -->
    <splash src="res/screen/ios/Default@3x~universal~comany~dark.png" /> <!-- with --splashscreen-dark-color -->
</platform>
```
