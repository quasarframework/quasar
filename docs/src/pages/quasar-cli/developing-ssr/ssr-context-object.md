---
title: The ssrContext Object
desc: The ssrContext Object in Quasar SSR
---

The `ssrContext` Object is the SSR context with which all the app's Vue components are rendered with.

## Usage

::: warning
The `ssrContext` Object is available only on SSR builds, on the server-side compilation (when `process.env.SERVER === true`).
:::

Among other places, it is supplied as parameter to [boot files](/quasar-cli/boot-files), to the [Vuex store](/quasar-cli/vuex-store) and [Vue Router](/quasar-cli/routing) initialization functions, and to the [preFetch](/quasar-cli/prefetch-feature) method:

```js
// a boot file
export default ({ ..., ssrContext }) => { /* ... */ }

// src/router/index.[js|ts]
export default ({ ..., ssrContext }) { /* ... */ }

// src/store/index.[js|ts]
export default ({ ..., ssrContext }) { /* ... */ }

// with preFetch:
preFetch ({ ..., ssrContext }) { /* ... */ }
```

## Anatomy of ssrContext

```js
ssrContext: {
  req,        // Express.js object
  res,        // Express.js object
  $q,         // The Quasar's $q Object
  state,      // The Vuex state (ONLY if using the Vuex store)

  nonce,      // (optional to set it yourself)
              // The global "nonce" attribute to use

  onRendered, // Registers a function to be executed server-side after
              // app has been rendered with Vue. You might need this
              // to access ssrContext again after it has been fully processed.
              // Example: ssrContext.onRendered(() => { /* ... */ })

  rendered    // (optional to set it yourself)
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

The `req` and `res` are Express.js's objects for the current server client. One use-case for `req` is accessing `req.url` to get the URL that the client is requesting.

Feel free to inject your own stuff into ssrContext too, but do NOT tamper with any of the private props (props that start with an underscore, eg. `_someProp`).
