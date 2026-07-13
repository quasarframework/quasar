---
title: Configuring SSG
desc: (@quasar/app-vite) How to manage your SSG apps with Quasar CLI.
related:
  - /quasar-cli-vite/quasar-config-file
scope:
  nodeJsTree:
    l: src-ssg
    c:
      - l: ssg-renderer.js
        e: (or .ts) SSG generator script
      - l: package.json
        e: helps install SSG only deps directly under /src-ssg
---

::: warning Warning! Alpha Stage
The Quasar SSG Mode is currently in the "alpha" stage. The API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

## quasar.config file

This is the place where you can configure some SSG options. Like if you want the client side to takeover as a SPA (Single Page Application -- the default behaviour), or as a PWA (Progressive Web App).

```ts /quasar.config file
return {
  // ...
  ssg: {
    /**
     * If a PWA should take over or just a SPA.
     * @default false
     */
    pwa?: boolean;

    /**
     * When using SSG+PWA, this is the name of the
     * PWA index html file that the client-side fallbacks to.
     *
     * Make sure to name it so that the SSG generated html files
     * don't conflict with it! Also, it shouldn't clash with the
     * "clientSideRenderingHtmlFilename" option if you are using that.
     *
     * @default 'offline.html'
     */
    pwaOfflineHtmlFilename?: string;

    /**
     * The name of the html file that will be used for the 404 page.
     * If set to false, no 404 page will be generated.
     *
     * You will need to properly configure the webserver to serve this
     * file for 404 errors.
     *
     * Make sure to name it so that the SSG generated html files
     * don't conflict with it!
     *
     * @default '404.html'
     */
    error404HtmlFilename?: string | false;

    /**
     * Configure this for a hybrid SSG + partial CSR (Client-Side Rendering)
     * build, where you want the client to use an empty shell html for some
     * of the pages (as if those pages are part of a SPA) and let the client-side
     * code take over and render the page.
     *
     * For production only. You will need to properly configure the webserver
     * to fallback to this html file for the pages that are not pre-rendered by SSG.
     *
     * Make sure to name it so that the SSG generated html files
     * don't conflict with it!
     *
     * If you are building a SSG+PWA app, you might want to directly use the
     * `pwaOfflineHtmlFilename` as the empty shell html file instead,
     * as it will have the same content. Otherwise, make sure to use a different
     * name otherwise it will clash with the `pwaOfflineHtmlFilename` one!
     *
     * @example 'csr.html'
     */
    clientSideRenderingHtmlFilename?: string;

    /**
     * Extend/configure the Workbox GenerateSW options
     * Specify Workbox options which will be applied on top of
     *  `pwa > extendPWAGenerateSWOptions()`.
     *
     * https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
     *
     * Can be async. Can directly modify the "config" parameter or
     * return a new one that will be merged with the default one.
     */
    extendSSGGenerateSWOptions?: (
      config: GenerateSWOptions
    ) => void | GenerateSWOptions | Promise<void | GenerateSWOptions>;

    /**
     * Extend/configure the Workbox InjectManifest options
     * Specify Workbox options which will be applied on top of
     *  `pwa > extendPWAInjectManifestOptions()`.
     *
     * https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
     *
     * Can be async. Can directly modify the "config" parameter or
     * return a new one that will be merged with the default one.
     */
    extendSSGInjectManifestOptions?: (
      config: InjectManifestOptions
    ) => void | InjectManifestOptions | Promise<void | InjectManifestOptions>;

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
     * Extend the Rolldown config that is used for the SSG renderer,
     * which is your /src-ssg/ssg-renderer file.
     *
     * Can be async. Can directly modify the "config" parameter or
     * return a new one that will be merged with the default one.
     */
    extendSSGRendererConf?: (
      config: RolldownOptions
    ) => void | RolldownOptions | Promise<void | RolldownOptions>;

    /**
     * Extend the underlying SSR manifest file generated by Vite,
     * which is used by the server-side renderer to know which files to preload.
     *
     * Can be async. Can directly modify the "ssrManifest" parameter or
     * return a new one that will be merged with the default one.
     */
    extendSSGManifestJson?: (
      ssrManifest: QuasarSsrManifest
    ) => void | QuasarSsrManifest | Promise<void | QuasarSsrManifest>;
  }
}
```

