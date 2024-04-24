<template>
  <h6>With Custom Component and Imports</h6>

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
