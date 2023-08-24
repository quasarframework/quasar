<template>
  <h3>With Custom Component and Imports</h3>

  <div>
    <q-btn label="Click me" />

    <q-icon name="map" />

    <custom-component />
  </div>
</template>

<script setup>
import { QBtn, Notify } from 'quasar'
import CustomComponent from './custom-component.js'

console.log(QBtn)
console.log('Notify', Notify)
</script>
