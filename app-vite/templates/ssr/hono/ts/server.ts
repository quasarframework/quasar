/**
 * https://v2.quasar.dev/quasar-cli-vite/developing-ssr/ssr-webserver
 *
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
