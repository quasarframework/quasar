<template>
  <div>Tab <mark>two</mark> Content</div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Two',

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
