import { between } from '../../utils/format.js'
import { position } from '../../utils/event.js'
import TouchPan from '../../directives/TouchPan.js'

// PGDOWN, LEFT, DOWN, PGUP, RIGHT, UP
export const keyCodes = [34, 37, 40, 33, 39, 38]

export function getRatio (evt, dragging, reverse) {
  const
    pos = position(evt),
    val = between((pos.left - dragging.left) / dragging.width, 0, 1)

  return reverse === true ? 1.0 - val : val
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

    reverse: Boolean,

    disable: Boolean,
    readonly: Boolean,
    tabindex: [String, Number],

    thumbPath: {
      type: String,
      default: 'M 4, 10 a 6,6 0 1,0 12,0 a 6,6 0 1,0 -12,0'
    }
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
        (this.isReversed === true ? ' q-slider--reversed' : '') +
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

    isReversed () {
      return this.reverse !== (this.$q.lang.rtl === true)
    },

    horizProp () {
      return this.isReversed === true ? 'right' : 'left'
    }
  },

  methods: {
    __getThumbSvg (h) {
      return h('svg', {
        staticClass: 'q-slider__thumb absolute',
        attrs: { focusable: 'false' /* needed for IE11 */, viewBox: '0 0 20 20', width: '20', height: '20' }
      }, [
        h('path', {
          attrs: {
            d: this.thumbPath
          }
        })
      ])
    },

    __getPinStyle (percent, ratio) {
      const offset = `${Math.ceil(20 * Math.abs(0.5 - ratio))}px`
      return {
        pin: {
          transformOrigin: `${this.$q.lang.rtl === true ? offset : (this.$q.platform.is.ie === true ? '100%' : `calc(100% - ${offset})`)} 50%`
        },

        pinTextContainer: {
          [this.$q.lang.rtl === true ? 'left' : 'right']: `${percent * 100}%`,
          transform: `translateX(${Math.ceil((this.$q.lang.rtl === true ? -1 : 1) * 20 * percent)}px)`
        }
      }
    },

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
        this.__updateValue()
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
      this.__updateValue()

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
