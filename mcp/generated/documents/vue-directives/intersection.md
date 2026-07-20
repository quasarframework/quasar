---
title: Intersection Directive
description: Vue directive that uses Intersection Observer API to call a method when user scrolls and brings a component into or out of view.
canonical: https://quasar.dev/vue-directives/intersection
kinds: directive
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [Intersection](../../api/Intersection.md)

"Intersection" is a Quasar directive that enables a method to be called when the user scrolls and the DOM element (or component) that it is applied to comes into or out of the viewport.

Under the hood, it uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

::: warning
Not all browsers support the Intersection Observer API. Most [modern browsers](https://caniuse.com/#search=intersection) do, but other browsers do not. If you need to support older browsers, you can install and import (into a boot file) the official W3C [polyfill](https://github.com/w3c/IntersectionObserver).
:::

**API reference:** [Intersection](../../api/Intersection.md)

## Usage

Reading the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) first will be best in your understanding of how this directive works.

Intersection directive takes either a handler function as an argument or an Object. The Object form looks like this:

```js
{
  handler: /* Function */,
  cfg: {
    // any options from "Intersection observer options"
    // on https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    root: null, // DOM Element
    rootMargin: '0px',
    threshold: 0
  }
}
```

When using the Object form, only the `handler` key is mandatory.

The handler Function takes one parameter, which is an [IntersectionObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry).

::: tip
Scroll within the examples below until the observed element is in view. Then scroll it out of view.
:::

### Basic

**Example: Basic**

Source: [Basic.vue](../../examples/Intersection/Basic.vue)

