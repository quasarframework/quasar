---
title: Injecting Quasar Plugin
desc: Tips and tricks on how to use a Quasar App Extension to configure the host app to use a Quasar Plugin.
---

This guide is for when you want to ensure that a [Quasar Plugin](/quasar-plugins) will be injected into the hosting app, because you depend on it for your own App Extension to work.

::: tip
In order for creating an App Extension project folder, please first read the [Development Guide > Introduction](/app-extensions/development-guide/introduction).
:::

::: tip Full Example
To see an example of what we will build, head over to [full example](https://github.com/quasarframework/app-extension-examples/tree/v1/inject-quasar-plugin), which is a GitHub repo with this App Extension.
:::

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

