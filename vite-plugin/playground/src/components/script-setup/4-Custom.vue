<template>
  <h3>With Custom Component</h3>

  <div>
    <q-btn label="Click me" />

    <q-icon name="map" />

    <custom-component />
  </div>
</template>

<script setup>
import CustomComponent from './custom-component.js'
</script>
