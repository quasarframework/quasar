<template>
  <h3>With Mixed Case and Duplicates and Aliased Imports</h3>

  <div>
    <q-btn label="Click me" />

    <QIcon name="map" />
    <q-icon name="home" />
  </div>
</template>

<script setup>
import { QIcon as Bibi } from 'quasar'

console.log(Bibi)
</script>
