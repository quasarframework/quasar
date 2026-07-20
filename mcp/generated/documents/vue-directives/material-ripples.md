---
title: Material Ripples
description: Vue directive for easily adding material ripples to your components and DOM elements.
canonical: https://quasar.dev/vue-directives/material-ripples
kinds: directive
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [Ripple](../../api/Ripple.md)

Material Ripple effect can easily be added to any DOM element (or component) through the `v-ripple` Quasar directive.

::: danger
Do not use this directive on components that already have material ripples baked in (example: `QBtn`). Rather configure the internal ripples through those component's `ripple` property.
:::

**API reference:** [Ripple](../../api/Ripple.md)

**Configuration:** configure `framework.config.ripple` in `quasar.config`.

## Usage

::: warning
Make sure that your DOM element or component has CSS `position: relative` or Quasar CSS helper class `relative-position` attached to it.
:::

### Basic

**Example: Basic**

Source: [Basic.vue](../../examples/Ripple/Basic.vue)

```vue
<template>
  <div class="q-pa-md row justify-center">
    <div
      v-ripple
      class="relative-position container flex flex-center text-white"
      :class="classes"
    >
      Click/tap me
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const colors = [
  // #region
  'primary',
  'amber',
  'secondary',
  'orange',
  'accent',
  'lime',
  'cyan',
  'purple',
  'brown',
  'blue'
  // #endregion
]

const color = ref(colors[0])
const classes = computed(() => `bg-${color.value}`)
const index = ref(0)

let timer

onMounted(() => {
  timer = setInterval(() => {
    index.value = (index.value + 1) % colors.length
    color.value = colors[index.value]
  }, 3000)
})

onBeforeUnmount(() => {
  clearTimeout(timer)
})
</script>

<style lang="sass" scoped>
.container
  border-radius: 3px
  cursor: pointer
  transition: background 1.5s
  height: 150px
  width: 80%
  max-width: 500px
</style>
```

### Coloring

The Material Ripple takes the CSS color of text by default, but you can configure it:

**Example: Colored**

Source: [Colored.vue](../../examples/Ripple/Colored.vue)

```vue
<template>
  <div class="q-pa-md column items-center">
    <div
      v-ripple:purple
      class="relative-position container bg-grey-3 text-black flex flex-center"
    >
      Purple colored ripple
    </div>

    <div
      v-ripple="{ color: 'yellow' }"
      class="relative-position container bg-cyan text-white flex flex-center q-mt-sm"
      style="height: 50px"
    >
      Yellow colored ripple
    </div>

    <div
      v-ripple
      class="relative-position container bg-purple text-yellow flex flex-center q-mt-sm"
      style="height: 50px"
    >
      Inheriting text color
    </div>
  </div>
</template>

<style lang="sass" scoped>
.container
  border-radius: 3px
  cursor: pointer
  height: 50px
  width: 80%
  max-width: 500px
</style>
```

### Positioning

You can also configure if the ripple should always start from center or not, regardless of the touch point:

**Example: Positioning**

Source: [Positioning.vue](../../examples/Ripple/Positioning.vue)

```vue
<template>
  <div class="q-pa-md q-gutter-md row justify-center">
    <div
      v-ripple.center
      class="relative-position container bg-grey-3 text-black inline flex flex-center"
    >
      Center
    </div>

    <div
      v-ripple
      class="relative-position container bg-grey-3 text-black inline flex flex-center text-center"
    >
      Touch point<br />(default)
    </div>
  </div>
</template>

<style lang="sass" scoped>
.container
  border-radius: 50%
  cursor: pointer
  width: 150px
  height: 150px
</style>
```

### Triggering early

By default, the Ripple directive is triggered on click or keyup. However, you can change that and make it trigger earlier, on the first user interaction (mousedown, touchstart, keydown). Please note that in most situations the event sets may overlap (small delay between first and last user interaction) and there is no difference in the user perception, but in certain conditions it may lead to misleading the user.

This is especially noticeable on touchscreens where if a user accidentally moves their finger after the touchstart it can sometimes be interpreted as a very small scroll event instead of a click so the click event isn't triggered but there is still a ripple.

**Example: Triggering immediately**

Source: [Early.vue](../../examples/Ripple/Early.vue)

```vue
<template>
  <div class="q-pa-md column items-center">
    <div
      v-ripple.early
      class="relative-position container bg-grey-3 text-black flex flex-center"
    >
      I have ripple triggering early
    </div>

    <div
      v-ripple="{ early: true }"
      class="relative-position container bg-cyan text-white flex flex-center q-mt-sm"
      style="height: 50px"
    >
      I too have ripple triggering early
    </div>
  </div>
</template>

<style lang="sass" scoped>
.container
  border-radius: 3px
  cursor: pointer
  height: 50px
  width: 80%
  max-width: 500px
</style>
```

### Disable

If for some reason you have a scenario where the ripples need to be disabled, then you can assign a Boolean as value for the directive:

**Example: Disable**

Source: [Disable.vue](../../examples/Ripple/Disable.vue)

```vue
<template>
  <div class="q-pa-md column items-center">
    <div
      v-ripple="state"
      class="relative-position container bg-cyan text-black flex flex-center"
    />

    <q-toggle
      v-model="state"
      label="Use ripple for container above"
      class="q-mt-md"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const state = ref(true)
</script>

<style lang="sass" scoped>
.container
  border-radius: 3px
  cursor: pointer
  height: 50px
  width: 80%
  max-width: 500px
</style>
```
