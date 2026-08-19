---
title: Injecting Quasar Plugin
desc: Tips and tricks on how to use a Quasar App Extension to configure the host app to use a Quasar Plugin.
related:
  - /app-extensions/common-formulas-and-patterns/provide-ui-elements
  - /app-extensions/development-guide/index-api
---

This guide is for when you want to ensure that a [Quasar Plugin](/components) will be injected into the hosting app, because you depend on it for your own App Extension to work.

We will only need to touch the Index script for this, because we can use the [Index API](/app-extensions/development-guide/index-api) to configure the /quasar.config file from the host app to include our required Quasar Plugin.

```js /ae/src/index.js (or .ts)
import { defineIndexScript } from '#q-app'

export default defineIndexScript(api => {
  // ...

  // Here we extend /quasar.config file, so we can add
  // a boot file which registers our new Vue directive;
  // "extendConf" will be defined below (keep reading the tutorial)
  api.extendQuasarConf((conf, api) => {
    // Let's play nice and add it only if it's not defined already
    if (!conf.framework.plugins.includes('AppVisibility')) {
      conf.framework.plugins.push('AppVisibility')
    }
  })
})
```

## Using the plugin from your own code

Injecting the plugin makes the host app install it, but importing it from your App Extension's runtime code needs one more step. Your package lives in the host app's `node_modules`, so Vite pre-bundles it by default. The pre-bundle links your `import { Notify }` from "quasar" against a second copy of Quasar, on which the host app never installed anything. The plugin then appears uninstalled to your code, with errors like `Notify.create is not a function`.

Tell Vite to serve your package through the module graph instead, where its Quasar imports resolve to the same modules as the host app's code. Your Index script can do this on behalf of the host app:

```js /ae/src/index.js (or .ts)
import { defineIndexScript } from '#q-app'

export default defineIndexScript(api => {
  // ...

  api.extendViteConf(() => {
    // gets deeply merged into the host app's Vite config
    return {
      optimizeDeps: {
        exclude: ['quasar-app-extension-my-ext']
      }
    }
  })
})
```

The same applies to any npm package that imports from the `quasar` package, App Extension or not. When the package cannot configure the host app itself, the app developer adds the equivalent through `/quasar.config file > build > extendViteConf` (see [Handling Vite](/quasar-cli-vite/handling-vite)).

::: tip
Code that runs in Vue render scope does not need any of this. `useQuasar()` returns the host app's own `$q`, so `$q.notify(...)` from a composable or component always reaches the installed plugin.
:::
