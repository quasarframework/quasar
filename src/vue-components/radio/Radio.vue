<template>
  <label class="q-radio" :class="{disabled: disable}">
    <input type="radio" v-model="model" :value="val" :disabled="disable">
    <div></div>
  </label>
</template>

<script>
export default {
  props: {
    value: {
      required: true
    },
    val: {
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
