---
title: Slide Transition
description: The QSlideTransition Vue component slides the encapsulated element up or down, based on its visibility. Works alongside v-show and v-if.
canonical: https://quasar.dev/vue-components/slide-transition
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QSlideTransition](../../api/QSlideTransition.md)

QSlideTransition slides the DOM element (or component) up or down, based on its visibility: works alongside `v-show` and `v-if` on a single element, similar to Vue's Transition component with the only difference being that it's not a group transition too (it only applies to one DOM element or component).

**API reference:** [QSlideTransition](../../api/QSlideTransition.md)

## Usage

**Example: Basic**

Source: [Basic.vue](../../examples/QSlideTransition/Basic.vue)

````vue
<template>
  <div class="q-pa-md" style="max-width: 500px">
    <q-toggle v-model="visible" label="Visible image" class="q-mb-md" />

    <q-slide-transition>
      <div v-show="visible">
        <img class="responsive" src="https://cdn.quasar.dev/img/quasar.jpg" />
      </div>
    </q-slide-transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(true)
</script>
````
