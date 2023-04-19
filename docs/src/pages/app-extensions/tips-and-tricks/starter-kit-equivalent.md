---
title: Starter kit equivalent
desc: Tips and tricks on how to use a Quasar App Extension to create the equivalent of a starter kit.
scope:
  tree:
    l: "."
    c:
    - l: README.md
    - l: package.json
    - l: src
      c:
      - l: boot
        c:
        - l: my-starter-kit-boot.js
      - l: templates
        c:
        - l: common-files
          c:
          - l: README.md
          - l: some-folder
            c:
            - l: tasks.md
        - l: serviceA
          c:
          - l: src
            c:
            - l: services
              c:
              - l: serviceA.js
        - l: serviceB
          c:
          - l: src
            c:
            - l: services
              c:
              - l: serviceB.js
      - l: index.js
        e: Described in Index API
      - l: install.js
        e: Described in Install API
      - l: prompts.js
        e: Described in Prompts API
      - l: uninstall.js
        e: Described in Uninstall API
---

This guide is for when you want to create what essentially is a "starter kit" that adds stuff (/quasar.config.js configuration, folders, files, CLI hooks) on top of the official starter kit. This allows you to have multiple projects sharing a common structure/logic (and only one package to manage them rather than having to change all projects individually to match your common pattern), and also allows you to share all this with the community.

::: tip
In order for creating an App Extension project folder, please first read the [Development Guide > Introduction](/app-extensions/development-guide/introduction).
:::

::: tip Full Example
To see an example of what we will build, head over to [MyStarterKit full example](https://github.com/quasarframework/app-extension-examples/tree/v2/my-starter-kit), which is a github repo with this App Extension.
:::

We'll be creating an example App Extension which does the following:

* it prompts the user what features it wants this App Extension to install
* renders (copies) files into the hosting folder, according to the answers he gave
* it extends /quasar.config.js
* it extends the Webpack configuration
* it uses an App Extension hook (onPublish)
* it removes the added files when the App Extension gets uninstalled
* it uses the prompts to define what the App Extension does

## The structure

For the intents of this example, we'll be creating the following folder structure:

<doc-tree :def="scope.tree" />

## The install script

The install script below is only rendering files into the hosted app. Notice the `src/templates` folder above, where we decided to keep these templates.

```js
// src/install.js

module.exports = function (api) {
  // (Optional!)
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of Quasar App CLI
  api.compatibleWith('quasar', '^2.0.0')

  if (api.hasVite === true) {
    api.compatibleWith('@quasar/app-vite', '^1.0.0-beta.0')
  }
  else { // api.hasWebpack === true
    api.compatibleWith('@quasar/app-webpack', '^3.0.0')
  }

  // We render some files into the hosting project

  if (api.prompts.serviceA) {
    api.render('./templates/serviceA')
  }

  if (api.prompts.serviceB) {
    // we supply interpolation variables
    // to the template
    api.render('./templates/serviceB', {
      productName: api.prompts.productName
    })
  }

  // we always render the following template:
  api.render('./templates/common-files')
}
```

Notice that we use the prompts to decide what to render into the hosting project. Furthermore, if the user has selected "service B", then we'll also have a "productName" that we can use when we render the service B's file.

## The index script

We do a few things in the index script, like extending /quasar.config.js, hooking into one of the many Index API hooks (onPublish in this case), and chaining the Webpack configuration:

```js
// src/index.js

module.exports = function (api) {
  // (Optional!)
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of Quasar App CLI
  api.compatibleWith('quasar', '^2.0.0')

  if (api.hasVite === true) {
    api.compatibleWith('@quasar/app-vite', '^1.0.0-beta.0')
  }
  else { // api.hasWebpack === true
    api.compatibleWith('@quasar/app-webpack', '^3.0.0')
  }

  // Here we extend /quasar.config.js;
  // (extendQuasarConf() will be defined later in this tutorial, continue reading)
  api.extendQuasarConf(extendQuasarConf)

  // Here we register the onPublish hook,
  // only if user answered that he wants the publishing service
  if (api.prompts.publishService) {
    // onPublish() will be defined later in this tutorial, continue reading
    api.onPublish(onPublish)
  }

  if (api.hasVite === true) {
    api.extendViteConf(extendVite)
  }
  else { // api.hasWebpack === true
    // we add/change/remove something in the Webpack configuration
    // (chainWebpack() will be defined later in this tutorial, continue reading)
    api.chainWebpack(chainWebpack)
  }

  // there's lots more hooks that you can use...
}
```

Here's an example of `extendQuasarConf` definition:

```js
function extendQuasarConf (conf, api) {
  conf.extras.push('ionicons-v4')
  conf.framework.iconSet = 'ionicons-v4'

  //
  // We register a boot file. User does not need to tamper with it,
  // so we keep it into the App Extension code:
  //

  // make sure my-ext boot file is registered
  conf.boot.push('~quasar-app-extension-my-starter-kit/src/boot/my-starter-kit-boot.js')

  // @quasar/app-vite does not need this
  if (api.hasVite !== true) {
    // make sure boot file get transpiled
    conf.build.transpileDependencies.push(/quasar-app-extension-my-starter-kit[\\/]src/)
  }
}
```

The `onPublish` function:

```js
function onPublish (api, { arg, distDir }) {
  // this hook is called when "quasar build --publish" is called

  // your publish logic here...
  console.log('We should publish now. But maybe later? :)')

  // are we trying to publish a Cordova app?
  if (api.ctx.modeName === 'cordova') {
    // do something
  }
}
```

The `extendVite` function:

```js
function extendVite (viteConf, { isClient, isServer }, api) {
  // viteConf is a Vite config object generated by Quasar CLI
}
```

The `chainWebpack` function:

```js
function chainWebpack (cfg, { isClient, isServer }, api) {
  // cfg is a Webpack chain Object;
  // docs on how to use it: webpack-chain docs (https://github.com/neutrinojs/webpack-chain)
}
```

## The uninstall script

When the App Extension gets uninstall, we need to do some cleanup. But beware what you delete from the app-space! Some files might still be needed. Proceed with extreme care, if you decide to have an uninstall script.

```js
// we yarn added it to our App Extension,
// so we can import the following:
const rimraf = require('rimraf')

module.exports = function (api) {
  // Careful when you remove folders!
  // You don't want to delete files that are still needed by the Project,
  // or files that are not owned by this app extension.

  // Here, we could also remove the /src/services folder altogether,
  // but what if the user has added other files into this folder?

  if (api.prompts.serviceA) {
    // we added it on install, so we remove it
    rimraf.sync(api.resolve.src('services/serviceA.js'))
  }

  if (api.prompts.serviceB) {
    // we added it on install, so we remove it
    rimraf.sync(api.resolve.src('services/serviceB.js'))
  }

  // we added it on install, so we remove it
  rimraf.sync(api.resolve.app('some-folder'))
  // warning... we've added this folder, but what if the
  // developer added more files into this folder???
}
```

Notice that we are requesting `rimraf` npm package. This means that we yarn/npm added it into our App Extension project.
