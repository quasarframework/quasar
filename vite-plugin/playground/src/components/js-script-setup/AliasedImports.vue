<template>
  <h6>With Aliased Imports</h6>

  <div>
    <q-btn label="Click me" />
    <q-icon name="map" />
  </div>
</template>

<script setup>
import { QBtn as SomeComponent, Notify } from 'quasar'

console.log(SomeComponent)
console.log('Notify', Notify)
</script>
