---
title: Capacitor Build Commands
---

[Quasar CLI](/quasar-cli/installation) makes it incredibly simple to develop or build the final distributables from your source code.

## Developing

```bash
$ quasar dev -m capacitor -T [ios|android]

# ..or the longer form:
$ quasar dev --mode capacitor --target [ios|android]
```

In order for you to be able to develop on a device emulator or directly on a phone (with Hot Module Reload included), Quasar CLI follows these steps:

1. Detects your machine's external IP address. If there are multiple such IPs detected, then it asks you to choose one. If you'll be using a mobile phone to develop then choose the IP address of your machine that's pingable from the phone/tablet.
2. It starts up a development server on your machine.
3. It tells Capacitor to use the IP previously detected. This allows the app to connect to the development server.
4. It uses the Capacitor CLI to update all of your plugins.
5. Finally, it opens your native IDE. Run your app here, and it will automatically connect to the dev server.

::: danger
If developing on a mobile phone/tablet, it is very important that the external IP address of your build machine is accessible from the phone/tablet, otherwise you'll get a development app with white screen only. Also check your machine's firewall to allow connections to the development chosen port.
:::

## Building for Production

```bash
$ quasar build -m capacitor -T [ios|android]

# ..or the longer form:
$ quasar build --mode cordova --target [ios|android]

# this opens Android Studio instead of building the apk for you. On iOS, XCode is always opened.
$ quasar build -m cordova -T [ios|android] --openIde
```

These commands parse and build your `/src` folder then overwrite `/dist/capacitor` then use the Capacitor CLI to update your plugins and open your IDE.

If you are building for Android, the apk will be built for you instead of opening Android Studio, unless the `--openIde` arg is passed. The file will be located at `dist/capacitor/app-release.apk`.
