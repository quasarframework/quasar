import { between } from '../../utils/format'

function width (val) {
  return { width: `${val}%` }
}

export default {
  name: 'QProgress',
  props: {
    percentage: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: 'primary'
    },
    stripe: Boolean,
    animate: Boolean,
    indeterminate: Boolean,
    buffer: Number,
    height: {
      type: String,
      default: '4px'
    }
  },
  computed: {
    model () {
      return between(this.percentage, 0, 100)
    },
    bufferModel () {
      return between(this.buffer || 0, 0, 100 - this.model)
    },
    bufferStyle () {
      return width(this.bufferModel)
    },
    trackStyle () {
      return width(this.buffer ? 100 - this.buffer : 100)
    },
    computedClass () {
      return `text-${this.color}`
    },
    computedStyle () {
      return { height: this.height }
    },
    modelClass () {
      return {
        animate: this.animate,
        stripe: this.stripe,
        indeterminate: this.indeterminate
      }
    },
    modelStyle () {
      return width(this.model)
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-progress',
      style: this.computedStyle,
      'class': this.computedClass
    }, [
      this.buffer && !this.indeterminate
        ? h('div', {
          staticClass: 'q-progress-buffer',
          style: this.bufferStyle
        })
        : null,

      h('div', {
        staticClass: 'q-progress-track',
        style: this.trackStyle
      }),

      h('div', {
        staticClass: 'q-progress-model',
        style: this.modelStyle,
        'class': this.modelClass
      })
    ])
  }
}
