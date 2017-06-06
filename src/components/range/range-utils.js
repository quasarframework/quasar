import { between } from '../../utils/format'
import { position } from '../../utils/event'
import { QChip } from '../chip'

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
  components: {
    QChip
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
    error: Boolean,
    disable: Boolean
  },
  computed: {
    classes () {
      const cls = {
        disabled: this.disable,
        'label-always': this.labelAlways,
        'has-error': this.error
      }

      if (!this.error && this.color) {
        cls[`text-${this.color}`] = true
      }

      return cls
    },
    labelColor () {
      return this.error
        ? 'negative'
        : this.color || 'primary'
    }
  },
  methods: {
    __pan (event) {
      if (this.disable) {
        return
      }
      if (event.isFinal) {
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
      if (this.disable) {
        return
      }
      this.__setActive(event)
      this.__end(event)
    }
  },
  created () {
    this.__validateProps()
  }
}
