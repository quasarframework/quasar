<template>
  <label class="quasar-radio" :class="{disabled: disable}">
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
    disable: {
      type: Boolean,
      default: false
    }
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
