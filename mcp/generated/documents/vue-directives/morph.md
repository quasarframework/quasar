---
title: Morph Directive
description: Vue directive that morphs between DOM elements or even between the two states of the same DOM element.
canonical: https://quasar.dev/vue-directives/morph
kinds: directive
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [Morph](../../api/Morph.md)

"Morph" is a Quasar directive that provides the ability to morph DOM elements between two states.

Under the hood, it uses the Quasar [Morph function util](/quasar-utils/morph-utils).

**API reference:** [Morph](../../api/Morph.md)

## Usage

Reading the [Morph function util](/quasar-utils/morph-utils) first will be best in your understanding of how this directive works.

This directive morphs one element in a group into another. The morphing is activated by changing the value (model) of the directive to match the name of the morphing element.

::: warning

- The "name" and "group" (as directive arg or through the value of the directive) are mandatory.
- If the value of the directive is in Object form, then "model" is also mandatory.

:::

**Example: Morph between multiple elements in a group**

Source: [BasicGroup.vue](../../examples/Morph/BasicGroup.vue)

````vue
<template>
  <div
    class="q-pa-md relative-position"
    style="height: 600px; max-height: 80vh"
  >
    <div
      class="absolute-top-left bg-red text-white q-ma-md q-pa-lg"
      style="border-radius: 10px; font-size: 32px"
      v-morph:topleft:boxes:800="morphGroupModel"
    >
      Top left
    </div>

    <div
      class="absolute-top-right bg-blue text-white q-ma-lg q-pa-xl"
      style="border-radius: 20px; font-size: 18px"
      v-morph:topright:boxes:600.tween="morphGroupModel"
    >
      Top right
    </div>

    <div
      class="absolute-bottom-right bg-orange text-white q-ma-lg q-pa-lg"
      style="border-radius: 0"
      v-morph:bottomright:boxes:400="morphGroupModel"
    >
      Bottom right
    </div>

    <div
      class="absolute-bottom-left bg-green text-white q-ma-xl q-pa-md"
      style="border-radius: 40px; font-size: 24px"
      v-morph:bottomleft:boxes:600.resize="morphGroupModel"
    >
      Bottom left
    </div>

    <q-btn
      class="absolute-center"
      color="purple"
      label="Next morph"
      no-caps
      @click="nextMorph"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const boxValues = ['topleft', 'topright', 'bottomleft', 'bottomright']
const morphGroupModel = ref('topleft')

function nextMorph() {
  let value = morphGroupModel.value

  // pick random box, other than current one
  while (value === morphGroupModel.value) {
    const i = Math.floor(Math.random() * boxValues.length)
    value = boxValues[i]
  }

  morphGroupModel.value = value
}
</script>
````

**Example: Morph a button into a card**

Source: [Card.vue](../../examples/Morph/Card.vue)

````vue
<template>
  <div
    class="q-pa-md relative-position"
    style="height: 280px; max-height: 80vh"
  >
    <q-btn
      v-morph:btn:mygroup:300.resize="morphGroupModel"
      class="absolute-bottom-left q-ma-md"
      fab
      color="primary"
      size="lg"
      icon="add"
      @click="nextMorph"
    />

    <q-card
      v-morph:card1:mygroup:500.resize="morphGroupModel"
      class="absolute-bottom-left q-ma-md bg-primary text-white"
      style="width: 300px; border-bottom-left-radius: 2em"
    >
      <q-card-section class="text-h6"> New user </q-card-section>

      <q-card-section class="text-subtitle1">
        Please fill the details for a new user.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Next" @click="nextMorph" />
      </q-card-actions>
    </q-card>

    <q-card
      v-morph:card2:mygroup:500.tween="morphGroupModel"
      class="absolute-bottom-left q-ma-md bg-primary text-white"
      style="width: 300px; border-bottom-left-radius: 2em"
    >
      <q-card-section class="text-h6"> Finalize registration </q-card-section>

      <q-card-section class="q-py-xl text-center text-subtitle2">
        Thank you for registering.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" @click="nextMorph" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const nextMorphStep = {
  btn: 'card1',
  card1: 'card2',
  card2: 'btn'
}

const morphGroupModel = ref('btn')

function nextMorph() {
  morphGroupModel.value = nextMorphStep[morphGroupModel.value]
}
</script>
````
