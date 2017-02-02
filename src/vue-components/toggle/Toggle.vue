<template>
  <span
    class="q-toggle cursor-pointer"
    :class="{disabled: disable}"
    v-touch-swipe.horizontal="__swipe"
    @click.stop.prevent="toggle"
  >
    <input
      type="checkbox"
      v-model="model"
      :disabled="disable"
      @click.stop
      @change="__change"
    >
    <div></div>
    <i v-if="icon">{{ icon }}</i>
  </span>
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
        if (value !== this.value) {
          this.$emit('input', value)
        }
      }
    }
  },
  methods: {
    toggle () {
      if (!this.disable) {
        this.model = !this.model
      }
    },
    __change (e) {
      if (this.$q.platform.is.ios) {
        this.toggle()
      }
    },
    __swipe (evt) {
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
