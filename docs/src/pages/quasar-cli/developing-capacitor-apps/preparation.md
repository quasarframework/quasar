---
title: Capacitor App Preparation
desc: What you need to do before developing a Quasar hybrid mobile app with Capacitor.
---

Before we dive in to the actual development, we need to do some preparation work.

## 1. Installation

### Android setup

- You will need to install Android Studio and the Android platform SDK on your machine. You can [download the Android Studio here](https://developer.android.com/studio/index.html) and follow these [installation steps](https://developer.android.com/studio/install.html) afterwards.

- Add Android installation to your path:

#### Unix (macOS, linux)

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
PATH=$PATH:$ANDROID_HOME/tools; PATH=$PATH:$ANDROID_HOME/platform-tools
```

> Please note that sometimes the `/Android/Sdk` folder is added inside `/Library/` inside your user folder. Check your user folder and if the `/Android/` folder is only inside `/Library/` do: `export ANDROID_HOME="$HOME/Library/Android/Sdk"` instead.

#### Windows

```bash
setx ANDROID_HOME "%USERPROFILE%\AppData\Local\Android\Sdk"
setx path "%path%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools"
```

- Start Android studio by changing into the folder you installed it in and run `./studio.sh`. Next step is to install the individual SDKs:

- Open the "Configure" menu at the bottom of the window:

  ![SDK manager](https://cdn.quasar.dev/img/Android-Studio-SDK-Menu.png 'SDK manager')

- Select the desired SDKs and click on "Apply" to install the SDKs.

  ![SDK selection](https://cdn.quasar.dev/img/Android-Studio-SDK-selection.png 'SDK selection')

### iOS setup

You will need a macOS with [XCode](https://developer.apple.com/xcode/) installed.

## 2. Add Capacitor Quasar Mode

In order to develop/build a Mobile app, we need to add the Capacitor mode to our Quasar project. This will use the Capacitor CLI to generate a Capacitor project in `/src-capacitor` folder.

```bash
$ quasar mode add capacitor
```

## 3. Start Developing

To start a dev server with HMR, run the following command:

```bash
$ quasar dev -m capacitor -T [android|ios]
```

Once the dev server is ready, your native IDE will open (Android Studio for Android and Xcode for iOS). Run your app here, and it will automatically connect to the dev server.

::: danger
In Android Studio, you will be greeted with a message recommending to upgrade the Gradle version. **DO NOT UPGRADE GRADLE** version as it will currently break the Capacitor project.

<img src="https://cdn.quasar.dev/img/gradle-upgrade-notice.png" alt="Gradle upgrade" class="q-mt-md fit rounded-borders" style="max-width: 350px">
:::
