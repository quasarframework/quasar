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


You can make the store accessable to your routes array by creating an imported routes function that takes the store as an argument. This allows you to do per route basis checking against the Vuex state. For example to see if the user has a subscription. 

First thing to do is go to your * "/src/router/routes.js" file and remove the ```const routes = [ ... ]``` delcaration and move the array to a return statement inside a newly created function. ```function routes () { return [ ... ] }``` See the example below. Then export default route as your normally would, execpt now you will export a function that expects store as an argument.

```js
function routes (store) {
  return [
    {
      path: '/',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        {
          path: '', 
          name: 'home', 
          component: () => import('pages/Index.vue'),
        },
        { 
          path: '/subscription',
          name: 'subscription',
          component: () => import ('pages/About.vue'),
          beforeEnter(to, from, next) {
            if (store.getters['getterModule/getterFunction']) { // check if user is logged via a getter
              next()
            } else {
              next({
                name: "home" // back to safety route //
              });
            }
            next()
          },
        }
      ]
    }
  ]
}

export default routes
```

In the VueRouter Instance add state into the function parameter to make it available to the function scope. Declare routes as a property and assign it the routes import function. In the routes function declaration pass it state. See the example below.

```js
export default function ({store} /* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes: routes(store), // call imported function that will return the routes array

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}
```


