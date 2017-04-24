<template>
  <svg
    class="q-spinner q-spinner-mat"
    :class="{'one-color': color}"
    :width="size"
    :height="size"
    viewBox="25 25 50 50"
  >
    <circle class="path" cx="50" cy="50" r="20" fill="none" :stroke="stroke" stroke-width="3" stroke-miterlimit="10"/>
  </svg>
</template>

<script>
import mixin from '../spinner-mixin'

export default {
  name: 'q-spinner-mat',
  mixins: [mixin],
  computed: {
    stroke () {
      if (this.color) {
        return this.color
      }
    }
  }
}
</script>
