---
title: Authentication - Email
desc: Firebase authentication using email instructions for the Quasar framework.
---

Email Authentication is one of a handful of authentication methods provided by Firebase. In order to setup email authentication you first have to enable it in your project in your firebase console:

- In the Firebase console, open the Auth section.
- On the Sign-in method tab, enable the Email/password sign-in method and click Save.

Moving forward a form is needed for the user to register or login. This can be achieved by creating a page called `Auth.vue` which will house both registration and logging in.

```bash
$ quasar new page Auth
```

In the `Auth.vue` page we've created a basic, but rich user form for registering and login in users.:

*A link to the sample app repo* => **/src/pages/Auth.vue**

Notice the use of the Vuex convenience method: [`mapActions`](https://vuex.vuejs.org/api/#mapactions). These are very helpful and will be using them along with [`mapGetters`](https://vuex.vuejs.org/api/#mapgetters) in future parts of the docs.
Now that the form is in place we need to start to augment a few more files. First lets take a look at our `serverConnection` file:

**/src/boot/serverConnection.js**

```js
import * as base from '../services/base.js'
import * as email from '../services/email.js'

const firebaseService = Object.assign({}, base, email)

// "async" is optional
export default ({ router, store, Vue }) => {
  const config = process.env.environments.FIREBASE_CONFIG
  firebaseService.fBInit(config)

  // Auth
  firebaseService.auth().onAuthStateChanged((user) => {
    firebaseService.handleOnAuthStateChanged(store, user)
  }, (error) => {
    console.error(error)
  })

  router.beforeEach(async (to, from, next) => {
    firebaseService.routerBeforeEach(to, from, next, store)
  })

  Vue.prototype.$fb = firebaseService
  store.$fb = firebaseService
}
```

A couple of additions now that we're going to be authenticating users. First we're combining our separate services, `base` & `email` into one service: `firebaseService`. Then we need to listen for changes in Firebase when the Auth service initializes and when a user authentication status changes. This is where `onAuthStateChanged` will be handled. Once the service is done initializing we pass the user state over to the method `handleOnAuthStateChanged` over to our base service. We're also setting up our navigational guard here in the boot file with vue-router's `beforeEach` hook. Again we pass the applications route state over to our base service as well.

Additionally we are also going to add the service to our Vue instance as well as our store instance to allow the application to use the service anywhere else in the app.

Next our services. First let's take a look at the new service: `email`

*A link to the sample app repo* => **/src/services/email.js**

This service is very straight forward and provides an interface to the firebase auth methods themselves.

Next we have some updates to our `base` service.

*A link to the sample app repo* => **/src/service/base.js**

The base auth service has changed substantially and we need to break a few things down for clarity. First off is the `ensureAuthIsInitialized` method. 

```js
/**
 * Async function providing the application time to
 * wait for firebase to initialize and determine if a
 * user is authenticated or not with only a single observable
 *
 * @return {Promise} - authPromise
 */
export const ensureAuthIsInitialized = async (store) => {
  if (store.state.auth.isReady) return true
  // Create the observer only once on init
  return new Promise((resolve, reject) => {
    // Use a promise to make sure that the router will eventually show the route after the auth is initialized.
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      resolve(user)
      unsubscribe()
    }, () => {
      console.error('Looks like there is a problem with the firebase service')
      reject(false)
    })
  })
}
```
This will allow our application to hold routing until the firebase service has actually finished initializing, and providing an auth state for the user. This is what allow us to stay on a `requiresAuth` page and not route us back to login. Also note the declaration of the observable as an assigned function, and then later calling it, [`unsubscribe()`](https://firebase.google.com/docs/reference/js/firebase.auth.Auth.html#optional-completed:-firebase.unsubscribe) to allow us to resolve the auth service once it's done initializing, and then unsubscribe listening to the observable which is useful when dealing with the navigational guards. If this isn't set up this way, you'll end up with multiple observables in memory every time your user is being routed around your app. A lot of us have learned this the hard way.

Next method is the `handleOnAuthStateChanged` method.
```js
/** Handle the auth state of the user and
 * set it in the auth store module
 * @param  {Object} store
 * @param  {Object} currentUser
 */
export const handleOnAuthStateChanged = async (store, currentUser) => {
  const initialAuthStateSet = isAuthenticated(store)
  // Save to the store
  store.commit('auth/setAuthState', {
    isAuthenticated: currentUser !== null,
    isReady: true,
    isSignedIn: currentUser !== null
  })

  // If the user looses authentication route
  // them to the login page
  if (!currentUser && initialAuthStateSet) {
    store.dispatch('common/routeUserToAuth')
  }
}
```

 We saw this used in our service connection boot file with in the first observable we set up to listen for changes in the auth state. Basically,once we have have a change in the auth state, we take the status of the user, and then set up a few props in state. Also, note the use of routing the user away from the current page they're on and back to login if the were initially authenticated. This is optional, but provided here.

Finally we have our navigation guard as mentioned in the previous section.

```js
/**
 * @param  {Object} to - From Vue Router
 * @param  {Object} from - From Vue Router
 * @param  {Object} next - From Vue Router
 * @param  {Object} store - Reference to Vuex store from
 * our boot file
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

This can grow and get more complex as your needs change, but the most important thing here is to halt the application from routing until the firebase service is done initializing.

Then we have some more [Vuex](https://vuex.vuejs.org/) implementation we need to do. It's a good practice to separate your applications state, and we will be doing the same in these docs. We will only be showing the vuex portions relevant to firebase, and not the minor state handling of the loading state. You can find the full code base in the example app.

*A link to the sample app repo* => **/src/store/auth/state.js**

Our auth state params.

*A link to the sample app repo* => **/src/store/auth/actions.js**

Notice the use of async functions to call the actual service methods in our service.

Finally our auth state mutation for when the `onAuthStateChanged` method is fired.

*A link to the sample app repo* => **/src/store/auth/mutations.js**
