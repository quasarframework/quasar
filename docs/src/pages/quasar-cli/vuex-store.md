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

If you don't choose the Vuex option during project creation but would like to add it later then all you need to do is to check the next section and create the `src/store/index.js` file.

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
import { createStore } from 'vuex'
import showcase from './showcase'

export default function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      showcase
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
}
```

::: tip
If you are developing a SSR app, then you can check out the [ssrContext](/quasar-cli/developing-ssr/ssr-context) Object that gets supplied server-side.
:::

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
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    const $store = useStore()

    const drawerState = computed({
      get: () => $store.state.showcase.drawerState,
      set: val => {
        $store.commit('showcase/updateDrawerState', val)
      }
    })

    return {
      drawerState
    }
  }
}
</script>
```

## Store Code Splitting
You can take advantage of the [PreFetch Feature](/quasar-cli/prefetch-feature#Store-Code-Splitting) to code-split Vuex modules.
