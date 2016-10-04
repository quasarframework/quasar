<template>
  <label class="quasar-checkbox" :class="{disabled: disable}">
    <input type="checkbox" :value="value" @input="__onInput" v-attr="attrib">
    <div></div>
  </label>
</template>

<script>
  export default {
    props: {
      value: Boolean,
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
    },
    methods: {
      __onInput (event) {
        this.$emit('input', event.target.value)
      }
    }
  }
</script>
