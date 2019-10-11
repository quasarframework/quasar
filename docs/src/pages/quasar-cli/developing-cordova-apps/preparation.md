---
title: Cordova App Preparation
desc: What you need to do before developing a Quasar hybrid mobile app with Cordova.
---
Before we dive in to the actual development, we need to do some preparation work.

## 1. Installation
First step is to make sure you got the Cordova CLI installed and the necessary SDKs.

```bash
$ npm install -g cordova
```

### Android setup

* After this step you will need to install the Android platform SDK on your machine. You can [download the Android Studio here](https://developer.android.com/studio/index.html) and follow these [installation steps](https://developer.android.com/studio/install.html) afterwards.

* Make sure that after you install the Android SDK you then accept its licenses. Open the terminal and go to the folder where the SDK was installed, in tools/bin and call `sdkmanager --licenses`.

* Add Android installation to your path:

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

* Start Android studio by changing into the folder you installed it in and run `./studio.sh`. Next step is to install the individual SDKs:

* Open the "Configure" menu at the bottom of the window:

  ![SDK manager](https://cdn.quasar.dev/img/Android-Studio-SDK-Menu.png "SDK manager")

* Select the desired SDKs. As per August 2018 Cordova supports 5.0 and up and click on "Apply" to install the SDKs.

  ![SDK selection](https://cdn.quasar.dev/img/Android-Studio-SDK-selection.png "SDK selection")

### iOS setup

You will need a macOS with [Xcode](https://developer.apple.com/xcode/) installed. After you've installed it, open Xcode in order to get the license prompt. Accept the license, then you can close it.

## 2. Add Cordova Quasar Mode
In order to develop/build a Mobile app, we need to add the Cordova mode to our Quasar project. What this does is that it uses Cordova CLI to generate a Cordova project in `/src-cordova` folder. `/src-cordova/www` folder will be overwritten each time you build.

```bash
$ quasar mode add cordova
```

## 3. Add Platform
To switch to the cordova project, type:

```
$ cd src-cordova
```

Target platforms get installed on demand by Quasar CLI. However, if you want to add a platform manually, type:

```
$ cordova platform add [android|ios]
```

To verify that everything is in order, type:

```bash
$ cordova requirements
```

> On some newer Debian-based operating systems you might face a very persistent problem when running `cordova requirements`. Please see the ["Android SDK not found" after installation](/quasar-cli/developing-cordova-apps/troubleshooting-and-tips#Android-SDK-not-found-after-installation-of-the-SDK) section for assistance.

### Switching to iOS WkWebView

Switching to WKWebView is highly recommended (but optional!) as UIWebView has been deprecated in iOS 12.0 as described in this Cordova blog post: [https://cordova.apache.org/news/2018/08/01/future-cordova-ios-webview.html](https://cordova.apache.org/news/2018/08/01/future-cordova-ios-webview.html).

**However, choose wisely if you want to replace the default webview. Each comes with its own caveats.** Make sure that you visit the link above.

#### Option 1: Ionic Webview Plugin

1. Install Ionic Webview Plugin

```bash
# from /src-cordova
$ cordova plugin add cordova-plugin-ionic-webview
```

2. Add ScrollEnabled Preference to Config.xml

```xml
<platform name="ios">
  <preference name="ScrollEnabled" value="true" />
</platform>
```

3. Consult Ionic Docs for caveats on WkWebViewPlugin
  * [https://beta.ionicframework.com/docs/building/webview](https://beta.ionicframework.com/docs/building/webview)
  * [https://github.com/ionic-team/cordova-plugin-ionic-webview](https://github.com/ionic-team/cordova-plugin-ionic-webview)

#### Option 2: Cordova WkWebviewEngine Plugin

1. Install Cordova WkWebviewEngine Plugin

```bash
# from /src-cordova
$ cordova plugin add cordova-plugin-wkwebview-engine
```

2. For caveats and more info, visit: [https://github.com/apache/cordova-plugin-wkwebview-engine](https://github.com/apache/cordova-plugin-wkwebview-engine)

## 4. Start Developing
If you want to jump right in and start developing, you can skip step #2 and #3 commands and issue one of the commands below. If you have a mobile/tablet device connected to your machine, you can also run the dev app on it instead of in an emulator.

```bash
$ quasar dev -m cordova -T [android|ios]

# passing extra parameters and/or options to
# underlying "cordova" executable:
$ quasar dev -m ios -- some params --and options --here
```

This will add Cordova mode and project automatically, if it is missing.

However, if you wish to open the IDE (Android Studio / Xcode) and from there to manually select the emulator (or multiple ones simultaneously!) to run the dev app on it/them:

```bash
$ quasar dev -m [ios|android] --ide
```

::: warning
In Android Studio, you will be greeted with a message recommending to upgrade the Gradle version. **DO NOT UPGRADE GRADLE** as it will break the Cordova project. Same goes for any other requested upgrades.

<img src="https://cdn.quasar.dev/img/gradle-upgrade-notice.png" alt="Gradle upgrade" class="q-my-md fit rounded-borders" style="max-width: 350px">

If you encounter any IDE errors then click on File > Invalidate caches and restart.

<img src="https://cdn.quasar.dev/img/gradle-invalidate-cache.png" alt="Gradle upgrade" class="q-mt-md fit rounded-borders" style="max-width: 350px">
:::
