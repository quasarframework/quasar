<template>
  <label
    class="quasar-toggle"
    :class="{disabled: disable}"
    v-touch:pan="toggle"
    v-touch-options:pan="{ direction: 'horizontal' }"
  >
    <input type="checkbox" v-model="model" v-attr="attrib">
    <div></div>
    <i v-if="icon">{{ icon }}</i>
  </label>
</template>

<script>
export default {
  props: {
    model: {
      type: Boolean,
      // twoWay: true // emit event instead
      required: true
    },
    disable: {
      type: Boolean,
      default: false,
      coerce: Boolean
    },
    icon: String
  },
  computed: {
    attrib () {
      return this.disable ? 'disabled' : []
    }
  },
  methods: {
    toggle (event) {
      if (
        !this.disable &&
        event.isFinal &&
        (this.model && event.deltaX < 0 || !this.model && event.deltaX > 0)
      ) {
        this.model = !this.model
      }
    }
  }
}
</script>
