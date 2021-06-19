<template>
  <div class="q-pa-md">
    <pre class="q-ma-none container">{{ scrollInfo }}</pre>
    <q-scroll-observer @scroll="onScroll" />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const scrollInfo = ref({})

    return {
      scrollInfo,
      onScroll (info) {
        scrollInfo.value = info
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.container
  font-size: 12px
</style>
