import Vue from 'vue'

import DarkMixin from '../../mixins/dark.js'
import { getSizeMixin } from '../../mixins/size.js'
import { mergeSlot } from '../../utils/slot.js'

function width (val) {
  return { transform: `scale3d(${val},1,1)` }
}

export default Vue.extend({
  name: 'QLinearProgress',

  mixins: [
    DarkMixin,
    getSizeMixin({
      xs: 2,
      sm: 4,
      md: 6,
      lg: 10,
      xl: 14
    })
  ],

  props: {
    value: {
      type: Number,
      default: 0
    },
    buffer: Number,

    color: String,
    trackColor: String,

    reverse: Boolean,
    stripe: Boolean,
    indeterminate: Boolean,
    query: Boolean,
    rounded: Boolean
  },

  computed: {
    motion () {
      return this.indeterminate === true || this.query === true
    },

    classes () {
      return 'q-linear-progress' +
        (this.color !== void 0 ? ` text-${this.color}` : '') +
        (this.reverse === true || this.query === true ? ' q-linear-progress--reverse' : '') +
        (this.rounded === true ? ' rounded-borders' : '')
    },

    trackStyle () {
      return width(this.buffer !== void 0 ? this.buffer : 1)
    },

    trackClass () {
      return 'q-linear-progress__track--' + (this.isDark === true ? 'dark' : 'light') +
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
    const child = [
      h('div', {
        staticClass: 'q-linear-progress__track absolute-full',
        style: this.trackStyle,
        class: this.trackClass
      }),

      h('div', {
        staticClass: 'q-linear-progress__model absolute-full',
        style: this.modelStyle,
        class: this.modelClasses
      })
    ]

    this.stripe === true && this.motion === false && child.push(
      h('div', {
        staticClass: 'q-linear-progress__stripe absolute-full',
        style: this.stripeStyle
      })
    )

    return h('div', {
      style: this.sizeStyle,
      class: this.classes,
      on: this.$listeners
    }, mergeSlot(child, this, 'default'))
  }
})
