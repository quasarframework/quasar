---
title: Convert project to Quasar CLI with Vite
desc: (@quasar/app-vite) How to convert a Quasar CLI with Webpack project to a Quasar CLI with Vite one.
---

This page will guide you on how to convert a Quasar CLI with Webpack (`@quasar/app-webpack` - formerly known as `@quasar/app`) project into a Quasar CLI with Vite one (`@quasar/app-vite`).

::: warning
Quasar CLI with Vite (`@quasar/app-vite`) is currently in **BETA**. Specifications may slightly change until the stable release.
:::

### 1. Create a Quasar CLI with Vite project folder:

```bash
$ yarn create quasar
# or:
$ npm init quasar

# pick "App with Quasar CLI", "Quasar v2", "Quasar App CLI with Vite"
```

There are significant changes to the root files so it's easier to generate a new project folder rather than explaining each of the many changes.

### 2. Copy folders from original folder

From your original project folder, copy these as they are:
  * /src (with small caveat; see next steps)
  * /src-cordova
  * /src-capacitor
  * /src-electron
  * /src-pwa (with small caveat; see next steps)
  * /src-ssr (with small caveat; see next steps)
  * ~~/src-bex~~ **Nope. Don't!**

Move `/src/index.template.html` to `/index.html`. And make the following change:

```
<!-- DO NOT touch the following DIV -->
<div id="q-app"></div>

// replace with:

<!-- quasar:entry-point -->
```

Also, edit `/src/router/index.js`:

```js
// Change:
history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
// Into:
history: createHistory(process.env.VUE_ROUTER_BASE)
```

### 3. Check the new quasar.config.js

There are property changes in `build`, `devServer`, and all Quasar Modes (pwa, ssr, etc). The props are detailed in [quasar.config.js](/quasar-cli-vite/quasar-config-js) page. You will have to manually port your configuration to the Quasar CLI with Vite architecture.

### 4. Browser compatibility

A Quasar CLI with Webpack project relies on `/package.json > browserslist` to specify which browsers you are targetting. That property no longer has any meaning. Projects managed by Quasar CLI with Vite work completely different and you might want to check the [Browser Compatibility](/quasar-cli-vite/browser-compatibility) page.

### 5. SSR related

* Delete `/src-ssr/directives` folder (if you have it) -- it no longer serves any purpose; check [Vue SSR Directives](/quasar-cli-vite/developing-ssr/vue-ssr-directives) page
* Port the `/src-ssr/production-export.js` file to `/src-ssr/server.js`; Make sure to read about the [SSR Webserver](/quasar-cli-vite/developing-ssr/ssr-webserver) first

More info: [Configuring SSR](/quasar-cli-vite/developing-ssr/configuring-ssr)

### 6. PWA related

* Quasar CLI with Webpack relies on `quasar.config.js > manifest` to specify the manifest, but you will need to use `/src-pwa/manifest.json` to declare it for Quasar CLI with Vite. After declaring the manifest in `/src-pwa/manifest.json`, delete `quasar.config.js > manifest` section.
* There were also some props in `quasar.config.js` that are no longer available. Most notably: `metaVariables`, `metaVariablesFn`. Simply edit `/index.html` and add those tags directly there.

```html
<!-- index.html -->
<head>
  <% if (ctx.mode.pwa) { %>
    <!-- Define your custom PWA-related meta/link tags here. -->
  <% } %>
</head>
```

More info: [PWA - Preparation](/quasar-cli-vite/developing-pwa/preparation)

### 7. BEX related

The BEX mode differs quite a lot. The PWA mode in a Quasar CLI with Vite project supports PWA manifest v3 and multiple content scripts. You will have to manually port over your BEX files to the new architecture, which should be fairly easy though.

It's best to `$ quasar mode add bex`, pick your preferred PWA manifest version (v2 or v3) and port your BEX.

More info: [Preparation and folder structure](/quasar-cli-vite/developing-browser-extensions/preparation#2-understand-the-anatomy-of-src-bex) and [Configuring BEX](/quasar-cli-vite/developing-browser-extensions/configuring-bex).

### 8. And we're done

```bash
$ quasar dev
$ quasar build
```
