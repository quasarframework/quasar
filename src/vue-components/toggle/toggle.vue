<template>
  <label
    class="quasar-toggle"
    :class="{disabled: disable}"
    v-touch:pan="toggle"
    v-touch-options:pan="{ direction: 'horizontal' }"
  >
    <input type="checkbox" v-model="model" :disabled="disable">
    <div></div>
    <i v-if="icon">{{ icon }}</i>
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
    },
    icon: String
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
