---
title: Preparation for Capacitor App
desc: What you need to do before developing a Quasar hybrid mobile app with Capacitor.
---

Before we dive in to the actual development, we need to do some preparation work.

## 1. Installation

### Android setup

* You will need to install Android Studio and the Android platform SDK on your machine. You can [download the Android Studio here](https://developer.android.com/studio/index.html) and follow these [installation steps](https://developer.android.com/studio/install.html) afterwards.

* Make sure that after you install the Android SDK you then accept its licenses. Open the terminal and go to the folder where the SDK was installed, in tools/bin and call `sdkmanager --licenses`.

::: warning
The environmental variable `ANDROID_HOME` has been deprecated and replaced with `ANDROID_SDK_ROOT`. Depending on your version of Android Studio you may need one or the other. It doesn't hurt to have both set.
:::

* Add Android installation to your path:

#### Unix (macOS, linux)

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export ANDROID_SDK_ROOT="$HOME/Android/Sdk"
PATH=$PATH:$ANDROID_SDK_ROOT/tools; PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
```

> Please note that sometimes the `/Android/Sdk` folder is added inside `/Library/` inside your user folder. Check your user folder and if the `/Android/` folder is only inside `/Library/` do: `export ANDROID_SDK_ROOT="$HOME/Library/Android/Sdk"` or `export ANDROID_HOME="$HOME/Library/Android/Sdk"` instead.

#### Windows

```bash
setx ANDROID_HOME "%USERPROFILE%\AppData\Local\Android\Sdk"
setx ANDROID_SDK_ROOT "%USERPROFILE%\AppData\Local\Android\Sdk"
setx path "%path%;%ANDROID_SDK_ROOT%\tools;%ANDROID_SDK_ROOT%\platform-tools"
```

- Start Android studio (check the executable in the folder that you installed it in). Next step is to install the individual SDKs:

- Open the "Configure" menu at the bottom of the window:

  ![SDK manager](https://cdn.quasar.dev/img/Android-Studio-SDK-Menu.png 'SDK manager')

- Select the desired SDKs and click on "Apply" to install the SDKs.

  ![SDK selection](https://cdn.quasar.dev/img/Android-Studio-SDK-selection.png 'SDK selection')

### iOS setup

You will need a macOS with [Xcode](https://developer.apple.com/xcode/) installed. After you've installed it, open Xcode in order to get the license prompt. Accept the license, then you can close it.

## 2. Add Capacitor Quasar Mode

In order to develop/build a Mobile app, we need to add the Capacitor mode to our Quasar project. This will use the Capacitor CLI to generate a Capacitor project in `/src-capacitor` folder.

```bash
$ quasar mode add capacitor
```

## 3. Start Developing

To start a dev server with HMR, run the command below:

```bash
$ quasar dev -m capacitor -T [android|ios]
```

Once the dev server is ready, your IDE will open (Android Studio or Xcode) and from there you can manually select the emulator (or multiple ones simultaneously!) and install the dev app on it/them. You can also run the dev app on a connected mobile/tablet device.

::: warning
In Android Studio, you will be greeted with a message recommending to upgrade the Gradle version. **DO NOT UPGRADE GRADLE** as it will break the Capacitor project. Same goes for any other requested upgrades.

<img src="https://cdn.quasar.dev/img/gradle-upgrade-notice.png" alt="Gradle upgrade" class="q-my-md fit rounded-borders" style="max-width: 350px">

If you encounter any IDE errors then click on File > Invalidate caches and restart.

<img src="https://cdn.quasar.dev/img/gradle-invalidate-cache.png" alt="Gradle upgrade" class="q-mt-md fit rounded-borders" style="max-width: 350px">

:::
