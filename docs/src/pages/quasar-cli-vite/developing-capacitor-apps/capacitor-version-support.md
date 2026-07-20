---
title: Capacitor versions
desc: (@quasar/app-vite) Supported Capacitor versions in Quasar. How to upgrade to a newer Capacitor version.
---

The officially supported versions of Capacitor are v5+.

## Upgrading Capacitor

If you previously used a lower version of Capacitor and you want to upgrade to a newer version, then:

Follow Capacitor's official [upgrade guide](https://capacitorjs.com/docs/updating/8-0) for the target major version, using the documentation version selector when upgrading to an older supported major. The guides cover dependency updates, native project migrations, and required toolchain changes that cannot be handled safely by changing package versions alone.

Before upgrading, commit or back up `/src-capacitor`, including any native changes. Run the migration commands from `/src-capacitor`, use the lockfile and package manager already selected by the project, and verify both native targets after the upgrade.

It would also be wise to check the changelog of Capacitor itself to see what breaking changes it has.

## Capacitor v8

::: warning Requirements

- Node v22.22+
- Xcode 26+ (for iOS)
- Xcode Command Line Tools
- iOS 15+
- Android Studio Otter 2025.2.1+
- Android SDK (minimum API 24; compile and target API 36)

:::

Capacitor v8 uses Swift Package Manager by default when adding a new iOS platform. CocoaPods is only required when maintaining or explicitly creating a CocoaPods-based iOS project.

Assuming that you've installed Capacitor mode already, this is how your dependencies in `/src-capacitor/package.json` should look like:

```json /src-capacitor/package.json
{
  "dependencies": {
    "@capacitor/app": "^8.0.0",
    "@capacitor/cli": "^8.0.0",
    "@capacitor/core": "^8.0.0",
    "@capacitor/splash-screen": "^8.0.0"
  }
}
```

The `@capacitor/app` and `@capacitor/splash-screen` plugins are optional, but Quasar can provide additional UI behavior when they are installed.

## Capacitor v7

::: warning Requirements

- Xcode 16+ (for iOS)
- Xcode Command Line Tools
- Homebrew
- CocoaPods
- Android Studio 2024.2.1+
- Android SDK (API 23+)

:::

Assuming that you've installed Capacitor mode already, this is how your dependencies in `/src-capacitor/package.json` should look like:

```json /src-capacitor/package.json
{
  "dependencies": {
    "@capacitor/app": "^7.0.0",
    "@capacitor/cli": "^7.0.0",
    "@capacitor/core": "^7.0.0",
    "@capacitor/splash-screen": "^7.0.0"
  }
}
```

The `@capacitor/app` and `@capacitor/splash-screen` plugins are optional, but Quasar can provide additional UI behavior when they are installed.

## Capacitor v6

::: warning Requirements

- Xcode 15+ (for iOS)
- Android Studio Jellyfish 2023.3.1.18 or newer (for Android)

:::

Assuming that you've installed Capacitor mode already, this is how your dependencies in `/src-capacitor/package.json` should look like:

```json /src-capacitor/package.json
{
  "dependencies": {
    "@capacitor/app": "^6.0.0",
    "@capacitor/cli": "^6.0.0",
    "@capacitor/core": "^6.0.0",
    "@capacitor/splash-screen": "^6.0.0"
  }
}
```

The `@capacitor/app` and `@capacitor/splash-screen` plugins are optional, but Quasar can provide additional UI behavior when they are installed.

## Capacitor v5

::: warning Requirements

- Xcode 14.1+ (for iOS)
- Android Studio Flamingo 2022.2.1 or newer (for Android)

:::

Assuming that you've installed Capacitor mode already, this is how your dependencies in `/src-capacitor/package.json` should look like:

```json /src-capacitor/package.json
{
  "dependencies": {
    "@capacitor/app": "^5.0.0",
    "@capacitor/cli": "^5.0.0",
    "@capacitor/core": "^5.0.0",
    "@capacitor/splash-screen": "^5.0.0"
  }
}
```

The `@capacitor/app` and `@capacitor/splash-screen` plugins are optional, but Quasar can provide additional UI behavior when they are installed.
