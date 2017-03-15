<template>
  <div class="q-stepper-header flex items-stretch justify-between wrap shadow-1">
    <slot></slot>
  </div>
</template>

<script>
export default {
  inject: ['setVerticality'],
  mounted () {
    this.setVerticality(false)
  },
  beforeDestroy () {
    this.setVerticality(true)
  }
}
</script>
