---
title: Mobile App Build Commands
---
[Quasar CLI](/quasar-cli/installation) makes it incredibly simple to develop or build the final distributables from your source code.

Before we dive in, make sure you got the Cordova CLI installed.

```bash
$ npm install -g cordova
```

## Developing
```bash
$ quasar dev -m cordova -T [ios|android]

# ..or the longer form:
$ quasar dev --mode cordova -T [ios|android]

# using a specific emulator (--emulator, -e)
$ quasar dev -m cordova -T ios -e iPhone-7
```

In order for you to be able to develop on a device emulator or directly on a phone (with Hot Module Reload included), Quasar CLI follows these steps:
1. Detects your machine's external IP address. If there are multiple such IPs detected, then it asks you to choose one. If you'll be using a mobile phone to develop then choose the IP address of your machine that's pingable from the phone/tablet.
2. It starts up a development server on your machine.
3. It temporarily changes the `<content/>` tag in `/src-cordova/config.xml` to point to the IP previously detected. This allows the app to connect to the development server.
3. It defers to Cordova CLI to build a native app with the temporarily changed config.xml.
4. Cordova CLI checks if a mobile phone / tablet is connected to your development machine. If it is, it installs the development app on it. If none is found, then it boots up an emulator and runs the development app.
5. Finally, it reverts the temporary changes made to `/src-cordova/config.xml`.

::: danger
If developing on a mobile phone/tablet, it is very important that the external IP address of your build machine is accessible from the phone/tablet, otherwise you'll get a development app with white screen only. Also check your machine's firewall to allow connections to the development chosen port.
:::

## Building for Production
```bash
$ quasar build -m cordova -T [ios|android]

# ..or the longer form:
$ quasar build --mode cordova -T [ios|android]

# this skips .app or .apk creation and just fills in /src-cordova/www
$ quasar build -m cordova -T [ios|android] --skip-pkg
```

These commands parse and build your `/src` folder then overwrite `/src-cordova/www` then, unless `--skip-pkg` was specified, defer to Cordova CLI to trigger the actual native app creation.

You may ask yourself. So where's the .apk or .app? Watch the terminal console to see where Cordova puts it.
