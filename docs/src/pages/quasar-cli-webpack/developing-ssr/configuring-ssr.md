---
title: Configuring SSR
desc: (@quasar/app-webpack) How to manage your server-side rendered apps with Quasar CLI.
related:
  - /quasar-cli-webpack/quasar-config-file
scope:
  nodeJsTree:
    l: src-ssr
    c:
      - l: middlewares/
        e: SSR middleware files
      - l: server.js
        e: (or .ts) SSR webserver
---

## quasar.config file

This is the place where you can configure some SSR options. Like if you want the client side to takeover as a SPA (Single Page Application -- the default behaviour), or as a PWA (Progressive Web App).

```js /quasar.config file
ssr: {
  /**
   * If a PWA should take over or just a SPA.
   * @default false
   */
  pwa?: boolean;

  /**
   * When using SSR+PWA, this is the name of the
   * PWA index html file that the client-side fallbacks to.
   * For production only.
   *
   * Do NOT use index.html as name as it will mess SSR up!
   *
   * @default 'offline.html'
   */
  pwaOfflineHtmlFilename?: string;

  /**
   * Extend/configure the Workbox GenerateSW options
   * Specify Workbox options which will be applied on top of
   *  `pwa > extendGenerateSWOptions()`.
   * More info: https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
   */
  pwaExtendGenerateSWOptions?: (config: object) => void;

  /**
   * Extend/configure the Workbox InjectManifest options
   * Specify Workbox options which will be applied on top of
   *  `pwa > extendInjectManifestOptions()`.
   * More info: https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
   */
  pwaExtendInjectManifestOptions?: (config: object) => void;

  /**
   * Manually serialize the store state and provide it yourself
   * as window.__INITIAL_STATE__ to the client-side (through a <script> tag)
   * @default false
   */
  manualStoreSerialization?: boolean;

  /**
   * Manually inject the store state into ssrContext.state
   * @default false
   */
  manualStoreSsrContextInjection?: boolean;

  /**
   * Manually handle the store hydration instead of letting Quasar CLI do it.
   *
   * For Pinia: store.state.value = window.__INITIAL_STATE__
   *
   * @default false
   */
  manualStoreHydration?: boolean;

  /**
   * Manually call $q.onSSRHydrated() instead of letting Quasar CLI do it.
   * This announces that client-side code should takeover.
   * @default false
   */
  manualPostHydrationTrigger?: boolean;

  /**
   * The default port (3000) that the production server should use
   * (gets superseded if process.env.PORT is specified at runtime)
   * @default 3000
   */
  prodPort?: number;

  /**
   * List of middleware files in src-ssr/middlewares
   * Order is important.
   */
  middlewares?: string[];

  /**
   * Add/remove/change properties of production generated package.json
   */
  extendPackageJson?: (pkg: { [index in string]: any }) => void;

  /**
   * Extend the Esbuild config that is used for the SSR webserver
   * (which includes the SSR middlewares)
   */
  extendSSRWebserverConf?: (config: EsbuildConfiguration) => void;
}
```

> If you decide to go with a PWA client takeover (**which is a killer combo**), the Quasar CLI PWA mode will be installed too. You may want to check out the [Quasar PWA](/quasar-cli-webpack/developing-pwa/introduction) guide too. But most importantly, make sure you read [SSR with PWA](/quasar-cli-webpack/developing-ssr/ssr-with-pwa) page.

When building, `extendWebpack()` and `chainWebpack()` will receive one more parameter (Object), currently containing `isServer` or `isClient` boolean props, because there will be two Webpack builds (one for the server-side and one for the client-side).

```js /quasar.config file
build: {
  extendWebpack(cfg, { isServer, isClient }) { ... }
}
```

If you want more information, please see this page that goes into more detail about [handling webpack](/quasar-cli-webpack/handling-webpack) in the `/quasar.config` file.

### Manually triggering store hydration

