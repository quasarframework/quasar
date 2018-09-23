import { between } from '../../utils/format.js'

function width (val) {
  return { width: `${val}%` }
}

export default {
  name: 'QLinearProgress',

  props: {
    value: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: 'primary'
    },
    fillColor: String,
    reverse: Boolean,
    stripe: Boolean,
    animate: Boolean,
    indeterminate: Boolean,
    query: Boolean,
    buffer: Number,
    height: {
      type: String,
      default: '4px'
    }
  },

  computed: {
    model () {
      return between(this.value, 0, 100)
    },

    bufferModel () {
      return between(this.buffer || 0, 0, 100 - this.model)
    },

    bufferStyle () {
      return width(this.bufferModel)
    },

    trackStyle () {
      return width(100 - (this.buffer || 0))
    },

    trackClass () {
      if (this.fillColor) {
        return `text-${this.fillColor}`
      }
    },

    computedClass () {
      return `text-${this.color}${this.reverse || this.query ? ' q-linear-progress--reverse' : ''}`
    },

    computedStyle () {
      return { height: this.height }
    },

    modelClass () {
      const motion = this.indeterminate || this.query
      return {
        'q-linear-progress__model--animate': this.animate,
        'q-linear-progress__model--stripe': this.stripe,
        'q-linear-progress__model--determinate': !motion,
        'q-linear-progress__model--indeterminate': motion
      }
    },

    modelStyle () {
      return width(this.model)
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-linear-progress',
      style: this.computedStyle,
      'class': this.computedClass
    }, [
      h('div', {
        staticClass: 'q-linear-progress__track',
        'class': this.trackClass,
        style: this.trackStyle
      }),

      h('div', {
        staticClass: 'q-linear-progress__model',
        style: this.modelStyle,
        'class': this.modelClass
      })
    ])
  }
}
