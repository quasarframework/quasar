---
title: State management with Pinia
desc: (@quasar/app-vite) How to manage Pinia in a Quasar App.
---
In large applications, state management often becomes complex due to multiple pieces of state scattered across many components and the interactions between them. It is often overlooked that the source of truth in Vue instances is the raw data object - a Vue instance simply proxies access to it. Therefore, if you have a piece of state that should be shared by multiple instances, you should avoid duplicating it and share it by identity.

The recommended way to go if you want components sharing state is Pinia. Take a look at its [documentation](https://pinia.vuejs.org/) before diving in. It has a great feature when used along the [Vue dev-tools](https://github.com/vuejs/vue-devtools) browser extension like Time Travel debugging.

We won't go into details on how to configure or use Pinia since it has great docs. Instead we'll just show you what the folder structure looks like when using it on a Quasar project.

```bash
.
└── src/
    └── stores/       # Pinia
        ├── index.js  # Pinia initialization
        ├── <store>   # Pinia store...
        └── <store>   # Pinia store...
```

When you scaffold a Quasar project folder you can choose to add Pinia. It will create all the necessary configuration for you. Like for example the creation of `/src/stores` which handles all the Pinia related code that you need.

If you don't choose the Pinia option during project creation but would like to add it later then all you need to do is to check the next section and create the `src/stores/index.[js|ts]` file.


## Adding a Pinia store
Adding a Pinia store is easy with Quasar CLI through the `$ quasar new` command.

```bash
$ quasar new store <store_name> [--format ts]
```

It will create a folder in `/src/stores` named by "store_name" from the command above. It will contain all the boilerplate that you need.

Let's say that you want to create a "counter" Pinia store. You issue `$ quasar new store counter`. You then notice the newly created `/src/stores/counter.[js|ts]` file:

```bash
.
└── src/
    └── stores/
        ├── index.js     # Pinia initialization
        └── counter.js   # Pinia store
```

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
  <div class="example">
    <div>Direct store</div>
    <!-- Read the state value directly -->
    <div>{{ store.counter }}</div>

    <!-- Manipulate state directly -->
    <button @click="store.counter--">-</button>
    <!-- Use an action -->
    <button @click="store.increment()">+</button>
  </div>

  <div class="example">
    <div>Indirect store</div>
    <!-- Use the computed value -->
    <div>{{ counter }}</div>

    <!-- Use the exposed function -->
    <button @click="decrement()">-</button>
    <!-- Use the exposed function -->
    <button @click="increment()">+</button>
  </div>
</template>

<script>
import { computed } from "vue";
import { useCounterStore } from "stores/counter";

export default {
  setup() {
    const store = useCounterStore();

    const counter = computed(() => store.counter);
    const increment = () => store.increment();
    const decrement = () => store.counter--;

    return {
      // Either return the store directly and couple it in the template
      store,

      // Or use the store in functions and compute the state to use in the template
      counter,
      increment,
      decrement,
    };
  },
};
</script>

<style>
.example {
  margin: 1rem;
}
</style>
```

[More info on defining a Pinia store](https://pinia.vuejs.org/core-concepts/).
