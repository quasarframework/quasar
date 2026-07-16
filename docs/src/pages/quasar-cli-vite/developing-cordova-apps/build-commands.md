---
title: Cordova Build Commands
desc: (@quasar/app-vite) The Quasar CLI list of commands when developing or building a hybrid mobile app with Cordova.
---

Before we dive in, make sure you got the Cordova CLI installed.

```tabs
<<| bash PNPM |>>
pnpm add -g cordova
<<| bash Yarn |>>
yarn global add cordova
<<| bash NPM |>>
npm i -g cordova
<<| bash Bun |>>
bun install -g cordova
```

## Developing

```bash
quasar dev -m cordova -T [ios|android]

# ..or the longer form:
quasar dev --mode cordova --target [ios|android]

# passing extra parameters and/or options to
# underlying "cordova" executable:
quasar dev -m cordova -T ios -- some params --and options --here
# when on Windows and using Powershell:
quasar dev -m cordova -T ios '--' some params --and options --here
```

It will open the IDE (Android Studio / Xcode) and from there you can manually select the emulator (or multiple ones simultaneously!) and install the dev app on it/them. You can also run the dev app on a real mobile/tablet device.

::: warning
Do not accept Android Studio upgrade suggestions automatically. Confirm that the proposed Java, Gradle, Android Gradle Plugin, and SDK versions are supported by the installed `cordova-android` version.

<img src="https://cdn.quasar.dev/img/gradle-upgrade-notice.png" alt="Gradle upgrade" class="q-my-md rounded-borders" style="max-width: 350px">

If you encounter any IDE errors then click on File > Invalidate caches and restart.

<img src="https://cdn.quasar.dev/img/gradle-invalidate-cache.png" alt="Gradle upgrade" class="q-mt-md rounded-borders" style="max-width: 350px">

:::

In order for you to be able to develop on a device emulator or directly on a phone (with Hot Module Reload included), Quasar CLI follows these steps:

1. Detects your machine's external IP address. If there are multiple such IPs detected, then it asks you to choose one. If you'll be using a mobile phone to develop then choose the IP address of your machine that's pingable from the phone/tablet.
2. It starts up a development server on your machine.
3. It temporarily changes the `<content/>` tag in `/src-cordova/config.xml` to point to the IP previously detected. This allows the app to connect to the development server.
4. It runs `cordova prepare` for the selected platform.
5. It opens Android Studio or Xcode, where you select and run an emulator, simulator, or connected device.
6. When the Cordova development process stops, Quasar reverts its temporary changes to `/src-cordova/config.xml`.

::: danger
When developing on a physical device, the selected address of the development machine must be reachable from that device. Ensure the firewall permits the development-server port and that the network does not isolate connected clients.
:::

## Building for production

```bash
quasar build -m cordova -T [android|ios]

# ..or the longer form:
quasar build --mode cordova --target [ios|android]

# this skips .app or .apk creation and just fills in /src-cordova/www
quasar build -m cordova -T [ios|android] --skip-pkg

# passing extra parameters and/or options to
# underlying "cordova" executable:
quasar build -m cordova -T ios -- some params --and options --here
```

- These commands parse and build your `/src` folder then overwrite `/src-cordova/www` then defer to Cordova CLI to trigger the actual native app creation.

- Built packages will be located in `/dist/cordova` unless configured otherwise.

- If you wish to skip the native Cordova build, generate `/src-cordova/www` and run `cordova prepare` only:

```bash
quasar build -m cordova -T [ios|android] --skip-pkg
```

- Should you wish to manually build the final assets using the IDE (Android Studio / Xcode) instead of doing a terminal build, then:

```bash
quasar build -m cordova -T [ios|android] --ide
```

::: warning
Do not accept Android Studio upgrade suggestions automatically. Check the compatibility requirements of the installed Cordova platform before changing the native toolchain.

<img src="https://cdn.quasar.dev/img/gradle-upgrade-notice.png" alt="Gradle upgrade" class="q-my-md rounded-borders" style="max-width: 350px">

If you encounter any IDE errors then click on File > Invalidate caches and restart.

<img src="https://cdn.quasar.dev/img/gradle-invalidate-cache.png" alt="Gradle upgrade" class="q-mt-md rounded-borders" style="max-width: 350px">

:::

If you want a production build with debugging enabled for the UI code:

```bash
quasar build -m cordova -T [ios|android] -d

# ..or the longer form
quasar build -m cordova -T [ios|android] --debug
```

::: tip
Also check `getCordovaBuildParams()` and `getCordovaBuildOutputFolder()` (quasar.config > cordova options) from [Configuring Cordova](/quasar-cli-vite/developing-cordova-apps/configuring-cordova#quasar-config-file) page.
:::
