<template>
  <svg
    class="q-spinner q-spinner-mat"
    :width="size"
    :height="size"
    :style="{color: color}"
    viewBox="25 25 50 50"
  >
    <circle class="path" cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="3" stroke-miterlimit="10"/>
  </svg>
</template>

<script>
import mixin from '../spinner-mixin'

export default {
  name: 'q-spinner-mat',
  mixins: [mixin]
}
</script>
