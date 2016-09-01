<template>
  <label class="quasar-radio" :class="{disabled: disabled}">
    <input type="radio" v-model="model" :value="value" :disabled="disabled">
    <div></div>
  </label>
</template>

<script>
export default {
  props: {
    model: {
      twoWay: true,
      required: true
    },
    value: {
      required: true
    },
    disabled: {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  }
}
</script>
