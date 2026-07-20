---
title: Intersection
description: The QIntersection vue component, a wrapper over Quasar's Intersection directive.
canonical: https://quasar.dev/vue-components/intersection
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QIntersection](../../api/QIntersection.md)

The QIntersection component is essentially a wrapper over the [Intersection directive](/vue-directives/intersection) with the added benefit that it handles the state by itself (does not require you to add it and handle it manually) and can optionally have a show/hide transition as well.

The main benefit of using QIntersection is, however, that the DOM tree is freed up of hidden nodes thus using the minimum possible RAM memory and making the page feel very snappy. As well, you can specify the `tag` property for the wrapper element to match your own needs, thus eliminating yet another DOM node.

Under the hood, it uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

::: warning
Not all browsers support the Intersection Observer API. Most [modern browsers](https://caniuse.com/#search=intersection) do, but other browsers do not. If you need to support older browsers, you can install and import (into a boot file) the official W3C [polyfill](https://github.com/w3c/IntersectionObserver).
:::

**API reference:** [QIntersection](../../api/QIntersection.md)

## Usage

::: warning
In most cases, it is required that you apply CSS to the QIntersection element so that it acts as a necessary filler when the inner content is not rendered. This will allow for a smooth scrolling experience, because otherwise the scroll will jump erratically.

An example of such needed CSS would be, for example, a fixed height or at least a min-height (and possibly even a fixed width, as in the examples below, where multiple QIntersections can be displayed on same row).
:::

::: danger
If using the `transition` prop, it is required that the content be wrapped in one and only one element.
:::

::: tip
There are edge cases where the default viewport won't work. For instance, when your code is hosted in an iframe (like Codepen). This is where you need to use the `root` property. It allows you to define an alternative to the viewport as your root (through its DOM element). It is important to keep in mind that root needs to be an ancestor of the observed element.
:::

### Basic

**Example: Basic**

Source: [Basic.vue](../../examples/QIntersection/Basic.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row justify-center q-gutter-sm">
      <q-intersection v-for="index in 60" :key="index" class="example-item">
        <q-card flat bordered class="q-ma-sm">
          <img src="https://cdn.quasar.dev/img/mountains.jpg" />

          <q-card-section>
            <div class="text-h6">Card #{{ index }}</div>
            <div class="text-subtitle2">by John Doe</div>
          </q-card-section>
        </q-card>
      </q-intersection>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.example-item
  height: 290px
  width: 290px
</style>
````

### With transition

In the example below we used a Quasar transition. For a full list, please head to [Transitions](/options/transitions) page.

**Example: With transition**

Source: [Transition.vue](../../examples/QIntersection/Transition.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row justify-center q-gutter-sm">
      <q-intersection
        v-for="index in 60"
        :key="index"
        transition="scale"
        class="example-item"
      >
        <q-card flat bordered class="q-ma-sm">
          <img src="https://cdn.quasar.dev/img/mountains.jpg" />

          <q-card-section>
            <div class="text-h6">Card #{{ index }}</div>
            <div class="text-subtitle2">by John Doe</div>
          </q-card-section>
        </q-card>
      </q-intersection>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.example-item
  height: 290px
  width: 290px
</style>
````

**Example: A list with transition**

Source: [List.vue](../../examples/QIntersection/List.vue)

````vue
<template>
  <div class="q-pa-md flex justify-center">
    <div style="max-width: 90%; width: 300px">
      <q-intersection
        v-for="index in 60"
        :key="index"
        transition="flip-right"
        class="example-item"
      >
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white"> Q </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Contact #{{ index }}</q-item-label>
            <q-item-label caption lines="1">some@email.com</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="chat_bubble" color="green" />
          </q-item-section>
        </q-item>
      </q-intersection>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.example-item
  height: 56px
</style>
````

### Only once

Triggering only once means, however, that you lose the benefit of freeing up the DOM tree. The content will remain in DOM regardless of visibility.

**Example: Triggering only once**

Source: [Once.vue](../../examples/QIntersection/Once.vue)

````vue
<template>
  <div class="q-pa-md">
    <div class="row justify-center q-gutter-sm">
      <q-intersection
        v-for="index in 60"
        :key="index"
        once
        transition="scale"
        class="example-item"
      >
        <q-card flat bordered class="q-ma-sm">
          <img src="https://cdn.quasar.dev/img/mountains.jpg" />

          <q-card-section>
            <div class="text-h6">Card #{{ index }}</div>
            <div class="text-subtitle2">by John Doe</div>
          </q-card-section>
        </q-card>
      </q-intersection>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.example-item
  height: 290px
  width: 290px
</style>
````

The example below uses the `root` property and therefore can be seen in a Codepen (which hosts in an iframe).

**Example: Root viewport**

Source: [Root.vue](../../examples/QIntersection/Root.vue)

````vue
<template>
  <div class="q-pa-md">
    <div ref="myListRef" class="scroll root-container">
      <div class="row justify-center q-gutter-sm">
        <q-intersection
          v-for="index in 60"
          :key="index"
          :root="myListRef"
          transition="scale"
          class="example-item"
        >
          <q-card flat bordered class="q-ma-sm">
            <img src="https://cdn.quasar.dev/img/mountains.jpg" />

            <q-card-section>
              <div class="text-h6">Card #{{ index }}</div>
              <div class="text-subtitle2">by John Doe</div>
            </q-card-section>
          </q-card>
        </q-intersection>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const myListRef = ref(null)
</script>

<style lang="sass" scoped>
.root-container
  height: 250px
  border: 1px solid #fff
  outline: 1px solid #000
  border-radius: 4px

.example-item
  height: 290px
  width: 290px
</style>
````
