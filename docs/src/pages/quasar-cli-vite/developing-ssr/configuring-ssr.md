---
title: Configuring SSR
desc: (@quasar/app-vite) How to manage your server-side rendered apps with Quasar CLI.
related:
  - /quasar-cli-vite/quasar-config-file
scope:
  nodeJsTree:
    l: src-ssr
    c:
      - l: server-assets/
        e: copied as-is to dist
      - l: middlewares
        e: SSR middleware files
        c:
          - l: render.js
            e: (or .ts) middleware to render pages with Vue
      - l: server.js
        e: (or .ts) SSR webserver
---

## quasar.config file

This is the place where you can configure some SSR options. Like if you want the client side to takeover as a SPA (Single Page Application -- the default behaviour), or as a PWA (Progressive Web App).

Options shared by the `ssr` and `ssg` sections can be configured once. When a shared option is omitted from `ssr`, Quasar uses an explicitly configured value from `ssg`. A value specified in `ssr`, including `false` or an empty array, always takes precedence.

```js /quasar.config file
export default defineConfig(() => ({
  ssr: {
    prodPort: 3000
  },

  ssg: {
    // Also used by SSR because SSR does not override it
    clientSideRenderingRoutes: ['/admin/**']
  }
}))
```

This applies to `pwa`, `pwaOfflineHtmlFilename`, `clientSideRenderingRoutes`, and the `manualStore*` and `manualPostHydrationTrigger` options. Mode-specific options and extension hooks are not shared.

```ts /quasar.config file
return {
  // ...
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
     *  `pwa > extendPWAGenerateSWOptions()`.
     *
     * https://developer.chrome.com/docs/workbox/the-ways-of-workbox/
     *
     * Can be async. Can directly modify the "config" parameter or
     * return a new one that will be merged with the default one.
     */
    extendSSRGenerateSWOptions?: (
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
    extendSSRInjectManifestOptions?: (
      config: InjectManifestOptions
    ) => void | InjectManifestOptions | Promise<void | InjectManifestOptions>;

    /**
     * Requires @quasar/app-vite v3.1+
     *
     * Configure this for a hybrid SSR + partial CSR (Client-Side Rendering)
     * approach, where you have some Vue Router routes that you want to be
     * rendered on the client-side exclusively.
     *
     * You can use picomatch patterns to match the routes you want to be rendered
     * on the client-side. https://www.npmjs.com/package/picomatch
     *
     * Note on picomatch patterns:
     *   "/admin" matches the exact route only
     *   "/admin/**" matches the exact route and all sub-routes of /admin
     *   "/admin/*" matches only direct sub-routes of /admin
     *   "/admin/{users,settings}" matches both exact routes /admin/users and /admin/settings
     *
     * @example ['/dashboard', '/admin/**']
     * @default []
     */
    clientSideRenderingRoutes?: string[];

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
     * Add/remove/change properties of SSR production generated package.json
     *
     * Can be async. Can directly modify the "pkgJson" parameter or
     * return a new one that will be merged with the default one.
     */
    extendSSRPackageJson?: (pkgJson: { [index in string]: any }) =>
      | void
      | { [index in string]: any }
      | Promise<void | { [index in string]: any }>;

    /**
     * Requires @quasar/app-vite v3.1+
     *
     * Extend the underlying SSR manifest file generated by Vite,
     * which is used by the server-side renderer to know which files to preload.
     *
     * Can be async. Can directly modify the "ssrManifest" parameter or
     * return a new one that will be merged with the default one.
     */
    extendSSRManifestJson?: (
      ssrManifest: QuasarSsrManifest
    ) => void | QuasarSsrManifest | Promise<void | QuasarSsrManifest>;

    /**
     * Extend the Rolldown config that is used for the SSR webserver
     * (which includes the SSR middlewares).
     *
     * Can be async. Can directly modify the "config" parameter or
     * return a new one that will be merged with the default one.
     */
    extendSSRWebserverConf?: (
      config: RolldownOptions
    ) => void | RolldownOptions | Promise<void | RolldownOptions>;

    /**
     * The named exports to use for the production generated SSR index.js script.
     * Works with `false` (no named exports), a single string (one named export),
     * or an array of strings (multiple named exports).
     *
     * Useful for serverless environments where you might want to export the
     * handler function. It creates one or more named exports from the
     * object returned by the defineSsrListen() function in /src-ssr/server file.
     *
     * @default false
     *
     * @example
     * prodScriptNamedExport: ['handler', 'ssr']
     * export const listen = defineSsrListen(() => {
     *   if (import.meta.env.QUASAR_PROD) {
     *     return { handler, ssr }
     *   }
     * })
     *
     * This will generate an SSR index.js with the following exports:
     * const { handler, ssr } = await listen({...})
     * export { handler, ssr }
     *
     * @example
     * prodScriptNamedExport: 'default'
     * export const listen = defineSsrListen(({ app }) => {
     *   if (import.meta.env.QUASAR_PROD) {
     *     return { default: app }
     *   }
     * })
     *
     * This will generate an SSR index.js with the following exports:
     * const listenResult = await listen({...})
     * export default listenResult?.default
     *
     * @example
     * prodScriptNamedExport: 'app'
     * export const listen = defineSsrListen(({ app }) => {
     *   if (import.meta.env.QUASAR_PROD) {
     *     return { app }
     *   }
     * })
     *
     * This will generate an SSR index.js with the following exports:
     * const { app } = await listen({...})
     * export { app }
     *
     * @example 'renderSsrContext' (special case)
     *
     * This will generate an SSR index.js with the following export:
     *   export { render as renderSsrContext }
     * where "render" is the same function used in
     * the /src-ssr/middlewares/render file
     */
    prodScriptNamedExport?: false | string | string[];
  }
}
```

