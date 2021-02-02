import Vue from 'vue'

import {
  getRatio,
  getModel,
  SliderMixin,
  keyCodes
} from '../slider/slider-utils.js'

import { stopAndPrevent } from '../../utils/event.js'
import { between } from '../../utils/format.js'

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

    name: String,

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
    return {
      model: {
        min: this.value.min === null ? this.min : this.value.min,
        max: this.value.max === null ? this.max : this.value.max
      },
      curMinRatio: 0,
      curMaxRatio: 0
    }
  },

  watch: {
    'value.min' (val) {
      this.model.min = val === null
        ? this.min
        : val
    },

    'value.max' (val) {
      this.model.max = val === null
        ? this.max
        : val
    },

    min (value) {
      if (this.model.min < value) {
        this.model.min = value
      }
      if (this.model.max < value) {
        this.model.max = value
      }
    },

    max (value) {
      if (this.model.min > value) {
        this.model.min = value
      }
      if (this.model.max > value) {
        this.model.max = value
      }
    }
  },

  computed: {
    ratioMin () {
      return this.active === true ? this.curMinRatio : this.modelMinRatio
    },

    ratioMax () {
      return this.active === true ? this.curMaxRatio : this.modelMaxRatio
    },

    modelMinRatio () {
      return this.minMaxDiff === 0 ? 0 : (this.model.min - this.min) / this.minMaxDiff
    },

    modelMaxRatio () {
      return this.minMaxDiff === 0 ? 0 : (this.model.max - this.min) / this.minMaxDiff
    },

    trackStyle () {
      return {
        [ this.positionProp ]: `${100 * this.ratioMin}%`,
        [ this.sizeProp ]: `${100 * (this.ratioMax - this.ratioMin)}%`
      }
    },

    minThumbStyle () {
      return {
        [ this.positionProp ]: `${100 * this.ratioMin}%`,
        'z-index': this.__nextFocus === 'min' ? 2 : void 0
      }
    },

    maxThumbStyle () {
      return {
        [ this.positionProp ]: `${100 * this.ratioMax}%`
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

    minLabel () {
      return this.leftLabelValue !== void 0
        ? this.leftLabelValue
        : this.model.min
    },

    maxLabel () {
      return this.rightLabelValue !== void 0
        ? this.rightLabelValue
        : this.model.max
    },

    minPinStyle () {
      const percent = (this.reverse === true ? -this.ratioMin : this.ratioMin - 1)
      return this.__getPinStyle(percent, this.ratioMin)
    },

    maxPinStyle () {
      const percent = (this.reverse === true ? -this.ratioMax : this.ratioMax - 1)
      return this.__getPinStyle(percent, this.ratioMax)
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
        sensitivity = this.dragOnlyRange === true
          ? 0
          : (this.vertical === true
            ? this.$refs.minThumb.offsetHeight / (2 * height)
            : this.$refs.minThumb.offsetWidth / (2 * width)
          )

      const dragging = {
        left,
        top,
        width,
        height,
        valueMin: this.model.min,
        valueMax: this.model.max,
        ratioMin: this.modelMinRatio,
        ratioMax: this.modelMaxRatio
      }

      const ratio = getRatio(event, dragging, this.isReversed, this.vertical)
      let type

      if (this.dragOnlyRange !== true && ratio < dragging.ratioMin + sensitivity) {
        type = dragType.MIN
      }
      else if (this.dragOnlyRange === true || ratio < dragging.ratioMax - sensitivity) {
        if (this.dragRange === true || this.dragOnlyRange === true) {
          type = dragType.RANGE
          Object.assign(dragging, {
            offsetRatio: ratio,
            offsetModel: getModel(ratio, this.min, this.max, this.step, this.decimals),
            rangeValue: dragging.valueMax - dragging.valueMin,
            rangeRatio: dragging.ratioMax - dragging.ratioMin
          })
        }
        else {
          type = dragging.ratioMax - ratio < ratio - dragging.ratioMin
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
          if (ratio <= dragging.ratioMax) {
            pos = {
              minR: ratio,
              maxR: dragging.ratioMax,
              min: model,
              max: dragging.valueMax
            }
            this.__nextFocus = 'min'
          }
          else {
            pos = {
              minR: dragging.ratioMax,
              maxR: ratio,
              min: dragging.valueMax,
              max: model
            }
            this.__nextFocus = 'max'
          }
          break

        case dragType.MAX:
          if (ratio >= dragging.ratioMin) {
            pos = {
              minR: dragging.ratioMin,
              maxR: ratio,
              min: dragging.valueMin,
              max: model
            }
            this.__nextFocus = 'max'
          }
          else {
            pos = {
              minR: ratio,
              maxR: dragging.ratioMin,
              min: model,
              max: dragging.valueMin
            }
            this.__nextFocus = 'min'
          }
          break

        case dragType.RANGE:
          const
            ratioDelta = ratio - dragging.offsetRatio,
            minR = between(dragging.ratioMin + ratioDelta, 0, 1 - dragging.rangeRatio),
            modelDelta = model - dragging.offsetModel,
            min = between(dragging.valueMin + modelDelta, this.min, this.max - dragging.rangeValue)

          pos = {
            minR,
            maxR: minR + dragging.rangeRatio,
            min: parseFloat(min.toFixed(this.decimals)),
            max: parseFloat((min + dragging.rangeValue).toFixed(this.decimals))
          }
          break
      }

      this.model = {
        min: pos.min,
        max: pos.max
      }

      // If either of the values to be emitted are null, set them to the defaults the user has entered.
      if (this.model.min === null || this.model.max === null) {
        this.model.min = pos.min || this.min
        this.model.max = pos.max || this.max
      }

      if (this.snap !== true || this.step === 0) {
        this.curMinRatio = pos.minR
        this.curMaxRatio = pos.maxR
      }
      else {
        this.curMinRatio = this.minMaxDiff === 0 ? 0 : (this.model.min - this.min) / this.minMaxDiff
        this.curMaxRatio = this.minMaxDiff === 0 ? 0 : (this.model.max - this.min) / this.minMaxDiff
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
          this.min,
          this.max - interval
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
            which === 'min' ? this.min : this.model.min,
            which === 'max' ? this.max : this.model.max
          )
        }
      }

      this.__updateValue()
    },

    __getThumb (h, which) {
      const child = [
        this.__getThumbSvg(h),
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
                this[which + 'Label']
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
    const track = [
      h('div', {
        staticClass: `q-slider__track q-slider__track${this.axis} absolute`,
        style: this.trackStyle
      })
    ]

    this.markers === true && track.push(
      h('div', {
        staticClass: `q-slider__track-markers q-slider__track-markers${this.axis} absolute-full fit`,
        style: this.markerStyle
      })
    )

    const child = [
      h('div', {
        staticClass: `q-slider__track-container q-slider__track-container${this.axis} absolute`
      }, track),

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
