<template>
  <h6>With Custom Component and Imports</h6>

  <div>
    <q-btn label="Click me" />
    <q-icon name="map" />
    <custom-component />
  </div>
</template>

<script setup lang="ts">
import { QBtn, Notify } from 'quasar'
import CustomComponent from './custom-component.ts'

console.log(QBtn)
console.log('Notify', Notify)
</script>
