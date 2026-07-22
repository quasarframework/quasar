---
title: SSR Webserver
desc: (@quasar/app-vite) Configuring the Quasar SSR webserver for different platforms, including a serverless architecture.
---

Notice that your generated `/src-ssr` contains a file named `server.js`. This file defines how your SSR webserver is created, managed and served. You can start listening to a port or provide a handler for your serverless infrastructure to use. It's up to you.

## Anatomy

The `/src-ssr/server.js` file is a simple JavaScript/TypeScript file which boots up your SSR webserver and defines what how your webserver starts & handles requests and what it exports (if exporting anything).

::: danger
The `/src-ssr/server.js` file is used for both DEV and PROD, so please be careful on how you configure it. To differentiate between the two states you can use `import.meta.env.QUASAR_DEV` and `import.meta.env.QUASAR_PROD`.
:::

Now let's see what it contains, for JS projects first and then for TypeScript. Pick the one you want to use based on the webserver of your choice:

<llm-exclude reason="Mirrors the TypeScript :::details below without the type annotations. LLMs can derive the JS form from the TS version.">

::: details Javascript

```tabs /src-ssr/server.js
<<| js Hono |>>
/**
 * Runs in Node.js context.
 *
 * Make sure to pnpm/yarn/npm/bun install (in /src-ssr folder)
 * anything you import here.
 */

import { lstatSync } from 'node:fs'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import {
  defineSsrClose,
  defineSsrCreate,
  defineSsrInjectDevMiddleware,
  defineSsrListen,
  defineSsrRenderPreloadTag,
  defineSsrServeStaticContent
} from '#q-app'

/**
 * Create your webserver and return its instance.
 */
export const create = defineSsrCreate(async (/* { ... } */) => {
  const app = new Hono()

  if (import.meta.env.QUASAR_PROD) {
    const { compress } = await import('hono/compress')
    app.use(compress())
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
export const injectDevMiddleware = defineSsrInjectDevMiddleware(
  ({ app }) =>
    middleware => {
      app.use('*', async (c, next) => {
        const req = c.env.incoming
        const res = c.env.outgoing

        const { promise, resolve, reject } = Promise.withResolvers()

        const onDone = () => resolve(false)
        res.once('finish', onDone)
        res.once('close', onDone)

        middleware(req, res, err => {
          res.off('finish', onDone)
          res.off('close', onDone)

          if (err) reject(err)
          else resolve(true)
        })

        const passed = await promise

        if (passed) {
          /**
           * Vite skipped the request, so we let Hono continue down the chain
           */
          return next()
        }

        /**
         * Vite handled the request natively!
         *
         * Monkey-patch the native Node.js response methods.
         * The Hono Node adapter will still try to write headers and end the stream
         * when we return the dummy response. We neutralize these methods
         * so it silently does nothing instead of crashing.
         */
        const noop = () => res
        res.writeHead = noop
        res.setHeader = noop
        res.end = noop

        /**
         * Return a dummy Response.
         * This satisfies Hono's strict requirement that every branch
         * either returns a Response or calls `await next()`.
         */
        return new Response(null)
      })
    }
)

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
export const listen = defineSsrListen(
  async ({ app, devHttpsOptions, port }) => {
    const opts = {
      fetch: app.fetch,
      port
    }

    /**
     * For production HTTPS you can use the /src-ssr/server-assets folder
     * to place your certificates and then read them here to create the server.
     *
     * Use resolve.serverAssets('path-to-file') to get the absolute path to the file
     * or directly play with folders.serverAssets.
     */

    if (import.meta.env.QUASAR_DEV && devHttpsOptions) {
      const { createServer } = await import('node:https')
      opts.createServer = createServer
      opts.serverOptions = { ...devHttpsOptions }
    } else {
      const { createServer } = await import('node:http')
      opts.createServer = createServer
    }

    return serve(opts, info => {
      if (import.meta.env.QUASAR_PROD) {
        console.log(`🚀 Server listening at port ${info.port}`)
      }
    })
  }
)

/**
 * Should close the server and free up any resources.
 * Will be used on development only when the server needs
 * to be rebooted.
 *
 * Should you need the result of the "listen()" call above,
 * you can use the "listenResult" param.
 *
 * Can be async: defineSsrClose(async ({ listenResult }) => { ... })
 */
export const close = defineSsrClose(({ listenResult }) => listenResult.close())

const maxAge = import.meta.env.QUASAR_DEV ? 0 : 1000 * 60 * 60 * 24 * 30

/**
 * Should return a function that will be used to configure the webserver
 * to serve static content at "urlPath" from "pathToServe" folder/file.
 *
 * Notice resolve.urlPath(urlPath) and resolve.public(pathToServe) usages.
 *
 * Can be async: defineSsrServeStaticContent(async ({ app, resolve }) => {
 * Can return an async function: return async ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
 */
export const serveStaticContent = defineSsrServeStaticContent(
  ({ app, resolve, publicPath }) =>
    ({ urlPath, pathToServe, opts = {} }) => {
      const pubPath = resolve.public(pathToServe)
      const isDir = lstatSync(pubPath).isDirectory()

      const resolvedUrlPath = resolve.urlPath(urlPath)
      const routePath = isDir
        ? resolvedUrlPath.endsWith('*')
          ? resolvedUrlPath
          : `${resolvedUrlPath}*`
        : resolvedUrlPath

      const { maxAge: localMaxAge, ...serveOpts } = opts
      const cacheAge = localMaxAge ?? maxAge

      if (cacheAge > 0) {
        app.get(routePath, async (c, next) => {
          c.header('Cache-Control', `public, max-age=${cacheAge}`)
          await next()
        })
      }

      if (publicPath !== '/') {
        serveOpts.rewriteRequestPath = p => p.replace(publicPath, '/')
      }

      app.use(
        routePath,
        serveStatic({
          [isDir ? 'root' : 'path']: pubPath,
          ...serveOpts
        })
      )
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
    if (jsRE.test(file)) {
      return `<link rel="modulepreload" href="${file}" crossorigin>`
    }

    if (cssRE.test(file)) {
      return `<link rel="stylesheet" href="${file}" crossorigin>`
    }

    if (woffRE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
    }

    if (woff2RE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
    }

    if (gifRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`
    }

    if (jpgRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`
    }

    if (pngRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`
    }

    return ''
  }
)
<<| js Express |>>
/**
 * Runs in Node.js context.
 *
 * Make sure to pnpm/yarn/npm/bun install (in /src-ssr folder)
 * anything you import here.
 */

