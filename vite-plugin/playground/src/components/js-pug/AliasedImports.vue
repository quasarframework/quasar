<template lang="pug">
h6 With Aliased Imports
div
  q-btn(label='Click me')
  q-icon(name='map')
</template>

<script setup>
import { QBtn as SomeComponent, Notify } from 'quasar'

console.log(SomeComponent)
console.log('Notify', Notify)
</script>
