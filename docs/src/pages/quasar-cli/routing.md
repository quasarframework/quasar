---
title: App Routing
desc: How to use the Vue Router in a Quasar app.
---

You'll notice that your Quasar project contains a `/src/router` folder. This holds the routing configuration of your website/app:
* "/src/router/index.js" holds the Vue Router initialization code
* "/src/router/routes.js" holds the routes of your website/app

Make sure to read [Vue Router documentation](https://router.vuejs.org/) to understand how it works.

The `/src/router/routes.js` needs to import your website/app's Pages and Layouts. Read more on [Routing with Layouts and Pages](/layout/routing-with-layouts-and-pages) documentation page.

When using Vuex the store is not directly importable from other scripts, but it is passed to the exported function of `/src/router/index.js`, so it can be accessed from there. For example you can use the `Router.beforeEach` method to check authentication in the router:

```js
export default function ({ store /*, ssrContext */ }) {
  // ...
  Router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth) && !store.getters['auth/isSignedIn']) {
      next({ name: 'account-signin', query: { next: to.fullPath } })
    } else {
      next()
    }
  })
  // ...
}
```
