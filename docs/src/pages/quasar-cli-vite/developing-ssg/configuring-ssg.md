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

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

## quasar.config file

The `ssg` section controls generated fallback files, client-rendered routes, PWA takeover, store hydration, and advanced build hooks. Page generation itself belongs in `/src-ssg/ssg-renderer`.

Options shared by the `ssg` and `ssr` sections can be configured once. When a shared option is omitted from `ssg`, Quasar uses an explicitly configured value from `ssr`. A value specified in `ssg`, including `false` or an empty array, always takes precedence.

```js /quasar.config file
export default defineConfig(() => ({
  ssr: {
    // Also used by SSG because SSG does not override it
    clientSideRenderingRoutes: ['/admin/**']
  },

  ssg: {
    error404HtmlFilename: '404.html'
  }
}))
```

This applies to `pwaOfflineHtmlFilename`, `clientSideRenderingRoutes`, and the `manualStore*` and `manualPostHydrationTrigger` options. The `pwa` option remains mode-specific so that enabling PWA takeover for one mode does not implicitly enable it for the other. Other mode-specific options and extension hooks are not shared.

A typical configuration needs only a few options:

```js /quasar.config file
export default defineConfig(() => ({
  ssg: {
    // Generate a PWA service worker and offline shell
    pwa: false,

    // Generate dist/ssg/404.html
    error404HtmlFilename: '404.html',

    /**
     * Exclude these routes from pre-rendering and generate csr.html
     * Note on picomatch patterns:
     *   "/admin" matches the exact route only
     *   "/admin/**" matches the exact route and all sub-routes of /admin
     *   "/admin/*" matches only direct sub-routes of /admin
     *   "/admin/{users,settings}" matches both exact routes /admin/users and /admin/settings
     */
    clientSideRenderingRoutes: ['/account{,/**}', '/admin']
  }
}))
```

The complete option reference follows. Most applications should leave the manual hydration and build-extension options at their defaults.

```ts /quasar.config file
ssg: {
  /**
    * Defines how to handle errors encountered during the SSG rendering process.
    *
    * Possible values:
    *  - "abort": Immediately halts the build process on the first error.
    *  - "error": Accumulates all errors and fails the build at the end.
    *  - "warn": Logs the errors to the console, but the build finishes successfully.
    *  - "ignore": Silently ignores errors with a single warning at the end
    *              with how many pages failed to render.
    *  - A custom function to implement your own error handling logic.
    *
    * Function example:
    *   onSsgRendererError: ({ err, reason, ssgPage }) => {
    *     const pageId = `${ssgPage.route} ${ssgPage.label ? ` (${ssgPage.label})` : ''}`
    *     console.error(
    *       `Error rendering SSG page with route ${pageId}${reason ? `: ${reason}` : ''}`
    *     )
    *     // Optional: exit the build process with an error code
    *     // If not exiting, the build will continue and accumulate errors then fail at the end.
    *     process.exit(1)
    *   }
    *
    * @type OnSsgBuildError
    * @default 'abort'
    */
  onSsgRendererError?:
    | "abort"
    | "error"
    | "warn"
    | "ignore"
    | (({
        err,
        reason,
        ssgPage
      }: {
        err: Error;
        reason?: string;
        ssgPage: SsgPage;
      }) => void | Promise<void>);

  /**
   * The number of threads to use for the SSG rendering process.
   * This can help speed up the rendering of multiple pages by utilizing multiple CPU cores.
   *
   * @default Math.max(1, os.availableParallelism() - 1)
   */
  ssgRendererConcurrency?: number;

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
    * If not explicitly configured and `clientSideRenderingRoutes`
    * is not its default value (an empty array), then this option will
    * default to 'csr.html'.
    *
    * @default false | 'csr.html'
    */
  clientSideRenderingHtmlFilename?: string | false;

  /**
    * Configure this for a hybrid SSG + partial CSR (Client-Side Rendering)
    * approach, where you have some Vue Router routes that you want to be
    * rendered on the client-side exclusively.
    *
    * When not also specifying `clientSideRenderingHtmlFilename`, the default
    * value for it becomes 'csr.html'.
    *
    * For production, you will need to properly configure the webserver
    * to fallback to the `clientSideRenderingHtmlFilename` for the pages that
    * are not pre-rendered by SSG.
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
    * @default ssr.clientSideRenderingRoutes (when configured), otherwise []
    */
  clientSideRenderingRoutes?: string[];

  /**
   * Configure the Vue Router routes for which you don't want to inject
   * preload tags in the generated HTML by the SSG renderer process.
   *
   * You can use picomatch patterns to match the routes you want
   * no preload tags for. https://www.npmjs.com/package/picomatch
   *
   * Note on picomatch patterns:
   *   "/admin" matches the exact route only
   *   "/admin/**" matches the exact route and all sub-routes of /admin
   *   "/admin/*" matches only direct sub-routes of /admin
   *   "/admin/{users,settings}" matches both exact routes /admin/users and /admin/settings
   *
   * @example ['/dashboard', '/admin/**']
   * @default ssr.noPreloadTagRoutes (when configured), otherwise []
   */
  noPreloadTagRoutes?: string[];

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
    * @default ssr.pwaOfflineHtmlFilename (when configured), otherwise 'offline.html'
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
    * @default ssr.manualStoreSerialization (when configured), otherwise false
    */
  manualStoreSerialization?: boolean;

  /**
    * Manually inject the store state into ssrContext.state
    * @default ssr.manualStoreSsrContextInjection (when configured), otherwise false
    */
  manualStoreSsrContextInjection?: boolean;

  /**
    * Manually handle the store hydration instead of letting Quasar CLI do it.
    *
    * For Pinia: store.state.value = window.__INITIAL_STATE__
    *
    * @default ssr.manualStoreHydration (when configured), otherwise false
    */
  manualStoreHydration?: boolean;

  /**
    * Manually call $q.onSSRHydrated() instead of letting Quasar CLI do it.
    * This announces that client-side code should takeover.
    * @default ssr.manualPostHydrationTrigger (when configured), otherwise false
    */
  manualPostHydrationTrigger?: boolean;
}
```

