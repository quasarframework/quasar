---
title: Page Routing with Vue Router
desc: (@quasar/app-vite) How to use the Vue Router in a Quasar app.
scope:
  filenameBasedRouting:
    l: '/src'
    c:
      - l: router
        c:
          - l: index.js
            e: (or .ts)
      - l: pages
        c:
          - l: index.vue
            e: layout for route "/"
          - l: index
            c:
              - l: (index).vue
                e: page for route "/"
              - l: second.vue
                e: page for route "/second"
          - l: admin.vue
            e: layout for route "/admin"
          - l: admin
            c:
              - l: (index).vue
                e: page for route "/admin"
              - l: account.vue
                e: page for route "/admin/account"
---

You'll notice that your Quasar project contains a `/src/router` folder. This holds the routing configuration of your website/app:

- "/src/router/index.js" holds the Vue Router initialization code
- "/src/router/routes.js" holds the routes of your website/app

::: warning
Quasar documentation assumes you are already familiar with [Vue Router](https://github.com/vuejs/vue-router). Below it's described only the basics of how to make use of it in a Quasar CLI project. For the full list of its features please visit the [Vue Router documentation](https://router.vuejs.org/).
:::

## Basic Usage

The `/src/router/routes.js` needs to import your website/app's Pages and Layouts. Read more on [Routing with Layouts and Pages](/layout/routing-with-layouts-and-pages) documentation page.

When using Pinia, the store is not directly importable from other scripts, but it is passed to the exported function of `/src/router/index.js`, so it can be accessed from there. For example you can use the `Router.beforeEach` method to check authentication in the router:

```js /src/router.js
import { defineRouter } from '#q-app'

export default defineRouter(({ store /*, ssrContext */ }) => {
  // ...
  const userStore = useUserStore(store)

  Router.beforeEach((to, from) => {
    if (
      to.matched.some(record => record.meta.requiresAuth) &&
      !userStore.isSignedIn
    ) {
      return { name: 'account-signin', query: { next: to.fullPath } }
    }
  })
  // ...
})
```

::: tip
If you are developing a SSR/SSG app, then you can check out the [ssrContext](/quasar-cli-vite/developing-ssr/ssr-context) Object that gets supplied server-side.
:::

## Filename-Based Routing <q-badge label="Vue Router v5+" />

### How to enable

Should you want to use Vue Router's filename-based routing, rather than manually handling the `/src/router/routes` file, then kill the devserver (if running), then edit:

```ts /quasar.config file
build: {
  /**
   * Should you want to use Vue Router's filename-based routing feature.
   * Set to `true` or an options object for vue-router/vite plugin (to override
   * or add to the default options).
   *
   * Restart the dev server and your IDE when toggling this option,
   * or run "quasar prepare" command.
   *
   * @type boolean | VueRouterVitePluginOptions
   * @default false
   */
  filenameBasedRouting: true
}
```

You also need to edit:

<!-- prettier-ignore -->
```js /src/router/index file
import routes from './routes' // [!code --]
import { routes, handleHotUpdate } from 'vue-router/auto-routes' // [!code ++]

export default defineRouter((/* { store, ssrContext } */) => {
  const Router = createRouter({
    routes
    // the rest....
  })

  // enable HMR for it // [!code ++]
  if (import.meta.hot) { // [!code ++]
    handleHotUpdate(Router) // [!code ++]
  } // [!code ++]

  return Router
})
```

Please note that you need to restart the dev server after toggling this option, or run "quasar prepare" command. You might also need to restart your IDE afterwards, too.

### Folder structure

When this feature is enabled, you will need to:

- Change the `/src/pages` folder structure to match [Vue Router naming convention](https://router.vuejs.org/file-based-routing/file-based-routing.html)
- Delete `/src/router/routes.js|ts` file
- Delete `/src/layouts` because it serves no purpose now (or incorporate it into `/src/pages`)

Here is an example of the folder structure:

<DocTree :def="scope.filenameBasedRouting" />

### Default options

When `filenameBasedRouting` is set to `true` or an options object is supplied (overriding or adding to the default config), this is the default options supplied to the `vue-router/vite` plugin:

```js
{
  // where are paths relative to:
  root: <root_project_folder>,

  // where to generate the types (if on TypeScript projects):
  dts: './src/router/typed-router.d.ts',
}
```

For more info on the object: [Vue Router configuration](https://router.vuejs.org/file-based-routing/configuration.html).