By default, Quasar CLI takes care of hydrating the Pinia stores (if you use it) on client-side.

However, should you wish to manually hydrate it yourself, you need to set quasar.config file > ssr > manualStoreHydration: true. One good example is doing it from [a boot file](/quasar-cli-webpack/boot-files):

```js Some boot file
// MAKE SURE TO CONFIGURE THIS BOOT FILE
// TO RUN ONLY ON CLIENT-SIDE
import { defineBoot } from '#q-app/wrappers'

export default defineBoot(({ store }) => {
  // For Pinia
  store.state.value = window.__INITIAL_STATE__
})
```

### Manually triggering post-hydration

By default, Quasar CLI wraps your App component and calls `$q.onSSRHydrated()` on the client-side when this wrapper component gets mounted. This is the moment that the client-side takes over. You don't need to configure anything for this to happen.

However should you wish to override the moment when this happens, you need to set quasar.config file > ssr > manualPostHydrationTrigger: true. For whatever your reason is (very custom use-case), this is an example of manually triggering the post hydration:

```tabs
<<| js Composition API |>>
// App.vue

import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
export default {
  // ....
  setup () {
    // ...
    const $q = useQuasar()
    onMounted(() => {
      $q.onSSRHydrated()
    })
  }
}
<<| js Options API |>>
// App.vue

export default {
  mounted () {
    this.$q.onSSRHydrated()
  }
}
```

## Nodejs Server

Adding SSR mode to a Quasar project means a new folder will be created: `/src-ssr`, which contains SSR specific files:

<DocTree :def="scope.nodeJsTree" />

You can freely edit these files. Each of the two folders are detailed in their own doc pages (check left-side menu).

Notice a few things:

1. If you import anything from node_modules, then make sure that the package is specified in package.json > "dependencies" and NOT in "devDependencies".

2. The `/src-ssr/middlewares` is built through a separate Esbuild config. You can extend the Esbuild configuration of these files through the `/quasar.config` file:

```js /quasar.config file
return {
  // ...
  ssr: {
    // ...
    extendSSRWebserverConf(esbuildConf) {
      // tamper with esbuildConf here
    }
  }
}
```

4. The `/src-ssr/server.js` file is detailed in [SSR Webserver](/quasar-cli-webpack/developing-ssr/ssr-webserver) page. Read it especially if you need to support serverless functions.

## Helping SEO

One of the main reasons when you develop a SSR instead of a SPA is for taking care of the SEO. And SEO can be greatly improved by using the [Quasar Meta Plugin](/quasar-plugins/meta) to manage dynamic html markup required by the search engines.

## Boot Files

When running on SSR mode, your application code needs to be isomorphic or "universal", which means that it must run both on a Node.js context and in the browser. This applies to your [Boot Files](/quasar-cli-webpack/boot-files) too.

However, there are cases where you only want some boot files to run only on the server or only on the client-side. You can achieve that by specifying:

```js /quasar.config file
return {
  // ...
  boot: [
    'some-boot-file', // runs on both server and client
    { path: 'some-other', server: false }, // this boot file gets embedded only on client-side
    { path: 'third', client: false } // this boot file gets embedded only on server-side
  ]
}
```

Just make sure that your app is consistent, though.

When a boot file runs on the server, you will have access to one more parameter (called [ssrContext](/quasar-cli-webpack/developing-ssr/ssr-context)) on the default exported function:

```js Some boot file
export default ({ app, ..., ssrContext }) => {
  // You can add props to the ssrContext then use them in the /index.html.
  // Example - let's say we ssrContext.someProp = 'some value', then in index template we can reference it:
  // {{ ssrContext.someProp }}
}
```

When you add such references into your `/index.html`, make sure you tell Quasar it's only valid for SSR builds:

```html /index.html
<% if (ctx.mode.ssr) { %>{{ ssrContext.someProp }} <% } %>
```
