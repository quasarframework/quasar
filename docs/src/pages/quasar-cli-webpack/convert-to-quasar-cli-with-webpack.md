---
title: Convert project to Quasar CLI with Webpack
desc: (@quasar/app-webpack) How to convert a Quasar CLI with Vite project to a Quasar CLI with Webpack one.
---

This page will guide you on how to convert a Quasar CLI with Webpack (`@quasar/app-vite`) project into a Quasar CLI with Webpack one (`@quasar/app-webpack`).

### 1. Create a Quasar CLI with Webpack project folder:

```bash
$ yarn create quasar
# or:
$ npm init quasar

# pick "App with Quasar CLI", "Quasar v2", "Quasar App CLI with Webpack"
```

There are significant changes to the root files so it's easier to generate a new project folder rather than explaining each of the many changes.

### 2. Copy folders from original folder

From your original project folder, copy these as they are:
  * /src (with small caveat; see next steps)
  * /src-cordova
  * /src-capacitor
  * /src-electron
  * /src-pwa
  * /src-ssr (with small caveat; see next steps)
  * ~~/src-bex~~ **Nope. Don't!**

Also move `/index.html` to `/src/index.template.html`. And make the following change:

```
<!-- quasar:entry-point -->

// replace with:

<!-- DO NOT touch the following DIV -->
<div id="q-app"></div>
```

Also, edit `/src/router/index.js`:

```js
// Change:
history: createHistory(process.env.VUE_ROUTER_BASE)
// Into:
history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
```

### 3. Check the new quasar.config.js

There are property changes in `build`, `devServer`, and all Quasar Modes (pwa, ssr, etc). The props are detailed in [quasar.config.js](/quasar-cli-webpack/quasar-config-js) page. You will have to manually port your configuration to the Quasar CLI with Webpack architecture.

### 4. Browser compatibility

A Quasar CLI with Webpack project relies on `/package.json > browserslist` to specify which browsers you are targetting. More info: [Browser Compatibility](/quasar-cli-webpack/browser-compatibility) page.

### 5. SSR related

Port the `/src-ssr/server.js` to `/src-ssr/production-export.js` file. Make sure to read about the [SSR Production Export](/quasar-cli-webpack/developing-ssr/ssr-production-export) first. The production-export.js is essentially default exporting the `listen()` method from `src-ssr/server.js`. All the other functionality cannot be ported over.

More info: [Configuring SSR](/quasar-cli-webpack/developing-ssr/configuring-ssr)

### 6. PWA related

The `/src-pwa/manifest.json` has no meaning for a Quasar CLI with Webpack project. You will need to use `quasar.config.js > manifest` to declare it there. After that then delete the `/src-pwa/manifest.json` file.

Also check `quasar.config.js > pwa` > `metaVariables` and `metaVariablesFn`.

More info: [Configuring PWA](/quasar-cli-webpack/developing-pwa/configuring-pwa)

### 7. BEX related

The BEX mode differs quite a lot. The PWA mode in a Quasar CLI with Webpack project does NOT supports PWA manifest v3 and multiple content scripts. You will have to manually port over your BEX files to the new architecture.

It's best to `$ quasar mode add bex` and port your BEX.

More info: [Preparation and folder structure](/quasar-cli-webpack/developing-browser-extensions/preparation#2-understand-the-anatomy-of-src-bex) and [Configuring BEX](/quasar-cli-webpack/developing-browser-extensions/configuring-bex).

### 8. And we're done

```bash
$ quasar dev
$ quasar build
```
