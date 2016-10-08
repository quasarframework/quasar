<template>
  <span>
    <slot v-show="!active"></slot>
    <slot v-else name="active"></slot>
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
