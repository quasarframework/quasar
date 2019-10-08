---
title: Capacitor Build Commands
desc: The Quasar CLI list of commands when developing or building a hybrid mobile app with Capacitor.
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
```

These commands parse and build your `/src` folder then overwrite `/src-capacitor/www` then use the Capacitor CLI to update your plugins and open your IDE. From within the IDE you need to issue a build for the final assets that go into a phone/tablet.
