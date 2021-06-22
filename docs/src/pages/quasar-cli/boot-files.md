---
title: Boot files
desc: Managing your startup code in a Quasar app.
related:
  - /quasar-cli/quasar-conf-js
---

A common use case for Quasar applications is to **run code before the root Vue app instance is instantiated**, like injecting and initializing your own dependencies (examples: Vue components, libraries...) or simply configuring some startup code of your app.

Since you won't be having access to any `/main.js` file (so that Quasar CLI can seamlessly initialize and build same codebase for SPA/PWA/SSR/Cordova/Electron) Quasar provides an elegant solution to that problem by allowing users to define so-called boot files.

In earlier Quasar versions, to run code before the root Vue instance was instantiated, you could alter the `/src/main.js` file and add any code you needed to execute.

There is a major problem with this approach: with a growing project, your `main.js` file was very likely to get cluttered and challenging to maintain, which breaks with Quasar's concept of encouraging developers to write maintainable and elegant cross-platform applications.

With boot files, it is possible to split each of your dependencies into self-contained, easy to maintain files. It is also trivial to disable any of the boot files or even contextually determine which of the boot files get into the build through `quasar.conf.js` configuration.

## Anatomy of a boot file

A boot file is a simple JavaScript file which can optionally export a function. Quasar will then call the exported function when it boots the application and additionally pass **an object** with the following properties to the function:

| Prop name | Description |
| --- | --- |
| `app` | Vue app instance |
| `router` | Instance of Vue Router from 'src/router/index.js' |
| `store` | Instance of the app Vuex Store - **store only will be passed if your project uses Vuex (you have src/store)** |
| `ssrContext` | Available only on server-side, if building for SSR. [More info](/quasar-cli/developing-ssr/ssr-context) |
| `urlPath` | The pathname (path + search) part of the URL. It also contains the hash on client-side. |
| `publicPath` | The configured public path. |
| `redirect` | Function to call to redirect to another URL. Accepts String (URL path) or a Vue Router location Object. |

```js
export default ({ app, router, store }) => {
  // something to do
}
```

Boot files can also be async:

```js
export default async ({ app, router, store }) => {
  // something to do
  await something()
}
```

You can wrap the returned function with `boot` helper to get a better IDE autocomplete experience (through Typescript):

```js
import { boot } from 'quasar/wrappers'

export default boot(async ({ app, router, store }) => {
  // something to do
  await something()
})
```

Notice we are using the [ES6 destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). Only assign what you actually need/use.

You may ask yourself why we need to export a function. This is actually optional, but before you decide to remove the default export, you need to understand when you need it:

```js
// Outside of default export:
//  - Code here gets executed immediately,
//  - Good place for import statements,
//  - No access to router, Vuex store, ...

export default async ({ app, router, store }) => {
  // Code here has access to the Object param above, connecting
  // with other parts of your app;

  // Code here can be async (use async/await or directly return a Promise);

  // Code here gets executed by Quasar CLI at the correct time in app's lifecycle:
  //  - we have a Router instantiated,
  //  - we have the optional Vuex store instantiated,
  //  - we have the root app's component ["app" prop in Object param] Object with
  //      which Quasar will instantiate the Vue app
  //      ("new Vue(app)" -- do NOT call this by yourself),
  //  - ...
}
```

## When to use boot files
::: warning
Please make sure you understand what problem boot files solve and when it is appropriate to use them, to avoid applying them in cases where they are not needed.
:::

Boot files fulfill one special purpose: they run code **before** the App's Vue root component is instantiated while giving you access to certain variables, which is required if you need to initialize a library, interfere with Vue Router, inject Vue prototype or inject the root instance of the Vue app.

### Examples of appropriate usage of boot files

