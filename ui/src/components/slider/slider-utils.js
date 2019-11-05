import { between } from '../../utils/format.js'
import { position } from '../../utils/event.js'
import TouchPan from '../../directives/TouchPan.js'

// PGDOWN, LEFT, DOWN, PGUP, RIGHT, UP
export const keyCodes = [34, 37, 40, 33, 39, 38]

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

import DarkMixin from '../../mixins/dark.js'

export let SliderMixin = {
  mixins: [ DarkMixin ],

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

    labelColor: String,
    labelTextColor: String,
    dense: Boolean,

    label: Boolean,
    labelAlways: Boolean,
    markers: Boolean,
    snap: Boolean,

    disable: Boolean,
    readonly: Boolean,
    tabindex: [String, Number]
  },

  data () {
    return {
      active: false,
      preventFocus: false,
      focus: false
    }
  },

  computed: {
    classes () {
      return `q-slider q-slider--${this.active === true ? '' : 'in'}active` +
        (this.color !== void 0 ? ` text-${this.color}` : '') +
        (this.disable === true ? ' disabled' : '') +
        (this.editable === true ? ' q-slider--editable' : '') +
        (this.focus === 'both' ? ' q-slider--focus' : '') +
        (this.label || this.labelAlways === true ? ' q-slider--label' : '') +
        (this.labelAlways === true ? ' q-slider--label-always' : '') +
        (this.isDark === true ? ' q-slider--dark' : '') +
        (this.dense === true ? ' q-slider--dense' : '')
    },

    editable () {
      return !this.disable && !this.readonly
    },

    decimals () {
      return (String(this.step).trim('0').split('.')[1] || '').length
    },

    computedStep () {
      return this.step === 0 ? 1 : this.step
    },

    markerStyle () {
      return {
        backgroundSize: 100 * this.computedStep / (this.max - this.min) + '% 2px'
      }
    },

    computedTabindex () {
      return this.editable === true ? this.tabindex || 0 : -1
    },

    horizProp () {
      return this.$q.lang.rtl === true ? 'right' : 'left'
    }
  },

  methods: {
    __pan (event) {
      if (event.isFinal) {
        if (this.dragging) {
          this.__updatePosition(event.evt)
          // only if touch, because we also have mousedown/up:
          event.touch === true && this.__updateValue(true)
          this.dragging = false
        }
        this.active = false
      }
      else if (event.isFirst) {
        this.dragging = this.__getDragging(event.evt)
        this.__updatePosition(event.evt)
        this.active = true
      }
      else {
        this.__updatePosition(event.evt)
        this.__updateValue()
      }
    },

    __blur () {
      this.focus = false
    },

    __activate (evt) {
      this.__updatePosition(evt, this.__getDragging(evt))

      this.preventFocus = true
      this.active = true

      document.addEventListener('mouseup', this.__deactivate, true)
    },

    __deactivate () {
      this.preventFocus = false
      this.active = false

      this.__updateValue(true)
      this.__blur()

      document.removeEventListener('mouseup', this.__deactivate, true)
    },

    __mobileClick (evt) {
      this.__updatePosition(evt, this.__getDragging(evt))
      this.__updateValue(true)
    },

    __keyup (evt) {
      if (keyCodes.includes(evt.keyCode)) {
        this.__updateValue(true)
      }
    }
  },

  beforeDestroy () {
    document.removeEventListener('mouseup', this.__deactivate, true)
  }
}
