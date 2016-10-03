<template>
  <div class="quasar-numeric textfield row inline items-center" :class="{disabled: disable}">
    <i @click.native="setByOffset(-1)">remove</i>
    <input
      class="no-style auto"
      type="text"
      v-model.number="model"
      class="quasar-input-field"
      :style="{width: (''+model).length * .7 + 'em'}"
      v-attr="attrib"
    >
    <i @click.native="setByOffset(1)">add</i>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Number,
      default: 0,
      coerce: value => parseFloat(value, 10) || 0
    },
    step: {
      type: Number,
      default: 1,
      coerce: value => parseFloat(value, 10)
    },
    min: Number,
    max: Number,
    disable: {
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
  computed: {
    attrib () {
      return this.disable ? 'disabled' : []
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
      if (!this.disable) {
        this.model += direction * this.step
      }
    }
  }
}
</script>
