<template>
  <div
    class="q-radio cursor-pointer inline no-outline"
    :class="{disabled: disable}"
    @click.stop.prevent="select"
    tabindex="0"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @keydown.space.enter.prevent="select"
  >
    <input
      type="radio"
      v-model="model"
      :value="val"
      :disabled="disable"
      @click.stop
      @change="__change"
    >
    <div></div>
  </div>
</template>

<script>
export default {
  name: 'q-radio',
  props: {
    value: {
      required: true
    },
    val: {
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
        if (value !== this.value) {
          this.$emit('input', value)
        }
      }
    }
  },
  methods: {
    select () {
      if (!this.disable) {
        this.model = this.val
      }
    },
    __change (e) {
      this.model = this.val
    }
  }
}
</script>
