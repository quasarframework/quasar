<template lang="pug">
h6 With Mixed Case and Duplicates and Aliased Imports
div
  q-btn(label='Click me')
  QIcon(name='map')
  q-icon(name='home')
</template>

<script setup>
import { QIcon as Bibi } from 'quasar'

console.log(Bibi)
</script>
