---
title: Capacitor versions
desc: (@quasar/app-vite) Supported Capacitor versions in Quasar. How to upgrade to a newer Capacitor version.
---

The officially supported versions of Capacitor are v1 through v5.

## Upgrading Capacitor

If you previously used a lower version of Capacitor and you want to upgrade to a newer version, then:

1. Delete the /src-capacitor/ios and /src-capacitor/android folders, but make sure that you are aware of any changes that you made in those folders as you will have to redo them after step 4.
2. Change /src-capacitor/package.json to reflect the correct versions of Capacitor dependencies (you can read them in the next appropriate section related to your desired Capacitor version).
3. Delete yarn.lock/package-lock.json then run `yarn` / `npm install` in /src-capacitor.
4. At this point, you will have Capacitor installed. Now you can run `quasar dev -m capacitor -T [ios|android]` or `quasar build -m capacitor -T [ios|android]` and it will add the upgraded iOS/Android platform that corresponds to your Capacitor version.

It would also be wise to check the changelog of Capacitor itself to see what breaking changes it has.

## Capacitor v5 <q-badge label="@quasar/app-vite v1.4+" />

::: warning Requirements
* Xcode 14.1+ (for iOS)
* Android Studio Flamingo 2022.2.1 or newer (for Android)
:::

Assuming that you've installed Capacitor mode already, this is how your dependencies in /src-capacitor/package.json should look like:

```
dependencies: {
  "@capacitor/app": "^5.0.0",
  "@capacitor/cli": "^5.0.0",
  "@capacitor/core": "^5.0.0",
  "@capacitor/splash-screen": "^5.0.0"
}
```

The `@capacitor/app` and `@capacitor/splash-screen` are optional, but it helps Quasar with some UI functionality if they are installed.

## Capacitor v4 <q-badge label="@quasar/app-vite v1.4+" />

Assuming that you've installed Capacitor mode already, this is how your dependencies in /src-capacitor/package.json should look like:

```
dependencies: {
  "@capacitor/app": "^4.0.0",
  "@capacitor/cli": "^4.0.0",
  "@capacitor/core": "^4.0.0",
  "@capacitor/splash-screen": "^4.0.0"
}
```

The `@capacitor/app` and `@capacitor/splash-screen` are optional, but it helps Quasar with some UI functionality if they are installed.

## Capacitor v3

::: warning Known issue
HTTPS devserver (through quasar.config.js > devServer > https: true) is not supported. If you are using Capacitor plugins that depend on it, it's better to upgrade to the newer supported Capacitor versions.
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

More info for [Switch to automatic Android plugin loading](https://capacitorjs.com/docs/updating/3-0#switch-to-automatic-android-plugin-loading).

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
