---
title: Firebase Application Initialization and Service Structure
desc: Application initialization and structure instructions for firebase implementation on the Quasar framework.
---

A typical Quasar app structure can be seen [here](https://quasar.dev/quasar-cli/cli-documentation/directory-structure). 

First we need to create a boot file. Be sure to read up on quasar’s boot files [here](https://quasar.dev/quasar-cli/cli-documentation/boot-files). This is a great review, and also a core tenant to understanding how firebase is embedded into a quasar app, and also the root place to start when debugging firebase issues. Once the firebase boot file is created we’ll then need to add its name to the boot config array in the `quasar.conf.js`

> A simple approach would be to create the firebase boot file, initialize your firebase app with your config, extend the Vue instance with a reference to firebase, and then use the firebase SDK throughout your app. [Here](https://medium.com/@anas.mammeri/vue-2-firebase-how-to-build-a-vue-app-with-firebase-authentication-system-in-15-minutes-fdce6f289c3c) is a popular medium article as a primer for Firebase and Vuejs.

```bash
$ quasar new boot firebase
```
**/src/boot/firebase.js**
```js
import firebase from 'firebase/app'
import 'firebase/auth'

// leave the export, even if you don't use it
export default async ({ Vue }) => {
  // Initialize Firebase
  let config = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SEND_ID'
  }
  firebase.initializeApp(config)
  
  // Add the firebase service to the Vue instance
  Vue.prototype.$fb = firebase
}
```

Then in a Vue single file component:

**/src/pages/SomePage.vue**
```js
<script>
  <template>
    <!-- Your Create User Form-->
  </template>

  export default {
    name: 'PageName',
    data () {
      return {
        email: null,
        password: null
      }
    },
    methods: {
      createUserWithEmail(email, password) {
        this.$fb.auth().createUserWithEmailAndPassword(email, password)
          .then(user => {
            // Do something with the newly created user
          })
          .catch(err => {
            this.$q.notify({
              message: `Looks like there was a problem: ${err}`,
              color: 'negative'
            })
          })
      }
    }
  }
</script>
```

::: tip
A better way is to focus on separation of concerns(SOC), and use Quasar's app extension [Qenv](https://github.com/quasarframework/app-extension-qenv) to handle our different environment configurations. Be sure to read up on the docs to understand how this will come into play with the follow section of code.
:::

Qenv will allow us to keep the config in the source directory, but will also give us the option for git to ignore the file and will be bundled on the desired build type. Either for dev, test, or production. Remember the tip from before though, and create separate firebase projects in your console. Please refer to qenv installation and setup [here](https://github.com/quasarframework/app-extension-qenv).

Once you’ve install qenv and have set up your `.quasar.env.json` file and updated your [scripts block](https://github.com/quasarframework/app-extension-qenv#specifying-the-environment) in your `package.json` we now are ready to start moving into our application structure.

The following code snippets are meant to highlight the initial approach of setting up your application with separating your server connection and the actual service itself. The following snippets are not meant to setup any real functionality, but just highlight the first basic pieces of the application structure.

```bash
$ quasar new boot serverConnection
```
**quasar.config.json**
```js
boot: [
  'serverConnection'
],
```
Our boot file will not actually be the firebase service itself, but a point in which to bring in the firebase service. This is done in case you need or want to switch out your backend to another cloud provider or traditional backend api interface.

**/src/boot/serverConnection.js**
```js
import * as base from '../services/base.js'

const firebaseService = Object.assign({}, base)

// "async" is optional
export default async () => {
  const config = process.env.environments.FIREBASE_CONFIG
  try {
    await firebaseService.fBInit(config)
    console.log('Firebase init called properly')
  } catch (err) {
    throw Error(`Error in firebase initialization: ${err}`)
  }
}
```
Calling `await firebaseService.fBInit(config)` is just a validation that our service structure is working. This does not guarantee that the initialization happened with a valid api key. This will be done when the app performs any auth() functionality, which will start to be highlight in the next section of the docs.

Were also going to create a new directory in our application structure called services, and put our base service inside.
From here we have our basic boot file structure:

**/src/services/base.js**

```js
import firebase from 'firebase/app'
import 'firebase/auth'

/** Convenience method to initialize firebase app
 *
 * @param  {Object} config
 * @return {Object} App
 */
export const fBInit = (config) => {
  return firebase.initializeApp(config)
}
```

For our service structure and simplicity sake we're only going to focus on on method that will initialize the app. In time this base service file will be the location of more than just initialization. Ideally you should break your services up in separate files for testing, and maintainance concerns.