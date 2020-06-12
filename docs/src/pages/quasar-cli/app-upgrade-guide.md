---
title: App CLI v2 Upgrade Guide
desc: How to upgrade a Quasar app to @quasar/app v2.
related:
  - /quasar-cli/quasar-conf-js
---

> * This guide refers to upgrading a Quasar app using `@quasar/app` v1 to using v2.
> * Please note that `@quasar/app` and `quasar` are different packages (one is the Quasar App CLI and one is the Quasar UI), each one with its own version.

## What's new in v2

* [Browser compatibility](/quasar-cli/browser-compatibility) is now clearer expressed.
* The JS transpilation (with the help of Babel) has been rethought from the ground up. It will now transpile based on the [Browser compatibility](/quasar-cli/browser-compatibility) that you configure. It will no longer go transpiling directly to ES5.
* The "modern build" is no longer necessary due to the above. However, if you want to disable transpiling, now you can: quasar.conf.js > build > transpile: false.
* Support for a `/public` folder which replaces `/src/statics`. The new folder will allow you to supply static content at the root/app base level, rather than as statics/*. One useful example: robots.txt
* SSR mode now supports a custom publicPath too
* The configured publicPath is now applied to dev mode by default
* Capacitor v2 and Workbox v5 support
* Simpler quasar.conf.js > build > transpileDependencies; it now supports String (auto transforms it to `/node_modules/...') and Regexes too
* Simpler quasar.conf.js > build > env; you no longer need to JSON.stringify each value (you now must not!)
* Simpler quasar.conf.js > framework config Object; "all" prop has been renamed to "importStrategy" and it allows "all" or (the default) "auto" values; "components" and "directives" are no longer taken into account because you don't need them
* New param for boot files and preFetch (publicPath); the "redirect()" method now fully supports a Vue Router location Object (on all build modes, on server-side or client-side); preFetch hook now also receive "urlPath" param

## Upgrade Guide

### Required steps

* Edit your `/quasar.conf.js` file:
  - delete framework > "components" and "directives" fields
  - rename "all" to "importStrategy" (valid values: 'auto' or 'all'; 'auto' is the default)
  - remove "supportIE" (it's now handled through package.json > browserslist)
  - remove "build" > "modern" if it's there (no longer needed due to the superior [browser compatibility](/quasar-cli/browser-compatibility) strategy)
  - remove "build" > "webpackManifest" and "forceDevPublicPath" (no longer used/necessary)
  - edit your "build" > "env": remove the use of JSON.stringify(); instead of `someProp: JSON.stringify('some-value')` -> `someProp: 'some-value`

* Edit your `/package.json` file:
  - remove "resolutions" > "@babel/parser" if it's there
  - make sure "devDependencies" > "@quasar/app" is set to "^2.0.0"
  - remove "cordovaId" and "capacitorId" if they are there
  - update "browserslist"; [what it does](/quasar-cli/browser-compatibility); the default content is:

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

  IE11 support is now enabled only if "browserslist" contains it (`ie 11` or `ie >= 11`).

* Update to the newly `/public` folder (which replaces the old `/stc/statics`):
  - do a global search and replace for "statics/" and replace with "" (empty string), including in `/quasar.conf.js`.
  - move `/src/statics/*` to `/public/*`; then move "/public/icons/favicon.ico" directly under "/public"

* Edit your `/src/index.template.html` file:
  - search for "htmlWebpackPlugin.options." and replace with "" (empty string)
  - update the favicon.ico `<link>` to point to `href="favicon.ico"` instead of "statics/icons/favicon.ico"

* The `workbox-webpack-plugin` package has been upgraded to v5; if you have any quasar.conf.js > pwa > workboxOptions you might want to review them

* You can upgrade your /src-capacitor dependencies to Capacitor v2 (which supports Android X); full support is included (thanks to help from Capacitor team) for both versions now; please review the Capacitor (v1 to v2) upgrade guide too! helpful links: [upgrade guide](https://capacitor.ionicframework.com/docs/android/updating/#from-1-5-1-to-2-0-0), [release notes](https://github.com/ionic-team/capacitor/releases/tag/2.0.0)

* The `webpack-html-plugin` package has been upgraded to v4; if you have tampered with the default config for it, please [review it](https://github.com/jantimon/html-webpack-plugin/blob/master/CHANGELOG.md#400-2020-03-23)

* The `copy-webpack-plugin` package has been upgraded to v6; if you have tampered with the default config for it, please [review it](https://github.com/jantimon/html-webpack-plugin/blob/master/CHANGELOG.md#400-2020-03-23)

* If you're building with SSR mode, then custom publicPath can now be used, but it requires a small change to all your app.use() statements:
  ``` js
  // for ALL app.use() statements
  // in /src-ssr/ files:

  // from:
  app.use('<path>', ...)
  // to:
  app.use(ssr.resolveUrl('<path>'), ...)
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

