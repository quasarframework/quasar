<template lang="pug">
h6 With Custom Component and Aliased Imports
div
  q-btn(label='Click me')
  q-icon(name='map')
</template>

<script setup>
import { QBtn as Mimi, Notify } from 'quasar'

console.log(Mimi)
console.log('Notify', Notify)
</script>
