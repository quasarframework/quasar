<template lang="pug">
h6 With Imports
div
  q-btn(label='Click me')
  q-icon(name='map')
</template>

<script setup>
import { QBtn, Notify } from 'quasar'

console.log(QBtn)
console.log('Notify', Notify)
</script>
