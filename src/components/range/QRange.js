import { stopAndPrevent } from '../../utils/event.js'
import { between } from '../../utils/format.js'
import {
  getModel,
  getPercentage,
  notDivides,
  SliderMixin
} from '../slider/slider-utils.js'
import QChip from '../chip/QChip.js'

const dragType = {
  MIN: 0,
  RANGE: 1,
  MAX: 2
}

export default {
  name: 'QRange',
  mixins: [SliderMixin],
  props: {
    value: {
      type: Object,
      default: () => ({
        min: 0,
        max: 0
      }),
      validator (value) {
        return value.hasOwnProperty('min') && value.hasOwnProperty('max')
      }
    },
    dragRange: Boolean,
    dragOnlyRange: Boolean,
    leftLabelColor: String,
    leftLabelValue: String,
    rightLabelColor: String,
    rightLabelValue: String
  },
  data () {
    return {
      model: Object.assign({}, this.value),
      dragging: false,
      currentMinPercentage: (this.value.min - this.min) / (this.max - this.min),
      currentMaxPercentage: (this.value.max - this.min) / (this.max - this.min)
    }
  },
  computed: {
    percentageMin () {
      return this.snap ? (this.model.min - this.min) / (this.max - this.min) : this.currentMinPercentage
    },
    percentageMax () {
      return this.snap ? (this.model.max - this.min) / (this.max - this.min) : this.currentMaxPercentage
    },
    activeTrackWidth () {
      return 100 * (this.percentageMax - this.percentageMin) + '%'
    },
    leftDisplayValue () {
      return this.leftLabelValue !== void 0
        ? this.leftLabelValue
        : this.model.min
    },
    rightDisplayValue () {
      return this.rightLabelValue !== void 0
        ? this.rightLabelValue
        : this.model.max
    },
    leftTooltipColor () {
      return this.leftLabelColor || this.labelColor
    },
    rightTooltipColor () {
      return this.rightLabelColor || this.labelColor
    }
  },
  watch: {
    'value.min' (value) {
      this.model.min = value
    },
    'value.max' (value) {
      this.model.max = value
    },
    'model.min' (value) {
      if (this.dragging) {
        return
      }
      if (value > this.model.max) {
        value = this.model.max
      }
      this.currentMinPercentage = (value - this.min) / (this.max - this.min)
    },
    'model.max' (value) {
      if (this.dragging) {
        return
      }
      if (value < this.model.min) {
        value = this.model.min
      }
      this.currentMaxPercentage = (value - this.min) / (this.max - this.min)
    },
    min (value) {
      if (this.model.min < value) {
        this.__update({min: value})
      }
      if (this.model.max < value) {
        this.__update({max: value})
      }
      this.$nextTick(this.__validateProps)
    },
    max (value) {
      if (this.model.min > value) {
        this.__update({min: value})
      }
      if (this.model.max > value) {
        this.__update({max: value})
      }
      this.$nextTick(this.__validateProps)
    },
    step () {
      this.$nextTick(this.__validateProps)
    }
  },
  methods: {
    __getDragging (event) {
      let
        container = this.$refs.handle,
        width = container.offsetWidth,
        sensitivity = (this.dragOnlyRange ? -1 : 1) * this.$refs.handleMin.offsetWidth / (2 * width)

      let dragging = {
        left: container.getBoundingClientRect().left,
        width,
        valueMin: this.model.min,
        valueMax: this.model.max,
        percentageMin: this.currentMinPercentage,
        percentageMax: this.currentMaxPercentage
      }

      let
        percentage = getPercentage(event, dragging, this.$q.i18n.rtl),
        type

      if (percentage < this.currentMinPercentage + sensitivity) {
        type = dragType.MIN
      }
      else if (percentage < this.currentMaxPercentage - sensitivity) {
        if (this.dragRange || this.dragOnlyRange) {
          type = dragType.RANGE
          Object.assign(dragging, {
            offsetPercentage: percentage,
            offsetModel: getModel(percentage, this.min, this.max, this.step, this.computedDecimals),
            rangeValue: dragging.valueMax - dragging.valueMin,
            rangePercentage: this.currentMaxPercentage - this.currentMinPercentage
          })
        }
        else {
          type = this.currentMaxPercentage - percentage < percentage - this.currentMinPercentage
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
      return dragging
    },
    __move (event, dragging = this.dragging) {
      let
        percentage = getPercentage(event, dragging, this.$q.i18n.rtl),
        model = getModel(percentage, this.min, this.max, this.step, this.computedDecimals),
        pos

      switch (dragging.type) {
        case dragType.MIN:
          if (percentage <= dragging.percentageMax) {
            pos = {
              minP: percentage,
              maxP: dragging.percentageMax,
              min: model,
              max: dragging.valueMax
            }
          }
          else {
            pos = {
              minP: dragging.percentageMax,
              maxP: percentage,
              min: dragging.valueMax,
              max: model
            }
          }
          break

        case dragType.MAX:
          if (percentage >= dragging.percentageMin) {
            pos = {
              minP: dragging.percentageMin,
              maxP: percentage,
              min: dragging.valueMin,
              max: model
            }
          }
          else {
            pos = {
              minP: percentage,
              maxP: dragging.percentageMin,
              min: model,
              max: dragging.valueMin
            }
          }
          break

        case dragType.RANGE:
          let
            percentageDelta = percentage - dragging.offsetPercentage,
            minP = between(dragging.percentageMin + percentageDelta, 0, 1 - dragging.rangePercentage),
            modelDelta = model - dragging.offsetModel,
            min = between(dragging.valueMin + modelDelta, this.min, this.max - dragging.rangeValue)

          pos = {
            minP,
            maxP: minP + dragging.rangePercentage,
            min: parseFloat(min.toFixed(this.computedDecimals)),
            max: parseFloat((min + dragging.rangeValue).toFixed(this.computedDecimals))
          }
          break
      }

      this.currentMinPercentage = pos.minP
      this.currentMaxPercentage = pos.maxP
      this.model = {
        min: pos.min,
        max: pos.max
      }
    },
    __end (event, dragging = this.dragging) {
      this.__move(event, dragging)
      this.currentMinPercentage = (this.model.min - this.min) / (this.max - this.min)
      this.currentMaxPercentage = (this.model.max - this.min) / (this.max - this.min)
    },
    __onKeyDown (ev, type) {
      const keyCode = ev.keyCode
      if (!this.editable || ![37, 40, 39, 38].includes(keyCode)) {
        return
      }
      stopAndPrevent(ev)
      const
        decimals = this.computedDecimals,
        step = ev.ctrlKey ? 10 * this.computedStep : this.computedStep,
        offset = [37, 40].includes(keyCode) ? -step : step,
        model = decimals ? parseFloat((this.model[type] + offset).toFixed(decimals)) : (this.model[type] + offset)

      this.model[type] = between(model, type === 'min' ? this.min : this.model.min, type === 'max' ? this.max : this.model.max)
      this.currentMinPercentage = (this.model.min - this.min) / (this.max - this.min)
      this.currentMaxPercentage = (this.model.max - this.min) / (this.max - this.min)
      this.__update()
    },
    __onKeyUp (ev, type) {
      const keyCode = ev.keyCode
      if (!this.editable || ![37, 40, 39, 38].includes(keyCode)) {
        return
      }
      this.__update(true)
    },
    __validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max)
      }
      else if (notDivides((this.max - this.min) / this.step, this.computedDecimals)) {
        console.error('Range error: step must be a divisor of max - min', this.min, this.max, this.step)
      }
      else if (notDivides((this.model.min - this.min) / this.step, this.computedDecimals)) {
        console.error('Range error: step must be a divisor of initial value.min - min', this.model.min, this.min, this.step)
      }
      else if (notDivides((this.model.max - this.min) / this.step, this.computedDecimals)) {
        console.error('Range error: step must be a divisor of initial value.max - min', this.model.max, this.max, this.step)
      }
    },

    __getHandle (h, lower, upper, edge, percentage, color, label) {
      return h('div', {
        ref: `handle${upper}`,
        staticClass: `q-slider-handle q-slider-handle-${lower}`,
        style: {
          [this.$q.i18n.rtl ? 'right' : 'left']: `${percentage * 100}%`,
          borderRadius: this.square ? '0' : '50%'
        },
        'class': [
          edge ? 'handle-at-minimum' : null,
          { dragging: this.dragging }
        ],
        attrs: { tabindex: this.editable ? 0 : -1 },
        on: {
          keydown: ev => this.__onKeyDown(ev, lower),
          keyup: ev => this.__onKeyUp(ev, lower)
        }
      }, [
        this.label || this.labelAlways
          ? h(QChip, {
            props: {
              pointing: 'down',
              square: true,
              dense: true,
              color
            },
            staticClass: 'q-slider-label no-pointer-events',
            'class': { 'label-always': this.labelAlways }
          }, [ label ])
          : null,
        process.env.THEME !== 'ios'
          ? h('div', { staticClass: 'q-slider-ring' })
          : null
      ])
    },
    __getContent (h) {
      return [
        h('div', {
          staticClass: 'q-slider-track active-track',
          style: {
            [this.$q.i18n.rtl ? 'right' : 'left']: `${this.percentageMin * 100}%`,
            width: this.activeTrackWidth
          },
          'class': {
            dragging: this.dragging,
            'track-draggable': this.dragRange || this.dragOnlyRange
          }
        }),

        this.__getHandle(
          h, 'min', 'Min', !this.fillHandleAlways && this.model.min === this.min, this.percentageMin,
          this.leftTooltipColor, this.leftDisplayValue
        ),
        this.__getHandle(
          h, 'max', 'Max', false, this.percentageMax,
          this.rightTooltipColor, this.rightDisplayValue
        )
      ]
    }
  }
}