import express from 'express'
import {
  defineSsrClose,
  defineSsrCreate,
  defineSsrInjectDevMiddleware,
  defineSsrListen,
  defineSsrRenderPreloadTag,
  defineSsrServeStaticContent
} from '#q-app'

/**
 * Create your webserver and return its instance.
 */
export const create = defineSsrCreate(async (/* { ... } */) => {
  const app = express()

  if (import.meta.env.QUASAR_PROD) {
    /**
     * Optional: secure your app with Helmet
     * (https://helmetjs.github.io/)
     */
    const { default: helmet } = await import('helmet')
    app.use(helmet())

    const { default: compression } = await import('compression')
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
export const injectDevMiddleware = defineSsrInjectDevMiddleware(
  ({ app }) =>
    middleware => {
      app.use(middleware)
    }
)

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
export const listen = defineSsrListen(
  async ({ app, devHttpsOptions, port }) => {
    if (import.meta.env.QUASAR_DEV && devHttpsOptions) {
      const https = await import('node:https')
      const server = https.createServer(devHttpsOptions, app)
      return server.listen(port)
    }

    /**
     * For production HTTPS you can use the /src-ssr/server-assets folder
     * to place your certificates and then read them here to create the server.
     *
     * Use resolve.serverAssets('path-to-file') to get the absolute path to the file
     * or directly play with folders.serverAssets.
     */

    const http = await import('node:http')
    const server = http.createServer(app)
    return server.listen(port, () => {
      if (import.meta.env.QUASAR_PROD) {
        console.log(`🚀 Server listening at port ${port}`)
      }
    })
  }
)

/**
 * Should close the server and free up any resources.
 * Will be used on development only when the server needs
 * to be rebooted.
 *
 * Should you need the result of the "listen()" call above,
 * you can use the "listenResult" param.
 *
 * Can be async: defineSsrClose(async ({ listenResult }) => { ... })
 */
export const close = defineSsrClose(({ listenResult }) => listenResult.close())

const maxAge = import.meta.env.QUASAR_DEV ? 0 : 1000 * 60 * 60 * 24 * 30

/**
 * Should return a function that will be used to configure the webserver
 * to serve static content at "urlPath" from "pathToServe" folder/file.
 *
 * Notice resolve.urlPath(urlPath) and resolve.public(pathToServe) usages.
 *
 * Can be async: defineSsrServeStaticContent(async ({ app, resolve }) => {
 * Can return an async function: return async ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
 */
export const serveStaticContent = defineSsrServeStaticContent(
  ({ app, resolve }) =>
    ({ urlPath, pathToServe, opts = {} }) => {
      const serveFn = express.static(resolve.public(pathToServe), {
        maxAge,
        ...opts
      })
      app.use(resolve.urlPath(urlPath), serveFn)
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
    if (jsRE.test(file)) {
      return `<link rel="modulepreload" href="${file}" crossorigin>`
    }

    if (cssRE.test(file)) {
      return `<link rel="stylesheet" href="${file}" crossorigin>`
    }

    if (woffRE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
    }

    if (woff2RE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
    }

    if (gifRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`
    }

    if (jpgRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`
    }

    if (pngRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`
    }

    return ''
  }
)
<<| js Fastify |>>
/**
 * Runs in Node.js context.
 *
 * Make sure to pnpm/yarn/npm/bun install (in /src-ssr folder)
 * anything you import here.
 */

import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import {
  defineSsrClose,
  defineSsrCreate,
  defineSsrInjectDevMiddleware,
  defineSsrListen,
  defineSsrRenderPreloadTag,
  defineSsrServeStaticContent
} from '#q-app'

/**
 * Create your webserver and return its instance.
 */
export const create = defineSsrCreate(async ({ devHttpsOptions }) => {
  const opts = {}

  /**
   * For production HTTPS you can use the /src-ssr/server-assets folder
   * to place your certificates and then read them here to create the server.
   *
   * Use resolve.serverAssets('path-to-file') to get the absolute path to the file
   * or directly play with folders.serverAssets.
   */
  if (import.meta.env.QUASAR_DEV && devHttpsOptions) {
    opts.https = devHttpsOptions
  }

  const app = Fastify(opts)

  if (import.meta.env.QUASAR_PROD) {
    const { default: fastifyCompress } = await import('@fastify/compress')
    app.register(fastifyCompress)
  }

  return app
})

/**
 * Used by Quasar SSR dev server to inject middleware into the webserver.
 * It uses it to handle Vite dev server, handle public paths, etc.
 * The given middleware is compatible with `node:http`'s Server, Express, Connect, etc.
 */
export const injectDevMiddleware = defineSsrInjectDevMiddleware(
  async ({ app }) => {
    const { default: middie } = await import('@fastify/middie')
    await app.register(middie)

    return middleware => {
      app.use(middleware)
    }
  }
)

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
export const listen = defineSsrListen(async ({ app, port }) => {
  await app.listen({ port })

  if (import.meta.env.QUASAR_PROD) {
    console.log(`🚀 Server listening at port ${port}`)
  }

  return app
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
 */
export const close = defineSsrClose(({ listenResult }) => listenResult.close())

const maxAge = import.meta.env.QUASAR_DEV ? 0 : 1000 * 60 * 60 * 24 * 30

/**
 * Should return a function that will be used to configure the webserver
 * to serve static content at "urlPath" from "pathToServe" folder/file.
 *
 * Notice resolve.urlPath(urlPath) and resolve.public(pathToServe) usages.
 *
 * Can be async: defineSsrServeStaticContent(async ({ app, resolve }) => {
 * Can return an async function: return async ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
 */
export const serveStaticContent = defineSsrServeStaticContent(
  ({ app, resolve }) =>
    ({ urlPath, pathToServe, opts = {} }) => {
      void app.register(fastifyStatic, {
        root: resolve.public(pathToServe),
        prefix: resolve.urlPath(urlPath),
        wildcard: false,
        maxAge,
        ...opts
      })
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
    if (jsRE.test(file)) {
      return `<link rel="modulepreload" href="${file}" crossorigin>`
    }

    if (cssRE.test(file)) {
      return `<link rel="stylesheet" href="${file}" crossorigin>`
    }

    if (woffRE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
    }

    if (woff2RE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
    }

    if (gifRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`
    }

    if (jpgRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`
    }

    if (pngRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`
    }

    return ''
  }
)
<<| js Koa |>>
/**
 * Runs in Node.js context.
 *
 * Make sure to pnpm/yarn/npm/bun install (in /src-ssr folder)
 * anything you import here.
 */

import Koa from 'koa'
import {
  defineSsrClose,
  defineSsrCreate,
  defineSsrInjectDevMiddleware,
  defineSsrListen,
  defineSsrRenderPreloadTag,
  defineSsrServeStaticContent
} from '#q-app'

/**
 * Create your webserver and return its instance.
 */
export const create = defineSsrCreate(async (/* { ... } */) => {
  const app = new Koa()

  if (import.meta.env.QUASAR_PROD) {
    const { default: compress } = await import('koa-compress')
    app.use(compress())
  }

  return app
})

/**
 * Used by Quasar SSR dev server to inject middleware into the webserver.
 * It uses it to handle Vite dev server, handle public paths, etc.
 * The given middleware is compatible with `node:http`'s Server, Express, Connect, etc.
 */
export const injectDevMiddleware = defineSsrInjectDevMiddleware(
  async ({ app }) => {
    const { default: koaConnect } = await import('koa-connect')
    return middleware => {
      app.use(koaConnect(middleware))
    }
  }
)

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
export const listen = defineSsrListen(
  async ({ app, devHttpsOptions, port }) => {
    /**
     * For production HTTPS you can use the /src-ssr/server-assets folder
     * to place your certificates and then read them here to create the server.
     *
     * Use resolve.serverAssets('path-to-file') to get the absolute path to the file
     * or directly play with folders.serverAssets.
     */

    if (import.meta.env.QUASAR_DEV && devHttpsOptions) {
      const https = await import('node:https')
      const server = https.createServer(devHttpsOptions, app.callback())
      return server.listen(port)
    }

    return app.listen(port, () => {
      if (import.meta.env.QUASAR_PROD) {
        console.log(`🚀 Server listening at port ${port}`)
      }
    })
  }
)

/**
 * Should close the server and free up any resources.
 * Will be used on development only when the server needs
 * to be rebooted.
 *
 * Should you need the result of the "listen()" call above,
 * you can use the "listenResult" param.
 *
 * Can be async: defineSsrClose(async ({ listenResult }) => { ... })
 */
export const close = defineSsrClose(({ listenResult }) => listenResult.close())

const maxAge = import.meta.env.QUASAR_DEV ? 0 : 1000 * 60 * 60 * 24 * 30

/**
 * Should return a function that will be used to configure the webserver
 * to serve static content at "urlPath" from "pathToServe" folder/file.
 *
 * Notice resolve.urlPath(urlPath) and resolve.public(pathToServe) usages.
 *
 * Can return an async function: return async ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
 */
export const serveStaticContent = defineSsrServeStaticContent(
  async ({ app, resolve }) => {
    const { default: serve } = await import('koa-static')
    const { default: mount } = await import('koa-mount')

    return ({ urlPath, pathToServe, opts = {} }) => {
      const { maxAge: localMaxAge, ...otherOpts } = opts
      const serveFn = serve(resolve.public(pathToServe), {
        maxage: localMaxAge ?? maxAge,
        ...otherOpts
      })

      app.use(mount(resolve.urlPath(urlPath), serveFn))
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
    if (jsRE.test(file)) {
      return `<link rel="modulepreload" href="${file}" crossorigin>`
    }

    if (cssRE.test(file)) {
      return `<link rel="stylesheet" href="${file}" crossorigin>`
    }

    if (woffRE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
    }

    if (woff2RE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
    }

    if (gifRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`
    }

    if (jpgRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`
    }

    if (pngRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`
    }

    return ''
  }
)
```

:::

</llm-exclude>

::: details TypeScript

```tabs /src-ssr/server.ts
<<| ts Hono |>>
/**
 * Runs in Node.js context.
 *
 * Make sure to pnpm/yarn/npm/bun install (in /src-ssr folder)
 * anything you import here.
 */

import { lstatSync } from "node:fs";
import { Hono } from "hono";
import type { IncomingMessage, ServerResponse } from "node:http";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import {
  defineSsrClose,
  defineSsrCreate,
  defineSsrInjectDevMiddleware,
  defineSsrListen,
  defineSsrRenderPreloadTag,
  defineSsrServeStaticContent
} from "#q-app";

interface NodeEnv {
  Bindings: {
    incoming: IncomingMessage;
    outgoing: ServerResponse;
  };
}

declare module "#q-app" {
  interface SsrDriver {
    app: Hono<NodeEnv>;
    listenResult: ReturnType<typeof serve>;
    request: IncomingMessage;
    response: ServerResponse;
  }
}

/**
 * Create your webserver and return its instance.
 */
export const create = defineSsrCreate(async (/* { ... } */) => {
  const app = new Hono<NodeEnv>();

  if (import.meta.env.QUASAR_PROD) {
    const { compress } = await import("hono/compress");
    app.use(compress());
  }

  return app;
});

/**
 * Used by Quasar SSR dev server to inject middleware into the webserver.
 * It uses it to handle Vite dev server, handle public paths, etc.
 * The given middleware is compatible with `node:http`'s Server, Express, Connect, etc.
 *
 * Can be async: defineSsrInjectDevMiddleware(async ({ app }) => { ... })
 */
export const injectDevMiddleware = defineSsrInjectDevMiddleware(
  ({ app }) =>
    middleware => {
      app.use("*", async (c, next) => {
        const req = c.env.incoming;
        const res = c.env.outgoing;

        const { promise, resolve, reject } = Promise.withResolvers<boolean>();

        const onDone = () => {
          resolve(false);
        };
        res.once("finish", onDone);
        res.once("close", onDone);

        middleware(req, res, err => {
          res.off("finish", onDone);
          res.off("close", onDone);

          if (err) reject(err);
          else resolve(true);
        });

        const passed: boolean = await promise;

        if (passed) {
          /**
           * Vite skipped the request, so we let Hono continue down the chain
           */
          return next();
        }

        /**
         * Vite handled the request natively!
         *
         * Monkey-patch the native Node.js response methods.
         * The Hono Node adapter will still try to write headers and end the stream
         * when we return the dummy response. We neutralize these methods
         * so it silently does nothing instead of crashing.
         */
        const noop = () => res;
        res.writeHead = noop;
        res.setHeader = noop;
        res.end = noop;

        /**
         * Return a dummy Response.
         * This satisfies Hono's strict requirement that every branch
         * either returns a Response or calls `await next()`.
         */
        return new Response(null);
      });
    }
);

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
export const listen = defineSsrListen(
  async ({ app, devHttpsOptions, port }) => {
    const opts: Parameters<typeof serve>[0] = {
      fetch: app.fetch,
      port
    };

    /**
     * For production HTTPS you can use the /src-ssr/server-assets folder
     * to place your certificates and then read them here to create the server.
     *
     * Use resolve.serverAssets('path-to-file') to get the absolute path to the file
     * or directly play with folders.serverAssets.
     */

    if (import.meta.env.QUASAR_DEV && devHttpsOptions) {
      const { createServer } = await import("node:https");
      opts.createServer = createServer;
      opts.serverOptions = { ...devHttpsOptions };
    } else {
      const { createServer } = await import("node:http");
      opts.createServer = createServer;
    }

    return serve(opts, info => {
      if (import.meta.env.QUASAR_PROD) {
        console.log(`🚀 Server listening at port ${info.port}`);
      }
    });
  }
);

/**
 * Should close the server and free up any resources.
 * Will be used on development only when the server needs
 * to be rebooted.
 *
 * Should you need the result of the "listen()" call above,
 * you can use the "listenResult" param.
 *
 * Can be async: defineSsrClose(async ({ listenResult }) => { ... })
 */
export const close = defineSsrClose(({ listenResult }) => listenResult.close());

const maxAge = import.meta.env.QUASAR_DEV ? 0 : 1000 * 60 * 60 * 24 * 30;

/**
 * Should return a function that will be used to configure the webserver
 * to serve static content at "urlPath" from "pathToServe" folder/file.
 *
 * Notice resolve.urlPath(urlPath) and resolve.public(pathToServe) usages.
 *
 * Can be async: defineSsrServeStaticContent(async ({ app, resolve }) => {
 * Can return an async function: return async ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
 */
export const serveStaticContent = defineSsrServeStaticContent(
  ({ app, resolve, publicPath }) =>
    ({ urlPath, pathToServe, opts = {} }) => {
      const pubPath = resolve.public(pathToServe);
      const isDir = lstatSync(pubPath).isDirectory();

      const resolvedUrlPath = resolve.urlPath(urlPath);
      const routePath = isDir
        ? resolvedUrlPath.endsWith("*")
          ? resolvedUrlPath
          : `${resolvedUrlPath}*`
        : resolvedUrlPath;

      const { maxAge: maxAgeOpt, ...serveOpts } = opts;
      const cacheAge = maxAgeOpt !== void 0 ? maxAgeOpt : maxAge;

      if (cacheAge > 0) {
        app.get(routePath, async (c, next) => {
          c.header("Cache-Control", `public, max-age=${cacheAge}`);
          await next();
        });
      }

      const staticOpts: Parameters<typeof serveStatic>[0] = { ...serveOpts };
      if (isDir) {
        staticOpts.root = pubPath;
      } else {
        staticOpts.path = pubPath;
      }

      if (publicPath !== "/") {
        staticOpts.rewriteRequestPath = p => p.replace(publicPath, "/");
      }

      app.use(routePath, serveStatic(staticOpts));
    }
);

const jsRE = /\.js$/;
const cssRE = /\.css$/;
const woffRE = /\.woff$/;
const woff2RE = /\.woff2$/;
const gifRE = /\.gif$/;
const jpgRE = /\.jpe?g$/;
const pngRE = /\.png$/;

/**
 * Should return a String with HTML output
 * (if any) for preloading indicated file
 */
export const renderPreloadTag = defineSsrRenderPreloadTag(
  (file /* , { ssrContext } */) => {
    if (jsRE.test(file)) {
      return `<link rel="modulepreload" href="${file}" crossorigin>`;
    }

    if (cssRE.test(file)) {
      return `<link rel="stylesheet" href="${file}" crossorigin>`;
    }

    if (woffRE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
    }

    if (woff2RE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
    }

    if (gifRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`;
    }

    if (jpgRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`;
    }

    if (pngRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`;
    }

    return "";
  }
);
<<| ts Express |>>
/**
 * Runs in Node.js context.
 *
 * Make sure to pnpm/yarn/npm/bun install (in /src-ssr folder)
 * anything you import here.
 */

import express from "express";
import type { Application, Request, Response } from "express";
import type { Server } from "node:http";
import {
  defineSsrClose,
  defineSsrCreate,
  defineSsrInjectDevMiddleware,
  defineSsrListen,
  defineSsrRenderPreloadTag,
  defineSsrServeStaticContent
} from "#q-app";

declare module "#q-app" {
  interface SsrDriver {
    app: Application;
    listenResult: Server;
    request: Request;
    response: Response;
  }
}

/**
 * Create your webserver and return its instance.
 */
export const create = defineSsrCreate(async (/* { ... } */) => {
  const app = express();

  if (import.meta.env.QUASAR_PROD) {
    /**
     * Optional: secure your app with Helmet
     * (https://helmetjs.github.io/)
     */
    const { default: helmet } = await import("helmet");
    app.use(helmet());

    const { default: compression } = await import("compression");
    app.use(compression());
  }

  return app;
});

/**
 * Used by Quasar SSR dev server to inject middleware into the webserver.
 * It uses it to handle Vite dev server, handle public paths, etc.
 * The given middleware is compatible with `node:http`'s Server, Express, Connect, etc.
 *
 * Can be async: defineSsrInjectDevMiddleware(async ({ app }) => { ... })
 */
export const injectDevMiddleware = defineSsrInjectDevMiddleware(
  ({ app }) =>
    middleware => {
      app.use(middleware);
    }
);

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
export const listen = defineSsrListen(
  async ({ app, devHttpsOptions, port }) => {
    if (import.meta.env.QUASAR_DEV && devHttpsOptions) {
      const https = await import("node:https");
      const server = https.createServer(devHttpsOptions, (req, res) => {
        app(req, res);
      });
      return server.listen(port);
    }

    /**
     * For production HTTPS you can use the /src-ssr/server-assets folder
     * to place your certificates and then read them here to create the server.
     *
     * Use resolve.serverAssets('path-to-file') to get the absolute path to the file
     * or directly play with folders.serverAssets.
     */

    const http = await import("node:http");
    const server = http.createServer((req, res) => {
      app(req, res);
    });
    return server.listen(port, () => {
      if (import.meta.env.QUASAR_PROD) {
        console.log(`🚀 Server listening at port ${port}`);
      }
    });
  }
);

/**
 * Should close the server and free up any resources.
 * Will be used on development only when the server needs
 * to be rebooted.
 *
 * Should you need the result of the "listen()" call above,
 * you can use the "listenResult" param.
 *
 * Can be async: defineSsrClose(async ({ listenResult }) => { ... })
 */
export const close = defineSsrClose(({ listenResult }) => listenResult.close());

const maxAge = import.meta.env.QUASAR_DEV ? 0 : 1000 * 60 * 60 * 24 * 30;

/**
 * Should return a function that will be used to configure the webserver
 * to serve static content at "urlPath" from "pathToServe" folder/file.
 *
 * Notice resolve.urlPath(urlPath) and resolve.public(pathToServe) usages.
 *
 * Can be async: defineSsrServeStaticContent(async ({ app, resolve }) => {
 * Can return an async function: return async ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
 */
export const serveStaticContent = defineSsrServeStaticContent(
  ({ app, resolve }) =>
    ({ urlPath, pathToServe, opts = {} }) => {
      const serveFn = express.static(resolve.public(pathToServe), {
        maxAge,
        ...opts
      });
      app.use(resolve.urlPath(urlPath), serveFn);
    }
);

const jsRE = /\.js$/;
const cssRE = /\.css$/;
const woffRE = /\.woff$/;
const woff2RE = /\.woff2$/;
const gifRE = /\.gif$/;
const jpgRE = /\.jpe?g$/;
const pngRE = /\.png$/;

/**
 * Should return a String with HTML output
 * (if any) for preloading indicated file
 */
export const renderPreloadTag = defineSsrRenderPreloadTag(
  (file /* , { ssrContext } */) => {
    if (jsRE.test(file)) {
      return `<link rel="modulepreload" href="${file}" crossorigin>`;
    }

    if (cssRE.test(file)) {
      return `<link rel="stylesheet" href="${file}" crossorigin>`;
    }

    if (woffRE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
    }

    if (woff2RE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
    }

    if (gifRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`;
    }

    if (jpgRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`;
    }

    if (pngRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`;
    }

    return "";
  }
);
<<| ts Fastify |>>
/**
 * Runs in Node.js context.
 *
 * Make sure to pnpm/yarn/npm/bun install (in /src-ssr folder)
 * anything you import here.
 */

import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import type {
  FastifyHttpsOptions,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions
} from "fastify";
import type { Server } from "node:https";
import type { IncomingMessage, ServerResponse } from "node:http";
import {
  defineSsrClose,
  defineSsrCreate,
  defineSsrInjectDevMiddleware,
  defineSsrListen,
  defineSsrRenderPreloadTag,
  defineSsrServeStaticContent
} from "#q-app";

declare module "#q-app" {
  interface SsrDriver {
    app: FastifyInstance;
    listenResult: FastifyInstance;
    request: FastifyRequest;
    response: FastifyReply;
  }
}

/**
 * Create your webserver and return its instance.
 */
export const create = defineSsrCreate(async ({ devHttpsOptions }) => {
  const opts = {} as FastifyServerOptions &
    Partial<FastifyHttpsOptions<Server>>;

  /**
   * For production HTTPS you can use the /src-ssr/server-assets folder
   * to place your certificates and then read them here to create the server.
   *
   * Use resolve.serverAssets('path-to-file') to get the absolute path to the file
   * or directly play with folders.serverAssets.
   */
  if (import.meta.env.QUASAR_DEV && devHttpsOptions) {
    opts.https = devHttpsOptions;
  }

  const app = Fastify(opts);

  if (import.meta.env.QUASAR_PROD) {
    const { default: fastifyCompress } = await import("@fastify/compress");
    app.register(fastifyCompress);
  }

  return app;
});

/**
 * Used by Quasar SSR dev server to inject middleware into the webserver.
 * It uses it to handle Vite dev server, handle public paths, etc.
 * The given middleware is compatible with `node:http`'s Server, Express, Connect, etc.
 */
export const injectDevMiddleware = defineSsrInjectDevMiddleware(
  async ({ app }) => {
    const { default: middie } = await import("@fastify/middie");
    await app.register(middie);

    return middleware => {
      app.use(
        (
          req: IncomingMessage,
          res: ServerResponse,
          next: (err?: unknown) => void
        ) => {
          void middleware(req, res, next);
        }
      );
    };
  }
);

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
export const listen = defineSsrListen(async ({ app, port }) => {
  await app.listen({ port });

  if (import.meta.env.QUASAR_PROD) {
    console.log(`🚀 Server listening at port ${port}`);
  }

  return app;
});

/**
 * Should close the server and free up any resources.
 * Will be used on development only when the server needs
 * to be rebooted.
 *
 * Should you need the result of the "listen()" call above,
 * you can use the "listenResult" param.
 *
 * Can be async: defineSsrClose(async ({ listenResult }) => { ... })
 */
export const close = defineSsrClose(async ({ listenResult }) => {
  await listenResult.close();
});

const maxAge = import.meta.env.QUASAR_DEV ? 0 : 1000 * 60 * 60 * 24 * 30;

/**
 * Should return a function that will be used to configure the webserver
 * to serve static content at "urlPath" from "pathToServe" folder/file.
 *
 * Notice resolve.urlPath(urlPath) and resolve.public(pathToServe) usages.
 *
 * Can be async: defineSsrServeStaticContent(async ({ app, resolve }) => {
 * Can return an async function: return async ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
 */
export const serveStaticContent = defineSsrServeStaticContent(
  ({ app, resolve }) =>
    ({ urlPath, pathToServe, opts = {} }) => {
      void app.register(fastifyStatic, {
        root: resolve.public(pathToServe),
        prefix: resolve.urlPath(urlPath),
        wildcard: false,
        maxAge,
        ...opts
      });
    }
);

const jsRE = /\.js$/;
const cssRE = /\.css$/;
const woffRE = /\.woff$/;
const woff2RE = /\.woff2$/;
const gifRE = /\.gif$/;
const jpgRE = /\.jpe?g$/;
const pngRE = /\.png$/;

/**
 * Should return a String with HTML output
 * (if any) for preloading indicated file
 */
export const renderPreloadTag = defineSsrRenderPreloadTag(
  (file /* , { ssrContext } */) => {
    if (jsRE.test(file)) {
      return `<link rel="modulepreload" href="${file}" crossorigin>`;
    }

    if (cssRE.test(file)) {
      return `<link rel="stylesheet" href="${file}" crossorigin>`;
    }

    if (woffRE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
    }

    if (woff2RE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
    }

    if (gifRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`;
    }

    if (jpgRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`;
    }

    if (pngRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`;
    }

    return "";
  }
);
<<| ts Koa |>>
/**
 * Runs in Node.js context.
 *
 * Make sure to pnpm/yarn/npm/bun install (in /src-ssr folder)
 * anything you import here.
 */

import Koa from "koa";
import {
  defineSsrClose,
  defineSsrCreate,
  defineSsrInjectDevMiddleware,
  defineSsrListen,
  defineSsrRenderPreloadTag,
  defineSsrServeStaticContent
} from "#q-app";

declare module "#q-app" {
  interface SsrDriver {
    app: Koa;
    listenResult: ReturnType<Koa["listen"]>;
    request: Koa.Request;
    response: Koa.Response;
  }
}

/**
 * Create your webserver and return its instance.
 */
export const create = defineSsrCreate(async (/* { ... } */) => {
  const app = new Koa();

  if (import.meta.env.QUASAR_PROD) {
    const { default: compress } = await import("koa-compress");
    app.use(compress());
  }

  return app;
});

/**
 * Used by Quasar SSR dev server to inject middleware into the webserver.
 * It uses it to handle Vite dev server, handle public paths, etc.
 * The given middleware is compatible with `node:http`'s Server, Express, Connect, etc.
 */
export const injectDevMiddleware = defineSsrInjectDevMiddleware(
  async ({ app }) => {
    const { default: koaConnect } = await import("koa-connect");
    return middleware => {
      app.use(
        koaConnect((req, res, next) => {
          middleware(req, res, next);
        })
      );
    };
  }
);

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
export const listen = defineSsrListen(
  async ({ app, devHttpsOptions, port }) => {
    /**
     * For production HTTPS you can use the /src-ssr/server-assets folder
     * to place your certificates and then read them here to create the server.
     *
     * Use resolve.serverAssets('path-to-file') to get the absolute path to the file
     * or directly play with folders.serverAssets.
     */

    if (import.meta.env.QUASAR_DEV && devHttpsOptions) {
      const https = await import("node:https");
      const handler = app.callback();
      const server = https.createServer(devHttpsOptions, (req, res) => {
        void handler(req, res);
      });
      return server.listen(port);
    }

    return app.listen(port, () => {
      if (import.meta.env.QUASAR_PROD) {
        console.log(`🚀 Server listening at port ${port}`);
      }
    });
  }
);

/**
 * Should close the server and free up any resources.
 * Will be used on development only when the server needs
 * to be rebooted.
 *
 * Should you need the result of the "listen()" call above,
 * you can use the "listenResult" param.
 *
 * Can be async: defineSsrClose(async ({ listenResult }) => { ... })
 */
export const close = defineSsrClose(({ listenResult }) => listenResult.close());

const maxAge = import.meta.env.QUASAR_DEV ? 0 : 1000 * 60 * 60 * 24 * 30;

/**
 * Should return a function that will be used to configure the webserver
 * to serve static content at "urlPath" from "pathToServe" folder/file.
 *
 * Notice resolve.urlPath(urlPath) and resolve.public(pathToServe) usages.
 *
 * Can return an async function: return async ({ urlPath = '/', pathToServe = '.', opts = {} }) => {
 */
export const serveStaticContent = defineSsrServeStaticContent(
  async ({ app, resolve }) => {
    const { default: serve } = await import("koa-static");
    const { default: mount } = await import("koa-mount");

    return ({ urlPath, pathToServe, opts = {} }) => {
      const { maxAge: localMaxAge, ...otherOpts } = opts;
      const serveFn = serve(resolve.public(pathToServe), {
        maxage: localMaxAge ?? maxAge,
        ...otherOpts
      });

      app.use(mount(resolve.urlPath(urlPath), serveFn));
    };
  }
);

const jsRE = /\.js$/;
const cssRE = /\.css$/;
const woffRE = /\.woff$/;
const woff2RE = /\.woff2$/;
const gifRE = /\.gif$/;
const jpgRE = /\.jpe?g$/;
const pngRE = /\.png$/;

/**
 * Should return a String with HTML output
 * (if any) for preloading indicated file
 */
export const renderPreloadTag = defineSsrRenderPreloadTag(
  (file /* , { ssrContext } */) => {
    if (jsRE.test(file)) {
      return `<link rel="modulepreload" href="${file}" crossorigin>`;
    }

    if (cssRE.test(file)) {
      return `<link rel="stylesheet" href="${file}" crossorigin>`;
    }

    if (woffRE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
    }

    if (woff2RE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
    }

    if (gifRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`;
    }

    if (jpgRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`;
    }

    if (pngRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`;
    }

    return "";
  }
);
```

:::

## Serverless

When deploying a Quasar SSR application to a serverless architecture, you face one main architectural shift: Serverless environments do not support long-running processes.

Normally, Quasar's SSR build spins up a Node.js webserver that listens on a specific port (e.g., app.listen(3000)). In a serverless environment, you must bypass this listening phase. Instead, your entry script (that gets built by Quasar CLI) must export a stateless request handler function that the serverless provider can invoke every time an HTTP request comes in.

Since the built SSR server is essentially a Hono/Express/Fastify/etc application under the hood, your goal is to export it in a format your specific cloud provider understands.

We will use the `/quasar.config` > ssr > `prodScriptNamedExport` property to configure what gets exported by the production generated dist/index.js file:

```ts
/**
 * The named exports to use for the production generated SSR index.js script.
 * Works with `false` (no named exports), a single string (one named export),
 * or an array of strings (multiple named exports).
 *
 * Useful for serverless environments where you might want to export the
 * handler function. It creates one or more named exports from the
 * object returned by the defineSsrListen() function in /src-ssr/server file.
 *
 * @default false
 *
 * @example
 * prodScriptNamedExport: ['handler', 'ssr']
 * export const listen = defineSsrListen(() => {
 *   if (import.meta.env.QUASAR_PROD) {
 *     return { handler, ssr }
 *   }
 * })
 *
 * This will generate an SSR index.js with the following exports:
 * const { handler, ssr } = await listen({...})
 * export { handler, ssr }
 *
 * @example
 * prodScriptNamedExport: 'default'
 * export const listen = defineSsrListen(({ app }) => {
 *   if (import.meta.env.QUASAR_PROD) {
 *     return { default: app }
 *   }
 * })
 *
 * This will generate an SSR index.js with the following exports:
 * const listenResult = await listen({...})
 * export default listenResult?.default
 *
 * @example
 * prodScriptNamedExport: 'app'
 * export const listen = defineSsrListen(({ app }) => {
 *   if (import.meta.env.QUASAR_PROD) {
 *     return { app }
 *   }
 * })
 *
 * This will generate an SSR index.js with the following exports:
 * const { app } = await listen({...})
 * export { app }
 *
 * @example 'renderSsrContext' (special case)
 *
 * This will generate an SSR index.js with the following export:
 *   export { render as renderSsrContext }
 * where "render" is the same function used in
 * the /src-ssr/middlewares/render file
 */
prodScriptNamedExport?: false | string | string[];
```

Below are examples for some of the major serverless suppliers:

### AWS Lambda (via Serverless Framework or AWS SAM)

AWS Lambda expects a handler function with an `(event, context)` signature. Because Quasar outputs a Node.js webserver app, you can't pass this directly to Lambda. You need a wrapper library like `serverless-http` to bridge the gap between Lambda's event object and the webserver request/response objects.

```js
// file: /src-ssr/server
export const listen = defineSsrListen(async ({ app }) => {
  if (import.meta.env.QUASAR_PROD) {
    // Crucial step: we don't listen on any port

    const { default: serverless } = await import('serverless-http')
    return {
      // Example with Express.js;
      // Adapt to your chosen webserver
      handler: serverless(app)
    }
  }

  // ...
})

// file: /quasar.config
ssr: {
  prodScriptNamedExport: 'handler'
}
```

Remember to install `serverless-http` in `/src-ssr` as "dependencies" (and NOT "devDependencies").

### Firebase Cloud Functions

Firebase Functions are built on top of Google Cloud Functions.

```js
// file: /src-ssr/server
export const listen = defineSsrListen(async ({ app }) => {
  if (import.meta.env.QUASAR_PROD) {
    // Crucial step: we don't listen on any port

    const { default: functions } = await import('firebase-functions')
    return {
      // Example with Express.js;
      // Adapt to your chosen webserver
      ssr: functions.https.onRequest(app)
    }
  }

  // ...
})

// file: /quasar.config
ssr: {
  prodScriptNamedExport: 'ssr'
}
```

Remember to install `firebase-functions` in `/src-ssr` as "dependencies" (and NOT "devDependencies").

### Vercel

Vercel's Node.js runtime natively understands standard Node HTTP request listeners (functions that take req and res parameters).

```js
// file: /src-ssr/server
export const listen = defineSsrListen(async ({ app }) => {
  if (import.meta.env.QUASAR_PROD) {
    // Crucial step: we don't listen on any port

    return {
      // Example with Express.js;
      // Adapt to your chosen webserver
      default: app
    }
  }

  // ...
})

// file: /quasar.config
ssr: {
  prodScriptNamedExport: 'default'
}
```

### Netlify Functions

Netlify Functions operate similarly to AWS Lambda (they are powered by AWS Lambda under the hood). Like AWS, you will need `serverless-http` to wrap your app.

```js
// file: /src-ssr/server
export const listen = defineSsrListen(async ({ app }) => {
  if (import.meta.env.QUASAR_PROD) {
    // Crucial step: we don't listen on any port

    const { default: serverless } = await import('serverless-http')
    return {
      // Example with Express.js;
      // Adapt to your chosen webserver
      handler: serverless(app)
    }
  }

  // ...
})

// file: /quasar.config
ssr: {
  prodScriptNamedExport: 'handler'
}
```

Remember to install `serverless-http` in `/src-ssr` as "dependencies" (and NOT "devDependencies").

### Azure Functions

```js
// file: /src-ssr/server
export const listen = defineSsrListen(async ({ app }) => {
  if (import.meta.env.QUASAR_PROD) {
    // Crucial step: we don't listen on any port

    // Example with Express.js;
    // Adapt to your chosen webserver
    const { createHandler } = await import('azure-function-express')
    return {
      default: createHandler(app)
    }
  }

  // ...
})

// file: /quasar.config
ssr: {
  prodScriptNamedExport: 'default'
}
```

Remember to install `azure-function-express` in `/src-ssr` as "dependencies" (and NOT "devDependencies").

### DigitalOcean Functions

```js
// file: /src-ssr/server
export const listen = defineSsrListen(async ({ app }) => {
  if (import.meta.env.QUASAR_PROD) {
    // Crucial step: we don't listen on any port

    const { default: serverless } = await import('serverless-http')
    return {
      // Example with Express.js;
      // Adapt to your chosen webserver
      main: serverless(app)
    }
  }

  // ...
})

// file: /quasar.config
ssr: {
  prodScriptNamedExport: 'main'
}
```

Remember to install `serverless-http` in `/src-ssr` as "dependencies" (and NOT "devDependencies").

### Tencent Cloud

```js
// file: /src-ssr/server
export const listen = defineSsrListen(async ({ app }) => {
  if (import.meta.env.QUASAR_PROD) {
    // Crucial step: we don't listen on any port

    const { default: serverless } = await import('serverless-http')
    return {
      // Example with Express.js;
      // Adapt to your chosen webserver
      main_handler: serverless(app)
    }
  }

  // ...
})

// file: /quasar.config
ssr: {
  prodScriptNamedExport: 'main_handler'
}
```

Remember to install `serverless-http` in `/src-ssr` as "dependencies" (and NOT "devDependencies").
