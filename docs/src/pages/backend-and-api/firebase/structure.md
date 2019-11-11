---
title: Firebase Application Initialization and Service Structure
desc: Application initiallization and strucuture instrcutions for firebase implementation on the Quasar framework.
---

A typical Quasar app structure can be seen [here](https://quasar.dev/quasar-cli/cli-documentation/directory-structure).

First, create a boot file. Once the Firebase boot file is created, add its name to the boot config array in the `quasar.conf.js`. Be sure to read up on Quasar’s boot files [here](https://quasar.dev/quasar-cli/cli-documentation/boot-files). This is a great review, and also a core tenant to understanding how Firebase is embedded into a Quasar app, and also the root place to start when debugging Firebase issues. 

> A simple approach is to create the Firebase boot file, initialize your Firebase app with your config, extend the Vue instance with a reference to Firebase, and then use the Firebase SDK throughout your app. [Here](https://medium.com/@anas.mammeri/vue-2-firebase-how-to-build-a-vue-app-with-firebase-authentication-system-in-15-minutes-fdce6f289c3c) is a popluar medium article as a primer for Firebase and Vuejs.

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
  
  // Add the firebase serverice to the Vue instance
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
A better way is to focus on the separation of concerns(SOC) and use Quasar's app extension [Qenv](https://github.com/quasarframework/app-extension-qenv) to handle our different environment configurations. Be sure to read up on the docs to understand how this will come into play with the following section of code.
:::

Qenv will allow us to keep the config in the source directory, but will also give us the option for git to ignore the file and will be bundled on the desired build type. Either for dev, test, or production. Remember the tip from before; create separate Firebase projects in your console. Please refer to qenv installation and setup [here](https://github.com/quasarframework/app-extension-qenv).

Once you’ve install qenv and have set up your `.quasar.env.json` file and updated your [scripts block](https://github.com/quasarframework/app-extension-qenv#specifying-the-environment) in your `package.json` we now are ready to start moving into our application structure.

The following code snippets are meant to highlight the initial approach of setting up your application by separating your server connection and the actual service itself. The following snippets are not meant to set up any real functionality, but just highlight the first basic pieces of the application structure.

```bash
$ quasar new boot serverConnection
```
**quasar.config.json**
```js
boot: [
  'serverConnection'
],
```
Our boot file will not be the Firebase service itself, but a point in which to bring in the Firebase service. This is done in case you need or want to switch out your backend to another cloud provider or traditional backend API interface.

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
    throw Error(`Error in firebase initilization: ${err}`)
  }
}
```

Calling the `fBInit(config)` method is just a validation that the service structure is working. This does not guarantee that the initialization happened with a valid API key. This will be done when the app performs any auth() functionality, which will start to be highlighted in the next section of the docs.

Create a new directory in our application structure called services, and put the base service inside.
From here we have our basic boot file structure:

**/src/services/base.js**

```js
import firebase from 'firebase/app'
import 'firebase/auth'

/** Convienience method to initialize firebase app
 *
 * @param  {Object} config
 * @return {Object} App
 */
export const fBInit = (config) => {
  return firebase.initializeApp(config)
}
```

For service structure and simplicity's sake, focus will only be on one method that will initialize the app. In time, this base service file will be the location of more than just initialization. Ideally, services should be broken up into separate files for testing, and maintenance concerns.