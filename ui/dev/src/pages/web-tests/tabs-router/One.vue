<template>
  <div>Tab <mark>one</mark> Content</div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'One',

  props: {
    allowRouteChange: {
      type: Boolean
    }
  },

  beforeRouteLeave (to, from, next) {
    next(this.allowRouteChange)
  }
})
</script>
