<template>
  <label
    class="q-toggle"
    :class="{disabled: disable}"
    v-touch-swipe.horizontal="__toggle"
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
    disable: Boolean,
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
    __toggle (evt) {
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