> If you decide to go with a PWA client takeover (**which is a killer combo**), the Quasar CLI PWA mode will be installed too. You may want to check out the [Quasar PWA](/quasar-cli-vite/developing-pwa/introduction) guide too. But most importantly, make sure you read [SSR with PWA](/quasar-cli-vite/developing-ssr/ssr-with-pwa) page.

Should you want to tamper with the Vite config for UI in /src:

```js /quasar.config file
export default defineConfig(ctx => {
  return {
    build: {
      extendViteConf(viteConf, { isClient, isServer }) {
        if (ctx.mode.ssr) {
          // do something with viteConf
          // or return an object to deeply merge with current viteConf
        }
      }
    }
  }
})
```

### Manually triggering store hydration

By default, Quasar CLI hydrates Pinia stores on the client.

However, should you wish to manually hydrate it yourself, you need to set quasar.config file > ssr > manualStoreHydration: true. One good example is doing it from [a boot file](/quasar-cli-vite/boot-files):

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

## Node.js Webserver

Adding SSR mode to a Quasar project means a new folder will be created: `/src-ssr`, which contains SSR specific files for the actual Node.js webserver:

<DocTree :def="scope.nodeJsTree" />

You can freely edit these files. All folders are detailed in their own doc pages (check left-side menu).

Notice a few things:

1. If `/src-ssr` imports a package needed at runtime, list it in `/src-ssr/package.json > dependencies`, not `devDependencies`. Quasar copies it into the generated production `package.json` so it can be installed during deployment.

2. These files are built through a separate Rolldown config. You can extend the Rolldown configuration of these files through the `/quasar.config` file:

```js /quasar.config file
return {
  // ...
  ssr: {
    /**
     * Extend the Rolldown config that is used for the SSR webserver
     * (which includes the SSR middlewares).
     *
     * Can be async. Can directly modify the "config" parameter or
     * return a new one that will be merged with the default one.
     */
    extendSSRWebserverConf?: (
      config: RolldownOptions
    ) => void | RolldownOptions | Promise<void | RolldownOptions>;
  }
}
```

3. The `/src-ssr/server.js` file is detailed on the [SSR Webserver](/quasar-cli-vite/developing-ssr/ssr-webserver) page. Read it especially if you need to support serverless functions.

## Helping SEO

SSR allows crawlers to receive rendered content for each route. Use the [Quasar Meta Plugin](/quasar-plugins/meta) to add the page titles, descriptions, canonical URLs, and structured data needed by search engines.

## Boot Files

In SSR mode, shared application code must run in both Node.js and browser contexts. This also applies to [Boot Files](/quasar-cli-vite/boot-files).

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

When a boot file runs on the server, you will have access to one more parameter (called [ssrContext](/quasar-cli-vite/developing-ssr/ssr-context)) on the default exported function:

```js Some boot file
import { defineBoot } from '#q-app'

export default defineBoot(({ app, ..., ssrContext }) => {
  // You can add props to the ssrContext then use them in the /index.html.
  // Example - let's say we ssrContext.someProp = 'some value', then in index template we can reference it:
  // {{ ssrContext.someProp }}
})
```

When you add such references into your `/index.html`, make sure you tell Quasar it's only valid for SSR builds:

```html /index.html
<% if (ctx.mode.ssr) { %>{{ ssrContext.someProp }} <% } %>
```
