---
title: Configuring PWA
desc: How to manage your Progressive Web Apps with Quasar CLI.
related:
  - /quasar-cli/quasar-conf-js
---
We'll be using Quasar CLI to develop and build a PWA. The difference between building a SPA, Mobile App, Electron App, PWA or SSR is simply determined by the "mode" parameter in "quasar dev" and "quasar build" commands.

## Installation
In order to build a PWA, we first need to add the PWA mode to our Quasar project:
```bash
$ quasar mode add pwa
```

If you want to jump right in and start developing, you can skip the "quasar mode" command and issue:
```bash
$ quasar dev -m pwa
```
This will add PWA mode automatically, if it is missing.

## Service Worker
Adding PWA mode to a Quasar project means a new folder will be created: `/src-pwa`, which contains PWA specific files:
```bash
.
└── src-pwa/
    ├── register-service-worker.js  # App-code *managing* service worker
    └── custom-service-worker.js    # Optional custom service worker
                                    # file (InjectManifest mode oNLY)
```

You can freely edit these files. Notice a few things:

1. `register-service-worker.js` is automatically imported into your app (like any other /src file). It registers the service worker (created by Workbox or your custom one, depending on workbox plugin mode -- quasar.conf.js > pwa > workboxPluginMode) and you can listen for Service Worker's events. You can use ES6 code.
2. `custom-service-worker.js` will be your service worker file ONLY if workbox plugin mode is set to "InjectManifest" (quasar.conf.js > pwa > workboxPluginMode: 'InjectManifest'). Otherwise, Workbox will create a service-worker file for you.
3. It makes sense to run [Lighthouse](https://developers.google.com/web/tools/lighthouse/) tests on production builds only.

::: tip
Read more on `register-service-worker.js` and how to interact with the Service Worker on [Handling Service Worker](/quasar-cli/developing-pwa/handling-service-worker) documentation page.
:::

## Quasar.conf.js
This is the place where you can configure Workbox's behavior and also tweak your manifest.json.

```js
pwa: {
  // workboxPluginMode: 'InjectManifest',
  // workboxOptions: {},
  manifest: {
    // ...
  },

  // variables used to inject specific PWA
  // meta tags (below are default values)
  metaVariables: {
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default',
    appleTouchIcon120: 'statics/icons/apple-icon-120x120.png',
    appleTouchIcon180: 'statics/icons/apple-icon-180x180.png',
    appleTouchIcon152: 'statics/icons/apple-icon-152x152.png',
    appleTouchIcon167: 'statics/icons/apple-icon-167x167.png',
    appleSafariPinnedTab: 'statics/icons/safari-pinned-tab.svg',
    msapplicationTileImage: 'statics/icons/ms-icon-144x144.png',
    msapplicationTileColor: '#000000'
  }
}
```

More information: [Workbox Webpack Plugin](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin), [Workbox](https://developers.google.com/web/tools/workbox/).

The `metaVariables` Object is used by Quasar itself only (has no meaning for Workbox) to inject specific value attributes to some PWA meta tags into the rendered HTML page. Example: `<meta name="apple-mobile-web-app-status-bar-style">` will have value attribute assigned to the content of `metaVariables.appleMobileWebAppStatusBarStyle`.

## Picking Workbox mode

There are two Workbox operating modes: **GenerateSW** (default) and **InjectManifest**. The first one generates a service worker automatically, based on quasar.conf.js > pwa > workboxOptions (if any), while the second mode allows you to write your own service worker file.

Setting the mode that you want to use is done through quasar.conf.js:

```js
// quasar.conf.js
pwa: {
  // workboxPluginMode: 'InjectManifest',
  // workboxOptions: { ... }
}
```

::: danger
Make sure that your `workboxOptions` match the Workbox mode that you have picked, otherwise the workbox webpack plugin might [halt your app from compiling](https://github.com/quasarframework/quasar/issues/4998).
:::

### GenerateSW

When to use GenerateSW:
* You want to precache files.
* You have simple runtime configuration needs (e.g. the configuration allows you to define routes and strategies).

When NOT to use GenerateSW:
* You want to use other Service Worker features (i.e. Web Push).
* You want to import additional scripts or add additional logic.

::: tip
Please check the available workboxOptions for this mode on [Workbox website](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#full_generatesw_config).
:::

### InjectManifest

When to use InjectManifest:
* You want more control over your service worker.
* You want to precache files.
* You have more complex needs in terms of routing.
* You would like to use your service worker with other API's (e.g. Web Push).

When NOT to use InjectManifest:
* You want the easiest path to adding a service worker to your site.

::: tip TIPS
* If you want to use this mode, you will have to write the service worker (/src-pwa/custom-service-worker.js) file by yourself.
* Please check the available workboxOptions for this mode on [Workbox website](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#full_injectmanifest_config).
:::

## Configuring Manifest File
The Manifest file is generated by Quasar CLI with a default configuration for it. You can however tweak this configuration from `/quasar.conf.js`.

```js
// quasar.conf.js
pwa: {
  // workboxPluginMode: 'InjectManifest',
  // workboxOptions: {},
  manifest: {
    name: 'Quasar Play',
    short_name: 'Quasar-Play',
    description: 'Quasar Framework Showcase',
    icons: [
      {
        'src': 'statics/icons/icon-128x128.png',
        'sizes': '128x128',
        'type': 'image/png'
      },
      {
        'src': 'statics/icons/icon-192x192.png',
        'sizes': '192x192',
        'type': 'image/png'
      },
      {
        'src': 'statics/icons/icon-256x256.png',
        'sizes': '256x256',
        'type': 'image/png'
      },
      {
        'src': 'statics/icons/icon-384x384.png',
        'sizes': '384x384',
        'type': 'image/png'
      },
      {
        'src': 'statics/icons/icon-512x512.png',
        'sizes': '512x512',
        'type': 'image/png'
      }
    ],
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#027be3'
  }
}
```

Please read about the [manifest config](https://developer.mozilla.org/en-US/docs/Web/Manifest) before diving in.

::: warning
Note that you don't need to edit your index.html file (generated from `/src/index.template.html`) to link to the manifest file. Quasar CLI takes care of embedding the right things for you.
::::

## PWA Checklist
More info: [PWA Checklist](https://developers.google.com/web/progressive-web-apps/checklist)

::: danger
Do not run [Lighthouse](https://developers.google.com/web/tools/lighthouse/) on your development build because at this stage the code is intentionally not optimized and contains embedded source maps (among many other things). See the [Testing and Auditing](/quasar-cli/testing-and-auditing) section of these docs for more information.
:::

## Reload & Update Workbox
For those who want to reload the page when the service worker is updated **and are using the default GenerateSW workbox mode**, you may as well want to make it active at once. Update the workboxOptions config in quasar.conf.js as follows:

```js
// quasar.conf.js
pwa: {
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true
  }
}
```

[Source](https://developers.google.com/web/tools/workbox/guides/codelabs/webpack)
