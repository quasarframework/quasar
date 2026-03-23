---
title: Configuring Cordova
desc: (@quasar/app-webpack) How to manage your Cordova apps with Quasar CLI.
related:
  - /quasar-cli-webpack/quasar-config-file
---

We'll be using Quasar CLI (and Cordova CLI) to develop and build a Mobile App. The difference between building a SPA, PWA, Electron App or a Mobile App is simply determined by the "mode" parameter in "quasar dev" and "quasar build" commands.

There are two configuration files of great importance to your mobile apps. We'll go over each one.

## config.xml

The most important config file for your mobile app is `/src-cordova/config.xml`. The `/src-cordova` folder is a Cordova project, so please refer to [Cordova documentation](https://cordova.apache.org/docs/en/latest/) in order to understand what each file from there does. But for now, have a few moments to read about [config.xml](https://cordova.apache.org/docs/en/latest/config_ref/).

Some properties from this file will get overwritten as we'll see in next section.

## quasar.config file

Quasar CLI helps you in setting some properties of the mobile Apps automatically (from config.xml): the Cordova "id", app version, description and android-versionCode. This is for convenience so you'll be able to have a single point where, for example, you change the version of your app, not multiple files that you need to simultaneously touch which is error prone.

For determining the values for each of the properties mentioned above, Quasar CLI:

1. Looks in the `/quasar.config` file for a "cordova" Object. Does it have "version", "description" and/or "androidVersionCode"? If yes, it will use them.
2. If not, then it looks into your `/package.json` for "cordovaId", "version" and "description" fields.

```js /quasar.config file > cordova
cordova: {
  /** If not present, will look for `package.json > version` */
  version?: string;
  /** If not present, will look for `package.json > description` */
  description?: string;
  androidVersionCode?: string;
  /**
   * Enable Xcode modern build even if after considering iOS-Cordova issues.
   * You can enable it if you know what you are doing,
   *  for example if you want to specify the build type in your “build.json”.
   *
   * @default false
   */
  noIosLegacyBuildFlag?: boolean;

  /**
   * Function to return the Cordova build command parameters that
   * will be executed after the UI has compiled.
   *
   * @param context.debug - True if in debug mode
   * @param context.target - The target platform (ios/android)
   * @returns Array of strings (command parameters)
   *
   * @default: [ 'build', '--debug'/'--release', '--device', 'ios'/'android' ]
   * @example: ({ isDebug, target }) => [ 'build', `--${isDebug ? 'debug' : 'release'}`, '--device', 'target' ]
   */
  getCordovaBuildParams?: (context: { debug: boolean; target: 'ios' | 'android' }) => string[];

  /**
   * Function to return the Cordova output folder after the "cordova build"
   * command is executed.
   * The relative to /src-cordova path is used to copy the Cordova output
   * to the /dist folder.
   *
   * @param context.debug - True if in debug mode
   * @param context.target - The target platform (ios/android)
   * @returns string | string[] | undefined - (relative path(s) from /src-cordova)
   *
   * @default ios: platforms/ios/build/... and android: platforms/android/app/build/outputs
   * @example:
   *    ({ isDebug, target }) => {
   *       return target === 'ios'
   *          ? `platforms/ios/build/${isDebug ? 'Debug' : 'Release'}-iphoneos
   *          : 'platforms/android/app/build/outputs'
   *    }
   * @example: (when interested in only one platform, leaving the other to the default value)
   *    ({ isDebug, target }) => {
   *       if (target === 'ios') {
   *          return `platforms/ios/build/${isDebug ? 'Debug' : 'Release'}-iphoneos`
   *       }
   *    }
   * @example: ()
   *    ({ isDebug, target }) => {
   *       if (target === 'ios') {
   *          // try these two folders
   *          return [ 'platforms/ios/build/device', 'platforms/ios/build/emulator' ]
   *       }
   *    }
   */
  getCordovaBuildOutputFolder?: (context: { debug: boolean; target: 'ios' | 'android' }) => string | string[] | undefined;
}
```

Other options you can configure:

```js /quasar.config file
return {
  framework: {
    config: {
      cordova: {
        // add the dynamic top padding on iOS mobile devices
        iosStatusBarPadding: true / false,

        // Quasar handles app exit on mobile phone back button.
        backButtonExit: true / false / '*' / ['/login', '/home', '/my-page'],

        // On the other hand, the following completely
        // disables Quasar's back button management.
        backButton: true / false
      }
    }
  }
}
```

Should you want to tamper with the Webpack config for UI in /src you have two options:

```js /quasar.config file
build: {
  extendWebpack(webpackCfg) { ... },
  chainWebpack(webpackChain) { ... }
}
```
