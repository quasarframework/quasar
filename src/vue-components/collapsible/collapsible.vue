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
      coerce: Boolean
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
