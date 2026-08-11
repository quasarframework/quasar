---
title: SSR Middleware
desc: (@quasar/app-vite) Managing the SSR middleware in a Quasar app.
related:
  - /quasar-cli-vite/quasar-config-file
---

The SSR middleware files fulfill one special purpose: they prepare the Node.js server that runs your SSR app with additional functionality.

With SSR middleware files, it is possible to split the middleware logic into self-contained, easy to maintain files. It is also trivial to disable any of the SSR middleware files or even contextually determine which of the SSR middleware files get into the build through the `/quasar.config` file configuration.

::: warning
You will need at least one SSR middleware file which handles the rendering of the page with Vue (which should be positioned as last in the middlewares list). When SSR mode is added to your Quasar CLI project, this will be scaffolded into `src-ssr/middlewares/render.js`.
:::

## Anatomy of a middleware file

A SSR middleware file is a simple JavaScript file which exports a function. Quasar will then call the exported function when it prepares the Node.js server app and additionally pass an Object as param (which will be detailed in the next section).

```js
import { defineSsrMiddleware } from '#q-app'

export default defineSsrMiddleware(
  ({ app, port, resolve, publicPath, folders, render, serve }) => {
    // something to do with the server "app"
  }
)
```

The SSR middleware files can also be async:

```js
// import something here

export default defineSsrMiddleware(
  async ({ app, port, resolve, publicPath, folders, render, serve }) => {
    // something to do with the server "app"
    await something()
  }
)
```

Notice the `defineSsrMiddleware` import. It is essentially a no-op function, but it helps with the IDE autocomplete.

## Middleware object parameter

We are referring here to the Object received as parameter by the default exported function of the SSR middleware file.

```js
export default defineSsrMiddleware(({
  app, port, resolve, publicPath, folders, render, serve
}) => {
```

Detailing the Object:

```ts
{
  /**
   * Webserver app instance or whatever is returned from src-ssr/server -> create()
   */
  app: SsrDriverTypes["app"];

  /**
   * On dev: devServer port;
   * On prod: process.env.PORT or quasar.config > ssr > prodPort
   */
  port: number;

  /**
   * The configured quasar.config file > build > publicPath
   */
  publicPath: string;

  resolve: {
    /**
     * Whenever you define a route (with app.use(), app.get(), app.post() etc),
     * you should use the resolve.urlPath() method so that you'll also keep
     * into account the configured publicPath (quasar.config file > build > publicPath).
     */
    urlPath: (url: string) => string;
    /**
     * Resolve folder path to the root (of the project in dev and of the
     * distributables in production). Under the hood, it does a path.join()
     * @param paths paths to join
     */
    root: (...paths: string[]) => string;
    /**
     * Resolve folder path to the "/public" folder. Under the hood, it does a path.join()
     * @param paths paths to join
     */
    public: (...paths: string[]) => string;
    /**
     * Resolve folder path to the "/src-ssr/server-assets" folder. Under the hood, it does a path.join()
     * @param paths paths to join
     */
    serverAssets: (...paths: string[]) => string;
  },

  folders: {
    /**
     * The root folder absolute path of the project in development
     * and of the distributables in production.
     */
    root: string;
    /**
     * The "/public" folder absolute path
     * at runtime (dev or prod).
     */
    public: string;
    /**
     * The "/src-ssr/server-assets" folder absolute path
     * at runtime (dev or prod).
     */
    serverAssets: string;
  },

  /**
   * Uses Vue and Vue Router to render the requested URL path.
   *
   * @throws {Error | SsrRenderRouteNotFoundError | SsrRenderRedirectError} when the rendering fails
   * @returns the rendered HTML string to return to the client
   */
  render: (ssrContext: RenderVueParams) => Promise<string>;

  serve: {
    /**
     * It's essentially a wrapper to serve static content with a few convenient tweaks:
     * - the pathToServe is a path resolved to the "public" folder out of the box
     * - the opts are the same as for express.static()
     * - opts.maxAge is used by default, taking into account the
     *    quasar.config file > ssr > maxAge configuration;
     *    this sets how long the respective file(s) can live in browser's cache
     *
     * The return value is whatever you return from by src-ssr/server -> serveStaticContent()
     */
    static: ({
      /**
       * The URL path to serve the static content at (without publicPath).
       */
      urlPath: string;

      /**
       * The sub-path from the publicFolder or an absolute path.
       */
      pathToServe: string;

      /**
       * Other custom options...
       */
      opts?: { maxAge?: number };
    }) => void;

    /**
     * Displays a wealth of useful debug information (including the stack trace).
     * Warning: It's available only in development and NOT in production.
     */
    devError: (params: {
      /**
       * The caught error that caused the render to fail.
       * It can be an instance of Error or any other value
       * thrown by the render() function.
       */
      err: unknown;
      req: SsrDriverTypes["request"];
    }) => { errorHeaders: Record<string, string>; errorHtml: string };
  }
}
```

