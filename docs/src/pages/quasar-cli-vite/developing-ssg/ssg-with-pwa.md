---
title: SSG with PWA Client Takeover
desc: (@quasar/app-vite) How to configure your Quasar SSG app to become a Progressive Web App on the client side.
---

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

SSG can serve pre-rendered HTML on the first visit and then install a service worker for offline support and subsequent navigations. The following options are generated in the `ssg` section of `/quasar.config`:

```js /quasar.config file
ssg: {
  /**
   * If a PWA should take over or just a SPA.
   * @default false
   */
  pwa?: boolean;

  /**
   * When using SSG+PWA, this is the name of the
   * PWA index html file that the client-side fallbacks to.
   * For production only.
   *
   * Make sure to name it so that the SSG generated html files
   * don't conflict with it. It may intentionally match
   * `clientSideRenderingHtmlFilename` to reuse the same application shell.
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
}
```

Set `pwa: true` to enable PWA takeover. Adding SSG mode with this option enabled also installs PWA mode when needed. Configure the manifest, icons, Workbox mode, and service worker through the normal [`pwa` configuration](/quasar-cli-vite/developing-pwa/configuring-pwa).

The production build generates the normal SSG pages, the PWA assets, and an application shell at `dist/ssg/offline.html` by default. The service worker uses that shell as its navigation fallback. Do not name it `index.html`, and do not give it the same name as a generated SSG page.

## How navigations are served

The first visit of a new client is served by your static host, which is also when the service worker gets installed. From then on, the service worker answers navigations, in this order:

1. if the requested URL matches a pre-rendered page in the precache, that page is served from cache, with its server-rendered markup and serialized state intact, exactly like a first visit would be
2. otherwise (a route that was not pre-rendered, or a URL that does not map to a generated file) the offline shell answers, and the page is rendered on the client

The second case is a client-side rendering page: no server-rendered markup, no serialized state, so [store hydration](/quasar-cli-vite/developing-ssr/configuring-ssr#manually-triggering-store-hydration) does not happen there and the [preFetch feature](/quasar-cli-vite/prefetch-feature) hooks run on the client.

Either way the network is not contacted for navigations, so a re-deployed page reaches your users when the service worker updates its precache, not before.

## Customizing Workbox

SSG-specific extension hooks run after their corresponding PWA hooks:

```js /quasar.config file
ssg: {
  pwa: true,

  extendSSGGenerateSWOptions (workboxConfig) {
    workboxConfig.navigateFallbackDenylist.push(
      /^\/api\//,
      /^\/admin\//
    )
  }
}
```

Use `extendSSGGenerateSWOptions` with Workbox `GenerateSW`, or `extendSSGInjectManifestOptions` with `InjectManifest`.

Keep in mind that the precache route is registered before the navigation fallback and before any `runtimeCaching` route, so a pre-rendered page is always answered from the precache. Making navigations go over the network means keeping the generated pages out of the precache (through `globIgnores`) in the first place.

::: warning
Deploy the entire output directory, including the service worker, manifest, icons, Workbox files, generated pages, and offline shell. Service workers also require HTTPS in production, except on localhost.
:::

> For more information on PWA, head on to [PWA Introduction](/quasar-cli-vite/developing-pwa/introduction) and read the whole PWA Guide section.
