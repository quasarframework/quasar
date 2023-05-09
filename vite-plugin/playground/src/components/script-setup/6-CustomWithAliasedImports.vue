<template>
  <h3>With Custom Component and Aliased Imports</h3>

  <div>
    <q-btn label="Click me" />

    <q-icon name="map" />

    <custom-component />
  </div>
</template>

<script setup>
import { QBtn as Mimi, Notify } from 'quasar'
import CustomComponent from './custom-component.js'

console.log(Mimi)
console.log('Notify', Notify)
</script>