* Your Vue plugin has installation instructions, like needing to call `app.use()` on it.
* Your Vue plugin requires instantiation of data that is added to the root instance - An example would be [vue-i18n](https://github.com/kazupon/vue-i18n/).
* You want to add a global mixin using `app.mixin()`.
* You want to add something to the Vue app globalProperties for convenient access - An example would be to conveniently use `this.$axios` (for Options API) inside your Vue files instead of importing Axios in each such file.
* You want to interfere with the router - An example would be to use `router.beforeEach` for authentication
* You want to interfere with the Vuex store instance - An example would be to use `vuex-router-sync` package
* Configure aspects of libraries - An example would be to create an instance of Axios with a base URL; you can then inject it into Vue prototype and/or export it (so you can import the instance from anywhere else in your app)

### Example of unneeded usage of boot files
* For plain JavaScript libraries like Lodash, which don't need any initialization prior to their usage. Lodash, for example, might make sense to use as a boot file only if you want to inject Vue prototype with it, like being able to use `this.$_` inside your Vue files.

## Usage of boot files
The first step is always to generate a new boot file using Quasar CLI:

```bash
$ quasar new boot <name> [--format ts]
```

Where `<name>` should be exchanged by a suitable name for your boot file.

This command creates a new file: `/src/boot/<name>.js` with the following content:

```js
// import something here

// "async" is optional!
// remove it if you don't need it
export default async ({ /* app, router, store */ }) => {
  // something to do
}
```

You can also return a Promise:

```js
// import something here

export default ({ /* app, router, store */ }) => {
  return new Promise((resolve, reject) => {
    // do something
  })
}
```

::: tip
The default export can be left out of the boot file if you don't need it. These are the cases where you don't need to access the "app", "router", "store" and so on.
:::

You can now add content to that file depending on the intended use of your boot file.

> Do not forget that your default export needs to be a function.
> However, you can have as many named exports as you want, should the boot file expose something for later usage. In this case, you can import any of these named exports anywhere in your app.

The last step is to tell Quasar to use your new boot file. For this to happen you need to add the file in `/quasar.conf.js`

```js
boot: [
  // references /src/boot/<name>.js
  '<name>'
]
```

When building a SSR app, you may want some boot files to run only on the server or only on the client, in which case you can do so like below:

```js
boot: [
  {
    server: false, // run on client-side only!
    path: '<name>' // references /src/boot/<name>.js
  },
  {
    client: false, // run on server-side only!
    path: '<name>' // references /src/boot/<name>.js
  }
]
```

In case you want to specify boot files from node_modules, you can do so by prepending the path with `~` (tilde) character:

```js
boot: [
  // boot file from an npm package
  '~my-npm-package/some/file'
]
```

If you want a boot file to be injected into your app only for a specific build type:

```js
boot: [
  ctx.mode.electron ? 'some-file' : ''
]
```

### Redirecting to another page

```js
export default ({ urlPath, redirect }) => {
  // ...
  const isAuthorized = // ...
  if (!isAuthorized && !urlPath.startsWith('/login')) {
    redirect({ path: '/login' })
    return
  }
  // ...
}
```

As it was mentioned in the previous sections, the default export of a boot file can return a Promise. If this Promise gets rejected with an Object that contains a "url" property, then Quasar CLI will redirect the user to that URL:

```js
export default ({ urlPath }) => {
  return new Promise((resolve, reject) => {
    // ...
    const isAuthorized = // ...
    if (!isAuthorized && !urlPath.startsWith('/login')) {
      reject({ url: '/login' })
      return
    }
    // ...
  })
}
```

Or a simpler equivalent:

```js
export default () => {
  // ...
  const isAuthorized = // ...
    if (!isAuthorized && !urlPath.startsWith('/login')) {
    return Promise.reject({ url: '/login' })
  }
  // ...
}
```

### Quasar App Flow
In order to better understand how a boot file works and what it does, you need to understand how your website/app boots:

1. Quasar is initialized (components, directives, plugins, Quasar i18n, Quasar icon sets)
2. Quasar Extras get imported (Roboto font -- if used, icons, animations, ...)
3. Quasar CSS & your app's global CSS are imported
4. App.vue is loaded (not yet being used)
5. Store is imported (if using Vuex Store in src/store)
6. Router is imported (in src/router)
7. Boot files are imported
8. Router default export function executed
9. Boot files get their default export function executed
10. (if on Electron mode) Electron is imported and injected into Vue prototype
11. (if on Cordova mode) Listening for "deviceready" event and only then continuing with following steps
12. Instantiating Vue with root component and attaching to DOM

## Examples of boot files

### Axios

```js
import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({ baseURL: 'https://api.example.com' })

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axios, api }
```

### vue-i18n

```js
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

const i18n = createI18n({
  locale: 'en-US',
  messages
})

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n)
})

export { i18n } // if you need this instance elsewhere
```

### Router authentication
Some boot files might need to interfere with Vue Router configuration:

```js
export default boot(({ router, store }) => {
  router.beforeEach((to, from, next) => {
    // Now you need to add your authentication logic here, like calling an API endpoint
  })
})
```

## Accessing data from boot files
Sometimes you want to access data that you configure in your boot file in files where you don't have access to the root Vue instance.

Fortunately, because boot files are just normal JavaScript files you can add as many named exports to your boot file as you want.

Let's take the example of Axios. Sometimes you want to access your Axios instance inside your JavaScript files, but you cannot access the root Vue instance. To solve this you can export the Axios instance in your boot file and import it elsewhere.

Consider the following boot file for axios:

```js
// axios boot file (src/boot/axios.js)

import axios from 'axios'

// We create our own axios instance and set a custom base URL.
// Note that if we wouldn't set any config here we do not need
// a named export, as we could just `import axios from 'axios'`
const api = axios.create({
  baseURL: 'https://api.example.com'
})

// for use inside Vue files through this.$axios and this.$api
// (only in Vue Options API form)
export default ({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
}

// Here we define a named export
// that we can later use inside .js files:
export { axios, api }
```

In any JavaScript file, you'll be able to import the axios instance like this.

```js
// we import one of the named exports from src/boot/axios.js
import { api } from 'boot/axios'
```

Further reading on syntax: [ES6 import](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import), [ES6 export](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export).
