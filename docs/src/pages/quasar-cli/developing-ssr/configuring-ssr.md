---
title: Configuring SSR
desc: How to manage your server-side rendered apps with Quasar CLI.
related:
  - /quasar-cli/quasar-conf-js
---

## Quasar.conf.js

This is the place where you can configure some SSR options. Like if you want the client side to takeover as a SPA (Single Page Application -- the default behaviour), or as a PWA (Progressive Web App).

```js
return {
  // ...
  ssr: {
    pwa: true/false, // should a PWA take over (default: false), or just a SPA?

    manualStoreHydration: true/false, // Manually hydrate the store

    prodPort: 3000, // The default port that the production server should use
                    // (gets superseded if process.env.PORT is specified at runtime)

    prodCacheDuration: 36000, // Tell browser when a file from the server should expire from cache (in ms)

    // optional; add/remove/change properties
    // of production generated package.json
    extendPackageJson (pkg) {
      // directly change props of pkg;
      // no need to return anything
    },

    // optional;
    // handles the Webserver webpack config ONLY
    // which includes the SSR middleware
    extendWebpackWebserver (cfg) {
      // directly change props of cfg;
      // no need to return anything
    },

    // optional; EQUIVALENT to extendWebpack() but uses webpack-chain;
    // handles the Webserver webpack config ONLY
    // which includes the SSR middleware
    chainWebpackWebserver (chain) {
      // chain is a webpack-chain instance
      // of the Webpack configuration
    }
  }
}
```

> If you decide to go with a PWA client takeover (**which is a killer combo**), the Quasar CLI PWA mode will be installed too. You may want to check out the [Quasar PWA](/quasar-cli/developing-pwa/introduction) guide too. But most importantly, make sure you read [SSR with PWA](/quasar-cli/developing-ssr/ssr-with-pwa) page.

When building, `extendWebpack()` and `chainWebpack()` will receive one more parameter (Object), currently containing `isServer` or `isClient` boolean props, because there will be two Webpack builds (one for the server-side and one for the client-side).

```js
// quasar.conf.js
build: {
  extendWebpack(cfg, { isServer, isClient }) { ... }
}
```

If you want more information, please see this page that goes into more detail about [handling webpack](/quasar-cli/handling-webpack) in the `quasar.conf.js` file.

## Nodejs Server

Adding SSR mode to a Quasar project means a new folder will be created: `/src-ssr`, which contains SSR specific files:

```bash
.
└── src-ssr/
    ├── middlewares/  # SSR middleware files
    └── directives/   # SSR transformations for Vue directives
```

You can freely edit these files. Each of the two folders are detailed in their own doc pages (check left-side menu).

Notice a few things:

1. These files run in a Node context (they are NOT transpiled by Babel), so use only the ES6 features that are supported by your Node version. (https://node.green/)

2. If you import anything from node_modules, then make sure that the package is specified in package.json > dependencies and NOT in devDependencies.

3. The `/src-ssr/middlewares` is built through a separate Webpack config. **You will see this marked as "Webserver" when Quasar App CLI builds your app.** You can chain/extend the Webpack configuration of these files through quasar.conf.js:

```js
return {
  // ...
  ssr: {
    // ...

    // optional; webpack config Object for
    // the Webserver part ONLY (/src-ssr/)
    // which is invoked for production (NOT for dev)
    extendWebpack (cfg) {
      // directly change props of cfg;
      // no need to return anything
    },

    // optional; EQUIVALENT to extendWebpack() but uses webpack-chain;
    // the Webserver part ONLY (/src-ssr/)
    // which is invoked for production (NOT for dev)
    chainWebpack (chain) {
      // chain is a webpack-chain instance
      // of the Webpack configuration
    }
  }
}
```

## Helping SEO

One of the main reasons when you develop a SSR instead of a SPA is for taking care of the SEO. And SEO can be greatly improved by using the [Quasar Meta Plugin](/quasar-plugins/meta) to manage dynamic html markup required by the search engines.

## Boot Files

When running on SSR mode, your application code needs to be isomorphic or "universal", which means that it must run both on a Node context and in the browser. This applies to your [Boot Files](/quasar-cli/boot-files) too.

However, there are cases where you only want some boot files to run only on the server or only on the client-side. You can achieve that by specifying:

```js
// quasar.conf.js
return {
  // ...
  boot: [
    'some-boot-file', // runs on both server and client
    { path: 'some-other', server: false } // this boot file gets embedded only on client-side
    { path: 'third', client: false } // this boot file gets embedded only on server-side
  ]
}
```

Just make sure that your app is consistent, though.

When a boot file runs on the server, you will have access to one more parameter (called `ssrContext`) on the default exported function:

```js
// some boot file
export default ({ app, ..., ssrContext }) => {
  // ssrContext has: { url, req, res }

  // You can add props to the ssrContext then use them in the src/index.template.html.
  // Example - let's say we ssrContext.someProp = 'some value', then in index template we can reference it:
  // {{ someProp }}
}
```

When you add such references (`someProp` surrounded by brackets in the example above) into your `src/index.template.html`, make sure you tell Quasar it’s only valid for SSR builds:

```html
<!-- index.template.html -->
<% if (ctx.mode.ssr) { %>{{ someProp }} <% } %>
```
