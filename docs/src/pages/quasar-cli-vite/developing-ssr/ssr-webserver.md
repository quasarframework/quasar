---
title: SSR Webserver
desc: (@quasar/app-vite) Configuring the Quasar SSR webserver for different platforms, including a serverless architecture.
---

Notice that your generated `/src-ssr` contains a file named `server.js`. This file defines how your SSR webserver is created, managed and served. You can start listening to a port or provide a handler for your serverless infrastructure to use. It's up to you.

## Anatomy

The `/src-ssr/server.js` file is a simple JavaScript/Typescript file which boots up your SSR webserver and defines what how your webserver starts & handles requests and what it exports (if exporting anything).

::: danger
The `/src-ssr/server.js` file is used for both DEV and PROD, so please be careful on how you configure it. To differentiate between the two states you can use `process∙env∙DEV` and `process∙env∙PROD`.
:::

```js
/**
 * Runs in Node.js context.
 */

/**
 * Make sure to yarn/npm/pnpm/bun install (in your project root)
 * anything you import here (except for express and compression).
 */
import express from 'express'
import compression from 'compression'
import {
  defineSsrCreate,
  defineSsrListen,
  defineSsrClose,
  defineSsrServeStaticContent,
  defineSsrRenderPreloadTag
} from '#q-app/wrappers'

/**
 * Create your webserver and return its instance.
 *
 * Can be async: defineSsrCreate(async ({ ... }) => { ... })
 *
 * Param: ({
 *   port, // on dev: devServer port; on prod: process.env.PORT or quasar.config > ssr > prodPort
 *   devHttpsOptions, // DEV only, if using HTTPS; if using a custom server, you can use this to handle HTTPS on your own instead of using the devHttpsApp in listen()
 *   resolve: {
 *      urlPath, // (url) => path string with publicPath ensured to be included,
 *      root, // (pathPart1, ...pathPartN) => path string (joins to the root folder),
 *      public // (pathPart1, ...pathPartN) => path string (joins to the public folder)
 *   },
 *   publicPath, // string
 *   folders: {
 *     root, // path string of the root folder
 *     public // path string of the public folder
 *   },
 *   render // (ssrContext) => html string
 * })
 */
export const create = defineSsrCreate((/* { ... } */) => {
  const app = express()

  // attackers can use this header to detect apps running Express
  // and then launch specifically-targeted attacks
  app.disable('x-powered-by')

  // place here any middlewares that
  // absolutely need to run before anything else
  if (process.env.PROD) {
    app.use(compression())
  }

  return app
})

/**
 * Used by Quasar SSR dev server to inject middleware into the webserver.
 * It uses it to handle Vite dev server, handle public paths, etc.
 * The given middleware is compatible with `node:http`'s Server, Express, Connect, etc.
 *
 * Can be async: defineSsrInjectDevMiddleware(async ({ app }) => { ... })
 */
export const injectDevMiddleware = defineSsrInjectDevMiddleware(({ app }) => {
  return middleware => {
    app.use(middleware)
  }
})

/**
 * You need to make the server listen to the indicated port
 * and return the listening instance or whatever you need to
 * close the server with.
 *
 * The "listenResult" param for the "close()" definition below
 * is what you return here.
 *
 * For production, you can instead export your
 * handler for serverless use or whatever else fits your needs.
 *
 * Can be async: defineSsrListen(async ({ app, devHttpsApp, port }) => { ... })
 *
 * Param: ({
 *   app, // Express app or whatever is returned from create()
 *   devHttpsApp, // DEV only, if using HTTPS; Node.js HTTPS server instance
 *   devHttpsOptions, // DEV only, if using HTTPS; if using a custom server, you can use this to handle HTTPS on your own
 *   port, // on dev: devServer port; on prod: process.env.PORT or quasar.config > ssr > prodPort
 *   resolve: {
 *      urlPath, // (url) => path string with publicPath ensured to be included,
 *      root, // (pathPart1, ...pathPartN) => path string (joins to the root folder),
 *      public // (pathPart1, ...pathPartN) => path string (joins to the public folder)
 *   },
 *   publicPath, // string
 *   folders: {
 *     root, // path string of the root folder
 *     public // path string of the public folder
 *   },
 *   render, // (ssrContext) => html string
 *   serve: {
 *     static, // ({ urlPath = '/', pathToServe = '.', opts = {} }) => void (OR whatever returned by serveStaticContent())
 *     error // DEV only; ({ err, req, res }) => void
 *   },
 * })
 */
export const listen = defineSsrListen(({ app, devHttpsApp, port }) => {
  const server = devHttpsApp || app
  return server.listen(port, () => {
    if (process.env.PROD) {
      console.log('Server listening at port ' + port)
    }
  })
})

/**
 * Should close the server and free up any resources.
 * Will be used on development only when the server needs
 * to be rebooted.
 *
 * Should you need the result of the "listen()" call above,
 * you can use the "listenResult" param.
 *
 * Can be async: defineSsrClose(async ({ listenResult }) => { ... })
 *
 * Param: ({
 *   app, // Express app or whatever is returned from create()
 *   devHttpsApp, // DEV only, if using HTTPS
 *   port, // on dev: devServer port; on prod: process.env.PORT or quasar.config > ssr > prodPort
 *   resolve: {
 *      urlPath, // (url) => path string with publicPath ensured to be included,
 *      root, // (pathPart1, ...pathPartN) => path string (joins to the root folder),
 *      public // (pathPart1, ...pathPartN) => path string (joins to the public folder)
 *   },
 *   publicPath, // string
 *   folders: {
 *     root, // path string of the root folder
 *     public // path string of the public folder
 *   },
 *   serve: {
 *     static, // ({ urlPath = '/', pathToServe = '.', opts = {} }) => void (OR whatever returned by serveStaticContent())
 *     error // DEV only; ({ err, req, res }) => void
 *   },
 *   render, // (ssrContext) => html string
 *   listenResult // whatever returned from listen()
 * })
 */
export const close = defineSsrClose(({ listenResult }) => {
  return listenResult.close()
})

const maxAge = process.env.DEV ? 0 : 1000 * 60 * 60 * 24 * 30

/**
 * Should return a function that will be used to configure the webserver
 * to serve static content at "urlPath" from "pathToServe" folder/file.
 *
 * Notice resolve.urlPath(urlPath) and resolve.public(pathToServe) usages.
 *
 * Can be async: defineSsrServeStaticContent(async ({ app, resolve }) => {
 * Can return an async function: return async ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
 *
 * Param: ({
 *   app, // Express app or whatever is returned from create()
 *   port, // on dev: devServer port; on prod: process.env.PORT or quasar.config > ssr > prodPort
 *   resolve: {
 *      urlPath: (url) => path string with publicPath ensured to be included,
 *      root: (pathPart1, ...pathPartN) => path string (joins to the root folder),
 *      public: (pathPart1, ...pathPartN) => path string (joins to the public folder)
 *   },
 *   publicPath, // string
 *   folders: {
 *     root, // path string of the root folder
 *     public // path string of the public folder
 *   },
 *   render: (ssrContext) => html string
 * })
 */
export const serveStaticContent = defineSsrServeStaticContent(
  ({ app, resolve }) => {
    return ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
      const serveFn = express.static(resolve.public(pathToServe), {
        maxAge,
        ...opts
      })
      app.use(resolve.urlPath(urlPath), serveFn)
    }
  }
)

const jsRE = /\.js$/
const cssRE = /\.css$/
const woffRE = /\.woff$/
const woff2RE = /\.woff2$/
const gifRE = /\.gif$/
const jpgRE = /\.jpe?g$/
const pngRE = /\.png$/

/**
 * Should return a String with HTML output
 * (if any) for preloading indicated file
 */
export const renderPreloadTag = defineSsrRenderPreloadTag(
  (file /* , { ssrContext } */) => {
    if (jsRE.test(file) === true) {
      return `<link rel="modulepreload" href="${file}" crossorigin>`
    }

    if (cssRE.test(file) === true) {
      return `<link rel="stylesheet" href="${file}" crossorigin>`
    }

    if (woffRE.test(file) === true) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
    }

    if (woff2RE.test(file) === true) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
    }

    if (gifRE.test(file) === true) {
      return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`
    }

    if (jpgRE.test(file) === true) {
      return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`
    }

    if (pngRE.test(file) === true) {
      return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`
    }

    return ''
  }
)
```

::: tip
Remember that whatever the `listen()` function returns (if anything) will be exported from your built `dist/ssr/index.js`. You can return your ssrHandler for a serverless architecture should you need it.
:::

## Usage

::: warning

- If you import anything from node_modules, then make sure that the package is specified in package.json > "dependencies" and NOT in "devDependencies".
- This is usually not the place to add middlewares (but you can do it). Add middlewares by using the [SSR Middlewares](/quasar-cli-vite/developing-ssr/ssr-middleware) instead. You can configure SSR Middlewares to run only for dev or only for production too.
  :::

### Replacing Express

You can replace the default Express server with any other one such as Connect, Fastify, h3, etc. You need to install the relevant packages, then adapt `create`, `listen`, `close`, etc. accordingly.

#### Example: Connect

Since Express is a Connect-based server, you can use Connect as a simple drop-in replacement:

```tabs
<<| bash Yarn |>>
$ yarn add connect
<<| bash NPM |>>
$ npm install --save connect
<<| bash PNPM |>>
$ pnpm add connect
<<| bash Bun |>>
$ bun add connect
```

```js src-ssr/server.js
import { defineSsrCreate } from '#q-app/wrappers'
import connect from 'connect'
import compression from 'compression'

