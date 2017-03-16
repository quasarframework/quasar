<template>
  <svg class="q-spinner q-spinner-mat" :width="size" :height="size" viewBox="25 25 50 50">
    <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-miterlimit="10"/>
  </svg>
</template>

<script>
export default {
  props: ['size']
}
</script>
