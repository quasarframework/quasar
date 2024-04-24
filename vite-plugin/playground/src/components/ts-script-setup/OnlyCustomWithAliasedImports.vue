<template>
  <h6>With only Custom Component and Aliased Imports</h6>

  <div>
    <custom-component />
  </div>
</template>

<script setup lang="ts">
import { QBtn as Bibi, Notify } from 'quasar'
import CustomComponent from './custom-component.ts'

console.log(Bibi)
console.log('Notify', Notify)
</script>
