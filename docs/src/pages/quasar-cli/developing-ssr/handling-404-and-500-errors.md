---
title: SSR Handling of 404 and 500 Errors
desc: Managing the common 404 and 500 HTTP errors in a Quasar server-side rendered app.
---
The handling of the 404 & 500 errors on SSR is a bit different than on the other modes (like SPA). If you check out `/src-ssr/index.js` (which is your production webserver), you will notice the following section:

```js
// this should be last get(), rendering with SSR
app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  ssr.renderToString({ req, res }, (err, html) => {
    if (err) {
      if (err.url) {
        res.redirect(err.url)
      }
      else if (err.code === 404) {
        // should never reach here if you have a
        // "catch-all" vue router route configured
        res.status(404).send('404 | Page Not Found')
      }
      else {
        // Render Error Page or Redirect
        res.status(500).send('500 | Internal Server Error')
        if (ssr.settings.debug) {
          console.error(`500 on ${req.url}`)
          console.error(err)
          console.error(err.stack)
        }
      }
    }
    else {
      res.send(html)
    }
  })
})
```

The section above is written after catching the other possible requests (like for /public folder, the manifest.json and service worker, etc). This is where we initialize your app, along with your Router and Vue gets to render the requested page.

## Things to be aware of
We'll discuss some architectural decisions that you need to be aware of. Choose whatever fits your app best.

### Error 404
If you define an equivalent 404 route on your Vue Router `/src/router/routes.js` file (like below), then `if (err.code === 404) {` part from the example above will NEVER be `true` since Vue Router already handled it.

```js
// Example of route for catching 404 with Vue Router
{ path: '*', component: () => import('pages/Error404.vue') }
```

### Error 500
On the `/src-ssr/index.js` example at the top of the page, notice that if the webserver encounters any rendering error, we send a simple string back to the client ('500 | Internal Server Error'). If you want to show a nice page instead, you could:

1. Add a specific route in `/src/router/routes.js`, like:
  ```js
  { path: 'error500', component: () => import('pages/Error500.vue') }
  ```
2. Write the Vue component to handle this page. In this example, we create `/src/pages/Error500.vue`
3. Then in `/src-ssr/index.js`:
  ```js
  if (err.url) { ... }
  else if (err.code === 404) { ... }
  else {
    // We got a 500 error here;
    // We redirect to our "error500" route newly defined at step #1.
    res.redirect('/error500') // keep account of publicPath though!
  }
  ```

::: danger
The only caveat is that you need to be sure that while rendering '/error500' route you don't get another 500 error, which would put your app into an infinite loop!
:::

A perfect approach to avoid this would simply be to directly return the HTML (as String) of the error 500 page from `/src-ssr/index.js`:

```js
res.status(500).send(`<html>....</html>`)
```
