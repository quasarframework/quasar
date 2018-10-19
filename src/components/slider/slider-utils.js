import { between } from '../../utils/format.js'
import { position } from '../../utils/event.js'
import TouchPan from '../../directives/touch-pan.js'

export function getRatio (evt, dragging, rtl) {
  const
    pos = position(evt),
    val = between((pos.left - dragging.left) / dragging.width, 0, 1)

  return rtl ? 1.0 - val : val
}

export function getModel (ratio, min, max, step, decimals) {
  let model = min + ratio * (max - min)

  if (step > 0) {
    const modulo = (model - min) % step
    model += (Math.abs(modulo) >= step / 2 ? (modulo < 0 ? -1 : 1) * step : 0) - modulo
  }

  if (decimals > 0) {
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
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1,
      validator: v => v >= 0
    },

    color: String,

    label: Boolean,
    labelAlways: Boolean,
    markers: Boolean,

    disable: Boolean,
    readonly: Boolean,
    tabindex: {
      type: [String, Number],
      default: 0
    }
  },

  computed: {
    editable () {
      return !this.disable && !this.readonly
    },

    decimals () {
      return (String(this.step).trim('0').split('.')[1] || '').length
    },

    computedTabindex () {
      return this.editable ? this.tabindex : -1
    }
  },

  methods: {
    __pan (event) {
      if (event.isFinal) {
        if (this.dragging) {
          this.dragTimer = setTimeout(() => {
            this.dragging = false
          }, 100)
          this.__updatePosition(event.evt)
          this.curRatio = (this.model - this.min) / (this.max - this.min)
          this.__updateValue(true)
        }
      }
      else if (event.isFirst) {
        clearTimeout(this.dragTimer)
        this.dragging = this.$el.getBoundingClientRect()
      }
      else if (this.dragging) {
        this.__updatePosition(event.evt)
        this.__updateValue()
      }
    }
  },

  beforeDestroy () {
    clearTimeout(this.dragTimer)
    this.__deactivate()
  }
}
