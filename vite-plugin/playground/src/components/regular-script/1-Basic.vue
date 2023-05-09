<template>
  <h3>Basic</h3>

  <div>
    <q-btn label="Click me" />

    <q-icon name="map" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

import Component from './2-Imports.vue?raw'

console.log(Component)

export default defineComponent({
  name: 'RSBasic'
})
</script>
