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
  }
}
</script>
