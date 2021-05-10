---
title: Capacitor versions
desc: Supported Capacitor versions in Quasar. How to upgrade to a newer Capacitor version.
---

The officially supported versions of Capacitor are v1, v2 and v3.

## Setting up Capacitor v3

::: tip
You will need `quasar` v1.15.5+ and `@quasar/app` v2.2.0+.
:::

::: warning Known issue
HTTPS devserver (through quasar.conf.js > devServer > https: true) is not **yet** supported. If you are using Capacitor plugins that depend on it, it's better to stay with Capacitor v2 for the moment.
:::

Assuming that you've installed Capacitor mode already, this is how your dependencies in /src-capacitor/package.json should look like:

```
dependencies: {
  "@capacitor/cli": "^3.0.0-beta.1",
  "@capacitor/core": "^3.0.0-beta.1",
  "@capacitor/app": "^0.3.3",
  "@capacitor/splash-screen": "^0.3.3"
}
```

The `@capacitor/app` and `@capacitor/splash-screen` are optional, but it helps Quasar with some UI functionality if they are installed.

## Setting up Capacitor v2

Assuming that you've installed Capacitor mode already, this is how your dependencies in /src-capacitor/package.json should look like:

```
dependencies: {
  "@capacitor/cli": "^2.0.0",
  "@capacitor/core": "^2.0.0"
}
```

## Setting up Capacitor v1

Assuming that you've installed Capacitor mode already, this is how your dependencies in /src-capacitor/package.json should look like:

```
dependencies: {
  "@capacitor/cli": "^1.0.0",
  "@capacitor/core": "^1.0.0"
}
```
