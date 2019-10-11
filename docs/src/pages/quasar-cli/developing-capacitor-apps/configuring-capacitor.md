---
title: Configuring Capacitor
desc: How to manage your Capacitor apps with Quasar CLI.
related:
  - /quasar-cli/quasar-conf-js
---

We'll be using Quasar CLI to develop and build a Mobile App. The difference between building a SPA, PWA, Electron App or a Mobile App is simply determined by the "mode" parameter in "quasar dev" and "quasar build" commands.

There are two configuration files of great importance to your mobile apps. We'll go over each one.

## capacitor.config.json
The most important config file for your mobile app is `/src-capacitor/capacitor.config.json`. The `/src-capacitor` folder is a Capacitor project, so please refer to [Capacitor documentation](https://capacitor.ionicframework.com) in order to understand what each file from there does. But for now, have a few moments to read about [capacitor.config.json](https://capacitor.ionicframework.com/docs/basics/configuring-your-app/).

Some properties from this file will get overwritten as we'll see in next section.

## quasar.conf.js
Quasar CLI helps you in setting some properties of the mobile Apps automatically, like the app name, app id, version, description and so on. This is for convenience so you'll be able to have a single point where, for example, you change the version of your app, not multiple files that you need to simultaneously touch which is error prone.

For determining the values for each of the properties mentioned above, Quasar CLI:
1. Looks in `/quasar.conf.js` for a "capacitor" Object. Does it have "id", "appName", "version", "description"? If yes, it will use them.
2. If not, then it looks into your `/package.json` for "capacitorId" (or "cordovaId" for carefree Quasar CLI upgrades), "name", "version" and "description" fields.

Other options you can configure:

```js
return {
  framework: {
    config: {
      capacitor: {
        iosStatusBarPadding: true/false, // add the dynamic top padding on iOS mobile devices
      }
    }
  }
}
```
