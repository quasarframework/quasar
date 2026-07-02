<template>
  <div class="q-pa-md">
    <pre class="q-ma-none container">{{ scrollInfo }}</pre>
    <q-scroll-observer @scroll="onScroll" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const scrollInfo = ref({})

function onScroll(info) {
  scrollInfo.value = info
}
</script>

<style lang="sass" scoped>
.container
  font-size: 10px
</style>
