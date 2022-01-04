import Vue from 'vue'

import {
  keyCodes,
  SliderMixin
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
    const innerMin = this.__getInnerMin(this.innerMin)
    const innerMax = this.__getInnerMax(this.innerMax)
    return {
      model: this.value === null ? innerMin : between(this.value, innerMin, innerMax),
      curRatio: 0
    }
  },

  computed: {
    modelRatio () {
      return this.__convertModelToRatio(this.model)
    },

    ratio () {
      return this.active === true ? this.curRatio : this.modelRatio
    },

    selectionBarStyle () {
      const acc = {
        [ this.positionProp ]: `${100 * this.innerMinRatio}%`,
        [ this.sizeProp ]: `${100 * (this.ratio - this.innerMinRatio)}%`
      }
      if (this.selectionImg !== void 0) {
        acc.backgroundImage = `url(${this.selectionImg}) !important`
      }
      return acc
    },

    thumbLabel () {
      return this.labelValue !== void 0
        ? this.labelValue
        : this.model
    },

    thumbClasses () {
      const color = this.thumbColor || this.color
      return `q-slider__thumb q-slider__thumb${this.axis} q-slider__thumb${this.axis}-${this.isReversed === true ? 'rtl' : 'ltr'} absolute non-selectable` +
        (
          this.preventFocus === false && this.focus === true
            ? ' q-slider--focus'
            : ''
        ) +
        (color !== void 0 ? ` text-${color}` : '')
    },

    thumbStyle () {
      return {
        width: this.thumbSize,
        height: this.thumbSize,
        [ this.positionProp ]: `${100 * this.ratio}%`
      }
    },

    thumbPinColor () {
      return this.labelColor !== void 0
        ? ` text-${this.labelColor}`
        : ''
    },

    thumbTextContainerStyle () {
      return this.__getTextContainerStyle(this.ratio)
    },

    thumbTextClass () {
      return 'q-slider__text' +
        (this.labelTextColor !== void 0 ? ` text-${this.labelTextColor}` : '')
    },

    trackContainerEvents () {
      if (this.editable !== true) {
        return {}
      }

      return this.$q.platform.is.mobile === true
        ? { click: this.__onMobileClick }
        : {
          mousedown: this.__onActivate,
          focus: this.__onFocus,
          blur: this.__onBlur,
          keydown: this.__onKeydown,
          keyup: this.__onKeyup
        }
    },

    trackContainerAttrs () {
      return {
        tabindex: this.$q.platform.is.mobile !== true
          ? this.computedTabindex
          : null
      }
    },

    modelUpdate () {
      return `${this.value}|${this.computedInnerMin}|${this.computedInnerMax}`
    }
  },

  watch: {
    modelUpdate () {
      this.model = this.value === null
        ? this.computedInnerMin
        : between(this.value, this.computedInnerMin, this.computedInnerMax)
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
      const ratio = this.__getDraggingRatio(event, dragging)

      this.model = this.__convertRatioToModel(ratio)
      this.curRatio = this.snap !== true || this.computedStep === 0
        ? ratio
        : this.__convertModelToRatio(this.model)
    },

    __onFocus () {
      this.focus = true
    },

    __onKeydown (evt) {
      if (!keyCodes.includes(evt.keyCode)) {
        return
      }

      stopAndPrevent(evt)

      const
        step = ([34, 33].includes(evt.keyCode) ? 10 : 1) * this.computedStep,
        offset = ([ 34, 37, 40 ].includes(evt.keyCode) ? -1 : 1) * (this.isReversed === true ? -1 : 1) * step

      this.model = between(
        parseFloat((this.model + offset).toFixed(this.computedDecimals)),
        this.computedInnerMin,
        this.computedInnerMax
      )

      this.__updateValue()
    }
  },

  render (h) {
    const content = this.__getContent(h, node => {
      node.push(
        this.__getThumb(h, {
          pinColor: this.thumbPinColor,
          textContainerStyle: this.thumbTextContainerStyle,
          textClass: this.thumbTextClass,
          label: this.thumbLabel,
          classes: this.thumbClasses,
          style: this.thumbStyle,
          nodeData: {}
        })
      )
    })

    return h('div', {
      class: this.classes + (this.value === null ? ' q-slider--no-value' : ''),
      attrs: {
        ...this.attributes,
        'aria-valuenow': this.value
      }
    }, content)
  }
})
