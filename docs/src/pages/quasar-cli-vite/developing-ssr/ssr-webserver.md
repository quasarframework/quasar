---
title: SSR Webserver
desc: (@quasar/app-vite) Configuring the Quasar SSR webserver for different platforms, including a serverless architecture.
---

Notice that your generated `/src-ssr` contains a file named `server.js`. This file defines how your SSR webserver is created, managed and served. You can start listening to a port or provide a handler for your serverless infrastructure to use. It's up to you.

## Anatomy

The `/src-ssr/server.[js|ts]` file is a simple JavaScript/Typescript file which boots up your SSR webserver and defines what how your webserver starts & handles requests and what it exports (if exporting anything).

::: danger
The `/src-ssr/server.[js|ts]` file is used for both DEV and PROD, so please be careful on how you configure it. To differentiate between the two states you can use `process.env.DEV` and `process.env.PROD`.
:::

``` js
/**
 * More info about this file:
 * https://v2.quasar.dev/quasar-cli-vite/developing-ssr/ssr-webserver
 *
 * Runs in Node context.
 */

/**
 * Make sure to yarn add / npm install (in your project root)
 * anything you import here (except for express and compression).
 */
import express from 'express'
import compression from 'compression'

/**
 * Create your webserver and return its instance.
 * If needed, prepare your webserver to receive
 * connect-like middlewares.
 *
 * Should NOT be async!
 */
export function create (/* { ... } */) {
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
}

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
 */
export async function listen ({ app, port, isReady, ssrHandler }) {
  await isReady()
  return await app.listen(port, () => {
    if (process.env.PROD) {
      console.log('Server listening at port ' + port)
    }
  })
}

/**
 * Should close the server and free up any resources.
 * Will be used on development only when the server needs
 * to be rebooted.
 *
 * Should you need the result of the "listen()" call above,
 * you can use the "listenResult" param.
 *
 * Can be async.
 */
export function close ({ listenResult }) {
  return listenResult.close()
}

const maxAge = process.env.DEV
  ? 0
  : 1000 * 60 * 60 * 24 * 30

/**
 * Should return middleware that serves the indicated path
 * with static content.
 */
export function serveStaticContent (path, opts) {
  return express.static(path, {
    maxAge,
    ...opts
  })
}

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
export function renderPreloadTag (file) {
  if (jsRE.test(file) === true) {
    return `<link rel="modulepreload" href="${file}" crossorigin>`
  }

  if (cssRE.test(file) === true) {
    return `<link rel="stylesheet" href="${file}">`
  }

  if (woffRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
  }

  if (woff2RE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
  }

  if (gifRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/gif">`
  }

  if (jpgRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/jpeg">`
  }

  if (pngRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/png">`
  }

  return ''
}
```

::: tip
Remember that whatever the `listen()` function returns (if anything) will be exported from your built `dist/ssr/index.js`. You can return your ssrHandler for a serverless architecture should you need it.
:::

## Parameters

``` js
export function <functionName> ({
  app, port, isReady, ssrHandler,
  resolve, publicPath, folders, render, serve
}) => {
```

Detailing the Object:

``` js
{
  app,     // Expressjs app instance (or whatever you return from create())

  port,    // on production: process.env.PORT or quasar.config.js > ssr > prodPort
           // on development: quasar.config.js > devServer > port

  isReady, // Function to call returning a Promise
           // when app is ready to serve clients

  ssrHandler, // Prebuilt app handler if your serverless service
              // doesn't require a specific way to provide it.
              // Form: ssrHandler (req, res, next)
              // Tip: it uses isReady() under the hood already

  // all of the following are the same as
  // for the SSR middlewares (check its docs page);
  // normally you don't need these here
  // (use a real SSR middleware instead)
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

## Usage

::: warning
* If you import anything from node_modules, then make sure that the package is specified in package.json > "dependencies" and NOT in "devDependencies".
* This is usually not the place to add middlewares (but you can do it). Add middlewares by using the [SSR Middlewares](/quasar-cli-vite/developing-ssr/ssr-middleware) instead. You can configure SSR Middlewares to run only for dev or only for production too.
:::

### Replacing express.js

You can replace the default Express.js Node server with any other connect API compatible one. Just make sure to yarn/npm install its package first.

```js
// src-ssr/server.[js|ts]

import connect from 'connect'

export function create (/* { ... } */) {
  const app = connect()

  // place here any middlewares that
  // absolutely need to run before anything else
  if (process.env.PROD) {
    app.use(compression())
  }

  return app
}
```

### Listen on a port

This is the default option that you get when adding SSR support in a Quasar CLI project. It starts listening on the configured port (process.env.PORT or quasar.config.js > ssr > prodPort).

``` js
// src-ssr/server.[js|ts]

export async function listen ({ app, port, isReady }) {
  await isReady()
  return await app.listen(port, () => {
    if (process.env.PROD) {
      console.log('Server listening at port ' + port)
    }
  })
}
```

### Serverless

If you have a serverless infrastructure, then you generally need to export a handler instead of starting to listen to a port.

Say that your serverless service requires you to:

``` js
module.exports.handler = __your_handler__
```

Then what you'd need to do is:

``` js
// src-ssr/server.[js|ts]

export async function listen ({ app, port, ssrHandler }) {
  if (process.env.DEV) {
    await isReady()
    return await app.listen(port, () => {
      if (process.env.PROD) {
        console.log('Server listening at port ' + port)
      }
    })
  }
  else { // in production
    // "ssrHandler" is a prebuilt handler which already
    // waits for all the middlewares to run before serving clients

    // whatever you return here is equivalent to module.exports.<key> = <value>
    return { handler: ssrHandler }
  }
}
```

Please note that the provided `ssrHandler` is a Function of form: `(req, res, next) => void`.
Should you require to export a handler of form `(event, context, callback) => void` then you will most likely want to use the `serverless-http` package (see below).

#### Example: serverless-http

You will need to manually yarn/npm install the `serverless-http` package.

``` js
// src-ssr/server.[js|ts]

import serverless from 'serverless-http'

export async function listen (({ app, port, ssrHandler }) => {
  if (process.env.DEV) {
    await isReady()
    return await app.listen(port, () => {
      // we're ready to serve clients
    })
  }
  else { // in production
    return { handler: serverless(ssrHandler) }
  }
})
```

#### Example: Firebase function

``` js
// src-ssr/server.[js|ts]

import * as functions from 'firebase-functions'

export async function listen (({ app, port, ssrHandler }) => {
  if (process.env.DEV) {
    await isReady()
    return await app.listen(port, () => {
      // we're ready to serve clients
    })
  }
  else { // in production
    return {
      handler: functions.https.onRequest(ssrHandler)
    }
  }
})
```
