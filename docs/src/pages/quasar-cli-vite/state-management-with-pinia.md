---
title: State management with Pinia
desc: (@quasar/app-vite) How to manage Pinia in a Quasar App.
scope:
  tree:
    l: src
    c:
    - l: stores
      e: Pinia
      c:
      - l: index.js
        e: Pinia initialization
      - l: "<store>"
        e: Pinia store...
      - l: "<store>"
        e: Pinia store...
  newStore:
    l: src
    c:
    - l: stores
      c:
      - l: index.js
        e: Pinia initialization
      - l: counter.js
        e: Pinia store
---
In large applications, state management often becomes complex due to multiple pieces of state scattered across many components and the interactions between them. It is often overlooked that the source of truth in Vue instances is the raw data object - a Vue instance simply proxies access to it. Therefore, if you have a piece of state that should be shared by multiple instances, you should avoid duplicating it and share it by identity.

The recommended way to go if you want components sharing state is Pinia. Take a look at its [documentation](https://pinia.vuejs.org/) before diving in. It has a great feature when used along the [Vue dev-tools](https://github.com/vuejs/vue-devtools) browser extension like Time Travel debugging.

We won't go into details on how to configure or use Pinia since it has great docs. Instead we'll just show you what the folder structure looks like when using it on a Quasar project.

<doc-tree :def="scope.tree" />

When you scaffold a Quasar project folder you can choose to add Pinia. It will create all the necessary configuration for you. Like for example the creation of `/src/stores` which handles all the Pinia related code that you need.

If you don't choose the Pinia option during project creation but would like to add it later then all you need to do is to check the next section and create the `src/stores/index.[js|ts]` file (it's automatically created when you run `quasar new store <name>`):

```js
// src/stores/index.js

import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia()

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia
})
```

## Adding a Pinia store
Adding a Pinia store is easy with Quasar CLI through the `$ quasar new` command.

```bash
$ quasar new store <store_name> [--format ts]
```

It will create a folder in `/src/stores` named by "store_name" from the command above. It will contain all the boilerplate that you need.

Let's say that you want to create a "counter" Pinia store. You issue `$ quasar new store counter`. You then notice the newly created `/src/stores/counter.[js|ts]` file:

<doc-tree :def="scope.newStore" />

Example of Pinia store:

```js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
  },
})
```

We've created the new Pinia store, but we haven't yet used it in our app. In a Vue file:

```html
<template>
  <div>
    <!-- Option 1 -->
    <div>Direct store</div>
    <!-- Read the state value directly -->
    <div>{{ store.counter }}</div>
    <!-- Use getter directly -->
    <div>{{ store.doubleCount }}</div>

    <!-- Manipulate state directly -->
    <q-btn @click="store.counter--">-</q-btn>
    <!-- Use an action -->
    <q-btn @click="store.increment()">+</q-btn>
  </div>

  <div>
    <!-- Option 2 -->
    <div>Indirect store</div>
    <!-- Use the computed state -->
    <div>{{ count }}</div>
    <!-- Use the computed getter -->
    <div>{{ doubleCountValue }}</div>

    <!-- Use the exposed function -->
    <q-btn @click="decrementCount()">-</q-btn>
    <!-- Use the exposed function -->
    <q-btn @click="incrementCount()">+</q-btn>
  </div>

  <div>
    <!-- Option 3 -->
    <div>Destructured store</div>
    <!-- Use the destructured state -->
    <div>{{ counter }}</div>
    <!-- Use the destructured getter -->
    <div>{{ doubleCount }}</div>

    <!-- Manipulate state directly-->
    <q-btn @click="counter--">-</q-btn>
    <!-- Use an action -->
    <q-btn @click="increment()">+</q-btn>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useCounterStore } from 'stores/counter';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const store = useCounterStore();

    // Option 2: use computed and functions to use the store
    const count = computed(() => store.counter);
    const doubleCountValue = computed(() => store.doubleCount);
    const incrementCount = () => store.increment(); // use action
    const decrementCount = () => store.counter--; // manipulate directly

    // Option 3: use destructuring to use the store in the template
    const { counter, doubleCount } = storeToRefs(store); // state and getters need "storeToRefs"
    const { increment } = store; // actions can be destructured directly

    return {
      // Option 1: return the store directly and couple it in the template
      store,

      // Option 2: use the store in functions and compute the state to use in the template
      count,
      doubleCountValue,
      incrementCount,
      decrementCount,

      // Option 3: pass the destructed state, getters and actions to the template
      counter,
      increment,
      doubleCount,
    };
  },
};
</script>
```

[More info on defining a Pinia store](https://pinia.vuejs.org/core-concepts/).

## Accessing the router in Pinia stores

Simply use `this.router` in Pinia stores to get access to the router.

Here is an example:
```js
import { defineStore } from 'pinia'

export const useWhateverStore = defineStore('whatever', {
  // ...
  actions: {
    whateverAction () {
      this.router.push('...')
    }
  }
}
```
