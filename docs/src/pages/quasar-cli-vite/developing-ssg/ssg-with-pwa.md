---
title: SSG with PWA Client Takeover
desc: (@quasar/app-vite) How to configure your Quasar SSG app to become a Progressive Web App on the client side.
---

::: warning Warning! Alpha Stage
The Quasar SSG Mode is currently in the "alpha" stage. The API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

With Quasar CLI you can build your app with the killer combo of SSG + PWA. In order to enable PWA for SSG builds, you need to edit your `/quasar.config` file first:

```js /quasar.config file
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
}
```

The first request of a **new** client will be served from the webserver (so SSR supplies the initial page content). The PWA gets installed then it takes over on client side. All further requests will be served from cache (unless you have some custom configuration to change that).

> For more information on PWA, head on to [PWA Introduction](/quasar-cli-vite/developing-pwa/introduction) and read the whole PWA Guide section.
