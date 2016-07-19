<template>
  <ul class="collapsible">
    <slot></slot>
  </ul>
</template>

<script>
export default {
  props: {
    freely: {
      type: Boolean,
      default: false,
      coerce: (value) => value ? true : false // eslint-disable-line no-unneeded-ternary
    }
  },
  events: {
    closeOtherItems (child) {
      if (this.freely) {
        return
      }

      this.$broadcast('closeYourself', child)
    }
  }
}
</script>
