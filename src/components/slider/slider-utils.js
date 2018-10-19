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
    dark: Boolean,

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

  data () {
    return {
      active: false,
      preventFocus: false,
      focus: false
    }
  },

  computed: {
    classes () {
      return {
        [`text-${this.color}`]: this.color,
        [`q-slider--${this.active ? 'active' : 'animated'}`]: true,
        'q-slider--disable': this.disable,
        'q-slider--focus': this.preventFocus === false && this.focus,
        'q-slider--label': this.label || this.labelAlways,
        'q-slider--label-always': this.labelAlways,
        'q-slider--dark': this.dark
      }
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

    events () {
      if (this.editable) {
        return this.$q.platform.is.mobile
          ? { click: this.__mobileClick }
          : {
            mousedown: this.__activate,
            touchstart: this.__activate,
            focus: this.__focus,
            blur: this.__blur,
            keydown: this.__keydown,
            keyup: this.__keyup
          }
      }
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
          this.__updateValue(true)
        }
        if (this.$q.platform.is.mobile) {
          this.active = false
        }
      }
      else if (event.isFirst) {
        clearTimeout(this.dragTimer)
        this.dragging = this.__getDragging(event.evt)
        if (this.$q.platform.is.mobile) {
          this.active = true
        }
      }
      else if (this.dragging) {
        this.__updatePosition(event.evt)
        this.__updateValue()
      }
    },

    __mobileClick (evt) {
      this.__updatePosition(evt, this.__getDragging(evt))
      this.__updateValue(true)
    },

    __activate (evt) {
      this.preventFocus = true
      this.active = true

      this.__updatePosition(evt, this.__getDragging(evt))

      document.body.addEventListener('mouseup', this.__deactivate)
      document.body.addEventListener('touchend', this.__deactivate)
    },

    __deactivate () {
      this.preventFocus = false
      this.active = false

      this.__updateValue(true)

      document.body.removeEventListener('mouseup', this.__deactivate)
      document.body.removeEventListener('touchend', this.__deactivate)
    },

    __focus () {
      this.focus = true
    },

    __blur () {
      this.focus = false
    },

    __keyup (evt) {
      if ([37, 40, 39, 38].includes(evt.keyCode)) {
        this.__updateValue(true)
      }
    }
  },

  beforeDestroy () {
    clearTimeout(this.dragTimer)
    this.__deactivate()
  }
}
