---
title: Configuring Cordova
desc: (@quasar/app-vite) How to manage your Cordova apps with Quasar CLI.
related:
  - /quasar-cli-vite/quasar-config-file
---

Quasar CLI selects the Cordova build target through the mode and target arguments passed to `quasar dev` and `quasar build`. Cordova CLI manages the native project under `/src-cordova`.

There are two configuration files of great importance to your mobile apps. We'll go over each one.

## config.xml

The most important config file for your mobile app is `/src-cordova/config.xml`. The `/src-cordova` folder is a Cordova project, so please refer to [Cordova documentation](https://cordova.apache.org/docs/en/latest/) in order to understand what each file from there does. But for now, have a few moments to read about [config.xml](https://cordova.apache.org/docs/en/latest/config_ref/).

Some properties from this file will get overwritten as we'll see in next section.

## quasar.config file

Quasar CLI updates the app version, description, and optional Android version code in `config.xml` before Cordova runs. The widget `id` is set when the Cordova project is created and is not rewritten from the Quasar config.

For determining the values for each of the properties mentioned above, Quasar CLI:

1. Looks in the `/quasar.config` file for a "cordova" Object. Does it have "version", "description" and/or "androidVersionCode"? If yes, it will use them.
2. If not, it falls back to `/package.json > version` and `/package.json > description`.

```ts /quasar.config file > cordova
cordova: {
  /** If not present, will look for `package.json > version` */
  version?: string;
  /** If not present, will look for `package.json > description` */
  description?: string;
  androidVersionCode?: string;

  /**
   * Function to return the Cordova build command parameters that
   * will be executed after the UI has compiled.
   *
   * @param context.debug - True if in debug mode
   * @param context.target - The target platform
   * @returns Array of strings (command parameters)
   *
   * @default: [ 'build', '--debug'/'--release', '--device', 'ios'/'android' ]
   * @example: ({ debug, target }) => [ 'build', `--${debug ? 'debug' : 'release'}`, '--device', target ]
   */
  getCordovaBuildParams?: (context: { debug: boolean; target: string }) => string[];

  /**
   * Function to return the Cordova output folder after the "cordova build"
   * command is executed.
   * The relative to /src-cordova path is used to copy the Cordova output
   * to the /dist folder.
   *
   * @param context.debug - True if in debug mode
   * @param context.target - The target platform
   * @returns string | string[] | undefined - (relative path(s) from /src-cordova)
   *
   * @default ios: platforms/ios/build/... and android: platforms/android/app/build/outputs
   * @example:
   *    ({ debug, target }) => {
   *       return target === 'ios'
   *          ? `platforms/ios/build/${debug ? 'Debug' : 'Release'}-iphoneos`
   *          : 'platforms/android/app/build/outputs'
   *    }
   * @example: (when interested in only one platform, leaving the other to the default value)
   *    ({ debug, target }) => {
   *       if (target === 'ios') {
   *          return `platforms/ios/build/${debug ? 'Debug' : 'Release'}-iphoneos`
   *       }
   *    }
   * @example: ()
   *    ({ debug, target }) => {
   *       if (target === 'ios') {
   *          // try these two folders
   *          return [ 'platforms/ios/build/device', 'platforms/ios/build/emulator' ]
   *       }
   *    }
   */
  getCordovaBuildOutputFolder?: (context: { debug: boolean; target: string }) => string | string[] | undefined;
}
```

Other options you can configure:

```ts /quasar.config file
return {
  framework: {
    config: {
      cordova: {
        // add the dynamic top padding on iOS mobile devices
        iosStatusBarPadding?: boolean,

        // account for Android safe areas (defaults to true)
        androidStatusBarPadding?: boolean,

        // Quasar handles app exit on mobile phone back button.
        backButtonExit?: boolean | '*' | ['/login', '/home', '/my-page'],

        // On the other hand, the following completely
        // disables Quasar's back button management.
        backButton?: boolean
      }
    }
  }
}
```

Should you want to tamper with the Vite config for UI in /src:

```js /quasar.config file
export default defineConfig(ctx => {
  return {
    build: {
      extendViteConf(viteConf) {
        if (ctx.mode.cordova) {
          // do something with viteConf
          // or return an object to deeply merge with current viteConf
        }
      }
    }
  }
})
```
