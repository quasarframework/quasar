---
title: Touch Hold Directive
description: Vue directive which triggers an event when the user touches and holds on a component or element for a specified amount of time.
canonical: https://quasar.dev/vue-directives/touch-hold
kinds: directive
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [TouchHold](../../api/TouchHold.md)

Quasar offers full-featured Vue directives that can totally replace libraries like Hammerjs: `v-touch-pan`, `v-touch-swipe`, `v-touch-hold` and even `v-touch-repeat`.

> **These directives also work with mouse events, not only touch events**, so you are able to build cool functionality for your App on desktops too.

We will be describing `v-touch-hold` directive on the lines below.

**API reference:** [TouchHold](../../api/TouchHold.md)

## Usage

**Example: Basic**

Source: [Basic.vue](../../examples/TouchHold/Basic.vue)

````vue
<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-hold.mouse="handleHold"
      class="custom-area cursor-pointer bg-primary text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="text-center">
        Click/touch and hold for at least 600ms.
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const info = ref(null)

function handleHold({ evt, ...newInfo }) {
  info.value = newInfo

  // native Javascript event
  console.log(evt)
}
</script>

<style lang="sass" scoped>
.custom-area
  width: 90%
  height: 200px
  border-radius: 3px
  padding: 8px

.custom-info pre
  width: 190px
  font-size: 12px
</style>
````

The default wait time is 600ms, but you can change it:

**Example: Custom wait time**

Source: [CustomTimer.vue](../../examples/TouchHold/CustomTimer.vue)

````vue
<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-hold:2000.mouse="handleHold"
      class="custom-area cursor-pointer bg-purple text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="text-center">
        Click/touch and hold for 2 seconds.
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const info = ref(null)

function handleHold({ evt, ...newInfo }) {
  info.value = newInfo

  // native Javascript event
  console.log(evt)
}
</script>

<style lang="sass" scoped>
.custom-area
  width: 90%
  height: 200px
  border-radius: 3px
  padding: 8px

.custom-info pre
  width: 190px
  font-size: 12px
</style>
````

::: tip
TouchHold also has a default sensitivity of 5px for touch events and 7px for mouse events, which means that it allows a slight movement of the finger or mouse without aborting, improving the user experience.
:::

However, you can change this sensitivity too (notice the directive argument below - `600:12:15` - 600ms wait time, 12px sensitivity for touch events, 15px sensitivity for mouse events):

**Example: Custom sensitivity**

Source: [CustomSensitivity.vue](../../examples/TouchHold/CustomSensitivity.vue)

````vue
<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-hold:600:12:15.mouse="handleHold"
      class="custom-area cursor-pointer bg-purple text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="text-center">
        Sensitivity: 12px for touch events and 15px for mouse events.
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const info = ref(null)

function handleHold({ evt, ...newInfo }) {
  info.value = newInfo

  // native Javascript event
  console.log(evt)
}
</script>

<style lang="sass" scoped>
.custom-area
  width: 90%
  height: 200px
  border-radius: 3px
  padding: 8px

.custom-info pre
  width: 190px
  font-size: 12px
</style>
````

### Handling Mouse Events

When you want to also handle mouse events too, use the `mouse` modifier:

```html
<div v-touch-hold.mouse="userHasHold">...</div>
```

### Inhibiting TouchHold

When you want to inhibit TouchHold, you can do so by stopping propagation of the `touchstart` / `mousedown` events from the inner content:

```html
<div v-touch-hold.mouse="userHasHold">
  <!-- ...content -->
  <div @touchstart.stop @mousedown.stop>
    <!--
      TouchHold will not apply here because
      we are calling stopPropagation() on touchstart
      and mousedown events
    -->
  </div>
  <!-- ...content -->
</div>
```

However, if you are using `capture` or `mouseCapture` modifiers then events will first reach the TouchHold directive then the inner content, so TouchHold will still trigger.

## Note on HMR

Due to performance reasons, not all of the modifiers are reactive. Some require a window/page/component refresh to get updated. Please check the API card for the modifiers which are not marked as reactive.
