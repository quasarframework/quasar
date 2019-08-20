import Vue from 'vue'

import slot from '../../utils/slot.js'

function width (val) {
  return { transform: `scale3d(${val},1,1)` }
}

const sizes = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 10,
  xl: 14
}

export default Vue.extend({
  name: 'QLinearProgress',

  props: {
    value: {
      type: Number,
      default: 0
    },
    buffer: Number,

    size: String,

    color: String,
    trackColor: String,
    dark: Boolean,

    reverse: Boolean,
    stripe: Boolean,
    indeterminate: Boolean,
    query: Boolean,
    rounded: Boolean
  },

  computed: {
    sizeStyle () {
      if (this.size !== void 0) {
        return { height: this.size in sizes ? `${sizes[this.size]}px` : this.size }
      }
    },

    motion () {
      return this.indeterminate || this.query
    },

    classes () {
      return {
        [`text-${this.color}`]: this.color !== void 0,
        'q-linear-progress--reverse': this.reverse === true || this.query === true,
        'rounded-borders': this.rounded === true
      }
    },

    trackStyle () {
      return width(this.buffer !== void 0 ? this.buffer : 1)
    },

    trackClass () {
      return 'q-linear-progress__track--' + (this.dark === true ? 'dark' : 'light') +
        (this.trackColor !== void 0 ? ` bg-${this.trackColor}` : '')
    },

    modelStyle () {
      return width(this.motion ? 1 : this.value)
    },

    modelClasses () {
      return `q-linear-progress__model--${this.motion ? 'in' : ''}determinate`
    },

    stripeStyle () {
      return { width: (this.value * 100) + '%' }
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-linear-progress',
      style: this.sizeStyle,
      class: this.classes,
      on: this.$listeners
    }, [
      h('div', {
        staticClass: 'q-linear-progress__track absolute-full',
        style: this.trackStyle,
        class: this.trackClass
      }),

      h('div', {
        staticClass: 'q-linear-progress__model absolute-full',
        style: this.modelStyle,
        class: this.modelClasses
      }),

      this.stripe === true && this.motion === false ? h('div', {
        staticClass: 'q-linear-progress__stripe absolute-full',
        style: this.stripeStyle
      }) : null
    ].concat(slot(this, 'default')))
  }
})
