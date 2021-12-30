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
    return {
      model: {
        min: this.value.min === null ? this.__getInnerMin() : between(this.value.min, this.min, this.max),
        max: this.value.max === null ? this.__getInnerMax() : between(this.value.max, this.min, this.max)
      },
      curMinRatio: 0,
      curMaxRatio: 0
    }
  },

  computed: {
    canDragRange () {
      return this.dragRange === true || this.dragOnlyRange === true
    },

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
      const minRatio = Math.max(this.ratioMin, this.innerMinRatio)
      const acc = {
        [ this.positionProp ]: `${100 * minRatio}%`,
        [ this.sizeProp ]: `${100 * (between(this.ratioMax, minRatio, this.innerMaxRatio) - minRatio)}%`
      }
      if (this.selectionImg !== void 0) {
        acc.backgroundImage = `url(${this.selectionImg}) !important`
      }
      return acc
    },

    trackContainerAttrs () {
      return this.$q.platform.is.mobile !== true
        ? { tabindex: this.canDragRange !== false ? this.computedTabindex : -1 }
        : void 0
    },

    trackContainerEvents () {
      if (this.editable !== true) {
        return {}
      }

      if (this.$q.platform.is.mobile === true) {
        return { click: this.__onMobileClick }
      }

      return {
        mousedown: this.__onActivate,
        focus: () => { this.__onFocus('both') },
        blur: this.__onBlur,
        keydown: this.__onKeydown,
        keyup: this.__onKeyup
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
        : (this.value.min < this.min || this.value.min > this.max ? this.value.min : this.model.min)
    },
    thumbMaxLabel () {
      return this.rightLabelValue !== void 0
        ? this.rightLabelValue
        : (this.value.max < this.min || this.value.max > this.max ? this.value.max : this.model.max)
    },

    thumbMinClasses () {
      const color = this.leftThumbColor || this.thumbColor || this.color
      return `q-slider__thumb q-slider__thumb${this.axis} q-slider__thumb${this.axis}-${this.isReversed === true ? 'rtl' : 'ltr'} absolute non-selectable` +
        (this.value.min < this.min || this.value.min > this.max ? ' q-slider__thumb--wrong-value' : '') +
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
        (this.value.max < this.min || this.value.max > this.max ? ' q-slider__thumb--hidden' : '') +
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
      return [
        this.value.min,
        this.value.max,
        this.min,
        this.max,
        this.innerMin,
        this.innerMax
      ].join('#')
    }
  },

  watch: {
    modelUpdate () {
      this.model.min = this.value.min === null
        ? this.computedInnerMin
        : between(this.value.min, this.min, this.max)

      this.model.max = this.value.max === null
        ? this.computedInnerMax
        : between(this.value.max, this.min, this.max)
    },

    focus (focus) {
      if (focus === 'both' && this.canDragRange !== true) {
        if (this.$q.platform.is.mobile !== true) {
          const thumb = this.$refs[`${this.nextFocus}Thumb`]
          thumb !== void 0 && thumb.focus()
        }
      }
      else if (focus !== false && focus !== this.nextFocus) {
        this.nextFocus = focus
      }
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
          ) + (this.modelMaxRatio - this.modelMinRatio) / 20

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
        if (this.canDragRange === true) {
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
            minR = between(dragging.ratioMin + ratioDelta, this.innerMinRatio, this.innerMaxRatio - dragging.rangeRatio),
            modelDelta = localModel - dragging.offsetModel,
            min = between(dragging.valueMin + modelDelta, this.computedInnerMin, this.computedInnerMax - dragging.rangeValue)

          pos = {
            minR,
            maxR: minR + dragging.rangeRatio,
            min: parseFloat(min.toFixed(this.computedDecimals)),
            max: parseFloat((min + dragging.rangeValue).toFixed(this.computedDecimals))
          }
          this.focus = 'both'
          break
      }

      const changedEnd = (this.focus === 'min' && pos.max >= this.computedInnerMin && pos.max <= this.computedInnerMax) ||
        (this.focus === 'max' && pos.min >= this.computedInnerMin && pos.min <= this.computedInnerMax)
        ? this.focus
        : null

      this.model = {
        min: changedEnd !== 'max'
          ? between(pos.min, this.computedInnerMin, this.computedInnerMax)
          : pos.min,
        max: changedEnd !== 'min'
          ? between(pos.max, this.computedInnerMin, this.computedInnerMax)
          : pos.max
      }

      // If either of the values to be emitted are null, set them to the defaults the user has entered.
      if (this.model.min === null || this.model.max === null) {
        this.model.min = pos.min || this.computedInnerMin
        this.model.max = pos.max || this.computedInnerMax
      }

      if (this.snap !== true || this.step === 0) {
        this.curMinRatio = changedEnd !== 'max'
          ? between(pos.minR, this.innerMinRatio, this.innerMaxRatio)
          : pos.minR
        this.curMaxRatio = changedEnd !== 'min'
          ? between(pos.maxR, this.innerMinRatio, this.innerMaxRatio)
          : pos.maxR
      }
      else {
        this.curMinRatio = this.__convertModelToRatio(this.model.min)
        this.curMaxRatio = this.__convertModelToRatio(this.model.max)
      }
    },

    __getEvents (side) {
      return this.$q.platform.is.mobile !== true && this.editable === true && this.dragOnlyRange !== true
        ? {
          focus: () => { this.__onFocus(side) },
          blur: this.__onBlur,
          keydown: this.__onKeydown,
          keyup: this.__onKeyup
        }
        : {}
    },

    __onFocus (which) {
      this.focus = which
    },

    __onKeydown (evt) {
      if (!keyCodes.includes(evt.keyCode)) {
        return
      }

      const wrongFocus = this.focus === 'both' && this.canDragRange !== true
      if (this.focus === false || wrongFocus === true) {
        this.focus = this.nextFocus
      }

      stopAndPrevent(evt)

      const
        step = ([ 34, 33 ].includes(evt.keyCode) ? 10 : 1) * this.computedStep,
        offset = ([ 34, 37, 40 ].includes(evt.keyCode) ? -step : step) * (this.isReversed === true ? -1 : 1)

      if (this.dragOnlyRange === true || (this.dragRange === true && this.focus === 'both')) {
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
      else if (this.focus !== 'min' && this.focus !== 'max') {
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

  created () {
    this.nextFocus = 'min'
  },

  render (h) {
    const content = this.__getContent(h, node => {
      const attrs = {
        tabindex: this.dragOnlyRange !== true ? this.computedTabindex : null
      }
      const minThumb = this.__getThumb(h, {
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
          attrs
        }
      })

      const maxThumb = this.__getThumb(h, {
        pinColor: this.thumbMaxPinColor,
        textContainerStyle: this.thumbMaxTextContainerStyle,
        textClass: this.thumbMaxTextClass,
        label: this.thumbMaxLabel,
        classes: this.thumbMaxClasses,
        style: this.thumbMaxStyle,
        nodeData: {
          ref: 'maxThumb',
          key: 'tmax',
          on: this.thumbMaxEvents,
          attrs
        }
      })

      if (this.reverse === true) {
        node.push(maxThumb, minThumb)
      }
      else {
        node.push(minThumb, maxThumb)
      }
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
