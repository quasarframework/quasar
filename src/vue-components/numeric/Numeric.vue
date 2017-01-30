<template>
  <div
    class="q-numeric textfield row inline items-center"
    :class="{disabled: disable, readonly: readonly, 'has-error': hasError}"
  >
    <i @click="__setByOffset(-1)">remove</i>
    <input
      class="no-style auto q-input-field"
      type="number"
      v-model.number="model"
      @blur="__updateValue"
      @keydown.up="__updateValue"
      @keydown.down="__updateValue"
      @keydown.enter="__updateValue"
      @keydown.esc="model = value"
      :disabled="disable"
      :readonly="readonly"
      :style="{width: width}"
      tabindex="0"
      :step="step"
      :min="min"
      :max="max"
    >
    <i @click="__setByOffset(1)">add</i>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: true
    },
    step: {
      type: Number,
      default: 1
    },
    min: Number,
    max: Number,
    readonly: Boolean,
    disable: Boolean,
    maxDecimals: {
      type: Number,
      default: 0
    }
  },
  watch: {
    value () {
      this.model = this.value
    }
  },
  data () {
    return {
      model: this.value
    }
  },
  computed: {
    hasMin () {
      return this.has(this.min)
    },
    hasMax () {
      return this.has(this.max)
    },
    hasError () {
      return (
        this.has(this.model) &&
        (
          (this.hasMin && this.model < this.min) ||
          (this.hasMax && this.model > this.max)
        )
      )
    },
    width () {
      return (this.has(this.model) ? ('' + this.model).length : 1) * 0.7 + 'em'
    }
  },
  methods: {
    has (val) {
      return typeof val !== 'undefined'
    },
    __normalize (value) {
      if (!this.has(value)) {
        value = this.hasMin ? this.min : 0
      }
      if (this.hasMin && value < this.min) {
        return this.min
      }
      else if (this.hasMax && value > this.max) {
        return this.max
      }

      return parseFloat(this.maxDecimals ? parseFloat(value).toFixed(this.maxDecimals) : value)
    },
    __updateValue () {
      this.$nextTick(() => {
        this.model = this.__normalize(this.model)
        if (!this.disable && !this.readonly && this.value !== this.model) {
          this.$emit('input', this.model)
        }
      })
    },
    __setByOffset (direction) {
      if (this.disable || this.readonly) {
        return
      }

      let newValue

      if (!this.has(this.model)) {
        newValue = this.__normalize(0)
      }
      else {
        newValue = this.model + direction * this.step
        if (this.hasMin && newValue < this.min && this.model === this.min) {
          return
        }
        if (this.hasMax && newValue > this.max && this.model === this.max) {
          return
        }
      }

      this.model = newValue
      this.__updateValue()
    }
  }
}
</script>
