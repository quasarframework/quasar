<template>
  <h6>With only Custom Component and Imports</h6>

  <div>
    <custom-component />
  </div>
</template>

<script setup lang="ts">
import { QBtn, Notify } from 'quasar'
import CustomComponent from './custom-component.ts'

console.log(QBtn)
console.log('Notify', Notify)
</script>
