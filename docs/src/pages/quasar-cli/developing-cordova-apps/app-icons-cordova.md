---
title: App Icons for Cordova
desc: How to manage the app icons for a Quasar hybrid mobile app with Cordova.
---


Cordova is one of the most complicated of all of the build targets as far as icons go, because not only do you need to place the icons in specific folders, you also need to register them in the `src-cordova/config.xml` file. Further, if you are using splashscreens (which you should), you will also need to install `cordova-plugin-splashscreen` and register it in your config.xml.

<img src="https://cdn.quasar.dev/img/iconfactory.png" style="float:right;max-width:15%;min-width:240px;padding-top:40px" />

## The Icon Genie

::: tip
We highly recommend using our official [Icon Genie](https://github.com/quasarframework/app-extension-icon-genie/) app extension, because it consumes a source icon and automatically clones, scales, minifies and places the icons in the appropriate directories for you. When you change this source file (or some of the extension's settings) the icons will be automatically rebuilt on the next dev or build command.
:::

## Manual instructions

Unless you are using the Icon Genie app extension, this is what you need to do:

```bash
$ cd src-cordova
$ cordova plugin add cordova-plugin-splashscreen
$ cordova plugin save
$ cd ..
```

```
src-cordova/
  config.xml
  res/
    android/
      icon-36-ldpi.png
      icon-48-mdpi.png
      icon-72-hdpi.png
      icon-96-xhdpi.png
      icon-144-xxhdpi.png
      icon-192-xxxhdpi.png
    ios/
      icon.png
      icon-2x.png
      icon-40.png
      icon-40-2x.png
      icon-50.png
      icon-50-2x.png
      icon-60.png
      icon-60-2x.png
      icon-60-3x.png
      icon-72.png
      icon-72-2x.png
      icon-83.5-2x.png
      icon-167.png
      icon-1024.png
    screen/
      android/
        screen-ldpi-landscape.png
        screen-ldpi-portrait.png
        screen-mdpi-landscape.png
        screen-mdpi-portrait.png
        screen-hdpi-landscape.png
        screen-hdpi-portrait.png
        screen-xhdpi-landscape.png
        screen-xhdpi-portrait.png
        screen-xxhdpi-landscape.png
        screen-xxhdpi-portrait.png
        screen-xxxhdpi-landscape.png
        screen-xxxhdpi-portrait.png
      ios/
        screen-ipad-landscape.png
        screen-ipad-landscape-2x.png
        screen-ipad-portrait.png
        screen-ipad-portrait-2x.png
        screen-iphone-portrait.png
        screen-iphone-portrait-2x.png
        screen-iphone-landscape.png
        screen-iphone-landscape-2x.png
        screen-iphone-portrait-568h_2x.png
        Default@2x~universal~anyany.png
```

And here is what your config.xml should look like:

```xml
<platform name="android">
    <icon density="ldpi" src="res/android/icon-36-ldpi.png" />
    <icon density="mdpi" src="res/android/icon-48-mdpi.png" />
    <icon density="hdpi" src="res/android/icon-72-hdpi.png" />
    <icon density="xhdpi" src="res/android/icon-96-xhdpi.png" />
    <icon density="xxhdpi" src="res/android/icon-144-xxhdpi.png" />
    <icon density="xxxhdpi" src="res/android/icon-192-xxxhdpi.png" />
    <splash density="land-ldpi" src="res/screen/android/screen-ldpi-landscape.png" />
    <splash density="port-ldpi" src="res/screen/android/screen-ldpi-portrait.png" />
    <splash density="land-mdpi" src="res/screen/android/screen-mdpi-landscape.png" />
    <splash density="port-mdpi" src="res/screen/android/screen-mdpi-portrait.png" />
    <splash density="land-hdpi" src="res/screen/android/screen-hdpi-landscape.png" />
    <splash density="port-hdpi" src="res/screen/android/screen-hdpi-portrait.png" />
    <splash density="land-xhdpi" src="res/screen/android/screen-xhdpi-landscape.png" />
    <splash density="port-xhdpi" src="res/screen/android/screen-xhdpi-portrait.png" />
    <splash density="land-xxhdpi" src="res/screen/android/screen-xxhdpi-landscape.png" />
    <splash density="port-xxhdpi" src="res/screen/android/screen-xxhdpi-portrait.png" />
    <splash density="land-xxxhdpi" src="res/screen/android/screen-xxxhdpi-landscape.png" />
    <splash density="port-xxxhdpi" src="res/screen/android/screen-xxxhdpi-portrait.png" />
</platform>
<platform name="ios">
    <icon height="57" src="res/ios/icon.png" width="57" />
    <icon height="114" src="res/ios/icon-2x.png" width="114" />
    <icon height="40" src="res/ios/icon-40.png" width="40" />
    <icon height="80" src="res/ios/icon-40-2x.png" width="80" />
    <icon height="50" src="res/ios/icon-50.png" width="50" />
    <icon height="100" src="res/ios/icon-50-2x.png" width="100" />
    <icon height="60" src="res/ios/icon-60.png" width="60" />
    <icon height="120" src="res/ios/icon-60-2x.png" width="120" />
    <icon height="180" src="res/ios/icon-60-3x.png" width="180" />
    <icon height="72" src="res/ios/icon-72.png" width="72" />
    <icon height="144" src="res/ios/icon-72-2x.png" width="144" />
    <icon height="167" src="res/ios/icon-83.5-2x.png" width="167" />
    <icon height="167" src="res/ios/icon-167.png" width="167" />
    <icon height="1024" src="res/ios/icon-1024.png" width="1024" />
    <splash height="768" src="res/screen/ios/screen-ipad-landscape.png" width="1024" />
    <splash height="1536" src="res/screen/ios/screen-ipad-landscape-2x.png" width="2048" />
    <splash height="1024" src="res/screen/ios/screen-ipad-portrait.png" width="768" />
    <splash height="2048" src="res/screen/ios/screen-ipad-portrait-2x.png" width="1536" />
    <splash height="320" src="res/screen/ios/screen-iphone-landscape.png" width="480" />
    <splash height="640" src="res/screen/ios/screen-iphone-landscape-2x.png" width="960" />
    <splash height="480" src="res/screen/ios/screen-iphone-portrait.png" width="320" />
    <splash height="960" src="res/screen/ios/screen-iphone-portrait-2x.png" width="640" />
    <splash height="1136" src="res/screen/ios/screen-iphone-portrait-568h_2x.png" width="640" />
    <splash height="2732" src="res/screen/ios/Default@2x~universal~anyany.png" width="2732" />
</platform>
<plugin name="cordova-plugin-splashscreen" spec="^5.0.2" />
```
