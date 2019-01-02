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

    leftLabelColor: String,
    rightLabelColor: String
  },

  data () {
    return {
      model: Object.assign({}, this.value),
      curMinRatio: 0,
      curMaxRatio: 0
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
        if (this.$q.platform.is.mobile) {
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
      if (this.editable && !this.$q.platform.is.mobile && this.dragOnlyRange !== true) {
        return {
          focus: () => { this.__focus('min') },
          blur: this.__blur,
          keydown: this.__keydown,
          keyup: this.__keyup
        }
      }
    },

    maxEvents () {
      if (this.editable && !this.$q.platform.is.mobile && this.dragOnlyRange !== true) {
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

    maxPinClass () {
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
    },

    __getDragging (event) {
      let
        { left, width } = this.$el.getBoundingClientRect(),
        sensitivity = this.dragOnlyRange ? 0 : this.$refs.minThumb.offsetWidth / (2 * width),
        diff = this.max - this.min

      let dragging = {
        left,
        width,
        valueMin: this.model.min,
        valueMax: this.model.max,
        ratioMin: (this.value.min - this.min) / diff,
        ratioMax: (this.value.max - this.min) / diff
      }

      let
        ratio = getRatio(event, dragging, this.$q.lang.rtl),
        type

      if (this.dragOnlyRange !== true && ratio < dragging.ratioMin + sensitivity) {
        type = dragType.MIN
      }
      else if (this.dragOnlyRange === true || ratio < dragging.ratioMax - sensitivity) {
        if (this.dragRange || this.dragOnlyRange) {
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
      let
        ratio = getRatio(event, dragging, this.$q.lang.rtl),
        model = getModel(ratio, this.min, this.max, this.step, this.decimals),
        pos

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
          let
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

      if (this.snap !== true || this.step === 0) {
        this.curMinRatio = pos.minR
        this.curMaxRatio = pos.maxR
      }
      else {
        const diff = this.max - this.min
        this.curMinRatio = (this.model.min - this.min) / diff
        this.curMaxRatio = (this.model.max - this.min) / diff
      }
    },

    __focus (which) {
      this.focus = which
    },

    __keydown (evt) {
      // PGDOWN, LEFT, DOWN, PGUP, RIGHT, UP
      if (![34, 37, 40, 33, 39, 38].includes(evt.keyCode)) {
        return
      }

      stopAndPrevent(evt)

      const
        step = ([34, 33].includes(evt.keyCode) ? 10 : 1) * this.computedStep,
        offset = [34, 37, 40].includes(evt.keyCode) ? -step : step

      if (this.dragOnlyRange) {
        const interval = this.dragOnlyRange ? this.model.max - this.model.min : 0

        this.model.min = between(
          parseFloat((this.model.min + offset).toFixed(this.decimals)),
          this.min,
          this.max - interval
        )

        this.model.max = parseFloat((this.model.min + interval).toFixed(this.decimals))
      }
      else {
        const which = this.focus

        this.model[which] = between(
          parseFloat((this.model[which] + offset).toFixed(this.decimals)),
          which === 'min' ? this.min : this.model.min,
          which === 'max' ? this.max : this.model.max
        )
      }

      this.__updateValue()
    },

    __getThumb (h, which) {
      return h('div', {
        ref: which + 'Thumb',
        staticClass: 'q-slider__thumb-container absolute non-selectable',
        style: this[which + 'ThumbStyle'],
        class: this[which + 'ThumbClass'],
        on: this[which + 'Events'],
        attrs: { tabindex: this.dragOnlyRange !== true ? this.computedTabindex : null }
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
          staticClass: 'q-slider__pin absolute flex flex-center',
          class: this[which + 'PinClass']
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
        'aria-disabled': this.disable,
        tabindex: this.dragOnlyRange && !this.$q.platform.is.mobile
          ? this.computedTabindex
          : null
      },
      class: this.classes,
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
