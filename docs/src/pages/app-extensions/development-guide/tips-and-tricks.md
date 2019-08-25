---
title: App Extension Tips & Tricks
desc: Tips and tricks on Quasar App Extensions development.
---

This page will help you with information or formulae on how to do some of the things with a Quasar App Extension. Make sure you also study the introduction and the APIs of App Extension pages first.

## Equivalent of a starter kit

## Injecting Components

> This guide is for when you want to create a new UI component and provide it through an App Extension, which will inject it into hosting app.

Create a folder structure to keep your code modularized and organized. For instance, for a UI component, create a structure that looks like this:

```bash
.
├── package.json
└── src
    ├── boot                  # folder to contain 'boot' code
    │   └── my-ext.js         # boot file for component
    ├── component             # folder to contain component
    │   ├── MyComponent.vue   # component file (can be .vue or even .js)
    │   ├── MyComponent.json  # (optional) json API file for the component
    │   └── MyComponent.styl  # stylus file for component (or .css, or whatever you need)
    └── index.js              # Described in Index API
```

Now, you need to handle registering your component. You do this with the `/index.js` file (described in the [Index API](/app-extensions/development-guide/index-api)) that was created when you set up your new App Extension.

Let's break it down.

```js
// file: /index.js
module.exports = function (api) {
  // (Optional!)
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of "@quasar/app" CLI
  api.compatibleWith('quasar', '^1.0.0')
  api.compatibleWith('@quasar/app', '^1.0.0')

  // (Optional!)
  // Register a json API for your component;
  // Users will be able to run "quasar describe <YourComponentName>" command
  // and the CLI will print out its API
  api.registerDescribeApi('my-ext', './component/MyComponent.json')

  // Here we extend /quasar.conf.js, so we can add
  // a boot file which registers our new UI component;
  // "extendConf" will be defined below (keep reading the tutorial)
  api.extendQuasarConf(extendConf)
}
```

The first group does a compatibility check with Quasar (which is optional, but recommended). If your component is using features of Quasar that were available after a certain version, you can make sure that the version of Quasar installed is the correct one.

::: tip
Not only can you do a `api.compatibleWith()` to check against Quasar packages, but with any other available packages (that you do not supply yourself through your App Extension) as well. Please read [Handling package dependencies](/app-extensions/development-guide/introduction#Handling-package-dependencies) section from the App Extension Development Guide > Introduction page for more information.
:::

The second group registers your JSON API with Quasar CLI (which is totally optional). This allows the end user to quickly get information about your API by issuing "quasar describe component_or_directive_name". Your JSON API file must conform to the [Quasar JSON API](/app-extensions/development-guide/json-api) specification in order to be properly recognized.

The third group tells Quasar to call our custom function when the `extendQuasarConf` CLI life-cycle hook is called. It would look something like this:

```js
// file: /index.js
function extendConf (conf) {
  // make sure my-ext boot file is registered
  conf.boot.push('~quasar-app-extension-my-ext/src/boot/my-ext.js')

  // make sure boot & component files get transpiled
  conf.build.transpileDependencies.push(/quasar-app-extension-my-ext[\\/]src/)

  // make sure my-ext css goes through webpack to avoid ssr issues
  conf.css.push('~quasar-app-extension-my-ext/src/component/MyComponent.styl')
}
```

Finally, let's see how the boot file would look like. Make sure that you read the [Boot files](/quasar-cli/cli-documentation/boot-files) documentation and understand what a Boot file is first.

```js
// file: /src/boot/my-ext.js
import Vue from 'vue'
import MyComponent from './src/component/MyComponent.vue'

// we globally register our component
Vue.component('MyComponent', MyComponent)
```

## Injecting Directives

> This guide is for when you want to create a new directive and provide it through an App Extension, which will inject it into hosting app.

Create a folder structure to keep your code modularized and organized. For instance, for a directive, create a structure that looks like this:

```bash
.
├── package.json
└── src
    ├── boot                  # folder to contain 'boot' code
    │   └── my-ext.js         # boot file for component
    ├── directive             # folder to contain component
    │   └── MyDirective.js    # directive file
    └── index.js              # Described in Index API
```

Now, you need to handle registering your Vue directive. You do this with the `/index.js` file (described in the [Index API](/app-extensions/development-guide/index-api)) that was created when you set up your new App Extension.

Let's break it down.

```js
// file: /index.js
module.exports = function (api) {
  // (Optional!)
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of "@quasar/app" CLI
  api.compatibleWith('quasar', '^1.0.0')
  api.compatibleWith('@quasar/app', '^1.0.0')

  // Here we extend /quasar.conf.js, so we can add
  // a boot file which registers our new Vue directive;
  // "extendConf" will be defined below (keep reading the tutorial)
  api.extendQuasarConf(extendConf)
}
```

The first group does a compatibility check with Quasar (which is optional, but recommended). If your component is using features of Quasar that were available after a certain version, you can make sure that the version of Quasar installed is the correct one.

::: tip
Not only can you do a `api.compatibleWith()` to check against Quasar packages, but with any other available packages (that you do not supply yourself through your App Extension) as well. Please read [Handling package dependencies](/app-extensions/development-guide/introduction#Handling-package-dependencies) section from the App Extension Development Guide > Introduction page for more information.
:::

The second group tells Quasar to call our custom function when the `extendQuasarConf` CLI life-cycle hook is called. It would look something like this:

```js
// file: /index.js
function extendConf (conf) {
  // make sure my-ext boot file is registered
  conf.boot.push('~quasar-app-extension-my-ext/src/boot/my-ext.js')

  // make sure boot & other files get transpiled
  conf.build.transpileDependencies.push(/quasar-app-extension-my-ext[\\/]src/)
}
```

Finally, let's see how the boot file would look like. Make sure that you read the [Boot files](/quasar-cli/cli-documentation/boot-files) documentation and understand what a Boot file is first.

```js
// file: /src/boot/my-ext.js
import Vue from 'vue'
import MyDirective from './src/component/MyDirective.js'

// we globally register our component
Vue.directive('my-directive', MyDirective)
```

## Injecting Quasar Plugins

> This guide is for when you want to ensure that a [Quasar Plugin](/quasar-plugins) will be injected into the hosting app, because you depend on it for your own App Extension to work.

We will only need the /index.js script for this, because we can use the [Index API](/app-extensions/development-guide/index-api) to configure quasar.conf.js from the host app to include our required Quasar Plugin.

```bash
.
├── package.json
└── src
    └── index.js              # Described in Index API
```

And /index.js would look like this:

```js
// file: /index.js
module.exports = function (api) {
  // (Optional!)
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of "@quasar/app" CLI
  api.compatibleWith('quasar', '^1.0.0')
  api.compatibleWith('@quasar/app', '^1.0.0')

  // Here we extend /quasar.conf.js, so we can add
  // a boot file which registers our new Vue directive;
  // "extendConf" will be defined below (keep reading the tutorial)
  api.extendQuasarConf(extendConf)
}
```

Our "extendConf" method, in the same file as above:

```js
// file: /index.js
function extendConf (conf) {
  // we push to /quasar.conf.js > framework > plugins:
  conf.framework.plugins.push('AppVisibility')
}
```
