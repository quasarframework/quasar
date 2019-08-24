---
title: App Extension Tips & Tricks
desc: Tips and tricks on Quasar App Extensions development.
---

This page will help you with information or formulae on how to do some of the things with a Quasar App Extension. Make sure you also study the introduction and the APIs of App Extension pages first.

## Injecting Components and Directives

When creating a new UI component or directive, create a folder structure to keep your code modularized and organized. For instance, for a UI component, create a structure that looks like this:

```bash
.
├── package.json
└── src
    ├── boot            # folder to contain 'boot' code
    │   └── my-ext.js   # boot file for component
    ├── component       # folder to contain component
    │   ├── my-ext.js   # component file
    │   ├── my-ext.json # component file
    │   └── my-ext.styl # stylus file for component
    ├── index.js        # Described in Index API
    └── uninstall.js    # Described in Uninstall API
```

Now, you need to handle registering your component with Quasar and Vue. You do this with the `index.js` file that was created when you set up your new App Extension.

Let's break it down.

```js
module.exports = function (api) {
  // quasar compatibility check
  api.compatibleWith('@quasar/app', '^1.0.0')

  // register JSON api
  api.registerDescribeApi('my-ext', './component/my-ext.json')

  // extend quasar.conf
  api.extendQuasarConf(extendConf)
}
```

The first line does a compatibility check with Quasar. If your component is using features of Quasar that were available after a certain version, you can make sure that the version of Quasar installed is the correct one.

::: tip
Not only can you do a `compatibleWith` check against Quasar, but with any other available package
:::

The second line registers your JSON API with Quasar. This allows the end user to quicky get information about your API by issuing `quasar describe my-ext`. Your JSON API file must conform to the [Quasar JSON API](/app-extensions/development-guide/json-api) specification in order to be properly recognized.

The third line tells Quasar to call our custom function when the `extendQuasarConf` build life-cycle hook is called. It would look something like this:

```js
const extendConf = function (conf) {
  // make sure my-ext boot file is registered
  conf.boot.push('~@quasar/quasar-app-extension-my-ext/src/boot/my-ext.js')

  // make sure boot & component files transpile
  conf.build.transpileDependencies.push(/quasar-app-extension-my-ext[\\/]src/)

  // make sure my-ext css goes through webpack to avoid ssr issues
  conf.css.push('~@quasar/quasar-app-extension-my-ext/src/component/my-ext.styl')
}
```

## Injecting Quasar Plugins

## Equivalent of a starter kit
