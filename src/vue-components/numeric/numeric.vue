<template>
  <div class="quasar-numeric textfield row inline items-center" :class="{disabled: disabled}">
    <i @click="setByOffset(-1)">remove</i>
    <input
      class="no-style auto"
      type="text"
      v-model="model"
      class="quasar-input-field"
      :style="{width: (''+model).length * .7 + 'em'}"
      :disabled="disabled"
      number
    >
    <i @click="setByOffset(1)">add</i>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Number,
      default: 0,
      coerce: (value) => parseFloat(value, 10) || 0
    },
    step: {
      type: Number,
      default: 1,
      coerce: (value) => parseFloat(value, 10)
    },
    min: Number,
    max: Number,
    disabled: {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  },
  watch: {
    model () {
      this.$nextTick(this.validate)
    }
  },
  methods: {
    validate () {
      if (typeof this.min === 'number' && this.model < this.min && this.model !== 0) {
        this.model = this.min
      }
      else if (typeof this.max === 'number' && this.model > this.max) {
        this.model = this.max
      }
    },
    setByOffset (direction) {
      if (!this.disabled) {
        this.model += direction * this.step
      }
    }
  }
}
</script>
