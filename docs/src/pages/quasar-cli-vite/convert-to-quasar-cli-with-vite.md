---
title: Convert project to Quasar CLI with Vite
desc: (@quasar/app-vite) How to convert a Quasar CLI with Webpack project to a Quasar CLI with Vite one.
---

This page will guide you on how to convert a Quasar CLI with Webpack (`@quasar/app-webpack` - formerly known as `@quasar/app`) project into a Quasar CLI with Vite one (`@quasar/app-vite`).

### 1. Create a Quasar CLI with Vite project folder:

```bash
$ yarn create quasar
# or:
$ npm init quasar
# or:
$ pnpm create quasar # experimental support

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


### 3. Explicitly specify extensions on all your import statements

Make sure that all your Vue component files (SFC) are imported with their `.vue` extension explicitly specified. Omitting the file extension works with Webpack (due to Quasar CLI configured list of extensions for it to try), but not with Vite too.

```js
// BAD! Will not work:
import MyComponent from './MyComponent'

// GOOD:
import MyComponent from './MyComponent.vue'
```

### 4. Check the new quasar.config.js

There are property changes in `build`, `devServer`, and all Quasar Modes (pwa, ssr, etc). The props are detailed in [quasar.config.js](/quasar-cli-vite/quasar-config-js) page. You will have to manually port your configuration to the Quasar CLI with Vite architecture.

### 5. Browser compatibility

A Quasar CLI with Webpack project relies on `/package.json > browserslist` to specify which browsers you are targetting. That property no longer has any meaning. Projects managed by Quasar CLI with Vite work completely different and you might want to check the [Browser Compatibility](/quasar-cli-vite/browser-compatibility) page.

### 6. SSR related

* Delete `/src-ssr/directives` folder (if you have it) -- it no longer serves any purpose; check [Vue SSR Directives](/quasar-cli-vite/developing-ssr/vue-ssr-directives) page
* Port the `/src-ssr/production-export.js` file to `/src-ssr/server.js`; Make sure to read about the [SSR Webserver](/quasar-cli-vite/developing-ssr/ssr-webserver) first

More info: [Configuring SSR](/quasar-cli-vite/developing-ssr/configuring-ssr)

### 7. PWA related

* **VERY important: BEFORE porting your files over, run command `quasar mode add pwa`. Otherwise all the needed packages will not be added, and your build will fail.**
* The default name of the outputted service worker file has changed from `service-worker.js` to `sw.js`. This can break your update process the first time the new app is loaded. So, if your app is in production, to ensure smooth upgrades from the previous Webpack builds, make sure the name matches the name of your previous service worker file. You can set it through [quasar.config.js > pwa > swFilename](/quasar-cli-vite/developing-pwa/configuring-pwa#quasar-config-js).
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

### 8. BEX related

The BEX mode differs quite a lot. The PWA mode in a Quasar CLI with Vite project supports PWA manifest v3 and multiple content scripts. You will have to manually port over your BEX files to the new architecture, which should be fairly easy though.

It's best to `$ quasar mode add bex`, pick your preferred PWA manifest version (v2 or v3) and port your BEX.

More info: [Preparation and folder structure](/quasar-cli-vite/developing-browser-extensions/preparation#2-understand-the-anatomy-of-src-bex) and [Configuring BEX](/quasar-cli-vite/developing-browser-extensions/configuring-bex).

### 8. And we're done

```bash
$ quasar dev
$ quasar build
```
