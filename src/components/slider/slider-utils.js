import { between } from '../../utils/format'
import { position } from '../../utils/event'
import TouchPan from '../../directives/touch-pan'

export function getPercentage (event, dragging) {
  return between((position(event).left - dragging.left) / dragging.width, 0, 1)
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

export let mixin = {
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
    decimals: {
      type: Number,
      default: 0
    },
    snap: Boolean,
    markers: Boolean,
    label: Boolean,
    labelAlways: Boolean,
    square: Boolean,
    color: String,
    fillHandleAlways: Boolean,
    error: Boolean,
    readonly: Boolean,
    disable: Boolean
  },
  data () {
    return {
      clickDisabled: false
    }
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
        'has-error': this.error
      }

      if (!this.error && this.color) {
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
        : this.color || 'primary'
    }
  },
  methods: {
    __pan (event) {
      if (event.isFinal) {
        this.clickDisabled = true
        this.$nextTick(() => {
          this.clickDisabled = false
        })
        this.__end(event.evt)
      }
      else if (event.isFirst) {
        this.__setActive(event.evt)
      }
      else if (this.dragging) {
        this.__update(event.evt)
      }
    },
    __click (event) {
      if (this.clickDisabled) {
        return
      }
      this.__setActive(event)
      this.__end(event)
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
          modifiers: { horizontal: true },
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
