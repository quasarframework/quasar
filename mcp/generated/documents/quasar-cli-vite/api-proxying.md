---
title: API Proxying for Dev
description: (@quasar/app-vite) How to use an API proxy with the Quasar dev server.
canonical: https://quasar.dev/quasar-cli-vite/api-proxying
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

When integrating a project folder (created by Quasar CLI) with an existing backend, a common need is to access the backend API when using the dev server. To achieve this, we can run the dev server and the API backend side-by-side (or remotely), and let the dev server proxy all API requests to the actual backend.

This is useful if you access relative paths in your API requests. Obviously, these relative paths will probably not work while you are developing. In order to create an environment similar to the one used by your deployed website/app, you can proxy your API requests.

To configure the proxy rules, edit the `/quasar.config` file in `devServer.proxy`. Under the hood, it uses `http-proxy`. Full list of its options [here](https://github.com/http-party/node-http-proxy#options).

::: warning
The development proxy is a convenience, not an authorization boundary. Anyone who can reach the dev server can request matching proxy routes, including through a public tunnel. Keep sensitive upstream services separately authenticated and avoid proxying production or otherwise privileged endpoints during development.

`changeOrigin` changes the forwarded `Host` header; it does not authenticate requests or make an HTTP target secure.
:::

```js /quasar.config file
devServer: {
  proxy: {
    // string shorthand: http://localhost:5173/foo -> http://localhost:4567/foo
    '/foo': 'http://localhost:4567',
    // with options: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
    '/api': {
      target: 'http://jsonplaceholder.typicode.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
    // with RegExp: http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
    '^/fallback/.*': {
      target: 'http://jsonplaceholder.typicode.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/fallback/, ''),
    },
    // Using the proxy instance
    '/api': {
      target: 'http://jsonplaceholder.typicode.com',
      changeOrigin: true,
      configure: (proxy, options) => {
        // proxy will be an instance of 'http-proxy'
      },
    },
    // Proxying websockets or socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
    // Exercise caution using `rewriteWsOrigin` as it can leave the proxying open to CSRF attacks.
    '/socket.io': {
      target: 'ws://localhost:5174',
      ws: true,
      rewriteWsOrigin: true,
    },
  },
}
```
