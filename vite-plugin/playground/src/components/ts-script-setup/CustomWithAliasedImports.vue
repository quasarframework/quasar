<template>
  <h6>With Custom Component and Aliased Imports</h6>

  <div>
    <q-btn label="Click me" />
    <q-icon name="map" />
    <custom-component />
  </div>
</template>

<script setup lang="ts">
import { QBtn as Mimi, Notify } from 'quasar'
import CustomComponent from './custom-component.ts'

console.log(Mimi)
console.log('Notify', Notify)
</script>
