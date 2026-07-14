---
title: Preparation for Cordova App
desc: (@quasar/app-vite) What you need before developing a Quasar hybrid mobile app with Cordova.
---

## Install Cordova CLI

Quasar invokes the `cordova` executable directly, so install Cordova CLI globally using your selected Node package manager:

```tabs
<<| bash PNPM |>>
pnpm add --global cordova
<<| bash NPM |>>
npm install --global cordova
```

Verify the installation:

```bash
cordova --version
```

## Android setup

Install [Android Studio](https://developer.android.com/studio) and the Android SDK components required by the version of `cordova-android` in your project. Cordova's [Android platform guide](https://cordova.apache.org/docs/en/latest/guide/platforms/android/) lists the compatible Java, Gradle, Android Gradle Plugin, SDK, and build-tools versions.

Set `ANDROID_HOME` to the Android SDK location and add the current command-line tools and platform tools to `PATH`:

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools"
```

On macOS, the SDK is usually under `$HOME/Library/Android/sdk`. On Windows, it is commonly under `%LOCALAPPDATA%\Android\Sdk`.

::: tip
`ANDROID_SDK_ROOT` is deprecated. If an older tool still requires it, set it to the same location as `ANDROID_HOME`.
:::

Accept the installed SDK licenses and verify the toolchain:

```bash
sdkmanager --licenses
cordova requirements android
```

## iOS setup

iOS development requires macOS and a compatible [Xcode](https://developer.apple.com/xcode/) installation. Open Xcode once to finish installing components and accept its license. Check the [Cordova iOS platform guide](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/) for the requirements of the installed `cordova-ios` version.

## Add Cordova mode

Add the Cordova project under `/src-cordova`:

```bash
quasar mode add cordova
```

Quasar installs Android or iOS on demand when you first develop or build that target. To add one manually:

```bash
cd src-cordova
cordova platform add [android|ios]
```

Treat `/src-cordova` as a native Cordova project and commit any intended configuration, plugin, resource, or native changes. The `/src-cordova/www` directory is generated and overwritten by Quasar builds.

## Start developing

```bash
quasar dev -m cordova -T [android|ios]
```

Quasar starts the development server, prepares the native project, and opens Android Studio or Xcode. Select an emulator, simulator, or connected device from the IDE.

Do not accept native toolchain upgrade suggestions automatically. First confirm that the proposed Java, Gradle, Android, or Xcode versions are supported by the installed Cordova platform version.
