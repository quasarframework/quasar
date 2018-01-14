import { between } from '../../utils/format'
import extend from '../../utils/extend'
import {
  getModel,
  getPercentage,
  notDivides,
  mixin
} from '../slider/slider-utils'
import { QChip } from '../chip'

const dragType = {
  MIN: 0,
  RANGE: 1,
  MAX: 2
}

export default {
  name: 'q-range',
  mixins: [mixin],
  props: {
    value: {
      type: Object,
      required: true,
      validator (value) {
        return typeof value.min !== 'undefined' && typeof value.max !== 'undefined'
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
      model: extend({}, this.value),
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
    __setActive (event) {
      let
        container = this.$refs.handle,
        width = container.offsetWidth,
        sensitivity = (this.dragOnlyRange ? -1 : 1) * this.$refs.handleMin.offsetWidth / (2 * width)

      this.dragging = {
        left: container.getBoundingClientRect().left,
        width,
        valueMin: this.model.min,
        valueMax: this.model.max,
        percentageMin: this.currentMinPercentage,
        percentageMax: this.currentMaxPercentage
      }

      let
        percentage = getPercentage(event, this.dragging),
        type

      if (percentage < this.currentMinPercentage + sensitivity) {
        type = dragType.MIN
      }
      else if (percentage < this.currentMaxPercentage - sensitivity) {
        if (this.dragRange || this.dragOnlyRange) {
          type = dragType.RANGE
          extend(this.dragging, {
            offsetPercentage: percentage,
            offsetModel: getModel(percentage, this.min, this.max, this.step, this.decimals),
            rangeValue: this.dragging.valueMax - this.dragging.valueMin,
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
        this.dragging = false
        return
      }

      this.dragging.type = type
      this.__update(event)
    },
    __update (event) {
      let
        percentage = getPercentage(event, this.dragging),
        model = getModel(percentage, this.min, this.max, this.step, this.decimals),
        pos

      switch (this.dragging.type) {
        case dragType.MIN:
          if (percentage <= this.dragging.percentageMax) {
            pos = {
              minP: percentage,
              maxP: this.dragging.percentageMax,
              min: model,
              max: this.dragging.valueMax
            }
          }
          else {
            pos = {
              minP: this.dragging.percentageMax,
              maxP: percentage,
              min: this.dragging.valueMax,
              max: model
            }
          }
          break

        case dragType.MAX:
          if (percentage >= this.dragging.percentageMin) {
            pos = {
              minP: this.dragging.percentageMin,
              maxP: percentage,
              min: this.dragging.valueMin,
              max: model
            }
          }
          else {
            pos = {
              minP: percentage,
              maxP: this.dragging.percentageMin,
              min: model,
              max: this.dragging.valueMin
            }
          }
          break

        case dragType.RANGE:
          let
            percentageDelta = percentage - this.dragging.offsetPercentage,
            minP = between(this.dragging.percentageMin + percentageDelta, 0, 1 - this.dragging.rangePercentage),
            modelDelta = model - this.dragging.offsetModel,
            min = between(this.dragging.valueMin + modelDelta, this.min, this.max - this.dragging.rangeValue)

          pos = {
            minP,
            maxP: minP + this.dragging.rangePercentage,
            min,
            max: min + this.dragging.rangeValue
          }
          break
      }

      this.currentMinPercentage = pos.minP
      this.currentMaxPercentage = pos.maxP
      this.__updateInput(pos)
    },
    __end () {
      this.dragging = false
      this.currentMinPercentage = (this.model.min - this.min) / (this.max - this.min)
      this.currentMaxPercentage = (this.model.max - this.min) / (this.max - this.min)
      this.$emit('change', this.model)
    },
    __updateInput ({min = this.model.min, max = this.model.max}) {
      const val = {min, max}
      if (this.model.min !== min || this.model.max !== max) {
        this.model = val
        this.$emit('input', val)
      }
    },
    __validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max)
      }
      else if (notDivides((this.max - this.min) / this.step, this.decimals)) {
        console.error('Range error: step must be a divisor of max - min', this.min, this.max, this.step)
      }
      else if (notDivides((this.model.min - this.min) / this.step, this.decimals)) {
        console.error('Range error: step must be a divisor of initial value.min - min', this.model.min, this.min, this.step)
      }
      else if (notDivides((this.model.max - this.min) / this.step, this.decimals)) {
        console.error('Range error: step must be a divisor of initial value.max - min', this.model.max, this.max, this.step)
      }
    },

    __getHandle (h, lower, upper, edge, percentage, color, label) {
      return h('div', {
        ref: `handle${upper}`,
        staticClass: `q-slider-handle q-slider-handle-${lower}`,
        style: {
          left: `${percentage * 100}%`,
          borderRadius: this.square ? '0' : '50%'
        },
        'class': [
          edge ? 'handle-at-minimum' : null,
          { dragging: this.dragging }
        ]
      }, [
        this.label || this.labelAlways
          ? h(QChip, {
            props: {
              pointing: 'down',
              square: true,
              color
            },
            staticClass: 'q-slider-label no-pointer-events',
            'class': { 'label-always': this.labelAlways }
          }, [ label ])
          : null,
        __THEME__ !== 'ios'
          ? h('div', { staticClass: 'q-slider-ring' })
          : null
      ])
    },
    __getContent (h) {
      return [
        h('div', {
          staticClass: 'q-slider-track active-track',
          style: {
            left: `${this.percentageMin * 100}%`,
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
