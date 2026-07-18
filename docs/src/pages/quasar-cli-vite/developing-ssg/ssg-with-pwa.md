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
   *
   * Make sure to name it so that the SSG generated html files
   * don't conflict with it! Also, it shouldn't clash with the
   * "clientSideRenderingHtmlFilename" option if you are using that.
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

Use `extendSSGGenerateSWOptions` with Workbox `GenerateSW`, or `extendSSGInjectManifestOptions` with `InjectManifest`. The service worker's actual caching behavior depends on those settings; it should not be assumed that every later request is always served from cache.

::: warning
Deploy the entire output directory, including the service worker, manifest, icons, Workbox files, generated pages, and offline shell. Service workers also require HTTPS in production, except on localhost.
:::

> For more information on PWA, head on to [PWA Introduction](/quasar-cli-vite/developing-pwa/introduction) and read the whole PWA Guide section.
