<template>
  <label class="quasar-checkbox" :class="{disabled: disabled}">
    <input type="checkbox" v-model="model" :disabled="disabled">
    <div></div>
  </label>
</template>

<script>
  export default {
    props: {
      model: {
        type: Boolean,
        twoWay: true
      },
      disabled: {
        type: Boolean,
        default: false,
        coerce: Boolean
      }
    }
  }
</script>
