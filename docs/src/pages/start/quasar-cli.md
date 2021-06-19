---
title: Quasar CLI
desc: How to use the Quasar CLI, the premium developer experience for free.
---

Quasar CLI is the pride of Quasar Framework. You can seamlessly build:

* a SPA (Single Page Application/Website),
* a SSR (Server-side Rendered App/Website),
* a PWA (Progressive Web App),
* a BEX (Browser Extensions),
* a Mobile App (through Cordova),
* an Electron App

...within the same project folder, ensuring you are **following the best Quasar practices while everything will simply work out of the box**.

<q-btn push no-caps color="brand-primary" icon-right="launch" label="Install Quasar CLI" to="/quasar-cli/installation" class="q-mt-md" />

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

Take note of the `/quasar.conf.js` file in the root of your project folder. This file helps you quickly configure the way your website/App works. We'll go over it in the [Configuration](/quasar-cli/quasar-conf-js) section.
