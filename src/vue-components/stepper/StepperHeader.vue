<template>
  <div
    class="q-stepper-header flex items-stretch justify-between wrap shadow-1"
    :class="{alternative: alternative}"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    alternative: Boolean
  },
  inject: ['setVerticality'],
  mounted () {
    this.setVerticality(false)
  },
  beforeDestroy () {
    this.setVerticality(true)
  }
}
</script>