## Usage of SSR middleware

The first step is always to generate a new SSR middleware file using Quasar CLI:

```bash
quasar new ssrmiddleware <name>
```

Where `<name>` should be exchanged by a suitable name for your SSR middleware file.

This command creates a new file: `/src-ssr/middlewares/<name>.js` with the following content:

```js
// import something here

// "async" is optional!
// remove it if you don't need it
export default async ({
  app,
  port,
  resolveUrlPath,
  publicPath,
  folders,
  render,
  serve
}) => {
  // something to do with the server "app"
}
```

You can also return a Promise:

```js
// import something here

export default defineSsrMiddleware(
  ({ app, port, resolve, publicPath, folders, render, serve }) => {
    return new Promise((resolve, reject) => {
      // something to do with the server "app"
    })
  }
)
```

You can now add content to that file depending on the intended use of your SSR middleware file.

The last step is to tell Quasar to use your new SSR middleware file. For this to happen you need to add the file in the `/quasar.config` file:

```js /quasar.config file
ssr: {
  middlewares: [
    // references /src-ssr/middlewares/<name>.js
    '<name>'
  ]
}
```

When building a SSR app, you may want some boot files to run only on production or only on development, in which case you can do so like below:

```js /quasar.config file
ssr: {
  middlewares: [
    ctx.prod ? '<name>' : '', // I run only on production!
    ctx.dev ? '<name>' : '' // I run only on development
  ]
}
```

In case you want to specify SSR middleware file from node_modules, you can do so by prepending the path with `~` (tilde) character:

```js /quasar.config file
ssr: {
  middlewares: [
    // boot file from an npm package
    '~my-npm-package/some/file'
  ]
}
```

::: warning
The order in which you specify the SSR middlewares matters because it determines the way in which the middlewares are applied to the Node.js server. So they influence how it responds to the client.
:::

## The SSR render middleware

::: danger Important!
Out of all the possible SSR middlewares in your app, **this one is absolutely required**, because it handles the actual SSR rendering with Vue.
:::