> If you decide to go with a PWA client takeover (**which is a killer combo**), the Quasar CLI PWA mode will be installed too. You may want to check out the [Quasar PWA](/quasar-cli-vite/developing-pwa/introduction) guide too. But most importantly, make sure you read [SSG with PWA](/quasar-cli-vite/developing-ssg/ssg-with-pwa) page.

Should you want to tamper with the Vite config for UI in /src:

```js /quasar.config file
export default defineConfig(ctx => {
  return {
    build: {
      extendViteConf(viteConf, { isClient, isServer }) {
        if (ctx.mode.ssg) {
          // do something with viteConf
          // or return an object to deeply merge with current viteConf
        }
      }
    }
  }
})
```

### Manually triggering store hydration

By default, Quasar CLI takes care of hydrating the Pinia stores (if you use it) on client-side.

However, should you wish to manually hydrate it yourself, you need to set quasar.config file > ssg > manualStoreHydration: true. One good example is doing it from [a boot file](/quasar-cli-vite/boot-files):

```js Some boot file
// MAKE SURE TO CONFIGURE THIS BOOT FILE
// TO RUN ONLY ON CLIENT-SIDE
import { defineBoot } from '#q-app'

export default defineBoot(({ store }) => {
  // For Pinia
  store.state.value = window.__INITIAL_STATE__
})
```

### Manually triggering post-hydration

By default, Quasar CLI wraps your App component and calls `$q.onSSRHydrated()` on the client-side when this wrapper component gets mounted. This is the moment that the client-side takes over. You don't need to configure anything for this to happen.

However should you wish to override the moment when this happens, you need to set quasar.config file > ssg > manualPostHydrationTrigger: true. For whatever your reason is (very custom use-case), this is an example of manually triggering the post hydration:

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

## SSG Renderer

Adding SSG mode to a Quasar project means a new folder will be created: `/src-ssg`, which contains SSG specific files, like the ssg renderer script:

<DocTree :def="scope.nodeJsTree" />

Notice a few things:

1. If you import anything from node_modules in /src-ssg, then make sure that the package is specified in /src-ssg/package.json > "dependencies" (and install that dependency in /src-ssg folder).

2. The SSG renderer file (src-ssg/ssg-renderer) is built through a separate Rolldown config. You can extend the Rolldown configuration of this file through the `/quasar.config` file:

```ts /quasar.config file
return {
  // ...
  ssg: {
    /**
     * Extend the Rolldown config that is used for the SSG renderer,
     * which is your /src-ssg/ssg-renderer file.
     *
     * Can be async. Can directly modify the "config" parameter or
     * return a new one that will be merged with the default one.
     */
    extendSSGRendererConf?: (
      config: RolldownOptions
    ) => void | RolldownOptions | Promise<void | RolldownOptions>;
  }
}
```

4. The `/src-ssg/ssg-renderer.js` file is detailed in [SSG Renderer](/quasar-cli-vite/developing-ssg/ssg-renderer) page.

## Helping SEO

One of the main reasons when you develop a SSR instead of a SPA is for taking care of the SEO. And SEO can be greatly improved by using the [Quasar Meta Plugin](/quasar-plugins/meta) to manage dynamic html markup required by the search engines.

## Boot Files

When running on SSG mode, your application code needs to be isomorphic or "universal", which means that it must run both on a Node.js context and in the browser. This applies to your [Boot Files](/quasar-cli-vite/boot-files) too.

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

When a boot file runs on the server-side (at build time), you will have access to one more parameter (called [ssrContext](/quasar-cli-vite/developing-ssr/ssr-context)) on the default exported function:

```js Some boot file
import { defineBoot } from '#q-app'

export default defineBoot(({ app, ..., ssrContext }) => {
  // You can add props to the ssrContext then use them in the /index.html.
  // Example - let's say we ssrContext.someProp = 'some value', then in index template we can reference it:
  // {{ ssrContext.someProp }}
})
```

When you add such references into your `/index.html`, make sure you tell Quasar it's only valid for SSG builds. And also, that your /src-ssg/ssg-renderer file returns SSG pages with configured ssrContext props that you reference.

```html /index.html
<% if (ctx.mode.ssg) { %>{{ ssrContext.someProp }} <% } %>
```
