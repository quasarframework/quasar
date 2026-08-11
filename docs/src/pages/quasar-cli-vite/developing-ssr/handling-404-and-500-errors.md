---
title: SSR Handling of 404 and 500 Errors
desc: (@quasar/app-vite) Managing the common 404 and 500 HTTP errors in a Quasar server-side rendered app.
---

The handling of the 404 & 500 errors on SSR is a bit different than on the other modes (like SPA). If you check out the default `/src-ssr/middlewares/render.js`, you will notice that 404 & 500 errors are handled there, based on the outcome of the `render()` call (if it throws error or not).

Here is an example with Express, but the same idea applies to any webserver you choose. The section below is written after catching the other possible requests (like for /public folder, the manifest.json and service worker, etc). This is where we render the page with Vue and Vue Router.

```js /src-ssr/middlewares/render.js
/**
 * We try to render the page html with Vue.
 * If all goes well, we have it and we use it.
 */
try {
  const renderedHtml = await render(/* the ssrContext: */ { req, res })
  res.send(renderedHtml)
} catch (err) {
  /**
   * If the render() call threw an error, we have a few
   * cases:
   */

  if (err?.routeNotFound) {
    /**
     * Hmm, Vue Router could not find the requested route
     * and it does not have a "catch-all" route, so we
     * essentially have a 404. We should handle it here.
     */

    // ...handle it
    return
  }

  if (err?.redirectUrl) {
    /**
     * We were told to redirect to another URL, so use
     * your webserver to do exactly that.
     */

    // ...handle it
    return
  }

  /**
   * If we reach this point, we essentially have
   * a rendering error and we're in the 500 domain.
   */

  if (import.meta.env.QUASAR_DEV) {
    /**
     * Well, we treat any other code as error;
     * if we're in dev mode, then we can use Quasar CLI
     * to display a nice error page that contains the stack
     * and other useful information
     *
     * Note that serve.devError is available on dev only
     */
    const { errorHeaders, errorHtml } = serve.devError({ err, req })

    // ...handle it
    return
  }

  /**
   * If we reach this point, we're in production.
   * Did we compile with debugging information?
   */
  if (import.meta.env.QUASAR_DEBUG) {
    console.error(err instanceof Error ? err.stack : (err ?? 'Unknown error'))
  }

  /**
   * Render Error Page on production or
   * alternatively, create a route (/src/routes) for an error page and redirect to it
   * (just make sure that route won't crash too, otherwise you'll end up in an infinite loop!)
   */
  // ...handle the 500 response
}
```

## Things to be aware of

We'll discuss some architectural decisions that you need to be aware of. Choose whatever fits your app best.

### Error 404

If you define an equivalent 404 route on your Vue Router `/src/router/routes.js` file (like below), then the `if(err.routeNotFound)` part from the example above will NEVER be `true` since Vue Router already handled it.

```js /src/router/routes file
// Example of route for catching 404 with Vue Router
{ path: '/:catchAll(.*)*', component: () => import('@/pages/Error404.vue') }
```

### Error 500

On the `/src-ssr/middlewares/render.js` example at the top of the page, notice that we may end up with a 500 error in dev or production. For the dev part, we can use Quasar CLI's `serve.devError()` to generate a nice page to send back to the client. But for production, this feature is not available, and we can send back the http status code along with a string (some error to be displayed?).

However, if we want to show a nice page instead, either create a function to return its html (just like serve.devError does), or even (and this is a bit dangerous) create a VueRouter route to handle it:

1. Add a specific route in `/src/router/routes.js`, like:

```js /src/router/routes file
{ path: 'error500', component: () => import('@/pages/Error500.vue') }
```

2. Write the Vue component to handle this page. In this example, we create `/src/pages/Error500.vue`
3. Then in `/src-ssr/middlewares/render.js` redirect the client to this path.

::: danger
The only caveat in this case is that you may end up in an endless loop if this VueRouter route throws an erorr too! So be extremely carefull should you choose this path.
:::

The perfect approach to avoid this would simply be to directly return the HTML (as String) of the error 500 page from `/src-ssr/middlewares/render.js`
