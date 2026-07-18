---
title: SSR with PWA Client Takeover
desc: (@quasar/app-vite) How to configure your Quasar server-side rendered app to become a Progressive Web App on the client side.
---

With Quasar CLI you can build your app with the killer combo of SSR + PWA. In order to enable PWA for SSR builds, you need to edit your `/quasar.config` file first:

```js /quasar.config file
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
     * @default ssg.pwaOfflineHtmlFilename (when configured), otherwise 'offline.html'
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
  }
}
```

The first request from a **new** client is served by the webserver, so SSR supplies the initial page content. Once installed, the service worker can handle later navigations. Whether a request is served from cache, the network, or the offline shell depends on the selected Workbox mode and configuration.

> For more information on PWA, head on to [PWA Introduction](/quasar-cli-vite/developing-pwa/introduction) and read the whole PWA Guide section.
