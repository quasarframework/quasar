<template>
  <div>Tab <mark>one</mark> Content</div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'One',

  props: {
    allowRouteChange: Boolean
  },

  beforeRouteLeave () {
    console.log(this.allowRouteChange ? 'allowing navigation' : 'denying navigation')
    return this.allowRouteChange
  }
})
</script>
