import { between } from '../../utils/format'
import { position } from '../../utils/event'

export function getPercentage (event, dragging) {
  return between((position(event).left - dragging.left) / dragging.width, 0, 1)
}

export function precision (number, decimals) {
  return decimals > 0
    ? parseFloat(number.toFixed(decimals))
    : number
}

export function getModel (percentage, min, max, step, decimals) {
  let
    model = precision(min + percentage * (max - min), decimals),
    modulo = precision((model - min) % step, decimals)

  return between(
    model - modulo + (Math.abs(modulo) >= step / 2 ? (modulo < 0 ? -1 : 1) * step : 0),
    min,
    max
  )
}

export let mixin = {
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
    disable: Boolean
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