````vue
<template>
  <div class="relative-position">
    <div class="example-area q-pa-lg scroll">
      <div class="example-filler" />

      <div
        v-intersection="onIntersection"
        class="example-observed text-center rounded-borders"
      >
        Observed Element
      </div>

      <div class="example-filler" />
    </div>

    <div
      class="example-state rounded-borders text-center absolute-top q-mt-md q-ml-md q-mr-lg text-white"
      :class="visibleClass"
    >
      {{ visible ? 'Visible' : 'Hidden' }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const visible = ref(false)

const visibleClass = computed(
  () => `bg-${visible.value ? 'positive' : 'negative'}`
)

function onIntersection(entry) {
  visible.value = entry.isIntersecting
}
</script>

<style lang="sass" scoped>
.example-state
  background: #ccc
  font-size: 20px
  color: #282a37
  padding: 10px
  opacity: 0.8

.example-observed
  width: 100%
  font-size: 20px
  color: #ccc
  background: #424242
  padding: 10px

.example-area
  height: 300px

.example-filler
  height: 500px
</style>
````

### Trigger once

The directive can be used with the `once` modifier (ex: `v-intersection.once`). Once the observed element comes into view, the handler Function will be called and the observing will stop. This allows you to control the processing overhead if all you need is to be notified when the observed element starts to be visible on screen.

**Example: Once**

Source: [Once.vue](../../examples/Intersection/Once.vue)

````vue
<template>
  <div class="relative-position">
    <div class="example-area q-pa-lg scroll">
      <div class="example-filler" />

      <div
        v-intersection.once="onIntersection"
        class="example-observed text-center rounded-borders"
      >
        Observed Element
      </div>

      <div class="example-filler" />
    </div>

    <div
      class="example-state rounded-borders text-center absolute-top q-mt-md q-ml-md q-mr-lg text-white"
      :class="visibleClass"
    >
      {{ visible ? 'Visible' : 'Hidden' }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const visible = ref(false)

const visibleClass = computed(
  () => `bg-${visible.value ? 'positive' : 'negative'}`
)

const message = computed(() =>
  visible.value ? "Visible. We're done." : 'Hidden'
)

function onIntersection(entry) {
  visible.value = entry.isIntersecting
}
</script>

<style lang="sass" scoped>
.example-state
  background: #ccc
  font-size: 20px
  color: #282a37
  padding: 10px
  opacity: 0.8

.example-observed
  width: 100%
  font-size: 20px
  color: #ccc
  background: #424242
  padding: 10px

.example-area
  height: 300px

.example-filler
  height: 500px
</style>
````

### Using an Object

By passing in an Object as the directive's value (instead of a Function), you can control all the options (like threshold) of the Intersection Observer.

**Example: Supplying configuration Object**

Source: [ObjectForm.vue](../../examples/Intersection/ObjectForm.vue)

````vue
<template>
  <div class="relative-position">
    <div
      class="example-state rounded-borders text-center absolute-top q-mt-md q-ml-md q-mr-lg text-white"
      :class="visibleClass"
    >
      Percent: {{ percent }}%
    </div>

    <div class="example-area q-pa-lg scroll">
      <div class="example-filler" />

      <div
        v-intersection="options"
        class="example-observed flex flex-center rounded-borders"
      >
        Observed Element
      </div>

      <div class="example-filler" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const thresholds = []
const percent = ref(0)

for (let i = 0; i <= 1; i += 0.01) {
  thresholds.push(i)
}

const visibleClass = computed(
  () => `bg-${percent.value > 0 ? 'positive' : 'negative'}`
)

const options = {
  handler(entry) {
    const val = (entry.intersectionRatio * 100).toFixed(0)
    if (percent.value !== val) {
      percent.value = val
    }
  },
  cfg: {
    threshold: thresholds
  }
}
</script>

<style lang="sass" scoped>
.example-state
  background: #ccc
  font-size: 20px
  color: #282a37
  padding: 10px
  opacity: 0.8

.example-observed
  height: 150px
  font-size: 20px
  color: #ccc
  background: #424242
  padding: 10px

.example-area
  height: 300px

.example-filler
  height: 500px
</style>
````

### Advanced

Below is a more advanced example of what you can do. The code takes advantage of the HTML `data` attribute. Basically, by setting `data-id` with the index of the element in a loop, this can be retrieved via the passed in `entry` to the handler as `entry.target.dataset.id`. If you are unfamiliar with the `data` attribute you can read more [here](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) about using it.

**Example: Advanced**

Source: [Advanced.vue](../../examples/Intersection/Advanced.vue)

````vue
<template>
  <div class="relative-position">
    <div class="example-area q-pa-lg scroll">
      <div class="example-filler" />

      <q-list>
        <q-item
          v-for="n in 30"
          :key="n"
          :data-id="n"
          class="q-my-md q-pa-sm bg-grey-9 text-white"
          v-intersection="onIntersection"
        >
          <q-item-section class="text-center"> Item #{{ n }} </q-item-section>
        </q-item>
      </q-list>

      <div class="example-filler" />
    </div>

    <div
      class="example-state bg-primary text-white overflow-hidden rounded-borders text-center absolute-top-left q-ma-md q-pa-sm"
    >
      <transition-group v-if="inView.length > 0" name="in-view" tag="ul">
        <li v-for="i in inView" :key="i" class="in-view-item">
          {{ i }}
        </li>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

function sortAtoi(a, b) {
  return Number(a) - Number(b)
}

const inView = ref([])

function onIntersection(entry) {
  if (entry.isIntersecting) {
    add(entry.target.dataset.id)
  } else {
    remove(entry.target.dataset.id)
  }
}

function add(i) {
  remove(i)
  inView.value.push(i)
  inView.value.sort(sortAtoi)
}

function remove(i) {
  let index
  while ((index = inView.value.indexOf(i)) > -1) {
    inView.value.splice(index, 1)
    inView.value.sort(sortAtoi)
  }
}
</script>

<style lang="sass" scoped>
.example-state
  width: 50px
  height: 226px
  opacity: 0.85

  ul
    list-style: none
    margin: 0
    padding: 0

  li
    padding: 0.5em

.example-area
  height: 300px

.example-filler
  height: 350px

.in-view-item
  transition: all 0.3s
  display: block

.in-view-enter, .in-view-leave-to
  opacity: 0
  transform: translateX(-30px)

.in-view-leave-active
  position: absolute
</style>
````

In the example below, we show multiple cards, but only the visible ones get rendered. The secret is in the wrapper which has `v-intersection` attached to it and a fixed height and width (which acts as a necessary filler when the inner content is not rendered -- so that scrolling won't erratically jump).

> The example below can also be written by using [QIntersection](/vue-components/intersection) component which makes everything even easier.

**Example: Scrolling Cards**

Source: [ScrollingCards.vue](../../examples/Intersection/ScrollingCards.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row justify-center q-gutter-sm">
      <div
        v-for="index in inView.length"
        :key="index"
        :data-id="index - 1"
        class="example-item q-pa-sm flex flex-center relative-position"
        v-intersection="onIntersection"
      >
        <transition name="q-transition--scale">
          <q-card v-if="inView[index - 1]">
            <img src="https://cdn.quasar.dev/img/mountains.jpg" />

            <q-card-section>
              <div class="text-h6">Card #{{ index }}</div>
              <div class="text-subtitle2">by John Doe</div>
            </q-card-section>
          </q-card>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// oxlint-disable-next-line unicorn/new-for-builtins
const inView = ref(Array(50).fill(false))

function onIntersection(entry) {
  const index = Number.parseInt(entry.target.dataset.id, 10)
  setTimeout(() => {
    inView.value.splice(index, 1, entry.isIntersecting)
  }, 50)
}
</script>

<style lang="sass" scoped>
.example-item
  height: 290px
  width: 290px
</style>
````

::: tip
In the example above we used a Quasar transition. For a full list, please head to [Transitions](/options/transitions) page.
:::
