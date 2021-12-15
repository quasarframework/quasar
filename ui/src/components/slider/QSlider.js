import Vue from 'vue'

import {
  getRatio,
  getModel,
  SliderMixin,
  keyCodes
} from './slider-utils.js'

import { between } from '../../utils/format.js'
import { stopAndPrevent } from '../../utils/event.js'

export default Vue.extend({
  name: 'QSlider',

  mixins: [ SliderMixin ],

  props: {
    value: {
      required: true,
      default: null,
      validator: v => typeof v === 'number' || v === null
    },

    labelValue: [ String, Number ]
  },

  data () {
    const minModel = isNaN(this.innerMin) === true || this.innerMin < this.min
      ? this.min
      : this.innerMin
    const model = this.value === null ? minModel : between(this.value, this.min, this.max)

    return {
      model,
      curRatio: 0
    }
  },

  watch: {
    value (val) {
      const model = val === null
        ? this.minInnerValue
        : between(val, this.min, this.max)

      if (this.model !== model) {
        this.model = model

        this.curRatio = this.__getModelRatio(model)
      }
    },

    min (val) {
      this.model = between(this.model, val, this.max)
    },

    max (val) {
      this.model = between(this.model, this.min, val)
    }
  },

  computed: {
    ratio () {
      return this.active === true ? this.curRatio : this.modelRatio
    },

    modelRatio () {
      return this.__getModelRatio(this.model)
    },

    trackStyle () {
      if (this.innerTrack !== true) {
        return {
          [ this.positionProp ]: 0,
          [ this.sizeProp ]: `${100 * between(this.ratio, 0, 1)}%`
        }
      }

      const minRatio = between(this.minInnerRatio, 0, 1)

      return {
        [ this.positionProp ]: `${100 * minRatio}%`,
        [ this.sizeProp ]: `${100 * (between(this.ratio, minRatio, Math.min(1, this.maxInnerRatio)) - minRatio)}%`
      }
    },

    thumbStyle () {
      return {
        [ this.positionProp ]: `${100 * this.ratio}%`
      }
    },

    thumbClass () {
      if (this.preventFocus === false && this.focus === true) {
        return 'q-slider--focus'
      }
    },

    pinClass () {
      if (this.labelColor !== void 0) {
        return `text-${this.labelColor}`
      }
    },

    pinTextClass () {
      return 'q-slider__pin-value-marker-text' +
        (this.labelTextColor !== void 0 ? ` text-${this.labelTextColor}` : '')
    },

    pinStyle () {
      const percent = (this.reverse === true ? -this.ratio : this.ratio - 1)
      return this.__getPinStyle(percent, this.ratio)
    },

    computedLabel () {
      return this.labelValue !== void 0
        ? this.labelValue
        : (this.value === null ? this.model : this.value)
    },

    events () {
      if (this.editable === true) {
        return this.$q.platform.is.mobile === true
          ? { click: this.__mobileClick }
          : {
            mousedown: this.__activate,
            focus: this.__focus,
            blur: this.__blur,
            keydown: this.__keydown,
            keyup: this.__keyup
          }
      }
    }
  },

  methods: {
    __updateValue (change) {
      if (this.model !== this.value) {
        this.$emit('input', this.model)
      }
      change === true && this.$emit('change', this.model)
    },

    __getDragging () {
      return this.$el.getBoundingClientRect()
    },

    __updatePosition (event, dragging = this.dragging) {
      const ratio = between(
        getRatio(event, dragging, this.isReversed, this.vertical),
        this.minInnerRatio,
        this.maxInnerRatio
      )

      this.model = between(
        getModel(ratio, this.min, this.max, this.step, this.decimals),
        this.minInnerValue,
        this.maxInnerValue
      )

      this.curRatio = this.snap !== true || this.step === 0
        ? ratio
        : this.__getModelRatio(this.model)
    },

    __focus () {
      this.focus = true
    },

    __keydown (evt) {
      if (!keyCodes.includes(evt.keyCode)) {
        return
      }

      stopAndPrevent(evt)

      const
        step = ([34, 33].includes(evt.keyCode) ? 10 : 1) * this.computedStep,
        offset = [34, 37, 40].includes(evt.keyCode) ? -step : step

      this.model = between(
        parseFloat((this.model + offset).toFixed(this.decimals)),
        this.minInnerValue,
        this.maxInnerValue
      )

      this.__updateValue()
    },

    __getThumb (h) {
      if (this.ratio < 0 || this.ratio > 1) {
        return
      }

      const child = [
        this.__getThumbSvg(h, this.value < this.min || this.value > this.max),
        h('div', { staticClass: 'q-slider__focus-ring' })
      ]

      if (this.label === true || this.labelAlways === true) {
        child.push(
          h('div', {
            staticClass: `q-slider__pin q-slider__pin${this.axis} absolute`,
            style: this.pinStyle.pin,
            class: this.pinClass
          }, [
            h('div', {
              staticClass: `q-slider__pin-text-container q-slider__pin-text-container${this.axis}`,
              style: this.pinStyle.pinTextContainer
            }, [
              h('span', {
                staticClass: 'q-slider__pin-text',
                class: this.pinTextClass
              }, [
                this.computedLabel
              ])
            ])
          ]),

          h('div', {
            staticClass: `q-slider__arrow q-slider__arrow${this.axis}`,
            class: this.pinClass
          })
        )
      }

      return h('div', {
        staticClass: `q-slider__thumb-container q-slider__thumb-container${this.axis} absolute non-selectable`,
        class: this.thumbClass,
        style: this.thumbStyle
      }, child)
    }
  },

  render (h) {
    const child = [
      h('div', {
        staticClass: `q-slider__track-container q-slider__track-container${this.axis} absolute`
      }, this.__getTrack(h)),

      this.__getThumb(h)
    ]

    if (this.name !== void 0 && this.disable !== true) {
      this.__injectFormInput(child, 'push')
    }

    return h('div', {
      staticClass: this.value === null
        ? ' q-slider--no-value'
        : void 0,
      attrs: {
        ...this.attrs,
        'aria-valuenow': this.value,
        tabindex: this.computedTabindex
      },
      class: this.classes,
      on: this.events,
      directives: this.panDirectives
    }, child)
  }
})
