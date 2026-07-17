---
title: Hybrid SSG with partial CSR
desc: (@quasar/app-vite) How to handle a hybrid SSG with partial CSR with Quasar CLI.
---

::: warning Warning! Beta Stage
The Quasar SSG Mode is currently in the "beta" stage. Based on the community feedback, the API may change in the future, so check the release notes each time you upgrade "@quasar/app-vite".
:::

Hybrid SSG lets most routes use pre-rendered HTML while selected routes behave like pages in a SPA. It is useful for authenticated dashboards, account settings, or other pages whose initial content is meaningful only in the browser.

## Configuration

The following options are generated in the `ssg` section of `/quasar.config`:

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
   *   "/admin/*" matches all sub-routes of /admin, but not /admin itself
   *   "/admin/{users,settings}" matches both exact routes /admin/users and /admin/settings
   *
   * @example ['/dashboard', '/admin/**']
   * @default []
   */
  clientSideRenderingRoutes?: string[];
}
```

For example, this configuration renders account routes on the client and writes the shell to `dist/ssg/app-shell.html`:

```js /quasar.config file
ssg: {
  clientSideRenderingHtmlFilename: 'app-shell.html',

  /**
   * Exclude these routes from pre-rendering and generate csr.html
   * Note on picomatch patterns:
   *   "/admin" matches the exact route only
   *   "/admin/**" matches the exact route and all sub-routes of /admin
   *   "/admin/*" matches all sub-routes of /admin, but not /admin itself
   *   "/admin/{users,settings}" matches both exact routes /admin/users and /admin/settings
   */
  clientSideRenderingRoutes: ['/account{,/**}', '/admin']
}
```

Do not use a filename that can also be produced by an SSG page. Setting `clientSideRenderingHtmlFilename: false` disables shell generation even when route patterns are configured.

## How It Works

- In development, matching routes bypass server rendering and use the client application shell.
- During a production build, `parseVueRouterRoutes()` excludes matching routes from the generated-page list (but adds them to `ignoredCsrRoutes` from the returned Object).
- The production build writes one CSR shell file. Your static host must rewrite each matching request to that file without changing the browser URL.

With the configuration above, requests for `/account/profile` and `/account/security` must both serve `/app-shell.html`. Do not rewrite every missing URL to the CSR shell, because that would turn real not-found requests into client-rendered pages.

See [Deploying SSG](/quasar-cli-vite/developing-ssg/deploying#hybrid-ssg-partial-csr) for nginx and static-host examples.

::: tip SSG + PWA
The PWA offline shell has the same application-shell content. You may set `clientSideRenderingHtmlFilename` to the value of `pwaOfflineHtmlFilename` so both features use one file. Otherwise, the two filenames must be different.
:::
