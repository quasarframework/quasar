import { between } from '../../utils/format.js'
import { position } from '../../utils/event.js'
import TouchPan from '../../directives/touch-pan.js'

export function getPercentage (event, dragging, rtl) {
  const val = between((position(event).left - dragging.left) / dragging.width, 0, 1)
  return rtl ? 1.0 - val : val
}

export function notDivides (res, decimals) {
  let number = decimals
    ? parseFloat(res.toFixed(decimals))
    : res

  return number !== parseInt(number, 10)
}

export function getModel (percentage, min, max, step, decimals) {
  let
    model = min + percentage * (max - min),
    modulo = (model - min) % step

  model += (Math.abs(modulo) >= step / 2 ? (modulo < 0 ? -1 : 1) * step : 0) - modulo

  if (decimals) {
    model = parseFloat(model.toFixed(decimals))
  }

  return between(model, min, max)
}

export let SliderMixin = {
  directives: {
    TouchPan
  },
  props: {
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 5
    },
    step: {
      type: Number,
      default: 1
    },
    decimals: Number,
    snap: Boolean,
    markers: Boolean,
    label: Boolean,
    labelAlways: Boolean,
    square: Boolean,
    color: String,
    fillHandleAlways: Boolean,
    error: Boolean,
    warning: Boolean,
    readonly: Boolean,
    disable: Boolean
  },
  computed: {
    editable () {
      return !this.disable && !this.readonly
    },
    classes () {
      const cls = {
        disabled: this.disable,
        readonly: this.readonly,
        'label-always': this.labelAlways,
        'has-error': this.error,
        'has-warning': this.warning
      }

      if (!this.error && !this.warning && this.color) {
        cls[`text-${this.color}`] = true
      }

      return cls
    },
    markersLen () {
      return (this.max - this.min) / this.step + 1
    },
    labelColor () {
      return this.error
        ? 'negative'
        : (this.warning ? 'warning' : (this.color || 'primary'))
    },
    computedDecimals () {
      return this.decimals !== void 0 ? this.decimals || 0 : (String(this.step).trim('0').split('.')[1] || '').length
    },
    computedStep () {
      return this.decimals !== void 0 ? 1 / Math.pow(10, this.decimals || 0) : this.step
    }
  },
  methods: {
    __pan (event) {
      if (event.isFinal) {
        if (this.dragging) {
          this.dragTimer = setTimeout(() => {
            this.dragging = false
          }, 100)
          this.__end(event.evt)
          this.__update(true)
        }
      }
      else if (event.isFirst) {
        clearTimeout(this.dragTimer)
        this.dragging = this.__getDragging(event.evt)
      }
      else if (this.dragging) {
        this.__move(event.evt)
        this.__update()
      }
    },
    __update (change) {
      if (JSON.stringify(this.model) === JSON.stringify(this.value)) {
        return
      }
      this.$emit('input', this.model)
      if (change) {
        this.$nextTick(() => {
          if (JSON.stringify(this.model) !== JSON.stringify(this.value)) {
            this.$emit('change', this.model)
          }
        })
      }
    },
    __click (event) {
      if (!this.dragging) {
        const dragging = this.__getDragging(event)
        if (dragging) {
          this.__end(event, dragging)
          this.__update(true)
        }
      }
    },
    __getMarkers (h) {
      if (!this.markers) {
        return
      }

      const markers = []

      for (let i = 0; i < this.markersLen; i++) {
        markers.push(h('div', {
          staticClass: 'q-slider-mark',
          key: `marker${i}`,
          style: {
            left: `${i * 100 * this.step / (this.max - this.min)}%`
          }
        }))
      }

      return markers
    }
  },
  created () {
    this.__validateProps()
  },
  render (h) {
    return h('div', {
      staticClass: 'q-slider non-selectable',
      'class': this.classes,
      on: this.editable ? { click: this.__click } : null,
      directives: this.editable
        ? [{
          name: 'touch-pan',
          modifiers: {
            horizontal: true,
            prevent: true,
            stop: true
          },
          value: this.__pan
        }]
        : null
    }, [
      h('div', {
        ref: 'handle',
        staticClass: 'q-slider-handle-container'
      }, [
        h('div', { staticClass: 'q-slider-track' }),
        this.__getMarkers(h)
      ].concat(this.__getContent(h)))
    ])
  }
}
