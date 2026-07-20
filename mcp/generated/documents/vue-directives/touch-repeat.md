---
title: Touch Repeat Directive
description: Vue directive which triggers an event at specified intervals of time while the user touches and holds on a component or element.
canonical: https://quasar.dev/vue-directives/touch-repeat
kinds: directive
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [TouchRepeat](../../api/TouchRepeat.md)

Quasar offers full-featured Vue directives that can totally replace libraries like Hammerjs: `v-touch-pan`, `v-touch-swipe`, `v-touch-hold` and `v-touch-repeat`.

> **These directives also work with mouse events, not only touch events**, so you are able to build cool functionality for your App on desktops too.

We will be describing `v-touch-repeat` on the lines below.

**API reference:** [TouchRepeat](../../api/TouchRepeat.md)

## Usage

Click and hold with your mouse on the area below to see it in action.
Notice that on touch capable devices the scrolling is not blocked.

> The default repeat pattern is 0:600:300 (ms).

**Example: Basic**

Source: [Basic.vue](../../examples/TouchRepeat/Basic.vue)

````vue
<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-repeat.mouse="handleRepeat"
      class="custom-area cursor-pointer bg-primary text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="text-center"> Click/touch and hold. </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const info = ref(null)

function handleRepeat({ evt, ...newInfo }) {
  info.value = newInfo

  // native Javascript event
  console.log(evt)
}
</script>

<style lang="sass" scoped>
.custom-area
  width: 96%
  height: 250px
  border-radius: 3px
  padding: 8px

.custom-info pre
  width: 190px
  font-size: 12px
</style>
````

Below is an example configured to also react to `SPACE`, `ENTER` and `h` keys (**focus on it first**), with 0:300:200 (ms) repeat pattern. Hit & hold keys, or click/tap and hold.

**Example: Custom keys**

Source: [Keys.vue](../../examples/TouchRepeat/Keys.vue)

````vue
<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-repeat:0:300:200.mouse.enter.space.72.104="handleRepeat"
      tabindex="0"
      class="custom-area cursor-pointer bg-primary text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="text-center"> Click/touch and hold. </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const info = ref(null)

function handleRepeat({ evt, ...newInfo }) {
  info.value = newInfo

  // native Javascript event
  console.log(evt)
}
</script>

<style lang="sass" scoped>
.custom-area
  width: 96%
  height: 250px
  border-radius: 3px
  padding: 8px

  &:focus
    outline: 1px solid #ccc
    outline-offset: 3px

.custom-info pre
  width: 190px
  font-size: 12px
</style>
````

Below is an example of applying TouchRepeat to QBtn. Notice how we play with the directive arguments in order to make the blue buttons increment slower than the red ones.

**Example: Applied to QBtn**

Source: [Buttons.vue](../../examples/TouchRepeat/Buttons.vue)

````vue
<template>
  <div class="q-pa-md row flex-center">
    <q-btn
      v-touch-repeat:0:1000.mouse.enter.space="decrement"
      color="primary"
      push
      round
      class="q-mr-sm"
      icon="remove"
    />

    <q-btn
      v-touch-repeat:0:100.mouse.enter.space="decrement"
      color="red"
      push
      round
      icon="remove"
    />

    <span class="q-mx-md">
      {{ number }}
    </span>

    <q-btn
      v-touch-repeat:0:100.mouse.enter.space="increment"
      color="red"
      push
      round
      class="q-mr-sm"
      icon="add"
    />

    <q-btn
      v-touch-repeat:0:1000.mouse.enter.space="increment"
      color="primary"
      push
      round
      icon="add"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const number = ref(110)

function increment() {
  number.value++
}

function decrement() {
  number.value--
}
</script>
````

### Handling Mouse Events

When you want to handle mouse events too, use the `mouse` modifier:

```html
<div v-touch-repeat.mouse="myHandler">...</div>
```

### Handling Key Events

When you want to handle key events too, use [keycodes](https://keycode.info/) as modifiers:

```html
<div v-touch-repeat.65.70="myHandler">...</div>
```

There are some special modifiers that you do not require to write the equivalent keycode: `space`, `tab`, `enter`.

### Inhibiting TouchRepeat

When you want to inhibit TouchRepeat, you can do so by stopping propagation of the `touchstart` / `mousedown` / `keydown` events from the inner content:

```html
<div v-touch-repeat.mouse.enter="userHasHold">
  <!-- ...content -->
  <div @touchstart.stop @mousedown.stop @keydown.stop>
    <!--
      TouchRepeat will not apply here because
      we are calling stopPropagation() on touchstart,
      mousedown and keydown events
    -->
  </div>
  <!-- ...content -->
</div>
```

However, if you are using `capture`, `mouseCapture` or `keyCapture` modifiers then events will first reach the TouchRepeat directive then the inner content, so TouchRepeat will still trigger.

## Note on HMR

Due to performance reasons, not all of the modifiers are reactive. Some require a window/page/component refresh to get updated. Please check the API card for the modifiers which are not marked as reactive.
