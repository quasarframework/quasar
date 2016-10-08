<template>
  <label class="quasar-checkbox" :class="{disabled: disable}">
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
