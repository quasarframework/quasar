---
title: SSR Middleware
desc: Managing the SSR middleware in a Quasar app.
related:
  - /quasar-cli/quasar-conf-js
---

The SSR middleware files fulfill one special purpose: they prepare the Nodejs server that runs your SSR app with additional functionality (Expressjs compatible middleware).

With SSR middleware files, it is possible to split the middleware logic into self-contained, easy to maintain files. It is also trivial to disable any of the SSR middleware files or even contextually determine which of the SSR middleware files get into the build through `quasar.conf.js` configuration.

::: tip
For more advanced usage, you will need to get acquainted to the [Expressjs API](https://expressjs.com/en/4x/api.html).
:::

::: warning
You will need at least one SSR middleware file which handles the rendering of the page with Vue (which should be positioned as last in the middlewares list). When SSR mode is added to your Quasar CLI project, this will be scaffolded into `src-ssr/middlewares/render.js`.
:::

## Anatomy of a middleware file

A SSR middleware file is a simple JavaScript file which exports a function. Quasar will then call the exported function when it prepares the Nodejs server (Expressjs) app and additionally pass an Object as param (which will be detailed in the next section).

```js
// import something here

export default ({ app, resolve, publicPath, folders, render, serve }) => {
  // something to do with the server "app"
}
```

Boot files can also be async:

```js
// import something here

export default async ({ app, resolve, publicPath, folders, render, serve }) => {
  // something to do with the server "app"
  await something()
}
```

You can wrap the returned function with `ssrMiddleware` helper to get a better IDE autocomplete experience (through Typescript):

```js
import { ssrMiddleware } from 'quasar/wrappers'

export default ssrMiddleware(async ({ app, resolve, publicPath, folders, render, serve }) => {
  // something to do
  await something()
})
```

Notice we are using the [ES6 destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). Only assign what you actually need/use.

## Middleware object parameter

We are referring here to the Object received as parameter by the default exported function of the SSR middleware file.

```js
export default ({ app, resolve, publicPath, folders, render, serve }) => {
```

Detailing the Object:

```js
{
  app, // Expressjs app instance
  resolve: {
    urlPath(path)
    root(arg1, arg2),
    public(arg1, arg2)
  },
  publicPath, // String
  folders: {
    root,     // String
    public    // String
  },
  render(ssrContext),
  serve: {
    static(path, opts),
    error({ err, req, res })
  }
}
```

#### app

This is the Expressjs app instance. The "bread and butter" of any middleware since you'll be using it to configure the webserver.

#### resolve

| Prop name | Description |
| --- | --- |
| `urlPath(path)` | Whenever you define a route (with app.use(), app.get(), app.post() etc), you should use the `resolve.urlPath()` method so that you'll also keep into account the configured publicPath (quasar.conf.js > build > publicPath). |
| `root(path1[, path2, ...pathN])` | Resolve folder path to the root (of the project in dev and of the distributables in production). Under the covers, it does a `path.join()`. |
| `public(path1[, path2, ...pathN])` | Resolve folder path to the "public" folder. Under the covers, it does a `path.join()`. |

#### publicPath

The configured quasar.conf.js > build > publicPath

#### folders

The `folders` is sometimes needed because the exact path to root folder and to the public folder differs in a production build than in a development build. So by using `folders` you won't need to mind about this.

| Prop name | Description |
| --- | --- |
| `root` | Full path to the root (of the project in dev and of the distributables in production). |
| `public` | Full path to the "public" folder. |

#### render

* Syntax: `<Promise(String)> render.vue(ssrContext)`.
* Description: Uses Vue and Vue Router to render the requested URL path. Returns the rendered HTML string to return to the client.


#### serve

serve.static():

* Syntax: `<middlewareFn> serve.static(pathFromPublicFolder, opts)`
* Description: It's essentially a wrapper over `express.static()` with a few convenient tweaks:
  * the `pathFromPublicFolder` is a path resolved to the "public" folder out of the box
  * the `opts` are the same as for `express.static()`
  * `opts.maxAge` is used by default, taking into account the quasar.conf.js > ssr > maxAge configuration; this sets how long the respective file(s) can live in browser's cache

  ```js
  serve.static('my-file.json')

  // is equivalent to:

  express.static(resolve.public('my-file.json'), {
    maxAge: ... // quasar.conf.js > ssr > maxAge
  })
  ```

serve.error():

* Syntax: `<void> render.error({ err, req, res })`
* Description: Displays a wealth of useful debug information (including the stack trace).
* It's available only in development and **NOT in production**.

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
export default async ({ app resolveUrlPath, publicPath, folders, render }) => {
  // something to do with the server "app"
}
```

You can also return a Promise:

```js
// import something here

export default ({ app, resolve, publicPath, folders, render, serve }) => {
  return new Promise((resolve, reject) => {
    // something to do with the server "app"
  })
}
```

You can now add content to that file depending on the intended use of your SSR middleware file.

The last step is to tell Quasar to use your new SSR middleware file. For this to happen you need to add the file in `/quasar.conf.js`

```js
// quasar.conf.js

ssr: {
  middlewares: [
    // references /src-ssr/middlewares/<name>.js
    '<name>'
  ]
}
```

When building a SSR app, you may want some boot files to run only on production or only on development, in which case you can do so like below:

```js
// quasar.conf.js

ssr: {
  middlewares: [
    ctx.prod ? '<name>' : '', // I run only on production!
    ctx.dev ? '<name>' : '' // I run only on development
  ]
}
```

In case you want to specify SSR middleware file from node_modules, you can do so by prepending the path with `~` (tilde) character:

```js
// quasar.conf.js

ssr: {
  middlewares: [
    // boot file from an npm package
    '~my-npm-package/some/file'
  ]
}
```

::: warning
The order in which you specify the SSR middlewares matters because it determines the way in which the middlewares are applied to the Nodejs server. So they influence how it responds to the client.
:::

## The SSR render middleware

::: danger Important!
Out of all the possible SSR middlewares in your app, **this one is absolutely required**, because it handles the actual SSR rendering with Vue.
:::

In the example below we highlight that this middleware needs to be the last in the list. This is because it also responds to the client (as we'll see in the second code sample below) with the HTML of the page. So any subsequent middleware cannot set headers.

```js
// quasar.conf.js

ssr: {
  middlewares: [
    // ..... all other middlewares

    'render' // references /src-ssr/middlewares/render.js;
             // you can name the file however you want,
             // just make sure that it runs as last middleware
  ]
}
```

Now let's see what it contains:

```js
// src-ssr/middlewares/render.js

// This middleware should execute as last one
// since it captures everything and tries to
// render the page with Vue

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

Notice the `render` parameter (from the above code sample) that the exported function of the middleware gets called with. That's where the SSR rendering happens.

## Hot Module Reload

While developing, whenever you change anything in the SSR middlewares, Quasar App CLI will automatically trigger a recompilation of client-side resources and apply the middleware changes to the Nodejs server (Expressjs).

## Examples of SSR middleware

::: tip
You can use any Expressjs compatible middleware.
:::

### Compression

This one makes sense to use it for production only.

```js
import compression from 'compression'

export default ({ app }) => {
  app.use(
    compression({ threshold: 0 })
  )
}
```

### Logger / Interceptor

The order in which the SSR middlewares are applied matters. So it might be wise to set the following one as the first (in quasar.conf.js > ssr > middlewares) so that it will be able to intercept all client requests.

```js
export default ({ app, resolve }) => {
  app.all(resolve.urlPath('*'), (req, _, next) => {
    console.log('someone requested:', req.url)
    next()
  })
}
```
