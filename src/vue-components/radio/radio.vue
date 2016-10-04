<template>
  <label class="quasar-radio" :class="{disabled: disable}">
    <input type="radio" v-model="model" :value="value" v-attr="attrib">
    <div></div>
  </label>
</template>

<script>
export default {
  props: {
    model: {
      // twoWay: true // emit event instead
      required: true
    },
    value: {
      required: true
    },
    disable: {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  },
  computed: {
    attrib () {
      return this.disable ? 'disabled' : []
    }
  }
}
</script>
