<template>
  <div class="q-numeric textfield row inline items-center" :class="{disabled: disable, readonly: readonly}">
    <i @click="__setByOffset(-1)">remove</i>
    <input
      class="no-style auto q-input-field"
      type="number"
      v-model.number="model"
      @blur="__updateValue()"
      @keydown.enter="__updateValue()"
      @keydown.up="__setByOffset(1)"
      @keydown.down="__setByOffset(-1)"
      @keydown.esc="model = value"
      :disabled="disable"
      :readonly="readonly"
      :style="{width: (''+model).length * .7 + 'em'}"
      tabindex="0"
      step="any"
    >
    <i v-show="value !== model && model !== ''">check</i>
    <i @click="__setByOffset(1)">add</i>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
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
  methods: {
    __normalize (value) {
      if (typeof this.min === 'number' && value < this.min) {
        return this.min
      }
      else if (typeof this.max === 'number' && value > this.max) {
        return this.max
      }

      return parseFloat(this.maxDecimals ? parseFloat(value).toFixed(this.maxDecimals) : value)
    },
    __updateValue () {
      this.model = this.__normalize(this.model)
      if (!this.disable && !this.readonly && this.value !== this.model) {
        this.$emit('input', this.model)
      }
    },
    __setByOffset (direction) {
      if (this.disable || this.readonly) {
        return
      }

      let newValue = this.model + direction * this.step
      if (typeof this.min === 'number' && newValue < this.min && this.model === this.min) {
        return
      }
      if (typeof this.max === 'number' && newValue > this.max && this.model === this.max) {
        return
      }
      this.model = newValue
      this.__updateValue()
    }
  },
  created () {
    this.__updateValue()
  }
}
</script>
