---
title: Build Commands
desc: Quasar CLI list of commands for developing and building a Quasar app.
---
We will be covering Development and Production build commands.

::: tip
Full list of Quasar CLI commands: [Commands List](/quasar-cli/commands-list).
:::

### Development
Starts a Node.js local development server.

``` bash
# run development server (with default theme)
$ quasar dev

# on specific port
$ quasar dev -p 9090

# SSR
$ quasar dev -m ssr

# PWA
$ quasar dev -m pwa

# Mobile App
$ quasar dev -m cordova -T [android|ios]
# or the shorter form:
$ quasar dev -m [android|ios]

# Electron App
$ quasar dev -m electron

# passing extra parameters and/or options to
# underlying "cordova" or "electron" executables:
$ quasar dev -m ios -- some params --and options --here
$ quasar dev -m electron -- --no-sandbox --disable-setuid-sandbox
```

### Production
Build assets for production.

``` bash
# build for production
$ quasar build

# SSR
$ quasar build -m ssr

# PWA
$ quasar build -m pwa

# Mobile App
$ quasar build -m cordova -T [android|ios]
# or the short form:
$ quasar build -m [android|ios]

# passing extra parameters and/or options to
# underlying "cordova" executable:
$ quasar build -m ios -- some params --and options --here

# Electron App
$ quasar build -m electron
```
