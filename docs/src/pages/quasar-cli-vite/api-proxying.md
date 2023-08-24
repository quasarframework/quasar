---
title: API Proxying for Dev
desc: (@quasar/app-vite) How to use an API proxy with the Quasar dev server.
related:
  - /quasar-cli-vite/quasar-config-file
---

When integrating a project folder (created by Quasar CLI) with an existing backend, a common need is to access the backend API when using the dev server. To achieve this, we can run the dev server and the API backend side-by-side (or remotely), and let the dev server proxy all API requests to the actual backend.

This is useful if you access relative paths in your API requests. Obviously, these relative paths will probably not work while you are developing. In order to create an environment similar to the one used by your deployed website/app, you can proxy your API requests.

To configure the proxy rules, edit the `/quasar.config` file in `devServer.proxy`. Under the hood, it uses `http-proxy`. Full list of its options [here](https://github.com/http-party/node-http-proxy#options).

```js
// quasar.config file

devServer: {
  proxy: {
    // string shorthand
    '/foo': 'http://localhost:4567',
    // with options
    '/api': {
      target: 'http://jsonplaceholder.typicode.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    },
    // with RegEx
    '^/fallback/.*': {
      target: 'http://jsonplaceholder.typicode.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/fallback/, '')
    },
    // Using the proxy instance
    '/api': {
      target: 'http://jsonplaceholder.typicode.com',
      changeOrigin: true,
      configure: (proxy, options) => {
        // proxy will be an instance of 'http-proxy'
      }
    },
    // Proxying websockets or socket.io
    '/socket.io': {
      target: 'ws://localhost:3000',
      ws: true
    }
  }
}
```
