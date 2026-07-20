---
title: Pull to refresh
description: The QPullToRefresh Vue component allows the user to pull down in order to refresh or retrieve the newest content on a page.
canonical: https://quasar.dev/vue-components/pull-to-refresh
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QPullToRefresh](../../api/QPullToRefresh.md)

The QPullToRefresh is a component that allows the user to pull down in order to refresh page content (or retrieve the newest content).

**API reference:** [QPullToRefresh](../../api/QPullToRefresh.md)

## Usage

### Basic

::: warning
In your `@refresh` function, don't forget to call the passed in `done()` function when you have finished loading more data.
:::

To refresh, pull down (with mouse or through finger touch) on the content below when the inner scroll position is the top.

**Example: Basic**

Source: [Basic.vue](../../examples/QPullToRefresh/Basic.vue)

````vue
<template>
  <div class="q-pa-md scroll" style="height: 300px">
    <q-pull-to-refresh @refresh="refresh">
      <div v-for="(item, index) in items" :key="index" class="q-mb-sm">
        <q-badge color="secondary">
          {{ items.length - index }}
        </q-badge>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
      </div>
    </q-pull-to-refresh>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([{}, {}, {}, {}, {}, {}, {}, {}, {}])

function refresh(done) {
  setTimeout(() => {
    items.value.push({}, {}, {}, {}, {}, {}, {})
    done()
  }, 1000)
}
</script>
````

### Custom icon

**Example: Custom icon**

Source: [Icon.vue](../../examples/QPullToRefresh/Icon.vue)

````vue
<template>
  <div class="q-pa-md scroll" style="height: 300px">
    <q-pull-to-refresh @refresh="refresh" color="yellow-9" icon="lightbulb">
      <div v-for="(item, index) in items" :key="index" class="q-mb-sm">
        <q-badge color="secondary">
          {{ items.length - index }}
        </q-badge>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
      </div>
    </q-pull-to-refresh>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([{}, {}, {}, {}, {}, {}, {}, {}, {}])

function refresh(done) {
  setTimeout(() => {
    items.value.push({}, {}, {}, {}, {}, {}, {})
    done()
  }, 1000)
}
</script>
````

### Custom coloring

**Example: Custom coloring**

Source: [CustomColoring.vue](../../examples/QPullToRefresh/CustomColoring.vue)

````vue
<template>
  <div class="q-pa-md scroll" style="height: 300px">
    <q-pull-to-refresh
      @refresh="refresh"
      color="orange-2"
      bg-color="black"
      icon="autorenew"
    >
      <div v-for="(item, index) in items" :key="index" class="q-mb-sm">
        <q-badge color="accent">
          {{ items.length - index }}
        </q-badge>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
      </div>
    </q-pull-to-refresh>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([{}, {}, {}, {}, {}, {}, {}, {}, {}])

function refresh(done) {
  setTimeout(() => {
    items.value.push({}, {}, {}, {}, {}, {}, {})
    done()
  }, 1000)
}
</script>
````

## Tips

::: tip Scrolling container
Please read [here](/vue-components/scroll-observer#determining-scrolling-container) about how Quasar determines the container to attach scrolling events to.
:::

- If using a QLayout, then it's recommended that you put QPullToRefresh as direct child of QPage and wrap your page content with it.
- If you change the parent of this component, don't forget to call `updateScrollTarget()` on the QPullToRefresh Vue reference.
- QPullToRefresh also allows text selection, so if your content also has images, you might want to add `draggable="false"` to them, otherwise the native browser behavior might interfere in a negative way.
