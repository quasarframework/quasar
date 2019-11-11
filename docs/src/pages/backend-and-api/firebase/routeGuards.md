---
title: Route Guards
desc: How we handle route guards with Firebase inside of Quasar
---

Before getting into the deeper areas of the documentation we need to dicuss [Navigation Guards with Vue Router](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards)

Route guarding is the process of allowing Firebase to fully initialize, and then respond based on how we set up our routes file in our app notifying us if there is an authenticated user or not. Navigation guards with Firebase, and subsequently when working with Quasar can be a little tricky. One of the most asked questions regarding how to deal with navigation guards, pertaining to the Quasar framework, is that you do not have direct access to the `main.js` file to manipulate the main Vue instance. To deal with this process we have to rely on the boot files, and the router instance itself.

Once we have a user authenticated the idea here is to have pages protected that only allow authenticated users to have access to routes and pages. To take this one step further would be to have role-based permissions set up as well. This will need to incorporate a data store and create a collection of users. More on that later, but back to route guarding.

> Initialy and simply we can easily just do this in our `index.js` in the router:

```js
router.beforeEach((to, from, next) => {
    firebaseService.auth().onAuthStateChanged((user) => {
      const currentUser = user
      const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
      if (requiresAuth && !currentUser) next('/auth/login')
      else if (to.path === '/' && currentUser) next('/user/someUserRoute')
      else next()
    })
  })
```

What's going on here is that before every route that is loaded in our app we inspect it from a programmatic standpoint. The router instance has a method called `beforeEach` that allows us to look at every route and determine if we have any metadata that we need to inspect before allowing the user to proceed. Conveniently, we can pause the runtime environment to wait for the Firebase service to make its call to its `onAuthStateChanged` method and return the state of the user before we continue the rendering of the application. Then, route the user to the appropriate page based on programmatical constraints we set.

Simplistically this works very effectively, but over time the problem here is creating an abundance of observables every time the route changes, which will lead to your browser eating up the system's memory.

::: tip Pro tip
To circumvent the accumulation of observables we need to be a little more diligent in how we approach our code. A better way is to create a pattern in which only a single observable is created and used for all routes created by the user for a given session.
:::

First, in our `serverConnection` boot file we are going to intercept the Router via the `router` argument provided to us in the boot file. Notice we're also passing the store as an argument to allow the service to handle the initialization process with Firebase, and set the state of the user in our store.

**/src/boot/serverConnection.js**
```js
router.beforeEach(async (to, from, next) => {
  firebaseService.routerBeforeEach(to, from, next, store)
})
```

Inside of our router's beforeEach hook we call our `base` firebaseService and implement our custom `routerBeforeEach` method.

**/src/services/firebase/base.js**
```js
/**
 * @param  {Object} to - From Vue Router
 * @param  {Object} from - From Vue Router
 * @param  {Object} next - From Vue Router
 */
export const routerBeforeEach = async (to, from, next, store) => {
  try {
    await ensureAuthIsInitialized(store)
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (isAuthenticated(store)) {
        next()
      } else {
        next('/auth/login')
      }
    } else {
      next()
    }
  } catch (err) {
    Notify.create({
      message: `${err}`,
      color: 'negative'
    })
  }
}
```

With our coresponding method, `ensureAuthIsInitialized` in our base service file:

**/src/services/firebase/base.js**
```js
/**
 * Async function providing the application time to
 * wait for Firebase to initialize and determine if a
 * user is authenticated or not with only a single observable
 */
export const ensureAuthIsInitialized = async (store) => {
  if (store.state.auth.isReady) return true
  // Create the observer only once on init
  return new Promise((resolve, reject) => {
    // Use a promise to make sure that the router will eventually show the route after the auth is initialized.
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      resolve()
      unsubscribe()
    }, () => {
      reject(new Error('Looks like there is a problem with the Firebase service. Please try again later'))
    })
  })
}
```

In the next section, we will implement this approach, and focus on our first authentication type: Email with Password and authenticate the user, as well as allow the application to be refreshed on a protected route requiring an authenticated user.