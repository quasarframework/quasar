---
title: Configuring SSR
desc: (@quasar/app-vite) How to manage your server-side rendered apps with Quasar CLI.
related:
  - /quasar-cli-vite/quasar-config-js
scope:
  nodeJsTree:
    l: src-ssr
    c:
    - l: middlewares/
      e: SSR middleware files
    - l: server.js
      e: SSR webserver
---

## quasar.config.js

This is the place where you can configure some SSR options. Like if you want the client side to takeover as a SPA (Single Page Application -- the default behaviour), or as a PWA (Progressive Web App).

```js
return {
  // ...
  ssr: {
    ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
                                        // will mess up SSR

    extendSSRWebserverConf (esbuildConf) {},

    // add/remove/change properties
    // of production generated package.json
    extendPackageJson (pkg) {
      // directly change props of pkg;
      // no need to return anything
    },

    pwa: false,

    /**
     * Manually serialize the store state and provide it yourself
     * as window.__INITIAL_STATE__ to the client-side (through a <script> tag)
     * (Requires @quasar/app-vite v1.0.0-beta.14+)
     */
    manualStoreSerialization: false,

    /**
     * Manually inject the store state into ssrContext.state
     * (Requires @quasar/app-vite v1.0.0-beta.14+)
     */
    manualStoreSsrContextInjection: false,

    /**
     * Manually handle the store hydration instead of letting Quasar CLI do it.
     * For Pinia: store.state.value = window.__INITIAL_STATE__
     * For Vuex: store.replaceState(window.__INITIAL_STATE__)
     */
    manualStoreHydration: false,

    /**
     * Manually call $q.onSSRHydrated() instead of letting Quasar CLI do it.
     * This announces that client-side code should takeover.
     */
    manualPostHydrationTrigger: false,

    prodPort: 3000, // The default port that the production server should use
                    // (gets superseded if process.env.PORT is specified at runtime)

    middlewares: [
      'render' // keep this as last one
    ]
  }
}
```

> If you decide to go with a PWA client takeover (**which is a killer combo**), the Quasar CLI PWA mode will be installed too. You may want to check out the [Quasar PWA](/quasar-cli-vite/developing-pwa/introduction) guide too. But most importantly, make sure you read [SSR with PWA](/quasar-cli-vite/developing-ssr/ssr-with-pwa) page.

Should you want to tamper with the Vite config for UI in /src:

```js
// quasar.config.js
module.exports = function (ctx) {
  return {
    build: {
      extendViteConf (viteConf, { isClient, isServer }) {
        if (ctx.mode.ssr) {
          // do something with ViteConf
        }
      }
    }
  }
}
```

### Manually triggering store hydration

By default, Quasar CLI takes care of hydrating the Vuex store (if you use it) on client-side.

However, should you wish to manually hydrate it yourself, you need to set quasar.config.js > ssr > manualStoreHydration: true. One good example is doing it from [a boot file](/quasar-cli-vite/boot-files):

```js
// some_boot_file
// MAKE SURE TO CONFIGURE THIS BOOT FILE
// TO RUN ONLY ON CLIENT-SIDE

export default ({ store }) => {
  // For Pinia
  store.state.value = window.__INITIAL_STATE__

  // For Vuex
  store.replaceState(window.__INITIAL_STATE__)
}
```

### Manually triggering post-hydration

By default, Quasar CLI wraps your App component and calls `$q.onSSRHydrated()` on the client-side when this wrapper component gets mounted. This is the moment that the client-side takes over. You don't need to configure anything for this to happen.

However should you wish to override the moment when this happens, you need to set quasar.config.js > ssr > manualPostHydrationTrigger: true. For whatever your reason is (very custom use-case), this is an example of manually triggering the post hydration:

```js
// App.vue - Composition API

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
```

```js
// App.vue - Options API
export default {
  mounted () {
    this.$q.onSSRHydrated()
  }
}
```

## Nodejs Server

Adding SSR mode to a Quasar project means a new folder will be created: `/src-ssr`, which contains SSR specific files:

<doc-tree :def="scope.nodeJsTree" />

You can freely edit these files. Each of the two folders are detailed in their own doc pages (check left-side menu).

Notice a few things:

1. These files run in a Node context (they are NOT transpiled by Babel), so use only the ES6 features that are supported by your Node version. (https://node.green/)

2. If you import anything from node_modules, then make sure that the package is specified in package.json > "dependencies" and NOT in "devDependencies".

3. The `/src-ssr/middlewares` is built through a separate Esbuild config. You can extend the Esbuild configuration of these files through quasar.config.js:

```js
return {
  // ...
  ssr: {
    // ...
    extendSSRWebserverConf (esbuildConf) {
      // tamper with esbuildConf here
    },
  }
}
```

4. The `/src-ssr/server.js` file is detailed in [SSR Webserver](/quasar-cli-vite/developing-ssr/ssr-webserver) page. Read it especially if you need to support serverless functions.

## Helping SEO

One of the main reasons when you develop a SSR instead of a SPA is for taking care of the SEO. And SEO can be greatly improved by using the [Quasar Meta Plugin](/quasar-plugins/meta) to manage dynamic html markup required by the search engines.

## Boot Files

When running on SSR mode, your application code needs to be isomorphic or "universal", which means that it must run both on a Node context and in the browser. This applies to your [Boot Files](/quasar-cli-vite/boot-files) too.

However, there are cases where you only want some boot files to run only on the server or only on the client-side. You can achieve that by specifying:

```js
// quasar.config.js
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

When a boot file runs on the server, you will have access to one more parameter (called [ssrContext](/quasar-cli-vite/developing-ssr/ssr-context)) on the default exported function:

```js
// some boot file
export default ({ app, ..., ssrContext }) => {
  // You can add props to the ssrContext then use them in the /index.html.
  // Example - let's say we ssrContext.someProp = 'some value', then in index template we can reference it:
  // {{ someProp }}
}
```

When you add such references (`someProp` surrounded by brackets in the example above) into your `/index.html`, make sure you tell Quasar it’s only valid for SSR builds:

```html
<!-- /index.html -->
<% if (ctx.mode.ssr) { %>{{ someProp }} <% } %>
```
