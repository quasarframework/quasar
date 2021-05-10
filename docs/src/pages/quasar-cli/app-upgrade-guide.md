---
title: App CLI v2 Upgrade Guide
desc: How to upgrade a Quasar app to @quasar/app v2.
related:
  - /quasar-cli/quasar-conf-js
---

> * This guide refers to upgrading a Quasar app from `@quasar/app` v1 to using v2.
> * Please note that `@quasar/app` and `quasar` are different packages (one is the Quasar App CLI and one is the Quasar UI), each one with its own version.

::: warn
This does not refers to Quasar v2, but to App CLI v2.
:::

## What's new in App CLI v2

* [Browser compatibility](/quasar-cli/browser-compatibility) is now more clearly expressed.
* The JS transpilation (with the help of Babel) has been rethought from the ground up (now using core-js v3). It will now transpile based on the [Browser compatibility](/quasar-cli/browser-compatibility) that you configure. It will no longer go transpiling directly to ES5, but it will look for exactly what JS features need transpiling based on the configured browsers. Be mindful about it though, as it is sufficient to add one "bad apple" in the options list and that will dumb down your code back to ES5.
* The "modern build" is no longer necessary due to the above. However, if you want to disable transpiling (it's perfectly equivalent), now you can: quasar.conf.js > build > transpile: false.
* Support for a `/public` folder which replaces `/src/statics`. The new folder will allow you to supply static content at the root/app base level, rather than as statics/*. One useful example: robots.txt
* SSR mode now supports a custom publicPath too
* The configured publicPath is now applied to dev mode by default
* Capacitor v2 and Workbox v5 support
* Simpler quasar.conf.js > build > transpileDependencies; it now supports String (auto transforms it to `/node_modules/...') and Regexes too
* Simpler quasar.conf.js > build > env; you no longer need to JSON.stringify each value (you now must not!)
* Simpler quasar.conf.js > framework config Object; "all" prop has been renamed to "importStrategy" and it allows "all" or "auto" (the default) values
* New param for boot files and preFetch (publicPath); the "redirect()" method now fully supports a Vue Router location Object (on all build modes, on server-side or client-side); preFetch hook now also receive "urlPath" param
* New API method for App Extension's install script: api.renderFile()
* Temporarily removed quasar.conf.js > build > preloadChunks (until compatibility is ensured with html-webpack-plugin v4)
* Upgraded to latest version of Typescript (v3.9.5 as of writing these lines; will also require "quasar" v1.12.6)
* Lots of other improvements and fixes

## Upgrade Guide

Following this guide should take you at most 5 minutes to complete.

### Required steps

* Dependencies
  - remove "resolutions" > "@babel/parser" if it's in your `/package.json`
  - Manually yarn/npm install @quasar/app v2: `yarn add --dev @quasar/app@^2.0.0` (or `npm install --save-dev @quasar/app@^2.0.0`).
  - if you are using PWA (or SSR+PWA) mode, you'll also need to install workbox-webpack-plugin@^5.0.0 (or ^4.0.0 -- v4 came with @quasar/app v1) -- this package is no longer supplied by "@quasar/app": `yarn add --dev workbox-webpack-plugin@^5.0.0` (or `npm install --save-dev workbox-webpack-plugin@^5.0.0`)
  - yarn/npm install core-js v3: `yarn add core-js@^3.0.0` (or `npm install core-js@^3.0.0`)
  - IMPORTANT: Run `quasar upgrade -i` to ensure the latest versions of all Quasar packages are installed

* Edit your `/quasar.conf.js` file:
  - rename "all" to "importStrategy" (valid values: 'auto' or 'all'; 'auto' is the default)
  - remove "supportIE" (it's now handled through package.json > browserslist)
  - remove "build" > "modern" if it's there (no longer needed due to the superior [browser compatibility](/quasar-cli/browser-compatibility) strategy)
  - remove "build" > "webpackManifest" and "forceDevPublicPath" (no longer used/necessary)
  - edit your "build" > "env": remove the use of JSON.stringify(); instead of `someProp: JSON.stringify('some-value')` -> `someProp: 'some-value'`
  - remove "build" > "preloadChunk" (temporarily removed until it's compatible with html-webpack-plugin v4)

* Edit your `/package.json` file:
  - remove "cordovaId" and "capacitorId" if they are there
  - update "browserslist"; [what it does](/quasar-cli/browser-compatibility); get inspired from the default value which is:

  ```js
  "browserslist": [
    "last 10 Chrome versions",
    "last 10 Firefox versions",
    "last 4 Edge versions",
    "last 7 Safari versions",
    "last 8 Android versions",
    "last 8 ChromeAndroid versions",
    "last 8 FirefoxAndroid versions",
    "last 10 iOS versions",
    "last 5 Opera versions"
  ]
  ```

  IE11 support is now enabled only if "browserslist" contains it (`ie 11` or `ie >= 11`) or if any of your queries silently includes it (example: `> 0.5%`).

* Update to the newly `/public` folder (which replaces the old `/src/statics`):
  - do a global search and replace for "statics/" and replace with "" (empty string), including in `/quasar.conf.js`.
  - move `/src/statics/*` to `/public/*`; then move "/public/icons/favicon.ico" directly under "/public"

* Edit your `/src/index.template.html` file:
  - search for "htmlWebpackPlugin.options." and replace with "" (empty string)
  - update the favicon.ico `<link>` to point to `href="favicon.ico"` instead of "statics/icons/favicon.ico" (some browsers or tools require a favicon.ico to be present at root level, which is one of the things that q/app v2 can now offer)

* You can upgrade your /src-capacitor dependencies to Capacitor v2 (which supports Android X); full support is included (thanks to help from Capacitor team) for both versions now; please review the Capacitor (v1 to v2) upgrade guide too! helpful links: [announcement on capacitor v2](https://ionicframework.com/blog/announcing-capacitor-2-0/), [upgrade guide](https://capacitor.ionicframework.com/docs/android/updating/#from-1-5-1-to-2-0-0), [release notes](https://github.com/ionic-team/capacitor/releases/tag/2.0.0)

* For Typescript devs: Make sure that you also upgrade the `quasar` package to v.12.6+. Internal types of features related only to Quasar CLI (eg. `BootFileParams`) have been moved under `@quasar/app` (previously they were provided by `quasar` package). If you have any reference to them in your code, change the import statement to use `@quasar/app` or consider switching to use the much cleaner wrapper functions provided by `quasar/wrappers`

* The `webpack-html-plugin` package has been upgraded to v4; if you have tampered with the default config for it, please [review it](https://github.com/jantimon/html-webpack-plugin/blob/master/CHANGELOG.md#400-2020-03-23)

* The `copy-webpack-plugin` package has been upgraded to v6; if you have tampered with the default config for it, please [review it](https://github.com/webpack-contrib/copy-webpack-plugin/blob/master/CHANGELOG.md#600-2020-05-15)

* If you're building with SSR mode, then custom publicPath can now be used, but it requires a small change to all your app.use() statements:
  ``` js
  // for ALL app.use() statements
  // in /src-ssr/ files:

  // from:
  app.use('<path>', ...)
  // to:
  app.use(ssr.resolveUrl('<path>'), ...)
  ```

* If you are building with Electron replace `QUASAR_NODE_INTEGRATION` in your main thread file (/src-electron/main-process/main.js) with `process.env.QUASAR_NODE_INTEGRATION` (if it is present)

* Also, if using Electron, make the following replacement in your /src-electron/main-process/main.js:
  ```js
  // OLD way
  if (process.env.PROD) {
    global.__statics = require('path').join(__dirname, 'statics').replace(/\\/g, '\\\\')
  }

  // NEW way (replace above with this)
  if (process.env.PROD) {
    global.__statics = __dirname
  }
  ```

### Optional steps

The following steps are optional, but recommended.

* If you are using [IconGenie CLI](/icongenie/introduction) then please upgrade it to v2.3+ which introduces support for @quasar/app v2 projects.

* Edit your `/src/router/routes.js` file:

  Instead of:

  ```
  // Always leave this as last one
  if (process.env.MODE !== 'ssr') {
    routes.push({
      path: '*',
      component: () => import('pages/Error404.vue')
    })
  }
  ```

  ...place this:

  ```
  // Always leave this as last one
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
  ```

