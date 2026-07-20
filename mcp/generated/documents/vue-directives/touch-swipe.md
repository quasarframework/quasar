---
title: Touch Swipe Directive
description: Vue directive which triggers an event when the user swipes with the finger or mouse on a component or element.
canonical: https://quasar.dev/vue-directives/touch-swipe
kinds: directive
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [TouchSwipe](../../api/TouchSwipe.md)

Quasar offers full-featured Vue directives that can totally replace libraries like Hammerjs: `v-touch-pan`, `v-touch-swipe`, `v-touch-hold` and even `v-touch-repeat`.

> **These directives also work with mouse events, not only touch events**, so you are able to build cool functionality for your App on desktops too.

We will be describing `v-touch-swipe` on the lines below.

**API reference:** [TouchSwipe](../../api/TouchSwipe.md)

## Usage

Swipe with your mouse on the area below to see it in action. If using a mouse, you need to do it quick.

::: tip
If your content also has images, you might want to add `draggable="false"` to them, otherwise the native browser behavior might interfere in a negative way.
:::

**Example: All directions**

Source: [Basic.vue](../../examples/TouchSwipe/Basic.vue)

````vue
<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-swipe.mouse="handleSwipe"
      class="custom-area cursor-pointer bg-primary text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="text-center">
        <q-icon name="arrow_upward" />
        <div class="row items-center">
          <q-icon name="arrow_back" />
          <div>Swipe in any direction</div>
          <q-icon name="arrow_forward" />
        </div>
        <q-icon name="arrow_downward" />
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const info = ref(null)

function handleSwipe({ evt, ...newInfo }) {
  info.value = newInfo

  // native Javascript event
  console.log(evt)
}
</script>

<style lang="sass" scoped>
.custom-area
  width: 90%
  height: 220px
  border-radius: 3px
  padding: 8px

.custom-info pre
  width: 180px
  font-size: 12px
</style>
````

**Example: One direction only**

Source: [Right.vue](../../examples/TouchSwipe/Right.vue)

````vue
<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-swipe.mouse.right="handleSwipe"
      class="custom-area cursor-pointer bg-primary text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else>
        Swipe to right only
        <q-icon name="arrow_forward" />
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const info = ref(null)

function handleSwipe({ evt, ...newInfo }) {
  info.value = newInfo

  // native Javascript event
  console.log(evt)
}
</script>

<style lang="sass" scoped>
.custom-area
  width: 90%
  height: 220px
  border-radius: 3px
  padding: 8px

.custom-info pre
  width: 180px
  font-size: 12px
</style>
````

**Example: Several directions**

Source: [UpOrLeft.vue](../../examples/TouchSwipe/UpOrLeft.vue)

````vue
<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-swipe.mouse.up.left="handleSwipe"
      class="custom-area cursor-pointer bg-primary text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="text-center">
        <q-icon name="arrow_upward" />
        <div class="row items-center">
          <q-icon name="arrow_back" />
          <div>Swipe up or left</div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const info = ref(null)

function handleSwipe({ evt, ...newInfo }) {
  info.value = newInfo

  // native Javascript event
  console.log(evt)
}
</script>

<style lang="sass" scoped>
.custom-area
  width: 90%
  height: 220px
  border-radius: 3px
  padding: 8px

.custom-info pre
  width: 180px
  font-size: 12px
</style>
````

### Handling Mouse Events

When you want to handle mouse events too, use the `mouse` modifier:

```html
<div v-touch-swipe.mouse="userHasSwiped">...</div>
```

### Inhibiting TouchSwipe

When you want to inhibit TouchSwipe, you can do so by stopping propagation of the `touchstart` / `mousedown` events from the inner content:

```html
<div v-touch-swipe.mouse="userSwiped">
  <!-- ...content -->
  <div @touchstart.stop @mousedown.stop>
    <!--
      TouchSwipe will not apply here because
      we are calling stopPropagation() on touchstart
      and mousedown events
    -->
  </div>
  <!-- ...content -->
</div>
```

However, if you are using `capture` or `mouseCapture` modifiers then events will first reach the TouchHold directive then the inner content, so TouchSwipe will still trigger.

## Note on HMR

Due to performance reasons, not all of the modifiers are reactive. Some require a window/page/component refresh to get updated. Please check the API card for the modifiers which are not marked as reactive.
