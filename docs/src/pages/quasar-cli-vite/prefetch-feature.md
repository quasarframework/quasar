---
title: PreFetch Feature
desc: (@quasar/app-vite) How to prefetch data and initialize Pinia, validate the route and redirect to another page in a Quasar app.
related:
  - /quasar-cli-vite/quasar-config-file
---

The PreFetch is a feature (**only available when using Quasar CLI**) which allows the components picked up by Vue Router (defined in `/src/router/routes.js`) to:

- pre-fetch data
- validate the route
- redirect to another route, when some conditions aren't met (like user isn't logged in)
- can help in initializing the Store state

All the above will run before the actual route component is rendered.

**It is designed to work with all Quasar modes** (SPA, PWA, SSR, Cordova, Electron), but it is especially useful for SSR builds.

## Installation

```js /quasar.config file
return {
  preFetch: true
}
```

::: warning
When you use it to pre-fetch data, you may want to use Pinia, so make sure that your project folder has the `/src/stores` (for Pinia) folders when you create your project, otherwise generate a new project and copy the store folder contents to your current project (or use `quasar new store` command).
:::

## How PreFetch Helps SSR Mode

This feature is especially useful for the SSR mode (but not limited to it only). During SSR, we are essentially rendering a "snapshot" of our app, so if the app relies on some asynchronous data, **then this data needs to be pre-fetched and resolved before we start the rendering process**.

Another concern is that on the client, the same data needs to be available before we mount the client side app - otherwise the client app would render using a different state and the hydration would fail.

To address this, the fetched data needs to live outside the view components, in a dedicated data store, or a "state container". On the server, we can pre-fetch and fill data into the store before rendering. The client-side store will directly pick up the server state before we mount the app.

## When PreFetch Gets Activated

The `preFetch` hook (described in next sections) is determined by the route visited - which also determines what components are rendered. In fact, the data needed for a given route is also the data needed by the components rendered at that route. **So it is natural (and also required) to place the hook logic ONLY inside route components.** This includes `/src/App.vue`, which in this case will run only once at the app bootup.

Let's take an example in order to understand when the hook is being called. Let's say we have these routes and we've written `preFetch` hooks for all these components:

```js Routes
;[
  {
    path: '/',
    component: LandingPage
  },
  {
    path: '/shop',
    component: ShopLayout,
    children: [
      {
        path: 'all',
        component: ShopAll
      },
      {
        path: 'new',
        component: ShopNew
      },
      {
        path: 'product/:name',
        component: ShopProduct,
        children: [
          {
            path: 'overview',
            component: ShopProductOverview
          }
        ]
      }
    ]
  }
]
```

Now, let's see how the hooks are called when the user visits these routes in the order specified below, one after another.

| Route being visited            | Hooks called from                    | Observations                                                                                                                               |
| ------------------------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`                            | App.vue then LandingPage             | App.vue hook is called since our app boots up.                                                                                             |
| `/shop/all`                    | ShopLayout then ShopAll              | -                                                                                                                                          |
| `/shop/new`                    | ShopNew                              | ShopNew is a child of ShopLayout, and ShopLayout is already rendered, so ShopLayout isn't called again.                                    |
| `/shop/product/pyjamas`        | ShopProduct                          | -                                                                                                                                          |
| `/shop/product/shoes`          | ShopProduct                          | Quasar notices the same component is already rendered, but the route has been updated and it has route params, so it calls the hook again. |
| `/shop/product/shoes/overview` | ShopProduct then ShopProductOverview | ShopProduct has route params so it is called even though it's already rendered.                                                            |
| `/`                            | LandingPage                          | -                                                                                                                                          |

## Usage

The hook is defined as a custom static function called `preFetch` on our route components. Note that because this function will be called before the components are instantiated, it doesn't have access to `this`.

Example below is when using Pinia:

```html Some .vue component used as route
<template>
  <div>{{ item.title }}</div>
</template>

