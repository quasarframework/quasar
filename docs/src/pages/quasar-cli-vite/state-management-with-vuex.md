---
title: App Vuex Store
desc: (@quasar/app-vite) How to manage the Vuex Store in a Quasar App.
scope:
  tree:
    l: src
    c:
    - l: store
      e: Vuex Store
      c:
      - l: index.js
        e: Vuex Store definition
      - l: "<folder>"
        e: Vuex Store Module...
      - l: "<folder>"
        e: Vuex Store Module...
  newStore:
    l: src
    c:
    - l: store
      c:
      - l: index.js
        e: Vuex Store definition
      - l: showcase
        e: Module "showcase"...
        c:
        - l: index.js
          e: Gluing the module together
        - l: actions.js
          e: Module actions
        - l: getters.js
          e: Module getters
        - l: mutations.js
          e: Module mutations
        - l: state.js
          e: Module state
---

::: danger
The Vue Team deprecated Vuex in favor of [Pinia](/quasar-cli-vite/state-management-with-pinia).
:::

In large applications, state management often becomes complex due to multiple pieces of state scattered across many components and the interactions between them. It is often overlooked that the source of truth in Vue instances is the raw data object - a Vue instance simply proxies access to it. Therefore, if you have a piece of state that should be shared by multiple instances, you should avoid duplicating it and share it by identity.

