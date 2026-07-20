---
title: Infinite Scroll
description: The QInfiniteScroll Vue component allows you to load new content as the user scrolls the page.
canonical: https://quasar.dev/vue-components/infinite-scroll
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QInfiniteScroll](../../api/QInfiniteScroll.md)

The QInfiniteScroll component allows you to load new content as the user scrolls the page.

**API reference:** [QInfiniteScroll](../../api/QInfiniteScroll.md)

## Usage

::: tip
Infinite Scroll loads items in advance when less than `offset` (default = 500) pixels is left to be seen. If the content you fetch has height less than the scroll target container’s height on screen then Infinite Scroll will continue loading more content. So make sure you load enough content.
:::

::: tip
In your `@load` function, don't forget to call the passed in `done()` function when you have finished loading more data.
:::

Scroll to the bottom to see QInfiniteScroll in action.

**Example: Basic**

Source: [Basic.vue](../../examples/QInfiniteScroll/Basic.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-infinite-scroll @load="onLoad" :offset="250">
      <div v-for="(item, index) in items" :key="index" class="caption">
        <p
          >Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
          repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
          perferendis totam, ea at omnis vel numquam exercitationem aut, natus
          minima, porro labore.</p
        >
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([{}, {}, {}, {}, {}, {}, {}])

function onLoad(index, done) {
  setTimeout(() => {
    items.value.push({}, {}, {}, {}, {}, {}, {})
    done()
  }, 2000)
}
</script>
````

**Example: Custom Scroll Target Container**

Source: [Container.vue](../../examples/QInfiniteScroll/Container.vue)

````vue
<template>
  <div>
    <div
      ref="scrollTargetRef"
      class="q-pa-md"
      style="max-height: 250px; overflow: auto"
    >
      <q-infinite-scroll
        @load="onLoadRef"
        :offset="250"
        :scroll-target="scrollTargetRef"
      >
        <div v-for="(item, index) in itemsRef" :key="index" class="caption">
          <p
            >Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
            repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
            perferendis totam, ea at omnis vel numquam exercitationem aut, natus
            minima, porro labore.</p
          >
        </div>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>

    <q-separator style="height: 2px" />

    <div
      id="scroll-target-id"
      class="q-pa-md"
      style="max-height: 248px; overflow: auto"
    >
      <q-infinite-scroll
        @load="onLoadId"
        :offset="250"
        scroll-target="#scroll-target-id"
      >
        <div v-for="(item, index) in itemsId" :key="index" class="caption">
          <p
            >Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
            repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
            perferendis totam, ea at omnis vel numquam exercitationem aut, natus
            minima, porro labore.</p
          >
        </div>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const itemsRef = ref([{}, {}, {}, {}, {}, {}, {}])
const itemsId = ref([{}, {}, {}, {}, {}, {}, {}])
const scrollTargetRef = ref(null)

function onLoadRef(index, done) {
  setTimeout(() => {
    itemsRef.value.push({}, {}, {}, {}, {}, {}, {})
    done()
  }, 2000)
}

function onLoadId(index, done) {
  setTimeout(() => {
    itemsId.value.push({}, {}, {}, {}, {}, {}, {})
    done()
  }, 2000)
}
</script>
````

**Example: Reverse (Messenger style)**

Source: [Reverse.vue](../../examples/QInfiniteScroll/Reverse.vue)

````vue
<template>
  <div class="q-pa-md">
    <q-infinite-scroll @load="onLoad" reverse>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>

      <div v-for="(item, index) in items" :key="index" class="caption q-py-sm">
        <q-badge class="shadow-1">
          {{ items.length - index }}
        </q-badge>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
        repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
        perferendis totam, ea at omnis vel numquam exercitationem aut, natus
        minima, porro labore.
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([{}, {}, {}, {}, {}, {}, {}])

function onLoad(index, done) {
  setTimeout(() => {
    items.value.splice(0, 0, {}, {}, {}, {}, {}, {}, {})
    done()
  }, 2000)
}
</script>
````

### Tips

::: tip Scrolling container
Please read [here](/vue-components/scroll-observer#determining-scrolling-container) about how Quasar determines the container to attach scrolling events to.
:::

- Works best when placed as direct child of the Vue component rendering your Page
- If you change the parent of this component, don't forget to call `updateScrollTarget()` on the QInfiniteScroll Vue reference.
- If you need to specify the scroll target inner element (because the auto detected one is not the desired one) pass a CSS selector (as string) or the DOM element in the `scroll-target` prop

::: warning
If you pass a custom scroll target container with `scroll-target` prop you must make sure that the element exists and that it can be overflowed (it must have a maximum height and an overflow that allows scrolling).

If the scroll target container cannot be overflowed you'll get a forever loading situation.
:::

**Example: Usage in QMenu**

Source: [Menu.vue](../../examples/QInfiniteScroll/Menu.vue)

````vue
<template>
  <div class="flex flex-center" style="height: 100px">
    <q-btn color="brown" label="Menu with QInfiniteScroll" no-caps>
      <q-menu anchor="bottom middle" self="top middle" :offset="[0, 8]">
        <q-item-label header> Notifications </q-item-label>

        <q-separator />

        <q-list ref="scrollTargetRef" class="scroll" style="max-height: 250px">
          <q-infinite-scroll
            @load="onLoadMenu"
            :offset="250"
            :scroll-target="scrollTargetRef"
          >
            <q-item v-for="(item, index) in itemsMenu" :key="index">
              <q-item-section>
                {{ index + 1 }}. Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Rerum repellendus sit voluptate voluptas
                eveniet porro. Rerum blanditiis perferendis totam, ea at omnis
                vel numquam exercitationem aut, natus minima, porro labore.
              </q-item-section>
            </q-item>

            <template v-slot:loading>
              <div class="text-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const itemsMenu = ref([{}, {}, {}, {}, {}, {}, {}])
const scrollTargetRef = ref(null)

function onLoadMenu(index, done) {
  if (index > 1) {
    setTimeout(() => {
      itemsMenu.value.push({}, {}, {}, {}, {}, {}, {})
      done()
    }, 2000)
  } else {
    setTimeout(() => {
      done()
    }, 200)
  }
}
</script>
````