<script>
  import { useRoute } from 'vue-router'
  import { useMyStore } from 'stores/myStore.js'

  export default {
    // our hook here
    preFetch({
      store,
      currentRoute,
      previousRoute,
      redirect,
      ssrContext,
      urlPath,
      publicPath
    }) {
      // fetch data, validate route and optionally redirect to some other route...

      // ssrContext is available only server-side in SSR mode

      // No access to "this" here

      // Return a Promise if you are running an async job
      // Example:
      const myStore = useMyStore() // useMyStore(store) for SSR
      return myStore.fetchItem(currentRoute.params.id) // assumes it is async
    },

    setup() {
      const myStore = useMyStore()
      const $route = useRoute()

      // display the item from store state.
      const item = computed(() => myStore.items[$route.params.id])

      return { item }
    }
  }
</script>
```

If you are using `<script setup>` (and Vue 3.3+):

```html
<script setup>
  /**
   * The defineOptions is a macro.
   * The options will be hoisted to module scope and cannot access local
   * variables in <script setup> that are not literal constants.
   */
  defineOptions({
    preFetch() {
      console.log('running preFetch')
    }
  })
</script>
```

::: tip
If you are developing a SSR app, then you can check out the [ssrContext](/quasar-cli-vite/developing-ssr/ssr-context) Object that gets supplied server-side.
:::

```js
// related action for Promise example
// ...

actions: {
  fetchItem ({ commit }, id) {
    return axiosInstance.get(url, id).then(({ data }) => {
      this.items = data
    })
  }
}

// ...
```

### Redirecting Example

Below is an example of redirecting the user under some circumstances, like when they try to access a page that only an authenticated user should see.

```js
// We assume here we already wrote the authentication logic
// in one Pinia Store, so take as a high-level example only.
import { useMyStore } from 'stores/myStore'

preFetch ({ store, redirect }) {
  const myStore = useMyStore() // useMyStore(store) for SSR
  if (!myStore.isAuthenticated) {
    redirect({ path: '/login' })
  }
}
```

By default, redirect occurs with a status response code of 302, but we can pass this status code as the second optional parameter when calling the function, like this:

```js
redirect({ path: '/moved-permanently' }, 301)
```

If `redirect(false)` is called (supported only on client-side!), it aborts the current route navigation. Note that if you use it like this in `src/App.vue` it will halt the app bootup, which is undesirable.

The `redirect()` method requires a Vue Router location Object.

### Using preFetch to Initialize Pinia

The `preFetch` hook runs only once, when the app boots up, so you can use this opportunity to initialize the Pinia store(s) here.

```tabs
<<| js Pinia on Non SSR |>>
// App.vue - handling Pinia stores
// example with a store named "myStore"
// placed in /src/stores/myStore.js|ts

import { useMyStore } from 'stores/myStore.js'

export default {
  // ...
  preFetch () {
    const myStore = useMyStore()
    // do something with myStore
  }
}
<<| js Pinia on SSR |>>
// App.vue - handling Pinia stores
// example with a store named "myStore"
// placed in /src/stores/myStore.js|ts

import { useMyStore } from 'stores/myStore.js'

export default {
  // ...
  preFetch ({ store }) {
    const myStore = useMyStore(store)
    // do something with myStore
  }
}
```

## Loading State

A good UX includes notifying the user that something is being worked on in the background while he/she waits for the page to be ready. Quasar CLI offers two options for this out of the box.

### LoadingBar

When you add Quasar [LoadingBar](/quasar-plugins/loading-bar) plugin to your app, Quasar CLI will use it while it runs the preFetch hooks by default.

### Loading

There's also the possibility to use Quasar [Loading](/quasar-plugins/loading) plugin. Here's an example:

```js A route .vue component
import { Loading } from 'quasar'

export default {
  // ...
  preFetch(
    {
      /* ... */
    }
  ) {
    Loading.show()

    return new Promise(resolve => {
      // do something async here
      // then call "resolve()"
    }).then(() => {
      Loading.hide()
    })
  }
}
```