export const create = defineSsrCreate((/* { ... } */) => {
  const app = connect()

  // Place any middleware that needs to run before anything else
  if (process.env.PROD) {
    app.use(compression())
  }

  return app
})
```

#### Example: Fastify

Fastify is considerably different from Express, so it requires a more thorough adaptation:

```tabs
<<| bash Yarn |>>
$ yarn add fastify @fastify/middie @fastify/compress @fastify/static
<<| bash NPM |>>
$ npm install --save fastify @fastify/middie @fastify/compress @fastify/static
<<| bash PNPM |>>
$ pnpm add fastify @fastify/middie @fastify/compress @fastify/static
<<| bash Bun |>>
$ bun add fastify @fastify/middie @fastify/compress @fastify/static
```

```js src-ssr/server.js
import {
  defineSsrCreate,
  defineSsrInjectDevMiddleware,
  defineSsrListen,
  defineSsrClose,
  defineSsrServeStaticContent
} from '#q-app/wrappers'
import Fastify from 'fastify'

// If using TypeScript, also enable the following:
/*
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

import type { Server } from 'node:http'
declare module '#q-app' {
  interface SsrDriver {
    app: FastifyInstance;
    listenResult: Server;
    request: FastifyRequest;
    response: FastifyReply;
  }
}
*/

