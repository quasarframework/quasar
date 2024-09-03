<template>
  <h6>With Imports</h6>

  <div>
    <q-btn label="Click me" />
    <q-icon name="map" />
  </div>
</template>

<script setup>
import { QBtn, Notify } from 'quasar'

console.log(QBtn)
console.log('Notify', Notify)
</script>
