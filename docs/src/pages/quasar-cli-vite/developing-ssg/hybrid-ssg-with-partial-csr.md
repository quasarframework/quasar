---
title: Hybrid SSG with partial CSR
desc: (@quasar/app-vite) How to handle a hybrid SSG with partial CSR with Quasar CLI.
---

::: warning Warning! Alpha Stage
The Quasar SSG Mode is currently in the "alpha" stage. The API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

Quasar CLI allows you to build a hybrid SSG with partial CSR (Client-Side Rendering). This is helpful for cases where you want to generate SSG pages only for some of your routes and leave the other be handled on the client-side like a regular SPA.

## Configuration

You can instruct the Quasar CLI to generate a specific html page that will be used for your CSR handled pages:

```js /quasar.config file
ssg: {
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
   * If not explicitly configured to `false` and `clientSideRenderingRoutes`
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
   * @example ['/dashboard', '/admin/**']
   * @default []
   */
  clientSideRenderingRoutes?: string[];
}
```

You will then need to configure your deployment webserver to point to this html file when serving your CSR only routes, instead of the default "index.html".

## How It Works

For dev mode, these pages will not go through rendering with the underlying SSR.

On production, if you have configured ssg.clientSideRenderingHtmlFilename or ssg.clientSideRenderingRoutes, then the Quasar CLI will generate a shell html file that will act similar to a SPA's generated index.html. It will load your app and Vue Router will handle what gets displayed for the respective route(s), along with its resources.

It is important that you configure your deployment webserver correctly for the respective route(s).
