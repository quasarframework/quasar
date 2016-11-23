<template>
  <label class="q-checkbox" :class="{disabled: disable}">
    <input type="checkbox" v-model="model" :disabled="disable">
    <div></div>
  </label>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    disable: Boolean
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
