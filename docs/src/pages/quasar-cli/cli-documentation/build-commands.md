---
title: Build Commands
desc: Quasar CLI list of commands for developing and building a Quasar app.
---
We will be covering Development and Production build commands.

::: tip
Full list of Quasar CLI commands: [Commands List](/quasar-cli/cli-documentation/commands-list).
:::

### Development
> Starts a Node.js local development server.

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

While developing with the Dev Server you will have:
* Babel, so you can write ES6 code
* Webpack + vue-loader for Vue SFC (single file components)
* State preserving hot-reload
* State preserving compilation error overlay
* Lint-on-save with ESLint
* Source maps
* Develop right on a device emulator (or a real phone connected to your machine) if you target a Mobile App
* Develop right on an Electron window with Developer Tools included if you target an Electron App

### Production
> Build assets for production.

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

In addition to what you get while developing your website/app, for production builds you also take advantage of:
* Javascript minified with [UglifyJS](https://github.com/mishoo/UglifyJS2)
* HTML minified with [html-minifier](https://github.com/kangax/html-minifier)
* CSS across all components extracted (and auto-prefixed) into a single file and minified with [cssnano](https://github.com/ben-eb/cssnano)
* All static assets are compiled with version hashes for efficient long-term caching, and a production index.html is auto-generated with proper URLs to these generated assets.
