---
title: App Vuex Store
desc: How to manage the Vuex Store in a Quasar App.
---
In large applications, state management often becomes complex due to multiple pieces of state scattered across many components and the interactions between them. It is often overlooked that the source of truth in Vue instances is the raw data object - a Vue instance simply proxies access to it. Therefore, if you have a piece of state that should be shared by multiple instances, you should avoid duplicating it and share it by identity.

The recommended way to go if you want components sharing state is Vuex. Take a look at its [documentation](https://vuex.vuejs.org/) before diving in. It has a great feature when used along the [Vue dev-tools](https://github.com/vuejs/vue-devtools) browser extension like Time Travel debugging.

We won't go into details on how to configure or use Vuex since it has great docs. Instead we'll just show you what the folder structure looks like when using it on a Quasar project.

```bash
.
└── src/
    └── store/               # Vuex Store
        ├── index.js         # Vuex Store definition
        ├── <folder>         # Vuex Store Module...
        └── <folder>         # Vuex Store Module...
```

By default, if you choose to use Vuex when you create a project folder with Quasar CLI, it will set you up on using Vuex modules. Each sub-folder of `/src/store` represents a Vuex Module.

If you don't choose the Vuex option during project creation, but would like to add it later, all you need to do is add a Vuex Module (see the example below).

::: tip
If Vuex Modules is too much for your website app, you can change `/src/store/index.js` and avoid importing any module.
:::

## Adding a Vuex Module.
Adding a Vuex Module is made easy by Quasar CLI through the `$ quasar new` command.

```bash
$ quasar new store <store_name>
```

It will create a folder in `/src/store` named by "store_name" from the command above. It will contain all the boilerplate that you need.

Let's say that you want to create a "showcase" Vuex Module. You issue `$ quasar new store showcase`. You then notice the newly created `/src/store/showcase` folder, which holds the following files:

```bash
.
└── src/
    └── store/
        ├── index.js         # Vuex Store definition
        └── showcase         # Module "showcase"
            ├── index.js     # Gluing the module together
            ├── actions.js   # Module actions
            ├── getters.js   # Module getters
            ├── mutations.js # Module mutations
            └── state.js     # Module state
```

We've created the new Vuex Module, but we haven't yet informed Vuex to use it. So we edit `/src/store/index.js` and add a reference to it:

```js
import Vue from 'vue'
import Vuex from 'vuex'

// we first import the module
import showcase from './showcase'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // then we reference it
      showcase
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  /*
    if we want some HMR magic for it, we handle
    the hot update like below. Notice we guard this
    code with "process.env.DEV" -- so this doesn't
    get into our production build (and it shouldn't).
  */

  if (process.env.DEV && module.hot) {
    module.hot.accept(['./showcase'], () => {
      const newShowcase = require('./showcase').default
      Store.hotUpdate({ modules: { showcase: newShowcase } })
    })
  }

  return Store
}
```

Now we can use this Vuex Module in our Vue files. Here is a quick example. Assume we configured `drawerState` in the state and added `updateDrawerState` mutation.

```js
// src/store/showcase/mutations.js
export const updateDrawerState = (state, opened) => {
  state.drawerState = opened
}

// src/store/showcase/state.js
// Always use a function to return state if you use SSR
export default function () {
  return {
    drawerState: true
  }
}
```

In a Vue file:
```html
<template>
  <div>
    <q-toggle v-model="drawerState" />
  </div>
</template>

<script>
export default {
  computed: {
    drawerState: {
      get () {
        return this.$store.state.showcase.drawerState
      },
      set (val) {
        this.$store.commit('showcase/updateDrawerState', val)
      }
    }
  }
}
</script>
```

## Store Code Splitting
You can take advantage of the [PreFetch Feature](/quasar-cli/prefetch-feature#store-code-splitting) to code-split Vuex modules.
