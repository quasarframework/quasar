<template>
  <div class="quasar-numeric textfield row inline items-center" :class="{disabled: disable}">
    <i @click="__setByOffset(-1)">remove</i>
    {{min}}-{{max}}={{value}}
    <input
      class="no-style auto quasar-input-field"
      type="text"
      v-model.number="model"
      @keydown.enter="__updateValue()"
      @blur="__updateValue()"
      @keydown.up="__setByOffset(1)"
      @keydown.down="__setByOffset(-1)"
      :disabled="disable"
      :style="{width: (''+model).length * .7 + 'em'}"
    >
    <i v-show="value !== model">check</i>
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
    disable: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value () {
      console.log('watching')
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
      return value
    },
    __updateValue () {
      this.model = this.__normalize(this.model)
      if (!this.disable && this.value !== this.model) {
        this.$emit('input', this.model)
      }
    },
    __setByOffset (direction) {
      if (!this.disable) {
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
    }
  },
  beforeUpdate () {
    this.__updateValue()
  },
  created () {
    this.__updateValue()
  }
}
</script>
