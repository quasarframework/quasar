---
title: CLI Installation and Development Features
---

Using the CLI is the recommended way to go in order to benefit from all Quasar can do for it. You'll be able to build:
* a SPA (Single Page Application/Website),
* a SSR (Server-side Rendered App/Website + optional PWA client takeover)
* a PWA (Progressive Web App),
* a Mobile App (through Cordova),
* an Electron App,
...**sharing the same base-code**.

First, we install Quasar CLI. Make sure you have Node >=8 and NPM >=5 installed on your machine.

```bash
# Node.js >= 8.9.0 is required.
$ yarn global add @quasar/cli
# or:
$ npm install -g @quasar/cli
```

Then we create a project folder with Quasar CLI:
```bash
$ quasar create <folder_name>
```

Note that you don't need separate projects if you want to build any of the options described above. This one project can seamlessly handle all of them.

To continue your learning about Quasar, you should familiarize yourself with the Quasar CLI in depth, because you will be using it a lot.

## What's Included

While developing with Dev Server (`$ quasar dev`):
* Babel, so you can write ES6 code
* Webpack + vue-loader for Vue SFC (single file components)
* State preserving hot-reload
* State preserving compilation error overlay
* Lint-on-save with ESLint
* Source maps
* Develop right on a device emulator (or a real phone connected to your machine) if you target a Mobile App
* Develop right on an Electron window with Developer Tools included if you target an Electron App
* ...many more

Developing for production (`$ quasar build`):
* Javascript minified with [UglifyJS](https://github.com/mishoo/UglifyJS2)
* HTML minified with [html-minifier](https://github.com/kangax/html-minifier)
* CSS across all components extracted (and auto-prefixed) into a single file and minified with [cssnano](https://github.com/ben-eb/cssnano)
* All static assets are compiled with version hashes for efficient long-term caching, and a production index.html is auto-generated with proper URLs to these generated assets.
* ...many more

Take note of the '/quasar.conf.js' file in the root of your project folder. This file helps you quickly configure the way your website/App works. We'll go over it in the [Configuration](/quasar-cli/cli-documentation/quasar-conf-js) section.
