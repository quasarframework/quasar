import Vue from 'vue'

import {
  getRatio,
  getModel,
  SliderMixin,
  keyCodes
} from '../slider/slider-utils.js'

import { between } from '../../utils/format.js'
import { stopAndPrevent } from '../../utils/event.js'

const dragType = {
  MIN: 0,
  RANGE: 1,
  MAX: 2
}

export default Vue.extend({
  name: 'QRange',

  mixins: [ SliderMixin ],

  props: {
    value: {
      type: Object,
      default: () => ({
        min: null,
        max: null
      }),
      validator (val) {
        return 'min' in val && 'max' in val
      }
    },

    dragRange: Boolean,
    dragOnlyRange: Boolean,

    leftLabelColor: String,
    leftLabelTextColor: String,
    rightLabelColor: String,
    rightLabelTextColor: String,

    leftLabelValue: [ String, Number ],
    rightLabelValue: [ String, Number ]
  },

  data () {
    const minModel = isNaN(this.innerMin) === true || this.innerMin < this.min
      ? this.min
      : this.innerMin
    const maxModel = isNaN(this.innerMax) === true || this.innerMax > this.max
      ? this.max
      : this.innerMax
    const min = this.value.min === null ? minModel : between(this.value.min, this.min, this.max)
    const max = this.value.max === null ? maxModel : between(this.value.max, this.min, this.max)

    return {
      model: { min, max },
      curMinRatio: 0,
      curMaxRatio: 0
    }
  },

  watch: {
    'value.min' (val) {
      const model = val === null
        ? this.min
        : between(val, this.min, this.max)

      if (this.model.min !== model) {
        this.model.min = model

        this.curMinRatio = this.__getModelRatio(model)
      }
    },

    'value.max' (val) {
      const model = val === null
        ? this.max
        : between(val, this.min, this.max)

      if (this.model.max !== model) {
        this.model.max = model

        this.curMaxRatio = this.__getModelRatio(model)
      }
    },

    min (val) {
      if (this.model.min < val) {
        this.model.min = val
      }
      if (this.model.max < val) {
        this.model.max = val
      }
    },

    max (val) {
      if (this.model.min > val) {
        this.model.min = val
      }
      if (this.model.max > val) {
        this.model.max = val
      }
    }
  },

  computed: {
    minRatio () {
      return this.active === true ? this.curMinRatio : this.modelMinRatio
    },

    maxRatio () {
      return this.active === true ? this.curMaxRatio : this.modelMaxRatio
    },

    modelMinRatio () {
      return this.__getModelRatio(this.model.min)
    },

    modelMaxRatio () {
      return this.__getModelRatio(this.model.max)
    },

    trackStyle () {
      if (this.innerTrack !== true) {
        const minRatio = between(this.minRatio, 0, 1)

        return {
          [ this.positionProp ]: `${100 * minRatio}%`,
          [ this.sizeProp ]: `${100 * (between(this.maxRatio, minRatio, 1) - minRatio)}%`
        }
      }

      const minRatio = between(Math.max(this.minRatio, this.minInnerRatio), 0, 1)

      return {
        [ this.positionProp ]: `${100 * minRatio}%`,
        [ this.sizeProp ]: `${100 * (between(this.maxRatio, minRatio, Math.min(1, this.maxInnerRatio)) - minRatio)}%`
      }
    },

    minThumbStyle () {
      return {
        [ this.positionProp ]: `${100 * this.minRatio}%`,
        'z-index': this.__nextFocus === 'min' ? 2 : void 0
      }
    },

    maxThumbStyle () {
      return {
        [ this.positionProp ]: `${100 * this.maxRatio}%`
      }
    },

    minThumbClass () {
      if (this.preventFocus === false && this.focus === 'min') {
        return 'q-slider--focus'
      }
    },

    maxThumbClass () {
      if (this.preventFocus === false && this.focus === 'max') {
        return 'q-slider--focus'
      }
    },

    minPinClass () {
      const color = this.leftLabelColor || this.labelColor
      if (color) {
        return `text-${color}`
      }
    },

    minPinTextClass () {
      const color = this.leftLabelTextColor || this.labelTextColor
      if (color) {
        return `text-${color}`
      }
    },

    maxPinClass () {
      const color = this.rightLabelColor || this.labelColor
      if (color) {
        return `text-${color}`
      }
    },

    maxPinTextClass () {
      const color = this.rightLabelTextColor || this.labelTextColor
      if (color) {
        return `text-${color}`
      }
    },

    minPinStyle () {
      const percent = (this.reverse === true ? -this.minRatio : this.minRatio - 1)
      return this.__getPinStyle(percent, this.minRatio)
    },

    maxPinStyle () {
      const percent = (this.reverse === true ? -this.maxRatio : this.maxRatio - 1)
      return this.__getPinStyle(percent, this.maxRatio)
    },

    minComputedLabel () {
      return this.leftLabelValue !== void 0
        ? this.leftLabelValue
        : (this.value.min === null ? this.model.min : this.value.min)
    },

    maxComputedLabel () {
      return this.rightLabelValue !== void 0
        ? this.rightLabelValue
        : (this.value.max === null ? this.model.max : this.value.max)
    },

    events () {
      if (this.editable === true) {
        if (this.$q.platform.is.mobile === true) {
          return { click: this.__mobileClick }
        }

        const evt = { mousedown: this.__activate }

        this.dragOnlyRange === true && Object.assign(evt, {
          focus: () => { this.__focus('both') },
          blur: this.__blur,
          keydown: this.__keydown,
          keyup: this.__keyup
        })

        return evt
      }
    },

    minEvents () {
      if (this.editable === true && this.$q.platform.is.mobile !== true && this.dragOnlyRange !== true) {
        return {
          focus: () => { this.__focus('min') },
          blur: this.__blur,
          keydown: this.__keydown,
          keyup: this.__keyup
        }
      }
    },

    maxEvents () {
      if (this.editable === true && this.$q.platform.is.mobile !== true && this.dragOnlyRange !== true) {
        return {
          focus: () => { this.__focus('max') },
          blur: this.__blur,
          keydown: this.__keydown,
          keyup: this.__keyup
        }
      }
    },

    formAttrs () {
      return {
        type: 'hidden',
        name: this.name,
        value: `${this.value.min}|${this.value.max}`
      }
    }
  },

  methods: {
    __updateValue (change) {
      if (this.model.min !== this.value.min || this.model.max !== this.value.max) {
        this.$emit('input', this.model)
      }
      change === true && this.$emit('change', this.model)
    },

    __getDragging (event) {
      const
        { left, top, width, height } = this.$el.getBoundingClientRect(),
        thumb = this.$refs.minThumb || this.$refs.maxThumb,
        sensitivity = this.dragOnlyRange === true || thumb === void 0
          ? 0
          : (this.vertical === true
            ? thumb.offsetHeight / (2 * height)
            : thumb.offsetWidth / (2 * width)
          ) + (Math.min(1, Math.max(0, this.modelMaxRatio)) - Math.min(1, Math.max(0, this.modelMinRatio))) / 15

      const dragging = {
        left,
        top,
        width,
        height,
        minValue: this.model.min,
        maxValue: this.model.max,
        minRatio: this.modelMinRatio,
        maxRatio: this.modelMaxRatio
      }

      const ratio = getRatio(event, dragging, this.isReversed, this.vertical)
      let type

      if (this.dragOnlyRange !== true && ratio < dragging.minRatio + sensitivity) {
        type = dragType.MIN
      }
      else if (this.dragOnlyRange === true || ratio < dragging.maxRatio - sensitivity) {
        if (this.dragRange === true || this.dragOnlyRange === true) {
          type = dragType.RANGE
          Object.assign(dragging, {
            offsetRatio: ratio,
            offsetModel: getModel(ratio, this.min, this.max, this.step, this.decimals),
            rangeValue: dragging.maxValue - dragging.minValue,
            rangeRatio: dragging.maxRatio - dragging.minRatio
          })
        }
        else {
          type = dragging.maxRatio - ratio < ratio - dragging.minRatio
            ? dragType.MAX
            : dragType.MIN
        }
      }
      else {
        type = dragType.MAX
      }

      dragging.type = type
      this.__nextFocus = void 0

      return dragging
    },

    __updatePosition (event, dragging = this.dragging) {
      const
        ratio = getRatio(event, dragging, this.isReversed, this.vertical),
        model = getModel(ratio, this.min, this.max, this.step, this.decimals)
      let pos

      switch (dragging.type) {
        case dragType.MIN:
          if (ratio <= dragging.maxRatio) {
            pos = {
              minR: ratio,
              maxR: dragging.maxRatio,
              min: model,
              max: dragging.maxValue
            }
            this.__nextFocus = 'min'
          }
          else {
            pos = {
              minR: dragging.maxRatio,
              maxR: ratio,
              min: dragging.maxValue,
              max: model
            }
            this.__nextFocus = 'max'
          }
          break

        case dragType.MAX:
          if (ratio >= dragging.minRatio) {
            pos = {
              minR: dragging.minRatio,
              maxR: ratio,
              min: dragging.minValue,
              max: model
            }
            this.__nextFocus = 'max'
          }
          else {
            pos = {
              minR: ratio,
              maxR: dragging.minRatio,
              min: model,
              max: dragging.minValue
            }
            this.__nextFocus = 'min'
          }
          break

        case dragType.RANGE:
          const
            ratioDelta = ratio - dragging.offsetRatio,
            minR = between(dragging.minRatio + ratioDelta, this.minInnerRatio, this.maxInnerRatio - dragging.rangeRatio),
            modelDelta = model - dragging.offsetModel,
            min = between(dragging.minValue + modelDelta, this.minInnerValue, this.maxInnerValue - dragging.rangeValue)

          pos = {
            minR,
            maxR: minR + dragging.rangeRatio,
            min: parseFloat(min.toFixed(this.decimals)),
            max: parseFloat((min + dragging.rangeValue).toFixed(this.decimals))
          }
          break
      }

      this.model = {
        min: this.__nextFocus !== 'max'
          ? between(pos.min, this.minInnerValue, this.maxInnerValue)
          : pos.min,
        max: this.__nextFocus !== 'min'
          ? between(pos.max, this.minInnerValue, this.maxInnerValue)
          : pos.max
      }

      // If either of the values to be emitted are null, set them to the defaults the user has entered.
      if (this.model.min === null || this.model.max === null) {
        this.model.min = pos.min || this.minInnerValue
        this.model.max = pos.max || this.maxInnerValue
      }

      if (this.snap !== true || this.step === 0) {
        this.curMinRatio = this.__nextFocus !== 'max'
          ? between(pos.minR, this.minInnerRatio, this.maxInnerRatio)
          : pos.minR
        this.curMaxRatio = this.__nextFocus !== 'min'
          ? between(pos.maxR, this.minInnerRatio, this.maxInnerRatio)
          : pos.maxR
      }
      else {
        this.curMinRatio = this.__getModelRatio(this.model.min)
        this.curMaxRatio = this.__getModelRatio(this.model.max)
      }
    },

    __focus (which) {
      this.focus = which
    },

    __keydown (evt) {
      if (!keyCodes.includes(evt.keyCode)) {
        return
      }

      stopAndPrevent(evt)

      const
        step = ([34, 33].includes(evt.keyCode) ? 10 : 1) * this.computedStep,
        offset = [34, 37, 40].includes(evt.keyCode) ? -step : step

      if (this.dragOnlyRange) {
        const interval = this.dragOnlyRange
          ? this.model.max - this.model.min
          : 0

        const min = between(
          parseFloat((this.model.min + offset).toFixed(this.decimals)),
          this.minInnerValue,
          this.maxInnerValue - interval
        )

        this.model = {
          min,
          max: parseFloat((min + interval).toFixed(this.decimals))
        }
      }
      else if (this.focus === false) {
        return
      }
      else {
        const which = this.focus

        this.model = {
          ...this.model,
          [which]: between(
            parseFloat((this.model[which] + offset).toFixed(this.decimals)),
            which === 'min' ? this.minInnerValue : this.model.min,
            which === 'max' ? this.maxInnerValue : this.model.max
          )
        }
      }

      this.__updateValue()
    },

    __getThumb (h, which) {
      const ratio = this[which + 'Ratio']
      if (ratio < 0 || ratio > 1) {
        return
      }

      const child = [
        this.__getThumbSvg(h, this.value[which] < this.min || this.value[which] > this.max),
        h('div', { staticClass: 'q-slider__focus-ring' })
      ]

      if (this.label === true || this.labelAlways === true) {
        child.push(
          h('div', {
            staticClass: `q-slider__pin q-slider__pin${this.axis} absolute`,
            style: this[which + 'PinStyle'].pin,
            class: this[which + 'PinClass']
          }, [
            h('div', {
              staticClass: `q-slider__pin-text-container q-slider__pin-text-container${this.axis}`,
              style: this[which + 'PinStyle'].pinTextContainer
            }, [
              h('span', {
                staticClass: 'q-slider__pin-text',
                class: this[which + 'PinTextClass']
              }, [
                this[which + 'ComputedLabel']
              ])
            ])
          ]),

          h('div', {
            staticClass: `q-slider__arrow q-slider__arrow${this.axis}`,
            class: this[which + 'PinClass']
          })
        )
      }

      return h('div', {
        ref: which + 'Thumb',
        staticClass: `q-slider__thumb-container q-slider__thumb-container${this.axis} absolute non-selectable`,
        style: this[which + 'ThumbStyle'],
        class: this[which + 'ThumbClass'],
        on: this[which + 'Events'],
        attrs: { tabindex: this.dragOnlyRange !== true ? this.computedTabindex : null }
      }, child)
    }
  },

  render (h) {
    const child = [
      h('div', {
        staticClass: `q-slider__track-container q-slider__track-container${this.axis} absolute`
      }, this.__getTrack(h)),

      this.__getThumb(h, 'min'),
      this.__getThumb(h, 'max')
    ]

    if (this.name !== void 0 && this.disable !== true) {
      this.__injectFormInput(child, 'push')
    }

    return h('div', {
      staticClass: this.value.min === null || this.value.max === null
        ? 'q-slider--no-value'
        : void 0,
      attrs: {
        ...this.attrs,
        'aria-valuenow': this.value.min + '|' + this.value.max,
        tabindex: this.dragOnlyRange === true && this.$q.platform.is.mobile !== true
          ? this.computedTabindex
          : null
      },
      class: this.classes,
      on: this.events,
      directives: this.panDirectives
    }, child)
  }
})
