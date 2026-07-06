---
title: Provide UI elements
desc: Tips and tricks on how to provide UI elements to the host app of a Quasar App Extension.
related:
  - /app-extensions/common-formulas-and-patterns/inject-quasar-plugin
  - /app-extensions/common-formulas-and-patterns/json-api
scope:
  tree:
    l: '.'
    c:
      - l: '/ae'
        e: 'Your App Extension'
        c:
          - l: src
            c:
              - l: runtime
                e: UI elements
                c:
                  - l: boot.register.js
                    e: (or .ts) boot file for injecting component
                  - l: MyComponent.vue
                    e: (or .js or .ts) the component file
              - l: index.js
                e: (or .ts) Described in Index API
      - l: '/playground'
        e: Testing/Development app (a @quasar/app-vite project)
        c:
          - l: src
            c:
              - l: pages
                c:
                  - l: index
                    c:
                      - l: test1.vue
                        e: Example of page using the component
---

This guide is for when you want to create a new UI component and provide it through an App Extension, which will inject it into the hosting app.

::: tip Full Example
To see an example of what we will build, head over to [MyComponent full example](https://github.com/quasarframework/app-extension-examples/tree/v3/my-component), which is a GitHub repo with this App Extension.
:::

<DocTree :def="scope.tree" />

You need to handle registering your component. You do this with the `/index.js` file (described in the [Index API](/app-extensions/development-guide/index-api)) that was created when you set up your new App Extension.

Let's break it down.

```js /ae/src/index.js (or .ts)
import { defineIndexScript } from '#q-app'

export default defineIndexScript(api => {
  // (Optional!)
  // Quasar compatibility check; you may need
  // hard dependencies, as in a minimum version of the "quasar"
  // package or a minimum version of Quasar App CLI
  api.compatibleWith('quasar', '^2.0.0')
  api.compatibleWith('@quasar/app-vite', '^3.0.0')

  // Here we extend the /quasar.config file, so we can add
  // a boot file which registers our new UI component;
  // "extendConf" will be defined below (keep reading the tutorial)
  api.extendQuasarConf(extendConf)
})
```

The first group does a compatibility check with Quasar (which is optional, but recommended). If your component is using features of Quasar that were available after a certain version, you can make sure that the version of Quasar installed is the correct one.

::: tip
Not only can you do a `api.compatibleWith()` to check against Quasar packages, but with any other available packages (that you do not supply yourself through your App Extension) as well. Please read [Handling package dependencies](/app-extensions/development-guide/introduction#handling-package-dependencies) section from the App Extension Development Guide > Introduction page for more information.
:::

The second group tells Quasar to call our custom function when the `extendQuasarConf` CLI life-cycle hook is called. It would look something like this:

```js /ae/src/index.js (or .ts)
function extendConf(conf, api) {
  return {
    // make sure my-ext boot file is registered
    boot: ['~quasar-app-extension-my-ext/src/runtime/boot.register.js']
  }
}

// Alternatively, directly touch the "conf" param
function extendConf(conf, api) {
  conf.boot.push('~quasar-app-extension-my-ext/src/runtime/boot.register.js')
}
```

Finally, let's see how the boot file would look like. Make sure that you read the [@quasar/app-vite Boot files](/quasar-cli-vite/boot-files) documentation and understand what a Boot file is first.

```js /ae/src/runtime/boot.register.js (or .ts)
import { defineBoot } from '#q-app'
import MyComponent from './MyComponent.vue'

// we globally register our component with Vue
export default defineBoot(({ app }) => {
  app.component('my-component', MyComponent)
})
```