export const create = defineSsrCreate(async ({ devHttpsOptions }) => {
  const app = Fastify({
    https: devHttpsOptions ?? null
  })

  // Place any middleware that needs to run before anything else
  if (process.env.PROD) {
    await app.register(import('@fastify/compress'))
  }

  return app
})

export const injectDevMiddleware = defineSsrInjectDevMiddleware(
  async ({ app }) => {
    await app.register(import('@fastify/middie'))

    return middleware => {
      app.use(middleware)
    }
  }
)

export const listen = defineSsrListen(async ({ app, port }) => {
  await app.listen({ port })
  return app.server
})

export const close = defineSsrClose(({ listenResult }) => {
  return listenResult.close()
})

const maxAge = process.env.DEV ? 0 : 1000 * 60 * 60 * 24 * 30

export const serveStaticContent = defineSsrServeStaticContent(
  ({ app, resolve }) => {
    return async ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
      await app.register(import('@fastify/static'), {
        root: resolve.public(pathToServe),
        prefix: resolve.urlPath(urlPath),
        maxAge: opts.maxAge ?? maxAge,
        // To avoid conflicts with ./middlewares/render
        wildcard: false,
        index: false
      })
    }
  }
)

// renderPreloadTag logic is the same
```

```js src-ssr/middlewares/render.js
import { defineSsrMiddleware } from '#q-app/wrappers'

export default defineSsrMiddleware(({ app, resolve, render, serve }) => {
  app.get(resolve.urlPath('{*path}'), async (req, res) => {
    res.type('text/html')

    try {
      return await render({ req, res })
    } catch (err) {
      if (err.url) {
        return res.redirect(err.url, err.code)
      }

      if (err.code === 404) {
        return res.status(404).send('404 | Page Not Found')
      }

      if (process.env.DEV) {
        serve.error({ err, req, res })
      } else {
        res.status(500).send('500 | Internal Server Error')

        if (process.env.DEBUGGING) {
          console.error(err.stack)
        }
      }
    }
  })
})
```

### Listen on a port

This is the default option that you get when adding SSR support in a Quasar CLI project. It starts listening on the configured port (process∙env∙PORT or quasar.config file > ssr > prodPort).

```js src-ssr/server.js
export const listen = defineSsrListen(({ app, devHttpsApp, port }) => {
  const server = devHttpsApp || app
  return server.listen(port, () => {
    if (process.env.PROD) {
      console.log('Server listening at port ' + port)
    }
  })
})
```

### Serverless

If you have a serverless infrastructure, then you generally need to export a handler instead of starting to listen to a port.

Say that your serverless service requires you to name export a variable called `handler`. Then what you'd need to do is:

```js src-ssr/server.js
import { defineSsrListen } from '#q-app/wrappers'
export const listen = defineSsrListen(({ app, devHttpsApp, port }) => {
  if (process.env.DEV) {
    // for dev, start listening on the created server
    const server = devHttpsApp || app
    return server.listen(port, () => {
      // we're ready to serve clients
    })
  } else {
    // in production
    // return an object with a "handler" property
    // that the server script will be named-export
    return { handler: app }
  }
})
```

Please note that the provided `app` is a Function of form: `(req, res, next) => void`.
Should you require to export a handler of form `(event, context, callback) => void` then you will most likely want to use the `serverless-http` package (see below).

#### Example: serverless-http

You will need to manually yarn/npm install the `serverless-http` package.

```js src-ssr/server.js
import { defineSsrListen } from '#q-app/wrappers'
import serverless from 'serverless-http'

export const listen = defineSsrListen(({ app, devHttpsApp, port }) => {
  if (process.env.DEV) {
    // for dev, start listening on the created server
    const server = devHttpsApp || app
    return server.listen(port, () => {
      // we're ready to serve clients
    })
  } else {
    // in production
    return { handler: serverless(app) }
  }
})
```

#### Example: Firebase function

```js src-ssr/server.js
import { defineSsrListen } from '#q-app/wrappers'
import * as functions from 'firebase-functions'

export const listen = defineSsrListen(({ app, devHttpsApp, port }) => {
  if (process.env.DEV) {
    // for dev, start listening on the created server
    const server = devHttpsApp || app
    return server.listen(port, () => {
      // we're ready to serve clients
    })
  } else {
    // in production
    return {
      handler: functions.https.onRequest(app)
    }
  }
})
```
