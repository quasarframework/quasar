<template>
  <q-btn
      round
      icon="arrow_upward"
      color="lp-accent"
      class="fixed-bottom-right q-ma-md shadow-bottom-small z-max"
      size="sm"
      @click="scrollToTop"
  />
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'scrollToTop',

  setup () {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return {
      scrollToTop
    }
  }
})
</script>
