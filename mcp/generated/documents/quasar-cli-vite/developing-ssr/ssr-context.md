---
title: The ssrContext Object
description: (@quasar/app-vite) The ssrContext Object in Quasar SSR
canonical: https://quasar.dev/quasar-cli-vite/developing-ssr/ssr-context
kinds: guide
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

The `ssrContext` Object is the SSR context with which all the app's Vue components are rendered with.

## Usage

::: warning
The `ssrContext` Object is available only on SSR builds, on the server-side compilation (when `import.meta.env.QUASAR_SERVER` is boolean `true`).
:::

Among other places, it is supplied as parameter to [boot files](/quasar-cli-vite/boot-files), to the [Pinia instance](/quasar-cli-vite/state-management-with-pinia) and [Vue Router](/quasar-cli-vite/page-routing-with-vue-router) initialization functions, and to the [preFetch](/quasar-cli-vite/prefetch-feature) method:

```js
// a boot file
export default defineBoot(({ ..., ssrContext }) => { /* ... */ })

// src/router/index.js
export default defineRouter(({ ..., ssrContext }) => { /* ... */ })

// src/store/index.js
export default defineStore(({ ..., ssrContext }) => { /* ... */ })

// with preFetch:
preFetch: definePreFetch(({ ..., ssrContext }) => { /* ... */ })
```

You can also access the ssrContext in your Vue components. Below are two examples, one with Composition API and one with Options API:

```tabs
<<| js Composition API |>>
import { useSSRContext } from 'vue'

export default {
  // ...
  setup () {
    // we need to guard it and call it only on SSR server-side:
    const ssrContext = import.meta.env.QUASAR_SERVER ? useSSRContext() : null
    // ...do something with it
  }
}
<<| js Options API |>>
export default {
  // ...
  created () { // can be any other Vue component lifecycle hook
    this.ssrContext
  }
}
```

## Anatomy of ssrContext

```json
ssrContext: {
  req, // Webserver-specific request object
  res, // Webserver-specific response object
  $q, // The Quasar's $q Object
  nonce, // (optional to set it yourself)
  // The global "nonce" attribute to use

  onRendered, // Registers a function to be executed server-side after
  // app has been rendered with Vue. You might need this
  // to access ssrContext again after it has been fully processed.
  // Example: ssrContext.onRendered(() => { /* ... */ })

  rendered // (optional to set it yourself)
  // Set this to a function which will be executed server-side
  // after the app has been rendered with Vue.
  // We recommend using the "onRendered" instead.
  //
  // Purpose: backward compatibility with Vue ecosystem packages
  // (like @vue/apollo-ssr)
  // Example: ssrContext.rendered = () => { /* ... */ }
}
```

More information on the purpose of the "nonce" property is available on [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce).

The exact `req` and `res` types depend on the selected webserver (Hono, Express, Fastify, or Koa). They represent the current request and response; consult that webserver's API before using framework-specific properties.

::: tip
Feel free to inject your own stuff into ssrContext too, but do NOT tamper with any of the private props (props that start with an underscore, eg. `_someProp`).
:::
