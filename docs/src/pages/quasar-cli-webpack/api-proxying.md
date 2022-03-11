---
title: API Proxying for Dev
desc: How to use an API proxy with the Quasar dev server.
related:
  - /quasar-cli/quasar-conf-js
---
When integrating a project folder (created by Quasar CLI) with an existing backend, a common need is to access the backend API when using the dev server. To achieve this, we can run the dev server and the API backend side-by-side (or remotely), and let the dev server proxy all API requests to the actual backend.

This is useful if you access relative paths in your API requests. Obviously, these relative paths will probably not work while you are developing. In order to create an environment similar to the one used by your deployed website/app, you can proxy your API requests.

To configure the proxy rules, edit `/quasar.conf.js` in `devServer.proxy`. You should refer to [Webpack Dev Server Proxy](https://webpack.js.org/configuration/dev-server/#devserver-proxy) docs for detailed usage. But here's a simple example:

```js
// quasar.conf.js

devServer: {
  proxy: {
    // proxy all requests starting with /api to jsonplaceholder
    '/api': {
      target: 'http://some.api.target.com:7070',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}
```

The above example will proxy the request `/api/posts/1` to `http://some.api.target.com:7070/posts/1`.
