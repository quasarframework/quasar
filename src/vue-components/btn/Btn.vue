<template>
  <button
    v-ripple.mat
    @click="__click"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    disable: Boolean
  },
  methods: {
    __click (e) {
      if (!this.disable) {
        this.$emit('click', e)
      }
    }
  }
}
</script>