The recommended way to go if you want components sharing state is Vuex. Take a look at its [documentation](https://vuex.vuejs.org/) before diving in. It has a great feature when used along the [Vue dev-tools](https://github.com/vuejs/vue-devtools) browser extension like Time Travel debugging.

We won't go into details on how to configure or use Vuex since it has great docs. Instead we'll just show you what the folder structure looks like when using it on a Quasar project.

<doc-tree :def="scope.tree" />

By default, if you choose to use Vuex when you create a project folder with Quasar CLI, it will set you up on using Vuex modules. Each sub-folder of `/src/store` represents a Vuex Module.

If you don't choose the Vuex option during project creation but would like to add it later then all you need to do is to check the next section and create the `src/store/index.js` file.

::: tip
If Vuex Modules is too much for your website app, you can change `/src/store/index.js` and avoid importing any module.
:::

## Adding a Vuex Module.
Adding a Vuex Module is made easy by Quasar CLI through the `$ quasar new` command.

```bash
$ quasar new store <store_name> [--format ts]
```

It will create a folder in `/src/store` named by "store_name" from the command above. It will contain all the boilerplate that you need.

Let's say that you want to create a "showcase" Vuex Module. You issue `$ quasar new store showcase`. You then notice the newly created `/src/store/showcase` folder, which holds the following files:

<doc-tree :def="scope.newStore" />

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
If you are developing a SSR app, then you can check out the [ssrContext](/quasar-cli-vite/developing-ssr/ssr-context) Object that gets supplied server-side.
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

## TypeScript support

If you choose to use Vuex and TypeScript when you create a project folder with Quasar CLI, it will add some typing code in `src/store/index.ts`.
To get a typed Vuex store in your component you will need to modify your Vue file like this:

```html
<template>
  <!-- ... -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'src/store';

export default defineComponent({
  setup () {
    const $store = useStore()
    // You can use the $store, example: $store.state.someStoreModule.someData
  }
})
</script>
```

::: warning
With Vuex, currently, only the state is strongly typed. If you want to use typed getters/mutations/actions, you will need to use either an extra package on top of Vuex or a replacement of Vuex.
:::

### Using Vuex Smart Module
One of the options for a fully typed store is a package called `vuex-smart-module`. You can add this package by running the following command:

```bash
yarn add vuex-smart-module
```

Once installed, you need to edit your `src/store/index.ts` file to use this package to create the store. Edit your store index file to resemble the following:

```js
import { store } from 'quasar/wrappers';
import {
  createStore,
  Module,
  createComposable,
  Getters,
  Mutations,
} from 'vuex-smart-module';

class RootState {
  count = 1;
}

class RootGetters extends Getters<RootState> {
  get count() {
    return this.state.count;
  }

  multiply(multiplier: number) {
    return this.state.count * multiplier;
  }
}

class RootMutations extends Mutations<RootState> {
  add(payload: number) {
    this.state.count += payload;
  }
}

// This is the config of the root module
// You can define a root state/getters/mutations/actions here
// Or do everything in separate modules
const rootConfig = {
  state: RootState,
  getters: RootGetters,
  mutations: RootMutations,
  modules: {
    //
  },
};

export const root = new Module(rootConfig);

export default store(function (/* { ssrContext } */) {
  const rootStore = createStore(root, {
    strict: !!process.env.DEBUGGING,
    // plugins: []
    // and other options, normally passed to Vuex `createStore`
  });

  return rootStore;
});

export const useStore = createComposable(root);
```

You can use modules just as with normal Vuex, and in that module you can choose to put everything in one file or use separate files for state, getters, mutations and actions. Or, of course, a combination of those two.

Just import the module in `src/store/index.ts` and add it to your `rootConfig`. For an example, look [here](https://github.com/ktsn/vuex-smart-module#usage)

Using the typed store inside Vue files is pretty straightforward, here is an example:

```vue
<template>
    <q-page class="column items-center justify-center">
        <q-btn @click="store.mutations.add(3)">Add count</q-btn>
        <div>Count: {{ store.getters.count }}</div>
        <div>Multiply(5): {{ store.getters.multiply(5) }}</div>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore, root } from 'src/store';

export default defineComponent({
    name: 'PageIndex',
    setup() {
        const store = useStore()

        return { store };
    }
});
</script>
```

#### Using a typed store in Boot Files
When using the store in Boot files, it is also possible to use a typed store. Here is an example of a very simple boot file:

```js
import { boot } from 'quasar/wrappers'
import { root } from 'src/store'

export default boot(({store}) => {
    root.context(store).mutations.add(5)
})
```

#### Using a typed store in Prefetch
Similarly, you can also use a typed store when using the [Prefetch feature](https://quasar.dev/quasar-cli-vite/prefetch-feature). Here is an example:

```html
<script lang="ts">
import { defineComponent } from 'vue';
import { root } from 'src/store';

export default defineComponent({
    name: 'PageIndex',
    preFetch({ store }) {
        root.context(store).mutations.add(5)
    },
    setup() {
       //
    }
});
</script>
```

## Store Code Splitting
You can take advantage of the [PreFetch Feature](/quasar-cli-vite/prefetch-feature#store-code-splitting) to code-split Vuex modules.

### Code splitting Vuex Smart Module
Code splitting with Vuex Smart Module works slightly different compared to regular Vuex.

Suppose we have the following module example:

```js
// store/modules/index.ts
// simple module example, with everything in one file
import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module'

class ModuleState { greeting = 'Hello'}

class ModuleGetters extends Getters<ModuleState> {
  get greeting() {
    return this.state.greeting
  }
}

class ModuleMutations extends Mutations<ModuleState> {
  morning() {
    this.state.greeting = 'Good morning!'
  }
}

class ModuleActions extends Actions<ModuleState, ModuleGetters, ModuleMutations, ModuleActions> {
    waitForIt(payload: number) {
        return new Promise<void>(resolve => {
            setTimeout(() => {
                this.commit('morning')
                resolve()
            }, payload)
        })
    }
}

export const admin = new Module({
  state: ModuleState,
  getters: ModuleGetters,
  mutations: ModuleMutations,
  actions: ModuleActions
})

export const useAdmin = createComposable(admin)
```

We then want to only load this module, when a certain route component is visited. We can do that in (at least) two different ways.

The first method is using the [PreFetch Feature](/quasar-cli-vite/prefetch-feature#store-code-splitting) that Quasar offers, similar to the example for regular Vuex, found [here](/quasar-cli-vite/prefetch-feature#store-code-splitting). To do this, we have a route defined in our `router/routes.ts` file. For this example, we have a /admin route which is a child of our MainLayout:

```
{ path: 'admin', component: () => import('pages/Admin.vue') }
```

Our `Admin.vue` file then looks like this:

```html
<template>
    <q-page class="column items-center justify-center">
        {{ greeting }}
        <q-btn to="/">Home</q-btn>
    </q-page>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue';
import { registerModule, unregisterModule } from 'vuex-smart-module'
import { admin, useAdmin } from 'src/store/module';
import { useStore } from 'vuex';

export default defineComponent({
    name: 'PageIndex',
    preFetch({ store }) {
        if (!store.hasModule('admin'))
            registerModule(store, 'admin', 'admin/', admin)
    },
    setup() {
        const $store = useStore()
        // eslint-disable-next-line
        if (!process.env.SERVER && !$store.hasModule('admin') && (window as any).__INITIAL_STATE__) {
            // This works both for SSR and SPA
            registerModule($store, ['admin'], 'admin/', admin, {
                preserveState: true
            })
        }
        const adminStore = useAdmin()

        const greeting = adminStore.getters.greeting

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // eslint-disable-next-line
        if (module.hot) module.hot.accept(['src/store/module'], () => {
            // This is necessary to prevent errors when this module is hot reloaded
            unregisterModule($store, admin)
            registerModule($store, ['admin'], 'admin/', admin, {
                preserveState: true
            })
        })

        onUnmounted(() => {
            unregisterModule($store, admin)
        })

        return { greeting };
    }
});
</script>
```

The second method is by using a `router.beforeEach` hook to register/ungregister our dynamic store modules. This makes sense, if you have a section of you app, which is only used by a small percentage of visitors. For example an `/admin` section of your site under which you have multiple sub routes. You can then check if the route starts with `/admin` upon route navigation and load the store module based on that for every route that starts with `/admin/...`.

To do this, you can use a [Boot File](/quasar-cli-vite/boot-files) in Quasar that looks like this:

:::tip
The example below is designed to work with both SSR and SPA. If you only use SPA, this can be simplified by removing the last argument of `registerModule` entirely.
:::

```js
import { boot } from 'quasar/wrappers'
import { admin } from 'src/store/module'
import { registerModule, unregisterModule } from 'vuex-smart-module'

// If you have never run your app in SSR mode, the ssrContext parameter will be untyped,
// Either remove the argument or run the project in SSR mode once to generate the SSR store flag
export default boot(({store, router, ssrContext}) => {
    router.beforeEach((to, from, next) => {
        if (to.fullPath.startsWith('/admin')) {
            if (!store.hasModule('admin')) {
                registerModule(store, ['admin'], 'admin/', admin, {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    preserveState: !ssrContext && !from.matched.length && Boolean(window.__INITIAL_STATE__),
                })
            }
        } else {
            if (store.hasModule('admin'))
                unregisterModule(store, admin)
        }
        next()
    })
})
```

In your components, you can then just use the dynamic module, without having to worry about registering it. For example:

```html
<template>
    <q-page class="column items-center justify-center">
        {{ greeting }}
        <q-btn to="/">Home</q-btn>
    </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAdmin } from 'src/store/module';

export default defineComponent({
    name: 'PageIndex',
    setup() {
        const adminStore = useAdmin()
        const greeting = adminStore.getters.greeting

        return { greeting };
    }
});
</script>
```

## Accessing the router in Vuex stores

Simply use `this.$router` in Vuex stores to get access to the router.

Here is an example:
```js
export function whateverAction (state) {
  this.$router.push('...')
}
```