> If you enable PWA client takeover, Quasar CLI installs PWA mode too. Read [SSG with PWA](/quasar-cli-vite/developing-ssg/ssg-with-pwa) and the [Quasar PWA guide](/quasar-cli-vite/developing-pwa/introduction).

> If you want certain routes of your app to be rendered exclusively on the client side, [Hybrid SSG + partial CSR](/quasar-cli-vite/developing-ssg/hybrid-ssg-with-partial-csr) is here for you.

To extend the Vite configuration used to build application code under `/src`, use the normal `build.extendViteConf` hook and check for SSG mode:

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

By default, Quasar CLI serializes the Pinia state into the generated HTML and hydrates the store on the client.

Set `ssg.manualStoreHydration: true` only when you need to replace that client-side hydration step. For example, use a client-only [boot file](/quasar-cli-vite/boot-files):

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

For an advanced integration that must control this timing, set `ssg.manualPostHydrationTrigger: true` and call the hook yourself after mounting:

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

Important details:

1. A package imported directly by `/src-ssg/ssg-renderer` must be listed in `/src-ssg/package.json` and installed in that folder.

2. The renderer is built with a separate Rolldown configuration. Extend it through `/quasar.config` only when the renderer needs custom build behavior:

```ts /quasar.config file
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
```

3. See [SSG Renderer](/quasar-cli-vite/developing-ssg/ssg-renderer) for the renderer API and page examples.

## Helping SEO

Use the [Quasar Meta Plugin](/quasar-plugins/meta) to include route-specific titles, descriptions, canonical links, and social metadata in generated HTML. See [SEO for SSG](/quasar-cli-vite/developing-ssg/seo-for-ssg).

## Boot Files

In SSG mode, application code must be universal: it runs in Node.js during the production build and again in the browser during hydration. This also applies to [Boot Files](/quasar-cli-vite/boot-files).

Mark browser-only or build-time-only boot files explicitly:

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

Server-only boot files run at build time for every rendered page. They do not run on the production static host.

When a boot file runs during server-side generation, its callback receives the [ssrContext](/quasar-cli-vite/developing-ssr/ssr-context):

```js Some boot file
import { defineBoot } from '#q-app'

export default defineBoot(({ ssrContext }) => {
  ssrContext.someProp = 'some value'
})
```

When `/index.html` references a custom value, guard it by mode and ensure every applicable page definition provides that value:

```html /index.html
<% if (ctx.mode.ssg) { %>{{ ssrContext.someProp }} <% } %>
```
