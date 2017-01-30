<template>
  <span>
    <slot v-if="active" name="active"></slot>
    <slot v-else></slot>
  </span>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      required: true
    }
  },
  beforeCreate () {
    console.warn('[Quasar] State component has been deprecated and will be soon removed. Use Vue v-if directive instead.')
  }
}
</script>
