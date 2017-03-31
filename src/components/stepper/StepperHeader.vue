<template>
  <div
    class="q-stepper-header flex items-stretch justify-between wrap shadow-1"
    :class="{'alternative-labels': alternativeLabels}"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'q-stepper-header',
  props: {
    alternativeLabels: Boolean
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
