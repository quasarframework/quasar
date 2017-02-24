<template>
  <button
    v-ripple
    @click="__click"
    tabindex="0"
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
