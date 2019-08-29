---
title: Firebase Service Structure
desc: Application strucuture instrcutions for firebase implementation on the Quasar framework.
---

A typical Quasar app structure can be seen [here](https://quasar.dev/quasar-cli/cli-documentation/directory-structure). Create a new boot file to implement the firebase sdk via: 

```bash
quasar new boot firebase
```

Be sure to read up on quasar’s boot files here: https://quasar.dev/quasar-cli/cli-documentation/boot-files. This is a great review, and also a core tenant to understanding how firebase is embedded into a quasar app, and also the root place to start when debugging firebase issues. Once the firebase boot file is created we’ll then need to add its name to the boot config array in the `quasar.conf.js`

```js
boot: [
  'firebase'
],
```

From here we have our basic boot file structure:

```js
import * as firebaseService from '../services/FirebaseService'

export default ({ app, router, Vue }) => {
  // Import the firebase service and call the initialization method with the config 
  // object supplied by the qenv app-ext at build time
  firebaseService.fBInit(process.env.AppConfig.FIREBASE_CONFIG)

  // Assign the service to a Vue instance property to allow
  // for reference elsewhere in the app.
  Vue.prototype.$fb = firebaseService
}
```

Now let’s create a new firebase service file inside of a services app directory. We like to do this in case we want to test our service, or chance our service in the future. Especially if our firebase service starts to incorporate more of the firebase suite offerings like storage, messaging, firestore, …etc.

For our service and simplicity sake let’s focus on some methods that will initialize the app, provide for an auth state, handle one type of Authentication flavor for registering and logging in users, and logging users out of the application. In time more will be discussed but for now let’s just get this very happy path set up. An example service file could look like this: [ show firebase service with: auth, fBInit, registerUserWithEmail, loginUserWithEmail, logoutUser ]

From here we should talk about route guarding. Once we have a user authenticated the idea is to have pages be protected as to allow authenticated user to have access to routes and pages. To take it one step further, it would be ideal to have role based permissions set up as well. This will need to incorporate a data store and create a collection of users. More on that later, but back to route guarding.

Route guarding in the context of a quasar app via vue-router [https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards], is the process of allowing firebase to fully initialize, and then respond based on how we set up our routes file in our app notifying us if there is an authenticated user or not. In the past this has been a tricky aspect of working with firebase and quasar, because quasar doesn’t directly allow you to control the initialization of the application itself. This is what the boot fire configuration was set up for, and this is where we will harness firebase’s auth method called `onAuthStateChange`.

This method is described in the firebase api docs[link] as a method that get invoked in the UI thread on changes in the authentication state:

	•	Right after the listener has been registered
	•	When a user is signed in
	•	When the current user is signed out
	•	When the current user changes

With that we should look at a coupe of things. First let’s look at how the firebase guide addresses this:
```js
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
  } else {
    // No user is signed in.
  }
})
```
Initially the easiest approach here is to wrap our route guard around this so something like this: 

```js
if (currentConfig) {
  router.beforeEach((to, from, next) => {
    firebase.auth().onAuthStateChanged(() => {
    const currentUser = firebase.auth().currentUser
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if (requiresAuth && !currentUser) next('login')
    else if (to.path === '/login' && (!requiresAuth && currentUser)) next('user')
    else if (to.path === '/register' && (!requiresAuth && currentUser)) next('user')
      else next()
    })
  })
}
```

But, upon further investigation this creates unwanted observables in memory, and over time that can lead to a memory leak

Here's a better approach:

```js 
> Some code

````