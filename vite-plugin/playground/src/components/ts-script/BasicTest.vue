<template>
  <h6>Basic</h6>

  <div>
    <q-btn label="Click me" />
    <q-icon name="map" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Component from './ImportsTest.vue?raw'

console.log(Component)

export default defineComponent({
  name: 'RSBasic'
})
</script>
