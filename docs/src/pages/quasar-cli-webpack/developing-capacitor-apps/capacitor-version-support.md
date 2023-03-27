---
title: Capacitor versions
desc: (@quasar/app-webpack) Supported Capacitor versions in Quasar. How to upgrade to a newer Capacitor version.
---

The officially supported versions of Capacitor are v1, v2 and v3.

## Upgrading Capacitor

If you previously used a lower version of Capacitor and you want to upgrade to a newer version, then:

1. Delete the /src-capacitor/ios and /src-capacitor/android folders, but make sure that you are aware of any changes that you made in those folders as you will have to redo them after step 4.
2. Change /src-capacitor/package.json to reflect the correct versions of Capacitor dependencies (you can read them in the next appropriate section related to your desired Capacitor version).
3. Delete yarn.lock/package-lock.json then run `yarn` / `npm install` in /src-capacitor.
4. At this point, you will have Capacitor installed. Now you can run `quasar dev -m capacitor -T [ios|android]` or `quasar build -m capacitor -T [ios|android]` and it will add the upgraded iOS/Android platform that corresponds to your Capacitor version.

It would also be wise to check the changelog of Capacitor itself to see what breaking changes it has.

## Capacitor v3

::: warning Known issue
HTTPS devserver (through quasar.config.js > devServer > https: true) is not **yet** supported. If you are using Capacitor plugins that depend on it, it's better to stay with Capacitor v2 for the moment.
:::

Assuming that you've installed Capacitor mode already, this is how your dependencies in /src-capacitor/package.json should look like:

```
dependencies: {
  "@capacitor/app": "^1.0.0",
  "@capacitor/cli": "^3.0.0",
  "@capacitor/core": "^3.0.0",
  "@capacitor/splash-screen": "^1.0.0"
}
```

The `@capacitor/app` and `@capacitor/splash-screen` are optional, but it helps Quasar with some UI functionality if they are installed.

## Capacitor v2

Assuming that you've installed Capacitor mode already, this is how your dependencies in /src-capacitor/package.json should look like:

```
dependencies: {
  "@capacitor/cli": "^2.0.0",
  "@capacitor/core": "^2.0.0"
}
```

## Capacitor v1

Assuming that you've installed Capacitor mode already, this is how your dependencies in /src-capacitor/package.json should look like:

```
dependencies: {
  "@capacitor/cli": "^1.0.0",
  "@capacitor/core": "^1.0.0"
}
```
