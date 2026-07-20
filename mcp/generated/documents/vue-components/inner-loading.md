---
title: Inner Loading
description: The QInnerLoading Vue component allows you to add a loading indicator within a component in the form of a local overlay.
canonical: https://quasar.dev/vue-components/inner-loading
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QInnerLoading](../../api/QInnerLoading.md)

The QInnerLoading component allows you to add a progress animation within a component. Much like the [Loading Plugin](/quasar-plugins/loading), its purpose is to offer visual confirmation to the user that some process is happening in the background, which takes an excessive amount of time. QInnerLoading will add an opaque overlay over the delayed element along with a [Spinner](/vue-components/spinners).

**API reference:** [QInnerLoading](../../api/QInnerLoading.md)

## Usage

::: warning
In order for the spinner to be properly placed in the center of the element you want the loading display to show over, that element must have CSS position set to `relative` (or the `relative-position` CSS class declared).
:::

::: warning
QInnerLoading must be the last element inside its parent so it can appear on top of the other content.
:::

### Basic

**Example: Basic**

Source: [Basic.vue](../../examples/QInnerLoading/Basic.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-md">
    <q-btn color="primary" @click="showTextLoading"> Show it </q-btn>

    <q-card class="relative-position card-example" flat bordered>
      <q-card-section class="q-pb-none">
        <div class="text-h6">Lorem Ipsum</div>
      </q-card-section>

      <q-card-section>
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <div v-show="showSimulatedReturnData">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            vel magna eu risus laoreet tristique. Nulla ut fermentum elit, nec
            consequat augue. Morbi et dolor nec metus tincidunt pellentesque.
            Nullam non semper ante. Fusce pellentesque sagittis felis quis
            porta. Aenean condimentum neque sed erat suscipit malesuada. Nulla
            eget rhoncus enim. Duis dictum interdum eros.
          </div>
        </transition>
      </q-card-section>

      <q-inner-loading :showing="visible">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Don't forget to specify which animations
// you are using in quasar.config file > animations.
// Alternatively, if using UMD, load animate.css from CDN.

const visible = ref(false)
const showSimulatedReturnData = ref(false)

function showTextLoading() {
  visible.value = true
  showSimulatedReturnData.value = false

  setTimeout(() => {
    visible.value = false
    showSimulatedReturnData.value = true
  }, 3000)
}
</script>

<style lang="sass" scoped>
.card-example
  width: 288px
  height: 315px
</style>
````

### Label <q-badge label="v2.2+" />

You can add a label when using the default slot, but you can also use the "label" props instead:

**Example: Label props**

Source: [LabelProp.vue](../../examples/QInnerLoading/LabelProp.vue)

````vue
<template>
  <div class="q-pa-md q-gutter-md">
    <q-btn color="primary" @click="showTextLoading"> Show it </q-btn>

    <q-card class="relative-position card-example" flat bordered>
      <q-card-section class="q-pb-none">
        <div class="text-h6">Lorem Ipsum</div>
      </q-card-section>

      <q-card-section>
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <div v-show="showSimulatedReturnData">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            vel magna eu risus laoreet tristique. Nulla ut fermentum elit, nec
            consequat augue. Morbi et dolor nec metus tincidunt pellentesque.
            Nullam non semper ante. Fusce pellentesque sagittis felis quis
            porta. Aenean condimentum neque sed erat suscipit malesuada. Nulla
            eget rhoncus enim. Duis dictum interdum eros.
          </div>
        </transition>
      </q-card-section>

      <q-inner-loading
        :showing="visible"
        label="Please wait..."
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Don't forget to specify which animations
// you are using in quasar.config file > animations.
// Alternatively, if using UMD, load animate.css from CDN.

const visible = ref(false)
const showSimulatedReturnData = ref(false)

function showTextLoading() {
  visible.value = true
  showSimulatedReturnData.value = false

  setTimeout(() => {
    visible.value = false
    showSimulatedReturnData.value = true
  }, 3000)
}
</script>

<style lang="sass" scoped>
.card-example
  width: 288px
  height: 315px
</style>
````
