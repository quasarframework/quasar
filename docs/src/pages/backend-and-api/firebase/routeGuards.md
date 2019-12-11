---
title: Route Guards
desc: How we handle route guards with Firebase inside of Quasar
---

Before we start getting into the deeper areas of the documentation we need to discuss [Navigation Guards with Vue Router](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards)

Route guarding is the process of allowing firebase to fully initialize, and then respond based on how we set up our routes file in our app notifying us if there is an authenticated user or not. Navigation guards with firebase, and subsequently when working with Quasar can be a little tricky. One of the most asked question regarding how to deal with navigation guards, as when using the Quasar framework, you do not have direct access to the `main.js` file to manipulate when the main Vue instance gets instantiated. To deal with this process we have to rely on the boot files, and the router instance itself.

Once we have a user authenticated the idea is to have pages be protected as to allow authenticated user to have access to routes and pages. To take it one step further, it would be ideal to have role based permissions set up as well. This will need to incorporate a data store and create a collection of users. More on that later, but back to route guarding.


> Initially and simply we can easily just do this in our `index.js` in the router:

```js
router.beforeEach((to, from, next) => {
    firebaseService.auth().onAuthStateChanged((user) => {
      const currentUser = user
      const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
      if (requiresAuth && !currentUser) next('/auth/login')
      else if (to.path === '/' && currentUser) next('/user/feed')
      else next()
    })
  })
```

What's going on here is that before every route that is loaded in our app we inspect if from a programmatic standpoint. The router instance has a method called `beforeEach` that allows us to look at every route and determine if we have any meta data that we need to inspect before allowing the user to proceed. Conveniently we have the ability to pause the runtime environment to wait for the firebase service to make its call to the its `onAuthStateChanged` method and return the state of the user before we continue the render of the app, and then route the user to the appropriate page based on programmatic constraints we set.

Simplistically this works very effectively, but over time the problem here is creating an abundance of observable every time a route changes which will lead to your browser eating up the systems memory.

To circumvent that we need to be a little more diligent in how we approach this. A better way is:

::: tip
Create a pattern in which only a single observable is created and used for all routes created by the user for a give session.
:::


**/src/boot/serverConnection.js**
```js
router.beforeEach(async (to, from, next) => {
    try {
      // get currentUser before routing occurs
      const currentUser = await firebaseService.ensureAuthIsInitialized()
      const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

      if (requiresAuth && !currentUser) next('auth/login')
      else if (to.path === '/auth/login' && currentUser) next('/user')
      else next()
    } catch (err) {
      throw Error(`Authentication error: ${err}`)
    }
  })
```

With a corresponding method in our service structure:

```js
import firebase from 'firebase/app'
import 'firebase/auth'

let authPromise

///...\\\

/**
 * Async function providing the application time to
 * wait for firebase to initialize and determine if a
 * user is authenticated or not with only a single observable
 *
 * @return {Promise} - authPromise
 */
export const ensureAuthIsInitialized = async () => {
  // Create the initialization promise
  if (!authPromise) {
    authPromise = new Promise((resolve, reject) => {
      // Create the observer only once on init
      firebase.auth().onAuthStateChanged(async user => {
        resolve(user)
      }, error => reject(error))
    })
  }

  return authPromise
}
```

In the next section we will implement this approach, and focus on our first authentication type: Email with Password, and authenticate the user, as well as allow the application to be refreshed on a protected route requiring an authenticated user.