---
title: SSR Middleware
desc: Managing the SSR middleware in a Quasar app.
related:
  - /quasar-cli/quasar-conf-js
---

The SSR middleware files fulfill one special purpose: they prepare the Express app with additional functionality.

// TODO...

With SSR middleware files, it is possible to split each of your dependencies into self-contained, easy to maintain files. It is also trivial to disable any of the SSR middleware files or even contextually determine which of the boot files get into the build through `quasar.conf.js` configuration.

::: tip
As you will learn by reading this page, **there is one required SSR middleware file** that you need to have in your app.
:::

## Anatomy of a middleware file

A SSR middleware file is a simple JavaScript file which exports a function. Quasar will then call the exported function when it prepares the Express app and additionally pass **an object** with the following properties to the function:

| Prop name | Description |
| --- | --- |
| `app` | Express app instance |
| `resolveUrlPath` | The pathname (path + search) part of the URL. It also contains the hash on client-side. |
| `publicPath` | The configured public path. |
| `render` | Object with two methods: `vue` and `error`. Explained in the "Required SSR middleware" section below. |

```js
// import something here

export default ({ app /*, resolveUrlPath, publicPath, render */ }) => {
  // something to do with the server "app"
}
```

Boot files can also be async:

```js
// import something here

export default async ({ app /*, resolveUrlPath, publicPath, render */ }) => {
  // something to do with the server "app"
  await something()
}
```

You can wrap the returned function with `ssrMiddleware` helper to get a better IDE autocomplete experience (through Typescript):

```js
import { ssrMiddleware } from 'quasar/wrappers'

export default ssrMiddleware(async ({ app /*, resolveUrlPath, publicPath, render */ }) => {
  // something to do
  await something()
})
```

Notice we are using the [ES6 destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). Only assign what you actually need/use.

## Usage of SSR middleware

The first step is always to generate a new SSR middleware file using Quasar CLI:

```bash
$ quasar new ssrmiddleware <name>
```

Where `<name>` should be exchanged by a suitable name for your SSR middleware file.

This command creates a new file: `/src-ssr/middlewares/<name>.js` with the following content:

```js
// import something here

// "async" is optional!
// remove it if you don't need it
export default async ({ app /*, resolveUrlPath, publicPath, render */ }) => {
  // something to do with the server "app"
}
```

You can also return a Promise:

```js
// import something here

export default ({ app /*, resolveUrlPath, publicPath, render */ }) => {
  return new Promise((resolve, reject) => {
    // something to do with the server "app"
  })
}
```

You can now add content to that file depending on the intended use of your SSR middleware file.

The last step is to tell Quasar to use your new SSR middleware file. For this to happen you need to add the file in `/quasar.conf.js`

```js
ssr: {
  middlewares: [
    // references /src-ssr/middlewares/<name>.js
    '<name>'
  ]
}
```

When building a SSR app, you may want some boot files to run only on production or only on development, in which case you can do so like below:

```js
ssr: {
  middlewares: [
    ctx.prod ? '<name>' : '', // I run only on production!
    ctx.dev ? '<name>' : '' // I run only on development
  ]
}
```

In case you want to specify SSR middleware file from node_modules, you can do so by prepending the path with `~` (tilde) character:

```js
ssr: {
  middlewares: [
    // boot file from an npm package
    '~my-npm-package/some/file'
  ]
}
```

## Required SSR middleware for render

// TODO... explain 1. what it does, 2. that it needs to be the last one specified in quasar.conf.js > ssr > middlewares

// TODO: explain render.vue(ssrContext)

// TODO: explain render.error(err, req, res)

```js
// This middleware should execute as last one
// since it captures everything and tries to
// render the page with Vue

export default ({ app, resolveUrl, render }) => {
  app.get(resolveUrl('*'), (req, res) => {
    res.setHeader('Content-Type', 'text/html')

    render.vue({ req, res })
      .then(html => {
        res.send(html)
      })
      .catch(err => {
        if (err.url) {
          if (err.code) {
            res.redirect(err.code, err.url)
          }
          else {
            res.redirect(err.url)
          }
        }
        else if (err.code === 404) {
          // Should reach here only if no "catch-all" route
          // is defined in /src/routes
          res.status(404).send('404 | Page Not Found')
        }
        else if (process.env.DEV) {
          // render.error is available on dev only
          render.error({ err, req, res })
        }
        else {
          // Render Error Page on production or
          // create a route (/src/routes) for an error page and redirect to it
          res.status(500).send('500 | Internal Server Error')
        }
      })
  })
}
```

## Examples of SSR middleware

// TODO...
