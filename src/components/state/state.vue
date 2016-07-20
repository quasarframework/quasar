<template>
  <span>
    <slot v-if="!model"></slot>
    <slot v-else name="active"></slot>
  </span>
</template>

<script>
export default {
  props: {
    model: {
      type: Boolean,
      required: true,
      twoWay: true
    }
  }
}
</script>
