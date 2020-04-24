---
title: App Icons for Cordova
desc: How to manage the app icons for a Quasar hybrid mobile app with Cordova.
---

Cordova is one of the most complicated of all of the build targets as far as icons go, because not only do you need to place the icons in specific folders, you also need to register them in the `src-cordova/config.xml` file. Further, if you are using splashscreens (which you should), you will also need to install `cordova-plugin-splashscreen` and register it in your config.xml.

If you discover one file that is new or missing, please [open an issue](https://github.com/quasarframework/quasar/issues).

<img src="https://cdn.quasar.dev/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px" />

## Icon Genie CLI

::: tip
We highly recommend using the [Icon Genie CLI](/icongenie/introduction), because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When needed, it also tells you what tags you'll need to add to your /src/index.template.html file.
:::

Quickly bootstrap the necessary images with Icon Genie CLI. For a complete list of options, please visit the [Icon Genie CLI](/icongenie/command-list) command list page.

```bash
$ icongenie generate -m cordova -i /path/to/source/icon.png [-b /path/to/background.png]
```

## Manual instructions

Unless you are using the Icon Genie CLI, this is what you need to do:

```bash
$ cd src-cordova
$ cordova plugin add cordova-plugin-splashscreen
$ cordova plugin save
```

```
src-cordova/
  config.xml
  res/
    android/
      ldpi.png     # 36x36
      mdpi.png     # 48x48
      hdpi.png     # 72x72
      xhdpi.png    # 96x96
      xxhdpi.png   # 144x144
      xxxhdpi.png  # 192x192
    ios/
      icon.png          # 57x57
      icon@2x.png       # 144x144
      icon-20@2x.png
      icon-20@3x.png
      icon-29.png
      icon-29@2x.png
      icon-29@3x.png
      icon-40@2x.png
      icon-60@2x.png
      icon-60@3x.png
      icon-20.png
      icon-20@2x.png
      icon-40.png
      icon-50.png
      icon-50@2x.png
      icon-72.png
      icon-72@2x.png
      icon-76.png
      icon-76@2x.png
      icon-83.5@2x.png
      icon-1024.png
      icon-24@2x.png
      icon-27.5@2x.png
      icon-29@2x.png
      icon-29@3x.png
      icon-40@2x.png
      icon-44@2x.png
      icon-50@2x.png
      icon-86@2x.png
      icon-98@2x.pn
    screen/
      android/
        splash-land-ldpi.png     # 320x200
        splash-port-ldpi.png     # 200x320
        splash-land-mdpi.png     # 480x320
        splash-port-mdpi.png     # 320x480
        splash-land-hdpi.png     # 800x480
        splash-port-hdpi.png     # 480x800
        splash-land-xhdpi.png    # 1280x720
        splash-port-xhdpi.png    # 720x1280
        splash-land-xxhdpi.png   # 1600x960
        splash-port-xxhdpi.png   # 960x1600
        splash-land-xxxhdpi.png  # 1920x1280
        splash-port-xxxhdpi.png  # 1280x1920
      ios/
        Default@2x~iphone~comcom.png
        Default@2x~iphone~comany.png
        Default@2x~iphone~anyany.png
        Default@3x~iphone~anycom.png
        Default@3x~iphone~comany.png
        Default@3x~iphone~anyany.png
        Default@2x~ipad~comany.png
        Default@2x~ipad~anyany.png
```

And here is part of what your config.xml should look like:

```xml
<platform name="android">
    <icon density="ldpi" src="res/android/ldpi.png" />
    <icon density="mdpi" src="res/android/mdpi.png" />
    <icon density="xxxhdpi" src="res/android/xxxhdpi.png" />
    <splash density="land-ldpi" src="res/screen/android/splash-land-ldpi.png" />
    <splash density="port-ldpi" src="res/screen/android/splash-port-ldpi.png" />
    <splash density="land-mdpi" src="res/screen/android/splash-land-mdpi.png" />
    <icon density="hdpi" src="res/android/hdpi.png" />
    <icon density="xxhdpi" src="res/android/xxhdpi.png" />
    <splash density="port-mdpi" src="res/screen/android/splash-port-mdpi.png" />
    <splash density="land-hdpi" src="res/screen/android/splash-land-hdpi.png" />
    <splash density="land-xxhdpi" src="res/screen/android/splash-land-xxhdpi.png" />
    <splash density="port-xxhdpi" src="res/screen/android/splash-port-xxhdpi.png" />
    <splash density="land-xxxhdpi" src="res/screen/android/splash-land-xxxhdpi.png" />
    <splash density="port-xxxhdpi" src="res/screen/android/splash-port-xxxhdpi.png" />
    <icon density="xhdpi" src="res/android/xhdpi.png" />
    <splash density="port-hdpi" src="res/screen/android/splash-port-hdpi.png" />
    <splash density="land-xhdpi" src="res/screen/android/splash-land-xhdpi.png" />
    <splash density="port-xhdpi" src="res/screen/android/splash-port-xhdpi.png" />
</platform>
<platform name="ios">
    <icon height="57" src="res/ios/icon.png" width="57" />
    <icon height="114" src="res/ios/icon@2x.png" width="114" />
    <splash src="res/screen/ios/Default@2x~iphone~comcom.png" />
    <icon height="60" src="res/ios/icon-20@3x.png" width="60" />
    <icon height="29" src="res/ios/icon-29.png" width="29" />
    <icon height="58" src="res/ios/icon-29@2x.png" width="58" />
    <icon height="87" src="res/ios/icon-29@3x.png" width="87" />
    <icon height="80" src="res/ios/icon-40@2x.png" width="80" />
    <icon height="120" src="res/ios/icon-60@2x.png" width="120" />
    <icon height="180" src="res/ios/icon-60@3x.png" width="180" />
    <icon height="20" src="res/ios/icon-20.png" width="20" />
    <icon height="40" src="res/ios/icon-20@2x.png" width="40" />
    <icon height="100" src="res/ios/icon-50@2x.png" width="100" />
    <icon height="72" src="res/ios/icon-72.png" width="72" />
    <icon height="144" src="res/ios/icon-72@2x.png" width="144" />
    <icon height="76" src="res/ios/icon-76.png" width="76" />
    <icon height="152" src="res/ios/icon-76@2x.png" width="152" />
    <icon height="167" src="res/ios/icon-83.5@2x.png" width="167" />
    <icon height="1024" src="res/ios/icon-1024.png" width="1024" />
    <icon height="48" src="res/ios/icon-24@2x.png" width="48" />
    <icon height="55" src="res/ios/icon-27.5@2x.png" width="55" />
    <icon height="88" src="res/ios/icon-44@2x.png" width="88" />
    <icon height="172" src="res/ios/icon-86@2x.png" width="172" />
    <icon height="196" src="res/ios/icon-98@2x.png" width="196" />
    <splash src="res/screen/ios/Default@2x~iphone~anyany.png" />
    <splash src="res/screen/ios/Default@3x~iphone~anyany.png" />
    <splash src="res/screen/ios/Default@3x~iphone~anycom.png" />
    <splash src="res/screen/ios/Default@3x~iphone~comany.png" />
    <splash src="res/screen/ios/Default@2x~ipad~anyany.png" />
    <splash src="res/screen/ios/Default@2x~ipad~comany.png" />
    <icon height="40" src="res/ios/icon-40.png" width="40" />
    <icon height="50" src="res/ios/icon-50.png" width="50" />
    <splash src="res/screen/ios/Default@2x~iphone~comany.png" />
    <splash src="res/screen/ios/Default-Landscape-2436h.png" />
    <splash src="res/screen/ios/Default@2x~iphone~anyany" />
    <splash src="res/screen/ios/Default@2x~iphone~comany" />
    <splash src="res/screen/ios/Default@2x~iphone~comcom" />
    <splash src="res/screen/ios/Default@3x~iphone~anyany" />
    <splash src="res/screen/ios/Default@3x~iphone~anycom" />
    <splash src="res/screen/ios/Default@3x~iphone~comany" />
    <splash src="res/screen/ios/Default@2x~ipad~anyany" />
    <splash src="res/screen/ios/Default@2x~ipad~comany" />
</platform>
```
