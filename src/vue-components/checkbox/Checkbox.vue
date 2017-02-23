<template>
  <div
    class="q-checkbox cursor-pointer inline no-outline"
    :class="{disabled: disable}"
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
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    disable: Boolean
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
    }
  }
}
</script>
