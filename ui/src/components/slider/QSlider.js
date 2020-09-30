import { h, defineComponent, withDirectives } from 'vue'

import {
  getRatio,
  getModel,
  SliderMixin,
  keyCodes
} from './slider-utils.js'

import { between } from '../../utils/format.js'
import { stopAndPrevent } from '../../utils/event.js'

export default defineComponent({
  name: 'QSlider',

  mixins: [ SliderMixin ],

  props: {
    modelValue: {
      required: true,
      default: null,
      validator: v => typeof v === 'number' || v === null
    },

    labelValue: [ String, Number ]
  },

  emits: [ 'update:modelValue' ],

  data () {
    return {
      model: this.modelValue === null ? this.min : this.modelValue,
      curRatio: 0
    }
  },

  watch: {
    modelValue (v) {
      this.model = v === null
        ? 0
        : between(v, this.min, this.max)
    },

    min (v) {
      this.model = between(this.model, v, this.max)
    },

    max (v) {
      this.model = between(this.model, this.min, v)
    }
  },

  computed: {
    ratio () {
      return this.active === true ? this.curRatio : this.modelRatio
    },

    modelRatio () {
      return (this.model - this.min) / (this.max - this.min)
    },

    trackStyle () {
      return {
        [ this.positionProp ]: 0,
        [ this.sizeProp ]: `${100 * this.ratio}%`
      }
    },

    thumbStyle () {
      return {
        [ this.positionProp ]: `${100 * this.ratio}%`
      }
    },

    thumbClass () {
      return this.preventFocus === false && this.focus === true
        ? ' q-slider--focus'
        : ''
    },

    pinClass () {
      return this.labelColor !== void 0
        ? `text-${this.labelColor}`
        : ''
    },

    pinTextClass () {
      return 'q-slider__pin-value-marker-text' +
        (this.labelTextColor !== void 0 ? ` text-${this.labelTextColor}` : '')
    },

    events () {
      if (this.editable === true) {
        return this.$q.platform.is.mobile === true
          ? { onClick: this.__mobileClick }
          : {
            onMousedown: this.__activate,
            onFocus: this.__focus,
            onBlur: this.__blur,
            onKeydown: this.__keydown,
            onKeyup: this.__keyup
          }
      }
    },

    computedLabel () {
      return this.labelValue !== void 0
        ? this.labelValue
        : this.model
    },

    pinStyle () {
      const percent = (this.reverse === true ? -this.ratio : this.ratio - 1)
      return this.__getPinStyle(percent, this.ratio)
    }
  },

  methods: {
    __updateValue (change) {
      if (this.model !== this.modelValue) {
        this.$emit('update:modelValue', this.model)
      }
      // TODO vue3 - handle lazy update
      // change === true && this.$emit('change', this.model)
    },

    __getDragging () {
      return this.$el.getBoundingClientRect()
    },

    __updatePosition (event, dragging = this.dragging) {
      const ratio = getRatio(
        event,
        dragging,
        this.isReversed,
        this.vertical
      )

      this.model = getModel(ratio, this.min, this.max, this.step, this.decimals)
      this.curRatio = this.snap !== true || this.step === 0
        ? ratio
        : (this.model - this.min) / (this.max - this.min)
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
        this.min,
        this.max
      )

      this.__updateValue()
    }
  },

  render () {
    const child = [
      this.__getThumbSvg(),
      h('div', { class: 'q-slider__focus-ring' })
    ]

    if (this.label === true || this.labelAlways === true) {
      child.push(
        h('div', {
          class: `q-slider__pin q-slider__pin${this.axis} absolute ` + this.pinClass,
          style: this.pinStyle.pin
        }, [
          h('div', {
            class: `q-slider__pin-text-container q-slider__pin-text-container${this.axis}`,
            style: this.pinStyle.pinTextContainer
          }, [
            h('span', {
              class: 'q-slider__pin-text ' + this.pinTextClass
            }, [
              this.computedLabel
            ])
          ])
        ]),

        h('div', {
          class: `q-slider__arrow q-slider__arrow${this.axis} ${this.pinClass}`
        })
      )
    }

    if (this.name !== void 0 && this.disable !== true) {
      this.__injectFormInput(child, 'push')
    }

    const track = [
      h('div', {
        class: `q-slider__track q-slider__track${this.axis} absolute`,
        style: this.trackStyle
      })
    ]

    this.markers === true && track.push(
      h('div', {
        class: `q-slider__track-markers q-slider__track-markers${this.axis} absolute-full fit`,
        style: this.markerStyle
      })
    )

    const node = h('div', {
      class: this.classes + (this.modelValue === null ? ' q-slider--no-value' : ''),
      ...this.attrs,
      'aria-valuenow': this.modelValue,
      tabindex: this.computedTabindex,
      ...this.events
    }, [
      h('div', {
        class: `q-slider__track-container q-slider__track-container${this.axis} absolute`
      }, track),

      h('div', {
        class: `q-slider__thumb-container q-slider__thumb-container${this.axis} absolute non-selectable` + this.thumbClass,
        style: this.thumbStyle
      }, child)
    ])

    return withDirectives(node, this.panDirective)
  }
})
