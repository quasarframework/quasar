---
title: Pagination
description: The QPagination Vue component allows you to easily display a pagination control on a page.
canonical: https://quasar.dev/vue-components/pagination
kinds: component
generated: true
---

> This file is generated from the official Quasar documentation, resolved API data, and source examples.

## Structured API references

- [QPagination](../../api/QPagination.md)

The QPagination component is available for whenever a pagination system is required. It offers the user a simple UI for moving between items or pages.

There are two modes in which QPagination operates: with buttons only or with an inputbox. The latter allows the user to go to a specific page by clicking/tapping on the inputbox, typing the page number then hitting Enter key. If the new page number is within valid limits, the model will be changed accordingly.

**API reference:** [QPagination](../../api/QPagination.md)

## Usage

### Design

**Example: Standard**

Source: [Standard.vue](../../examples/QPagination/Standard.vue)

````vue
<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination v-model="current" :max="5" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const current = ref(3)
</script>
````

The following are a few examples, but not an exhaustive list:

**Example: Button design (v2.10+)**

Source: [BtnDesign.vue](../../examples/QPagination/BtnDesign.vue)

````vue
<template>
  <div class="q-pa-lg">
    <div class="q-gutter-md">
      <q-pagination
        v-model="current"
        max="5"
        direction-links
        flat
        color="grey"
        active-color="primary"
      />

      <q-pagination
        v-model="current"
        max="5"
        direction-links
        outline
        color="orange"
        active-design="unelevated"
        active-color="brown"
        active-text-color="orange"
      />

      <q-pagination
        v-model="current"
        max="5"
        direction-links
        push
        color="teal"
        active-design="push"
        active-color="orange"
      />

      <q-pagination
        v-model="current"
        :max="5"
        direction-links
        unelevated
        color="black"
        active-color="purple"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const current = ref(3)
</script>
````

**Example: Gutter (v2.10+)**

Source: [BtnGutter.vue](../../examples/QPagination/BtnGutter.vue)

````vue
<template>
  <div class="q-pa-lg">
    <div class="q-gutter-md">
      <q-pagination v-model="current" max="5" direction-links />

      <q-pagination v-model="current" max="5" direction-links gutter="sm" />

      <q-pagination v-model="current" max="5" direction-links gutter="md" />

      <q-pagination v-model="current" max="5" direction-links gutter="20px" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const current = ref(2)
</script>
````

### Custom icons

**Example: With icon replacement**

Source: [Icons.vue](../../examples/QPagination/Icons.vue)

````vue
<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      :max="5"
      direction-links
      boundary-links
      icon-first="skip_previous"
      icon-last="skip_next"
      icon-prev="fast_rewind"
      icon-next="fast_forward"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const current = ref(3)
</script>
````

### With input

**Example: With input**

Source: [Input.vue](../../examples/QPagination/Input.vue)

````vue
<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination v-model="current" :max="5" input />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const current = ref(3)
</script>
````

**Example: With input color**

Source: [InputColor.vue](../../examples/QPagination/InputColor.vue)

````vue
<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      :max="5"
      input
      input-class="text-orange-10"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const current = ref(3)
</script>
````

### Max pages shown

**Example: Maximum pages shown**

Source: [MaxPages.vue](../../examples/QPagination/MaxPages.vue)

````vue
<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      color="black"
      :max="10"
      :max-pages="6"
      :boundary-numbers="false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const current = ref(5)
</script>
````

**Example: Removing ellipses**

Source: [Ellipses.vue](../../examples/QPagination/Ellipses.vue)

````vue
<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      color="teal"
      :max="10"
      :max-pages="5"
      :ellipses="false"
      :boundary-numbers="false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const current = ref(5)
</script>
````

### Handling boundary

**Example: With boundary numbers**

Source: [BoundaryNumbers.vue](../../examples/QPagination/BoundaryNumbers.vue)

````vue
<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      color="purple"
      :max="10"
      :max-pages="6"
      boundary-numbers
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const current = ref(6)
</script>
````

**Example: With boundary links**

Source: [BoundaryLinks.vue](../../examples/QPagination/BoundaryLinks.vue)

````vue
<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      color="deep-orange"
      :max="5"
      boundary-links
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const current = ref(3)
</script>
````

**Example: With direction links**

Source: [DirectionLinks.vue](../../examples/QPagination/DirectionLinks.vue)

````vue
<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination v-model="current" :max="5" direction-links />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const current = ref(3)
</script>
````