In the example below we highlight that this middleware needs to be the last in the list. This is because it also responds to the client (as we'll see in the second code sample below) with the HTML of the page. So any subsequent middleware cannot set headers.

```js /quasar.config file
ssr: {
  middlewares: [
    // ..... all other middlewares

    'render' // references /src-ssr/middlewares/render.js;
    // you can name the file however you want,
    // just make sure that it runs as last middleware
  ]
}
```

Now let's see what it contains, for JS projects first and then for TypeScript. Pick the one you want to use based on the webserver of your choice:

<llm-exclude reason="Mirrors the TypeScript :::details below without the type annotations. LLMs can derive the JS form from the TS version.">

::: details Javascript

```tabs /src-ssr/middlewares/render.js
<<| js Hono |>>
import { defineSsrMiddleware } from '#q-app'

/**
 * This middleware should execute as last one
 * since it captures everything and tries to
 * render the page with Vue
 */
export default defineSsrMiddleware(({ app, resolve, render, serve }) => {
  /**
   * We capture any other Hono route and hand it
   * over to Vue and Vue Router to render our page
   */
  app.get(resolve.urlPath('/*'), async c => {
    const req = c.env.incoming
    const res = c.env.outgoing

    try {
      /**
       * We hand over to Vue to render our page
       */
      const renderedHtml = await render(/* the ssrContext: */ { req, res })
      return c.html(renderedHtml)
    } catch (err) {
      if (err?.routeNotFound) {
        /**
         * Hmm, Vue Router could not find the requested route
         * and it does not have a "catch-all" route
         */
        return c.html('404 | Page Not Found', 404)
      }

      if (err?.redirectUrl) {
        /**
         * We were told to redirect to another URL
         */
        return c.redirect(err.redirectUrl, err.redirectHttpStatusCode)
      }

      if (import.meta.env.QUASAR_DEV) {
        /**
         * Well, we treat any other code as error;
         * if we're in dev mode, then we can use Quasar CLI
         * to display a nice error page that contains the stack
         * and other useful information
         *
         * Note that serve.devError is available on dev only
         */
        const { errorHtml, errorHeaders } = serve.devError({ err, req })
        return c.html(errorHtml, 500, errorHeaders)
      }

      if (import.meta.env.QUASAR_DEBUG) {
        console.error(
          err instanceof Error ? err.stack : (err ?? 'Unknown error')
        )
      }

      /**
       * Render Error Page on production or
       * alternatively, create a route (/src/routes) for an error page and redirect to it
       * (just make sure that route won't crash too, otherwise you'll end up in an infinite loop!)
       */
      return c.html('500 | Internal Server Error', 500)
    }
  })
})
<<| js Express |>>
import { defineSsrMiddleware } from '#q-app'

/**
 * This middleware should execute as last one
 * since it captures everything and tries to
 * render the page with Vue
 */
export default defineSsrMiddleware(({ app, resolve, render, serve }) => {
  /**
   * We capture any other Express route and hand it
   * over to Vue and Vue Router to render our page
   */
  app.get(resolve.urlPath('{*path}'), async (req, res) => {
    res.setHeader('Content-Type', 'text/html')

    try {
      /**
       * We hand over to Vue to render our page
       */
      const renderedHtml = await render(/* the ssrContext: */ { req, res })
      res.send(renderedHtml)
    } catch (err) {
      if (err?.routeNotFound) {
        /**
         * Hmm, Vue Router could not find the requested route
         * and it does not have a "catch-all" route
         */
        res.status(404).send('404 | Page Not Found')
        return
      }

      if (err?.redirectUrl) {
        /**
         * We were told to redirect to another URL
         */
        res.redirect(err.redirectHttpStatusCode, err.redirectUrl)
        return
      }

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
        res.set(errorHeaders).status(500).send(errorHtml)
        return
      }

      if (import.meta.env.QUASAR_DEBUG) {
        console.error(
          err instanceof Error ? err.stack : (err ?? 'Unknown error')
        )
      }

      /**
       * Render Error Page on production or
       * alternatively, create a route (/src/routes) for an error page and redirect to it
       * (just make sure that route won't crash too, otherwise you'll end up in an infinite loop!)
       */
      res.status(500).send('500 | Internal Server Error')
    }
  })
})
<<| js Fastify |>>
import { defineSsrMiddleware } from '#q-app'

/**
 * This middleware should execute as last one
 * since it captures everything and tries to
 * render the page with Vue
 */
export default defineSsrMiddleware(({ app, resolve, render, serve }) => {
  /**
   * We capture any other Fastify route and hand it
   * over to Vue and Vue Router to render our page
   */
  app.get(resolve.urlPath('*'), async (request, reply) => {
    reply.header('Content-Type', 'text/html')

    try {
      /**
       * We hand over to Vue to render our page
       */
      return await render(/* the ssrContext: */ { req: request, res: reply })
    } catch (err) {
      if (err?.routeNotFound) {
        /**
         * Hmm, Vue Router could not find the requested route
         * and it does not have a "catch-all" route
         */
        reply.status(404)
        return '404 | Page Not Found'
      }

      if (err?.redirectUrl) {
        /**
         * We were told to redirect to another URL
         */
        reply.status(err.redirectHttpStatusCode)
        return reply.redirect(err.redirectUrl)
      }

      if (import.meta.env.QUASAR_DEV) {
        /**
         * Well, we treat any other code as error;
         * if we're in dev mode, then we can use Quasar CLI
         * to display a nice error page that contains the stack
         * and other useful information
         *
         * Note that serve.devError is available on dev only
         */
        const { errorHeaders, errorHtml } = serve.devError({
          err,
          req: request
        })
        reply.status(500).headers(errorHeaders)
        return errorHtml
      }

      if (import.meta.env.QUASAR_DEBUG) {
        console.error(
          err instanceof Error ? err.stack : (err ?? 'Unknown error')
        )
      }

      /**
       * Render Error Page on production or
       * alternatively, create a route (/src/routes) for an error page and redirect to it
       * (just make sure that route won't crash too, otherwise you'll end up in an infinite loop!)
       */
      reply.status(500)
      return '500 | Internal Server Error'
    }
  })
})
<<| js Koa |>>
import { defineSsrMiddleware } from '#q-app'

/**
 * This middleware should execute as last one
 * since it captures everything and tries to
 * render the page with Vue
 */
export default defineSsrMiddleware(({ app, publicPath, render, serve }) => {
  /**
   * We act as the catch-all, manually verifying
   * the method and base path.
   */
  app.use(async (ctx, next) => {
    if (ctx.method !== 'GET' || !ctx.path.startsWith(publicPath)) {
      return next()
    }

    ctx.type = 'text/html'

    try {
      /**
       * We hand over to Vue to render our page
       */
      const renderedHtml = await render(
        /* the ssrContext: */ { req: ctx.request, res: ctx.response }
      )
      ctx.body = renderedHtml
    } catch (err) {
      if (err?.routeNotFound) {
        /**
         * Hmm, Vue Router could not find the requested route
         * and it does not have a "catch-all" route
         */
        ctx.status = 404
        ctx.body = '404 | Page Not Found'
        return
      }

      if (err?.redirectUrl) {
        /**
         * We were told to redirect to another URL
         */
        ctx.status = err.redirectHttpStatusCode
        ctx.redirect(err.redirectUrl)
        return
      }

      if (import.meta.env.QUASAR_DEV) {
        /**
         * Well, we treat any other code as error;
         * if we're in dev mode, then we can use Quasar CLI
         * to display a nice error page that contains the stack
         * and other useful information
         *
         * Note that serve.devError is available on dev only
         */
        const { errorHeaders, errorHtml } = serve.devError({
          err,
          req: ctx.request
        })
        ctx.status = 500
        ctx.set(errorHeaders)
        ctx.body = errorHtml
        return
      }

      if (import.meta.env.QUASAR_DEBUG) {
        console.error(
          err instanceof Error ? err.stack : (err ?? 'Unknown error')
        )
      }

      /**
       * Render Error Page on production or
       * alternatively, create a route (/src/routes) for an error page and redirect to it
       * (just make sure that route won't crash too, otherwise you'll end up in an infinite loop!)
       */
      ctx.status = 500
      ctx.body = '500 | Internal Server Error'
    }
  })
})
```

:::

</llm-exclude>

::: details TypeScript

```tabs src-ssr/middlewares/render.ts
<<| ts Hono |>>
import { defineSsrMiddleware } from "#q-app";
import type {
  SsrRenderRedirectError,
  SsrRenderRouteNotFoundError
} from "#q-app";

function isRedirectError(err: unknown): err is SsrRenderRedirectError {
  return (
    typeof err === "object" &&
    err !== null &&
    "redirectUrl" in err &&
    "redirectHttpStatusCode" in err
  );
}

function isRouteNotFoundError(
  err: unknown
): err is SsrRenderRouteNotFoundError {
  return typeof err === "object" && err !== null && "routeNotFound" in err;
}

/**
 * This middleware should execute as last one
 * since it captures everything and tries to
 * render the page with Vue
 */
export default defineSsrMiddleware(({ app, resolve, render, serve }) => {
  /**
   * We capture any other Hono route and hand it
   * over to Vue and Vue Router to render our page
   */
  app.get(resolve.urlPath("/*"), async c => {
    try {
      /**
       * We hand over to Vue to render our page
       */
      const renderedHtml = await render(
        /* the ssrContext: */ { req: c.env.incoming, res: c.env.outgoing }
      );
      return c.html(renderedHtml);
    } catch (err) {
      if (isRouteNotFoundError(err)) {
        /**
         * Hmm, Vue Router could not find the requested route
         * and it does not have a "catch-all" route
         */
        return c.html("404 | Page Not Found", 404);
      }

      if (isRedirectError(err)) {
        /**
         * We were told to redirect to another URL
         */
        return c.redirect(err.redirectUrl, err.redirectHttpStatusCode);
      }

      if (import.meta.env.QUASAR_DEV) {
        /**
         * Well, we treat any other code as error;
         * if we're in dev mode, then we can use Quasar CLI
         * to display a nice error page that contains the stack
         * and other useful information
         *
         * Note that serve.devError is available on dev only
         */
        const { errorHtml, errorHeaders } = serve.devError({
          err,
          req: c.env.incoming
        });
        return c.html(errorHtml, 500, errorHeaders);
      }

      if (import.meta.env.QUASAR_DEBUG) {
        console.error(
          err instanceof Error ? err.stack : (err ?? "Unknown error")
        );
      }

      /**
       * Render Error Page on production or
       * alternatively, create a route (/src/routes) for an error page and redirect to it
       * (just make sure that route won't crash too, otherwise you'll end up in an infinite loop!)
       */
      return c.html("500 | Internal Server Error", 500);
    }
  });
});
<<| ts Express |>>
import { defineSsrMiddleware } from "#q-app";
import type {
  SsrRenderRedirectError,
  SsrRenderRouteNotFoundError
} from "#q-app";

function isRedirectError(err: unknown): err is SsrRenderRedirectError {
  return (
    typeof err === "object" &&
    err !== null &&
    "redirectUrl" in err &&
    "redirectHttpStatusCode" in err
  );
}

function isRouteNotFoundError(
  err: unknown
): err is SsrRenderRouteNotFoundError {
  return typeof err === "object" && err !== null && "routeNotFound" in err;
}

/**
 * This middleware should execute as last one
 * since it captures everything and tries to
 * render the page with Vue
 */
export default defineSsrMiddleware(({ app, resolve, render, serve }) => {
  /**
   * We capture any other Express route and hand it
   * over to Vue and Vue Router to render our page
   */
  app.get(resolve.urlPath("{*path}"), async (req, res) => {
    res.setHeader("Content-Type", "text/html");

    try {
      const renderedHtml = await render({ req, res });
      res.send(renderedHtml);
    } catch (err) {
      if (isRouteNotFoundError(err)) {
        /**
         * Hmm, Vue Router could not find the requested route
         * and it does not have a "catch-all" route
         */
        res.status(404).send("404 | Page Not Found");
        return;
      }

      if (isRedirectError(err)) {
        /**
         * We were told to redirect to another URL
         */
        res.redirect(err.redirectHttpStatusCode, err.redirectUrl);
        return;
      }

      if (import.meta.env.QUASAR_DEV) {
        /**
         * Well, we treat any other code as error;
         * if we're in dev mode, then we can use Quasar CLI
         * to display a nice error page that contains the stack
         * and other useful information
         *
         * Note that serve.devError is available on dev only
         */
        const { errorHeaders, errorHtml } = serve.devError({ err, req });
        res.set(errorHeaders).status(500).send(errorHtml);
        return;
      }

      if (import.meta.env.QUASAR_DEBUG) {
        console.error(
          err instanceof Error ? err.stack : (err ?? "Unknown error")
        );
      }

      /**
       * Render Error Page on production or
       * alternatively, create a route (/src/routes) for an error page and redirect to it
       * (just make sure that route won't crash too, otherwise you'll end up in an infinite loop!)
       */
      res.status(500).send("500 | Internal Server Error");
    }
  });
});
<<| ts Fastify |>>
import { defineSsrMiddleware } from "#q-app";
import type {
  SsrRenderRedirectError,
  SsrRenderRouteNotFoundError
} from "#q-app";

function isRedirectError(err: unknown): err is SsrRenderRedirectError {
  return (
    typeof err === "object" &&
    err !== null &&
    "redirectUrl" in err &&
    "redirectHttpStatusCode" in err
  );
}

function isRouteNotFoundError(
  err: unknown
): err is SsrRenderRouteNotFoundError {
  return typeof err === "object" && err !== null && "routeNotFound" in err;
}

/**
 * This middleware should execute as last one
 * since it captures everything and tries to
 * render the page with Vue
 */
export default defineSsrMiddleware(({ app, resolve, render, serve }) => {
  /**
   * We capture any other Fastify route and hand it
   * over to Vue and Vue Router to render our page
   */
  app.get(resolve.urlPath("*"), async (request, reply) => {
    reply.header("Content-Type", "text/html");

    try {
      /**
       * We hand over to Vue to render our page
       */
      return await render(/* the ssrContext: */ { req: request, res: reply });
    } catch (err) {
      if (isRouteNotFoundError(err)) {
        /**
         * Hmm, Vue Router could not find the requested route
         * and it does not have a "catch-all" route
         */
        reply.status(404);
        return "404 | Page Not Found";
      }

      if (isRedirectError(err)) {
        /**
         * We were told to redirect to another URL
         */
        reply.status(err.redirectHttpStatusCode);
        return reply.redirect(err.redirectUrl);
      }

      if (import.meta.env.QUASAR_DEV) {
        /**
         * Well, we treat any other code as error;
         * if we're in dev mode, then we can use Quasar CLI
         * to display a nice error page that contains the stack
         * and other useful information
         *
         * Note that serve.devError is available on dev only
         */
        const { errorHeaders, errorHtml } = serve.devError({
          err,
          req: request
        });
        reply.status(500).headers(errorHeaders);
        return errorHtml;
      }

      if (import.meta.env.QUASAR_DEBUG) {
        console.error(
          err instanceof Error ? err.stack : (err ?? "Unknown error")
        );
      }

      /**
       * Render Error Page on production or
       * alternatively, create a route (/src/routes) for an error page and redirect to it
       * (just make sure that route won't crash too, otherwise you'll end up in an infinite loop!)
       */
      reply.status(500);
      return "500 | Internal Server Error";
    }
  });
});
<<| ts Koa |>>
import { defineSsrMiddleware } from "#q-app";
import type {
  SsrRenderRedirectError,
  SsrRenderRouteNotFoundError
} from "#q-app";

function isRedirectError(err: unknown): err is SsrRenderRedirectError {
  return (
    typeof err === "object" &&
    err !== null &&
    "redirectUrl" in err &&
    "redirectHttpStatusCode" in err
  );
}

function isRouteNotFoundError(
  err: unknown
): err is SsrRenderRouteNotFoundError {
  return typeof err === "object" && err !== null && "routeNotFound" in err;
}

/**
 * This middleware should execute as last one
 * since it captures everything and tries to
 * render the page with Vue
 */
export default defineSsrMiddleware(({ app, publicPath, render, serve }) => {
  /**
   * We act as the catch-all, manually verifying
   * the method and base path.
   */
  app.use(async ctx => {
    if (ctx.method !== "GET" || !ctx.path.startsWith(publicPath)) {
      return;
    }

    ctx.type = "text/html";

    try {
      /**
       * We hand over to Vue to render our page
       */
      const renderedHtml = await render(
        /* the ssrContext: */ { req: ctx.request, res: ctx.response }
      );
      ctx.body = renderedHtml;
    } catch (err) {
      if (isRouteNotFoundError(err)) {
        /**
         * Hmm, Vue Router could not find the requested route
         * and it does not have a "catch-all" route
         */
        ctx.status = 404;
        ctx.body = "404 | Page Not Found";
        return;
      }

      if (isRedirectError(err)) {
        /**
         * We were told to redirect to another URL
         */
        ctx.status = err.redirectHttpStatusCode;
        ctx.redirect(err.redirectUrl);
        return;
      }

      if (import.meta.env.QUASAR_DEV) {
        /**
         * Well, we treat any other code as error;
         * if we're in dev mode, then we can use Quasar CLI
         * to display a nice error page that contains the stack
         * and other useful information
         *
         * Note that serve.devError is available on dev only
         */
        const { errorHeaders, errorHtml } = serve.devError({
          err,
          req: ctx.request
        });
        ctx.status = 500;
        ctx.set(errorHeaders);
        ctx.body = errorHtml;
        return;
      }

      if (import.meta.env.QUASAR_DEBUG) {
        console.error(
          err instanceof Error ? err.stack : (err ?? "Unknown error")
        );
      }

      /**
       * Render Error Page on production or
       * alternatively, create a route (/src/routes) for an error page and redirect to it
       * (just make sure that route won't crash too, otherwise you'll end up in an infinite loop!)
       */
      ctx.status = 500;
      ctx.body = "500 | Internal Server Error";
    }
  });
});
```

:::

Notice the `render` parameter (from the above code sample) that the exported function of the middleware gets called with. That's where the SSR rendering happens.

## Hot Module Reload

While developing, whenever you change anything in the SSR middlewares, Quasar App CLI will automatically trigger a recompilation of client-side resources and apply the middleware changes to the Node.js server.
