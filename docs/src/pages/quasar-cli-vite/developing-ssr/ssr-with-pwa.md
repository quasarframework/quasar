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

## How navigations are served

The first request from a **new** client is served by the webserver, so SSR supplies the initial page content, and the service worker gets installed along the way.

From that point on, the service worker takes over. With the default configuration of both Workbox modes, Quasar registers the offline shell as the navigation fallback, which ends up in your service worker as:

```js Generated service worker
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('offline.html'), {
    denylist: [/* ... */]
  })
)
```

`createHandlerBoundToURL()` answers straight from the precache and never touches the network, while `NavigationRoute` matches every navigation request. In other words, **each subsequent page load is served the offline shell from cache, and the webserver is not contacted at all**. This is what makes the app load instantly and work offline, and it is what "client takeover" means here.

The offline shell is a client-side rendering shell, so on those page loads:

- there is no server-rendered markup and no serialized state, which means [store hydration](/quasar-cli-vite/developing-ssr/configuring-ssr#manually-triggering-store-hydration) does not happen
- the [preFetch feature](/quasar-cli-vite/prefetch-feature) hooks run on the client instead of on the server
- nothing that lives only on the server side (`ssrContext`, its request and response objects, the server-side part of your boot files) is involved

::: tip
This concerns full page loads only. In-app navigation was already handled by Vue Router on the client, and your API calls still go out over the network as usual.
:::

## Letting the server render every navigation

If you want the SSR webserver to keep serving navigations and the offline shell to kick in only when the network is unavailable, opt out of the navigation fallback and use the offline shell as a fallback of a network strategy instead.

For the `GenerateSW` Workbox mode:

```js /quasar.config file
ssr: {
  pwa: true,

  extendSSRGenerateSWOptions (workboxConfig) {
    delete workboxConfig.navigateFallback
    delete workboxConfig.navigateFallbackDenylist

    workboxConfig.runtimeCaching = [
      ...(workboxConfig.runtimeCaching || []),
      {
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: 'NetworkOnly',
        options: {
          precacheFallback: { fallbackURL: 'offline.html' }
        }
      }
    ]
  }
}
```

For the `InjectManifest` Workbox mode, edit your own service worker instead:

```tabs /src-pwa/sw/custom-sw file
<<| js custom-sw.js |>>
import { NetworkOnly } from 'workbox-strategies'
import { PrecacheFallbackPlugin } from 'workbox-precaching'

// ...replaces the default NavigationRoute:
registerRoute(
  new NavigationRoute(
    new NetworkOnly({
      plugins: [
        new PrecacheFallbackPlugin({
          fallbackURL: import.meta.env.QUASAR_PWA_FALLBACK_HTML
        })
      ]
    }),
    {
      denylist: [
        new RegExp(import.meta.env.QUASAR_PWA_SERVICE_WORKER_REGEX),
        /workbox-(.)*\.js$/
      ]
    }
  )
)
<<| ts custom-sw.ts |>>
import { NetworkOnly } from "workbox-strategies";
import { PrecacheFallbackPlugin } from "workbox-precaching";

// ...replaces the default NavigationRoute:
registerRoute(
  new NavigationRoute(
    new NetworkOnly({
      plugins: [
        new PrecacheFallbackPlugin({
          fallbackURL: import.meta.env.QUASAR_PWA_FALLBACK_HTML
        })
      ]
    }),
    {
      denylist: [
        new RegExp(import.meta.env.QUASAR_PWA_SERVICE_WORKER_REGEX),
        /workbox-(.)*\.js$/
      ]
    }
  )
);
```

Navigations then depend on the network again, so you may also want to enable Workbox's [navigation preload](https://developer.chrome.com/docs/workbox/modules/workbox-navigation-preload/) (`navigationPreload: true`) to avoid paying the service worker startup time on each of them.

> For more information on PWA, head on to [PWA Introduction](/quasar-cli-vite/developing-pwa/introduction) and read the whole PWA Guide section.
