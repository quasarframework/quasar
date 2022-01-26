---
title: SSR Handling of 404 and 500 Errors
desc: Managing the common 404 and 500 HTTP errors in a Quasar server-side rendered app.
---

The handling of the 404 & 500 errors on SSR is a bit different than on the other modes (like SPA). If you check out `/src-ssr/middlewares/render.js`, you will notice the following section:

```js
export default ({ app, resolve, render, serve }) => {
  // we capture any other Express route and hand it
  // over to Vue and Vue Router to render our page
  app.get(resolve.urlPath('*'), (req, res) => {
    res.setHeader('Content-Type', 'text/html')

    render({ req, res })
      .then(html => {
        // now let's send the rendered html to the client
        res.send(html)
      })
      .catch(err => {
        // oops, we had an error while rendering the page

        // we were told to redirect to another URL
        if (err.url) {
          if (err.code) {
            res.redirect(err.code, err.url)
          }
          else {
            res.redirect(err.url)
          }
        }
        // hmm, Vue Router could not find the requested route
        else if (err.code === 404) {
          // Should reach here only if no "catch-all" route
          // is defined in /src/routes
          res.status(404).send('404 | Page Not Found')
        }
        // well, we treat any other code as error;
        // if we're in dev mode, then we can use Quasar CLI
        // to display a nice error page that contains the stack
        // and other useful information
        else if (process.env.DEV) {
          // serve.error is available on dev only
          serve.error({ err, req, res })
        }
        // we're in production, so we should have another method
        // to display something to the client when we encounter an error
        // (for security reasons, it's not ok to display the same wealth
        // of information as we do in development)
        else {
          // Render Error Page on production or
          // create a route (/src/routes) for an error page and redirect to it
          res.status(500).send('500 | Internal Server Error')
        }
      })
  })
}
```

The section above is written after catching the other possible requests (like for /public folder, the manifest.json and service worker, etc). This is where we render the page with Vue and Vue Router.

## Things to be aware of

We'll discuss some architectural decisions that you need to be aware of. Choose whatever fits your app best.

### Error 404

If you define an equivalent 404 route on your Vue Router `/src/router/routes.js` file (like below), then `if (err.code === 404) {` part from the example above will NEVER be `true` since Vue Router already handled it.

```js
// Example of route for catching 404 with Vue Router
{ path: '/:catchAll(.*)*', component: () => import('pages/Error404.vue') }
```

### Error 500

On the `/src-ssr/middlewares/render.js` example at the top of the page, notice that if the webserver encounters any rendering error, we send a simple string back to the client ('500 | Internal Server Error'). If you want to show a nice page instead, you could:

1. Add a specific route in `/src/router/routes.js`, like:
  ```js
  { path: 'error500', component: () => import('pages/Error500.vue') }
  ```
2. Write the Vue component to handle this page. In this example, we create `/src/pages/Error500.vue`
3. Then in `/src-ssr/middlewares/render.js`:
  ```js
  if (err.url) { ... }
  else if (err.code === 404) { ... }
  else {
    // We got a 500 error here;
    // We redirect to our "error500" route newly defined at step #1.
    res.redirect(resolve.urlPath('error500')) // keep account of publicPath though!
  }
  ```

::: danger
The only caveat is that you need to be sure that while rendering '/error500' route you don't get another 500 error, which would put your app into an infinite loop!
:::

A perfect approach to avoid this would simply be to directly return the HTML (as String) of the error 500 page from `/src-ssr/middlewares/render.js`:

```js
res.status(500).send(`<html>....</html>`)
```
