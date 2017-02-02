<template>
  <span
    class="q-checkbox cursor-pointer"
    :class="{disabled: disable}"
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
  </span>
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
