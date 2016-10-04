<template>
  <label class="quasar-checkbox" :class="{disabled: disable}">
    <input type="checkbox" v-model="model" v-attr="attrib">
    <div></div>
  </label>
</template>

<script>
  export default {
    props: {
      model: {
        type: Boolean
        // twoWay: true // emit event instead
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
