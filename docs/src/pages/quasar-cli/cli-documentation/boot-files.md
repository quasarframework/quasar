---
title: Boot files
---
A common use case for Quasar applications is to run code before the root Vue instance is instantiated.
Quasar provides an elegant solution to that problem by allowing users to define so-called boot files.

In earlier Quasar versions, to run code before the root Vue instance was instantiated, you could alter the `/src/main.js` file and add any code you needed to execute.

There is a major problem with this approach: With a growing project, your `main.js` file was very likely to get cluttered and challenging to maintain, which breaks with Quasar's concept of encouraging developers to write maintainable and elegant cross-platform applications.

With boot files, it is possible to split each of your dependencies into a self-contained, easy to maintain files. It is also trivial to disable any of the boot files or even contextually determine which of the boot files get into the build through `quasar.conf.js` configuration.

## Anatomy of an boot file
A boot file is a simple JavaScript file which needs to export a function. Quasar will then call the exported function when it boots the application and additionally pass **an object** with the following properties to the function:

| Prop name | Description |
| --- | --- |
| `app` | Object with which the root component gets instantiated by Vue |
| `router` | Instance of Vue Router from 'src/router/index.js' |
| `store` | Instance of the app Vuex Store - **store only will be passed if your project uses Vuex (you have src/store)** |
| `Vue` | Is same as if we do `import Vue from 'vue'` and it's there for convenience |
| `ssrContext` | Available only on server-side, if building for SSR |

```js
export default ({ app, router, store, Vue }) => {
  // something to do
}
```

Starting with v1.0, boot files can also be async:
```js
export default async ({ app, router, store, Vue }) => {
  // something to do
  await something()
}
```

Notice we are using the [ES6 destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). Only assign what you actually need/use.

::: danger
Never call `new Vue(App)` in your boot files as this will completely break your website/app. You don't need it since Quasar CLI takes care of instantiating your App with Vue.
:::

## When to use boot files
::: warning
Please make sure you understand what problem boot files solve and when it is appropriate to use them, to avoid applying them in cases where they are not needed.
:::

Boot files fulfill one special purpose: they run code **before** the App's Vue root component is instantiated while giving you access to certain variables, which is required if you need to initialize a library, interfere with Vue Router, inject Vue prototype or inject the root instance of the Vue app.

### Examples of appropriate usage of boot files
* Your Vue plugin has installation instructions, like needing to call `Vue.use()` on it.
* Your Vue plugin requires instantiation of data that is added to the root instance - An example would be [vue-i18n](https://github.com/kazupon/vue-i18n/).
* You want to add something to the Vue prototype for convenient access - An example would be to conveniently use `this.$axios` inside your Vue files instead of importing Axios in each such file.
* You want to interfere with the router - An example would be to use `router.beforeEach` for authentication
* You want to interfere with the Vuex store instance - An example would be to use `vuex-router-sync` package
* Configure aspects of libraries - An example would be to create an instance of Axios with a base URL; you can then inject it into Vue prototype and/or export it (so you can import the instance from anywhere else in your app)

### Example of unneeded usage of boot files
* For plain JavaScript libraries like Lodash, which don't need any initialization prior to their usage. Lodash, for example, might make sense to use as a boot file only if you want to inject Vue prototype with it, like being able to use `this.$_` inside your Vue files.

## Usage of boot files
The first step is always to generate a new plugin using Quasar CLI:

```bash
$ quasar new boot <name>
```
Where `<name>` should be exchanged by a suitable name for your boot file.

This command creates a new file: `/src/boot/<name>.js` with the following content:

```js
// import something here

// leave the export, even if you don't use it
export default ({ app, router, store, Vue }) => {
  // something to do
}
```

You can now add content to that file depending on the intended use of your boot file.

> Do not forget that your default export needs to be a function.
> However, you can have as many named exports as you want, should the boot file expose something for later usage. In this case, you can import any of these named exports anywhere in your app.

The last step is to tell Quasar to use your new boot file. For this to happen you need to add the file in `/quasar.conf.js`

```js
boot: [
  '<name>' // references /src/boot/<name>.js
]
```

### Quasar App Flow
In order to better understand how a boot file works and what it does, you need to understand how your website/app boots:

1. Quasar is initialized (components, directives, plugins, Quasar i18n, Quasar icon sets)
2. Quasar Extras get imported (Roboto font -- if used, icons, animations, ...)
3. Quasar CSS & your app's global CSS is imported
4. App.vue is loaded (not yet being used)
5. Store is imported (if using Vuex Store in src/store)
6. Boot files are imported
7. Boot files get their default export function executed
7. (if on Electron mode) Electron is imported and injected into Vue prototype
8. (if on Cordova mode) Listening for "deviceready" event and only then continuing with following steps
9. Instantiating Vue with root component and attaching to DOM

## Examples of boot files

### Axios

```js
import axios from 'axios'

export default ({ Vue }) => {
  // we add it to Vue prototype
  // so we can reference it in Vue files
  // without the need to import axios
  Vue.prototype.$axios = axios

  // Example: this.$axios will reference Axios now so you don't need stuff like vue-axios
}
```

### vue-i18n

```js
// we import the external package
import VueI18n from 'vue-i18n'

// let's say we have a file in /src/i18n containing the language pack
import messages from 'src/i18n'

export default ({ app, Vue }) => {
  // we tell Vue to use our Vue package:
  Vue.use(VueI18n)

  // Set i18n instance on app;
  // We inject it into root component by doing so;
  // new Vue({..., i18n: ... }).$mount(...)

  app.i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages
  })
}
```

### Router authentication
Some boot files might need to interfere with Vue Router configuration:
```js
export default ({ router, store, Vue }) => {
  router.beforeEach((to, from, next) => {
    // Now you need to add your authentication logic here, like calling an API endpoint
  })
}
```

## Accessing data from boot files
Sometimes you want to access data that you configure in your boot file in files where you don't have access to the root Vue instance.

Fortunately, because boot files are just normal JavaScript files you can add as many named exports to your boot file as you want.

Let's take the example of Axios. Sometimes you want to access your Axios instance inside your JavaScript files, but you can not access the root Vue instance. To solve this you can export the Axios instance in your boot file and import it elsewhere.

Consider the following boot file for axios:

```js
// axios boot file file (src/boot/axios.js)

import axios from 'axios'

// We create our own axios instance and set a custom base URL.
// Note that if we wouldn't set any config here we do not need
// a named export, as we could just `import axios from 'axios'`
const axiosInstance = axios.create({
  baseURL: 'https://api.example.com'
})

export default ({ Vue }) => {
  // for use inside Vue files through this.$axios
  Vue.prototype.$axios = axiosInstance
}

// Here we define a named export
// that we can later use inside .js files:
export { axiosInstance }
```

In any JavaScript file, you'll be able to import the axios instance like this.

```js
// we import one of the named exports from src/boot/axios.js
import { axiosInstance } from 'boot/axios'
```

Further reading on syntax: [ES6 import](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import), [ES6 export](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export).
