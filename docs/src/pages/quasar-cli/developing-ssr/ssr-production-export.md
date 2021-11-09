---
title: SSR Production Export
desc: Configuring the Quasar SSR webserver for different platforms, including a serverless architecture.
---

::: danger
* You will need to be running on "@quasar/app" v3.2+ to be able to use this feature.
* This file is used ONLY for your production build and NOT while developing.
:::

Notice that your generated `/src-ssr` contains a file named `production-export.js`. This file defines how your SSR webserver is served. You can start listening to a port or provide a handler for your serverless infrastructure to use. It's up to you.

> Whatever this function returns (if anything) will be exported from your built `dist/ssr/index.js`.

## Anatomy

The `/src-ssr/production-export.[js|ts]` file is a simple JavaScript file which boots up your SSR webserver and defines what your webserver exports (if exporting anything).

``` js
// import something here (serverless packages?)

export default ({
  app, port, isReady, ssrHandler,
  resolve, publicPath, folders, render, serve
}) => {
  // something to do with the server "app"
  // return whatever you want your webserver to export (handler for serverless function?)
}
```

::: tip
Remember that whatever this function returns (if anything) will be exported from your built `dist/ssr/index.js`.
:::

You can wrap the returned function with `ssrProductionExport` helper to get a better IDE autocomplete experience (Quasar v2.3.1+ required):

``` js
import { ssrProductionExport } from 'quasar/wrappers'

export default ssrProductionExport(({
  app, port, isReady, ssrHandler,
  resolve, publicPath, folders, render, serve
}) => {
  // something to do with the server "app"
  // return whatever you want your webserver to export (handler for serverless?)
})
```

## Parameters

We are referring here to the Object received as parameter by the default exported function of the production-export file.

``` js
export default ({
  app, port, isReady, ssrHandler,
  resolve, publicPath, folders, render, serve
}) => {
```

Detailing the Object:

``` js
{
  app,     // Expressjs app instance

  port,    // process.env.PORT or quasar.conf > ssr > prodPort

  isReady, // Function to call returning a Promise
           // when app is ready to serve clients

  ssrHandler, // Prebuilt app handler if your serverless service
              // doesn't require a specific way to provide it.
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
If you import anything from node_modules, then make sure that the package is specified in package.json > "dependencies" and NOT in "devDependencies".
:::

### Listen on a port

This is the default option that you get when adding SSR support in a Quasar CLI project. It starts listening on the configured port (process.env.PORT or quasar.conf > ssr > prodPort).

``` js
// src-ssr/production-export.[js|ts]

import { ssrProductionExport } from 'quasar/wrappers'

export default ssrProductionExport(({ app, port, isReady }) => {
  // we wait for app to be ready (including running all SSR middlewares)
  return isReady().then(() => {
    // then we start listening on a port
    app.listen(port, () => {
      // we're ready to serve clients
      console.log('Server listening at port ' + port)
    })
  })
})
```

### Serverless

If you have a serverless infrastructure, then you generally need to export a handler instead of starting to listen to a port.

Say that your serverless service requires you to:

``` js
module.exports.handler = __your_handler__
```

Then what you'd need to do is:

``` js
// src-ssr/production-export.[js|ts]

import { ssrProductionExport } from 'quasar/wrappers'

export default ssrProductionExport(({ ssrHandler }) => {
  // "ssrHandler" is a prebuilt handler which already
  // waits for all the middlewares to run before serving clients

  // whatever you return here is equivalent to module.exports.<key> = <value>
  return { handler: ssrHandler }
})
```

#### Example: Firebase function

``` js
// src-ssr/production-export.[js|ts]

import * as functions from 'firebase-functions'
import { ssrProductionExport } from 'quasar/wrappers'

export default ssrProductionExport(({ ssrHandler }) => {
  return {
    ssr: functions.https.onRequest(ssrHandler)
  }
})
```
