import Vue from 'vue'

import {
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
      default: () => ({ min: null, max: null }),
      validator: v => 'min' in v && 'max' in v
    },

    dragRange: Boolean,
    dragOnlyRange: Boolean,

    leftLabelColor: String,
    leftLabelTextColor: String,
    rightLabelColor: String,
    rightLabelTextColor: String,

    leftLabelValue: [ String, Number ],
    rightLabelValue: [ String, Number ],

    leftThumbColor: String,
    rightThumbColor: String
  },

  data () {
    const innerMin = this.__getInnerMin(this.innerMin)
    const innerMax = this.__getInnerMax(this.innerMax)
    return {
      model: {
        min: this.value.min === null ? innerMin : between(this.value.min, innerMin, innerMax),
        max: this.value.max === null ? innerMax : between(this.value.max, innerMin, innerMax)
      },
      curMinRatio: 0,
      curMaxRatio: 0
    }
  },

  computed: {
    modelMinRatio () {
      return this.__convertModelToRatio(this.model.min)
    },
    modelMaxRatio () {
      return this.__convertModelToRatio(this.model.max)
    },

    ratioMin () {
      return this.active === true ? this.curMinRatio : this.modelMinRatio
    },
    ratioMax () {
      return this.active === true ? this.curMaxRatio : this.modelMaxRatio
    },

    selectionBarStyle () {
      const acc = {
        [ this.positionProp ]: `${100 * this.ratioMin}%`,
        [ this.sizeProp ]: `${100 * (this.ratioMax - this.ratioMin)}%`
      }
      if (this.selectionImg !== void 0) {
        acc.backgroundImage = `url(${this.selectionImg}) !important`
      }
      return acc
    },

    trackContainerEvents () {
      if (this.editable !== true) {
        return {}
      }

      if (this.$q.platform.is.mobile === true) {
        return { click: this.__onMobileClick }
      }

      const evt = { mousedown: this.__onActivate }

      if (this.dragRange === true || this.dragOnlyRange === true) {
        Object.assign(evt, {
          focus: () => { this.focus = 'both' },
          blur: this.__onBlur,
          keydown: this.__onKeydown,
          keyup: this.__onKeyup
        })
      }

      return evt
    },

    trackContainerAttrs () {
      return {
        tabindex: this.$q.platform.is.mobile !== true && (this.dragRange || this.dragOnlyRange === true)
          ? this.computedTabindex
          : null
      }
    },

    thumbAttrs () {
      return {
        tabindex: this.dragOnlyRange !== true ? this.computedTabindex : null
      }
    },

    thumbMinEvents () {
      return this.__getEvents('min')
    },
    thumbMaxEvents () {
      return this.__getEvents('max')
    },

    thumbMinLabel () {
      return this.leftLabelValue !== void 0
        ? this.leftLabelValue
        : this.model.min
    },
    thumbMaxLabel () {
      return this.rightLabelValue !== void 0
        ? this.rightLabelValue
        : this.model.max
    },

    thumbMinClasses () {
      const color = this.leftThumbColor || this.thumbColor || this.color
      return `q-slider__thumb q-slider__thumb${this.axis} q-slider__thumb${this.axis}-${this.isReversed === true ? 'rtl' : 'ltr'} absolute non-selectable` +
        (
          this.preventFocus === false && (this.focus === 'min' || this.focus === 'both')
            ? ' q-slider--focus'
            : ''
        ) +
        (color !== void 0 ? ` text-${color}` : '')
    },
    thumbMaxClasses () {
      const color = this.rightThumbColor || this.thumbColor || this.color
      return `q-slider__thumb q-slider__thumb${this.axis} q-slider__thumb${this.axis}-${this.isReversed === true ? 'rtl' : 'ltr'} absolute non-selectable` +
        (
          this.preventFocus === false && (this.focus === 'max' || this.focus === 'both')
            ? ' q-slider--focus'
            : ''
        ) +
        (color !== void 0 ? ` text-${color}` : '')
    },

    thumbMinStyle () {
      return {
        width: this.thumbSize,
        height: this.thumbSize,
        [ this.positionProp ]: `${100 * this.ratioMin}%`,
        zIndex: this.focus === 'min' ? 2 : void 0
      }
    },
    thumbMaxStyle () {
      return {
        width: this.thumbSize,
        height: this.thumbSize,
        [ this.positionProp ]: `${100 * this.ratioMax}%`,
        zIndex: this.focus === 'max' ? 2 : void 0
      }
    },

    thumbMinPinColor () {
      const color = this.leftLabelColor || this.labelColor
      return color !== void 0
        ? ` text-${color}`
        : ''
    },
    thumbMaxPinColor () {
      const color = this.rightLabelColor || this.labelColor
      return color !== void 0
        ? ` text-${color}`
        : ''
    },

    thumbMinTextContainerStyle () {
      return this.__getTextContainerStyle(this.ratioMin)
    },
    thumbMaxTextContainerStyle () {
      return this.__getTextContainerStyle(this.ratioMax)
    },

    thumbMinTextClass () {
      const color = this.leftLabelTextColor || this.labelTextColor
      return 'q-slider__text' +
        (color !== void 0 ? ` text-${color}` : '')
    },
    thumbMaxTextClass () {
      const color = this.rightLabelTextColor || this.labelTextColor
      return 'q-slider__text' +
        (color !== void 0 ? ` text-${color}` : '')
    },

    formAttrs () {
      return {
        type: 'hidden',
        name: this.name,
        value: `${this.value.min}|${this.value.max}`
      }
    },

    modelUpdate () {
      return `${this.value.min}|${this.value.max}|${this.computedInnerMin}|${this.computedInnerMax}`
    }
  },

  watch: {
    modelUpdate () {
      this.model.min = this.value.min === null
        ? this.computedInnerMin
        : between(this.value.min, this.computedInnerMin, this.computedInnerMax)

      this.model.max = this.value.max === null
        ? this.computedInnerMax
        : between(this.value.max, this.computedInnerMin, this.computedInnerMax)
    }
  },

  methods: {
    __updateValue (change) {
      if (this.model.min !== this.value.min || this.model.max !== this.value.max) {
        this.$emit('input', { ...this.model })
      }
      change === true && this.$emit('change', { ...this.model })
    },

    __getDragging (event) {
      const
        { left, top, width, height } = this.$el.getBoundingClientRect(),
        sensitivity = this.dragOnlyRange === true
          ? 0
          : (
            this.vertical === true
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

      const ratio = this.__getDraggingRatio(event, dragging)

      if (this.dragOnlyRange !== true && ratio < dragging.ratioMin + sensitivity) {
        dragging.type = dragType.MIN
      }
      else if (this.dragOnlyRange === true || ratio < dragging.ratioMax - sensitivity) {
        if (this.dragRange === true || this.dragOnlyRange === true) {
          dragging.type = dragType.RANGE
          Object.assign(dragging, {
            offsetRatio: ratio,
            offsetModel: this.__convertRatioToModel(ratio),
            rangeValue: dragging.valueMax - dragging.valueMin,
            rangeRatio: dragging.ratioMax - dragging.ratioMin
          })
        }
        else {
          dragging.type = dragging.ratioMax - ratio < ratio - dragging.ratioMin
            ? dragType.MAX
            : dragType.MIN
        }
      }
      else {
        dragging.type = dragType.MAX
      }

      return dragging
    },

    __updatePosition (event, dragging = this.dragging) {
      let pos
      const ratio = this.__getDraggingRatio(event, dragging)
      const localModel = this.__convertRatioToModel(ratio)

      switch (dragging.type) {
        case dragType.MIN:
          if (ratio <= dragging.ratioMax) {
            pos = {
              minR: ratio,
              maxR: dragging.ratioMax,
              min: localModel,
              max: dragging.valueMax
            }
            this.focus = 'min'
          }
          else {
            pos = {
              minR: dragging.ratioMax,
              maxR: ratio,
              min: dragging.valueMax,
              max: localModel
            }
            this.focus = 'max'
          }
          break

        case dragType.MAX:
          if (ratio >= dragging.ratioMin) {
            pos = {
              minR: dragging.ratioMin,
              maxR: ratio,
              min: dragging.valueMin,
              max: localModel
            }
            this.focus = 'max'
          }
          else {
            pos = {
              minR: ratio,
              maxR: dragging.ratioMin,
              min: localModel,
              max: dragging.valueMin
            }
            this.focus = 'min'
          }
          break

        case dragType.RANGE:
          const
            ratioDelta = ratio - dragging.offsetRatio,
            minR = between(dragging.ratioMin + ratioDelta, 0, 1 - dragging.rangeRatio),
            modelDelta = localModel - dragging.offsetModel,
            min = between(dragging.valueMin + modelDelta, this.min, this.max - dragging.rangeValue)

          pos = {
            minR,
            maxR: minR + dragging.rangeRatio,
            min: parseFloat(min.toFixed(this.computedDecimals)),
            max: parseFloat((min + dragging.rangeValue).toFixed(this.computedDecimals))
          }

          this.focus = 'both'
          break
      }

      // If either of the values to be emitted are null, set them to the defaults the user has entered.
      this.model = this.model.min === null || this.model.max === null
        ? { min: pos.min || this.min, max: pos.max || this.max }
        : { min: pos.min, max: pos.max }

      if (this.snap !== true || this.step === 0) {
        this.curMinRatio = pos.minR
        this.curMaxRatio = pos.maxR
      }
      else {
        this.curMinRatio = this.__convertModelToRatio(this.model.min)
        this.curMaxRatio = this.__convertModelToRatio(this.model.max)
      }
    },

    __getEvents (side) {
      return this.$q.platform.is.mobile !== true && this.editable === true && this.dragOnlyRange !== true
        ? {
          focus: () => { this.focus = side },
          blur: this.__onBlur,
          keydown: this.__onKeydown,
          keyup: this.__onKeyup
        }
        : {}
    },

    __onKeydown (evt) {
      if (!keyCodes.includes(evt.keyCode)) {
        return
      }

      stopAndPrevent(evt)

      const
        stepVal = ([ 34, 33 ].includes(evt.keyCode) ? 10 : 1) * this.computedStep,
        offset = ([ 34, 37, 40 ].includes(evt.keyCode) ? -1 : 1) * (this.isReversed === true ? -1 : 1) * stepVal

      if (this.focus === 'both') {
        const interval = this.model.max - this.model.min
        const min = between(
          parseFloat((this.model.min + offset).toFixed(this.computedDecimals)),
          this.computedInnerMin,
          this.computedInnerMax - interval
        )

        this.model = {
          min,
          max: parseFloat((min + interval).toFixed(this.computedDecimals))
        }
      }
      else if (this.focus === false) {
        return
      }
      else {
        const which = this.focus

        this.model = {
          ...this.model,
          [ which ]: between(
            parseFloat((this.model[ which ] + offset).toFixed(this.computedDecimals)),
            which === 'min' ? this.computedInnerMin : this.model.min,
            which === 'max' ? this.computedInnerMax : this.model.max
          )
        }
      }

      this.__updateValue()
    }
  },

  render (h) {
    const content = this.__getContent(h, node => {
      node.push(
        this.__getThumb(h, {
          pinColor: this.thumbMinPinColor,
          textContainerStyle: this.thumbMinTextContainerStyle,
          textClass: this.thumbMinTextClass,
          label: this.thumbMinLabel,
          classes: this.thumbMinClasses,
          style: this.thumbMinStyle,
          nodeData: {
            ref: 'minThumb',
            key: 'tmin',
            on: this.thumbMinEvents,
            attrs: this.thumbAttrs
          }
        }),

        this.__getThumb(h, {
          pinColor: this.thumbMaxPinColor,
          textContainerStyle: this.thumbMaxTextContainerStyle,
          textClass: this.thumbMaxTextClass,
          label: this.thumbMaxLabel,
          classes: this.thumbMaxClasses,
          style: this.thumbMaxStyle,
          nodeData: {
            key: 'tmax',
            on: this.thumbMaxEvents,
            attrs: this.thumbAttrs
          }
        })
      )
    })

    return h('div', {
      class: 'q-range ' + this.classes + (
        this.value.min === null || this.value.max === null
          ? ' q-slider--no-value'
          : ''
      ),
      attrs: {
        ...this.attributes,
        'aria-valuenow': this.value.min + '|' + this.value.max
      }
    }, content)
  }
})
