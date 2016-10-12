<template>
  <label
    class="quasar-toggle"
    :class="{disabled: disable}"
    v-touch-swipe.horizontal="toggle"
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
    toggle (evt) {
      if (!this.disable) {
        if (this.model && evt.direction === 'left') {
          this.model = false
        }
        else if (!this.model && evt.direction === 'right') {
          this.model = true
        }
      }
    }
  }
}
</script>
