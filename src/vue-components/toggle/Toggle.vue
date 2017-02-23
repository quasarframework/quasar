<template>
  <div
    class="q-toggle cursor-pointer inline no-outline"
    :class="{disabled: disable}"
    v-touch-swipe.horizontal="__swipe"
    @click.stop.prevent="toggle"
    tabindex="0"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @keydown.space.enter.prevent="toggle"
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
  </div>
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
        this.$el.focus()
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
