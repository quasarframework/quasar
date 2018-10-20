import Vue from 'vue'

import {
  getRatio,
  getModel,
  SliderMixin
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
        min: 0,
        max: 0
      }),
      validator (val) {
        return 'min' in val && 'max' in val
      }
    },

    dragRange: Boolean,
    dragOnlyRange: Boolean,

    labelColor: String,
    leftLabelColor: String,
    rightLabelColor: String
  },

  data () {
    return {
      model: Object.assign({}, this.value),
      curMinRatio: (this.value.min - this.min) / (this.max - this.min),
      curMaxRatio: (this.value.max - this.min) / (this.max - this.min)
    }
  },

  watch: {
    'value.min' (val) {
      this.model.min = val
    },

    'value.max' (val) {
      this.model.max = val
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
      let update = false

      if (this.model.min > value) {
        this.model.min = value
        update = true
      }
      if (this.model.max > value) {
        this.model.max = value
      }

      if (update === true) {
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
      return (this.model.min - this.min) / (this.max - this.min)
    },

    modelMaxRatio () {
      return (this.model.max - this.min) / (this.max - this.min)
    },

    trackStyle () {
      return {
        left: 100 * this.ratioMin + '%',
        width: 100 * (this.ratioMax - this.ratioMin) + '%'
      }
    },

    minThumbStyle () {
      return { left: (100 * this.ratioMin) + '%' }
    },

    maxThumbStyle () {
      return { left: (100 * this.ratioMax) + '%' }
    },

    minThumbClass () {
      return this.preventFocus === false && this.focus === 'min' ? 'q-slider--focus' : null
    },

    maxThumbClass () {
      return this.preventFocus === false && this.focus === 'max' ? 'q-slider--focus' : null
    },

    events () {
      if (this.editable) {
        return this.$q.platform.is.mobile
          ? { click: this.__mobileClick }
          : { mousedown: this.__activate }
      }
    },

    minEvents () {
      if (this.editable && !this.$q.platform.is.mobile) {
        return {
          focus: () => { this.__focus('min') },
          blur: this.__blur,
          keydown: this.__keydown,
          keyup: this.__keyup
        }
      }
    },

    maxEvents () {
      if (this.editable && !this.$q.platform.is.mobile) {
        return {
          focus: () => { this.__focus('max') },
          blur: this.__blur,
          keydown: this.__keydown,
          keyup: this.__keyup
        }
      }
    },

    leftColor () {
      const color = this.leftLabelColor || this.labelColor
      if (color) {
        return `text-${color}`
      }
    },

    rightColor () {
      const color = this.rightLabelColor || this.labelColor
      if (color) {
        return `text-${color}`
      }
    }
  },

  methods: {
    __updateValue (change) {
      if (this.model.min !== this.value.min || this.model.max !== this.value.max) {
        this.$emit('input', this.model)
        change === true && this.$emit('change', this.model)
      }

      if (change === true) {
        const diff = (this.max - this.min)
        this.curMinRatio = (this.model.min - this.min) / diff
        this.curMaxRatio = (this.model.max - this.min) / diff
      }
    },

    __getDragging (event) {
      let
        { left, width } = this.$el.getBoundingClientRect(),
        sensitivity = (this.dragOnlyRange ? -1 : 1) * this.$refs.minThumb.offsetWidth / (2 * width)

      let dragging = {
        left,
        width,
        valueMin: this.model.min,
        valueMax: this.model.max,
        ratioMin: this.curMinRatio,
        ratioMax: this.curMaxRatio
      }

      let
        ratio = getRatio(event, dragging, this.$q.i18n.rtl),
        type

      if (ratio < this.curMinRatio + sensitivity) {
        type = dragType.MIN
      }
      else if (ratio < this.curMaxRatio - sensitivity) {
        if (this.dragRange || this.dragOnlyRange) {
          type = dragType.RANGE
          Object.assign(dragging, {
            offsetRatio: ratio,
            offsetModel: getModel(ratio, this.min, this.max, this.step, this.decimals),
            rangeValue: dragging.valueMax - dragging.valueMin,
            rangeRatio: this.curMaxRatio - this.curMinRatio
          })
        }
        else {
          type = this.curMaxRatio - ratio < ratio - this.curMinRatio
            ? dragType.MAX
            : dragType.MIN
        }
      }
      else {
        type = dragType.MAX
      }

      if (this.dragOnlyRange && type !== dragType.RANGE) {
        return false
      }

      dragging.type = type
      this.__nextFocus = void 0

      return dragging
    },

    __updatePosition (event, dragging = this.dragging) {
      let
        ratio = getRatio(event, dragging, this.$q.i18n.rtl),
        model = getModel(ratio, this.min, this.max, this.step, this.decimals),
        pos

      switch (dragging.type) {
        case dragType.MIN:
          if (ratio <= dragging.ratioMax) {
            pos = {
              minP: ratio,
              maxP: dragging.ratioMax,
              min: model,
              max: dragging.valueMax
            }
            this.__nextFocus = 'min'
          }
          else {
            pos = {
              minP: dragging.ratioMax,
              maxP: ratio,
              min: dragging.valueMax,
              max: model
            }
            this.__nextFocus = 'max'
          }
          break

        case dragType.MAX:
          if (ratio >= dragging.ratioMin) {
            pos = {
              minP: dragging.ratioMin,
              maxP: ratio,
              min: dragging.valueMin,
              max: model
            }
            this.__nextFocus = 'max'
          }
          else {
            pos = {
              minP: ratio,
              maxP: dragging.ratioMin,
              min: model,
              max: dragging.valueMin
            }
            this.__nextFocus = 'min'
          }
          break

        case dragType.RANGE:
          let
            ratioDelta = ratio - dragging.offsetRatio,
            minP = between(dragging.ratioMin + ratioDelta, 0, 1 - dragging.rangeRatio),
            modelDelta = model - dragging.offsetModel,
            min = between(dragging.valueMin + modelDelta, this.min, this.max - dragging.rangeValue)

          pos = {
            minP,
            maxP: minP + dragging.rangeRatio,
            min: parseFloat(min.toFixed(this.decimals)),
            max: parseFloat((min + dragging.rangeValue).toFixed(this.decimals))
          }
          break
      }

      this.curMinRatio = pos.minP
      this.curMaxRatio = pos.maxP
      this.model = {
        min: pos.min,
        max: pos.max
      }
    },

    __focus (which) {
      this.focus = which
    },

    __keydown (evt) {
      if (![37, 40, 39, 38].includes(evt.keyCode)) {
        return
      }

      stopAndPrevent(evt)

      const
        step = (evt.ctrlKey ? 10 : 1) * this.computedStep,
        offset = [37, 40].includes(evt.keyCode) ? -step : step,
        which = this.focus

      let model = this.model[which] + offset

      if (this.decimals) {
        model = parseFloat(model.toFixed(this.decimals))
      }

      this.model[which] = between(
        model,
        which === 'min' ? this.min : this.model.min,
        which === 'max' ? this.max : this.model.max
      )
      this.__updateValue()
    },

    __getThumb (h, which) {
      return h('div', {
        ref: which + 'Thumb',
        staticClass: 'q-slider__thumb-container absolute non-selectable',
        style: this[which + 'ThumbStyle'],
        'class': this[which + 'ThumbClass'],
        on: this[which + 'Events'],
        attrs: { tabindex: this.computedTabindex }
      }, [
        h('svg', {
          staticClass: 'q-slider__thumb absolute',
          attrs: { width: '21', height: '21' }
        }, [
          h('circle', {
            attrs: {
              cx: '10.5',
              cy: '10.5',
              r: '7.875'
            }
          })
        ]),

        this.label === true || this.labelAlways === true ? h('div', {
          staticClass: 'q-slider__pin absolute flex flex-center'
        }, [
          h('span', { staticClass: 'q-slider__pin-value-marker' }, [ this.model[which] ])
        ]) : null,

        h('div', { staticClass: 'q-slider__focus-ring' })
      ])
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-slider',
      attrs: {
        role: 'slider',
        'aria-valuemin': this.min,
        'aria-valuemax': this.max,
        'data-step': this.step,
        'aria-disabled': this.disable
      },
      'class': this.classes,
      on: this.events,
      directives: this.editable ? [{
        name: 'touch-pan',
        value: this.__pan,
        modifiers: {
          horizontal: true,
          prevent: true,
          stop: true
        }
      }] : null
    }, [
      h('div', { staticClass: 'q-slider__track-container absolute overflow-hidden' }, [
        h('div', {
          staticClass: 'q-slider__track absolute-full',
          style: this.trackStyle
        }),

        this.markers === true
          ? h('div', {
            staticClass: 'q-slider__track-markers absolute-full fit',
            style: this.markerStyle
          })
          : null
      ]),

      this.__getThumb(h, 'min'),
      this.__getThumb(h, 'max')
    ])
  }
})
