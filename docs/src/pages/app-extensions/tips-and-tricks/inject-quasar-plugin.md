---
title: Injecting Quasar Plugin
desc: Tips and tricks on how to use a Quasar App Extension to configure the host app to use a Quasar Plugin.
scope:
  tree:
    l: "."
    c:
    - l: package.json
    - l: src
      c:
      - l: index.js
        e: Described in Index API
---

This guide is for when you want to ensure that a [Quasar Plugin](/quasar-plugins) will be injected into the hosting app, because you depend on it for your own App Extension to work.

::: tip
In order for creating an App Extension project folder, please first read the [Development Guide > Introduction](/app-extensions/development-guide/introduction).
:::

::: tip Full Example
To see an example of what we will build, head over to [full example](https://github.com/quasarframework/app-extension-examples/v2/master/inject-quasar-plugin), which is a GitHub repo with this App Extension.
:::

We will only need the /index.js script for this, because we can use the [Index API](/app-extensions/development-guide/index-api) to configure quasar.config.js from the host app to include our required Quasar Plugin.

<doc-tree :def="scope.tree" />

And /index.js would look like this:

```js
// file: /index.js
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

  // Here we extend /quasar.config.js, so we can add
  // a boot file which registers our new Vue directive;
  // "extendConf" will be defined below (keep reading the tutorial)
  api.extendQuasarConf(extendConf)
}
```

Our "extendConf" method, in the same file as above:

```js
// file: /index.js
function extendConf (conf) {
  // we push to /quasar.config.js > framework > plugins:
  conf.framework.plugins.push('AppVisibility')
}
```
