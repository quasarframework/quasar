<template>
  <div
    class="q-slider non-selectable"
    :class="classes"
    @click="__click"
    v-touch-pan.horizontal="__pan"
  >
    <div ref="handle" class="q-slider-handle-container">
      <div class="q-slider-track"></div>
      <div
        v-if="markers"
        class="q-slider-mark"
        v-for="n in ((max - min) / step + 1)"
        :style="{left: (n - 1) * 100 * step / (max - min) + '%'}"
      ></div>
      <div
        class="q-slider-track active-track"
        :style="{left: `${percentageMin * 100}%`, width: activeTrackWidth}"
        :class="{dragging: dragging, 'track-draggable': dragRange || dragOnlyRange}"
      ></div>

      <div
        class="q-slider-handle q-slider-handle-min"
        ref="handleMin"
        :style="{left: `${percentageMin * 100}%`, borderRadius: square ? '0' : '50%'}"
        :class="{dragging: dragging, 'handle-at-minimum': value.min === min}"
      >
        <q-chip
          pointing="down"
          square
          :color="labelColor"
          class="q-slider-label no-pointer-events"
          :class="{'label-always': labelAlways}"
          v-if="label || labelAlways"
        >
          {{ leftDisplayValue }}
        </q-chip>

        <div v-if="$q.theme !== 'ios'" class="q-slider-ring"></div>
      </div>
      <div
        class="q-slider-handle q-slider-handle-max"
        :style="{left: `${percentageMax * 100}%`, borderRadius: square ? '0' : '50%'}"
        :class="{dragging: dragging, 'handle-at-maximum': value.max === max}"
      >
        <q-chip
          pointing="down"
          square
          :color="labelColor"
          class="q-slider-label no-pointer-events"
          :class="{'label-always': labelAlways}"
          v-if="label || labelAlways"
        >
          {{ rightDisplayValue }}
        </q-chip>

        <div v-if="$q.theme !== 'ios'" class="q-slider-ring"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { between } from '../../utils/format'
import extend from '../../utils/extend'
import {
  getModel,
  getPercentage,
  notDivides,
  mixin
} from '../slider/slider-utils'
import TouchPan from '../../directives/touch-pan'

const dragType = {
  MIN: 0,
  RANGE: 1,
  MAX: 2
}

export default {
  name: 'q-range',
  directives: {
    TouchPan
  },
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
    leftLabelValue: String,
    rightLabelValue: String
  },
  data () {
    return {
      dragging: false,
      currentMinPercentage: (this.value.min - this.min) / (this.max - this.min),
      currentMaxPercentage: (this.value.max - this.min) / (this.max - this.min)
    }
  },
  computed: {
    percentageMin () {
      return this.snap ? (this.value.min - this.min) / (this.max - this.min) : this.currentMinPercentage
    },
    percentageMax () {
      return this.snap ? (this.value.max - this.min) / (this.max - this.min) : this.currentMaxPercentage
    },
    activeTrackWidth () {
      return 100 * (this.percentageMax - this.percentageMin) + '%'
    },
    leftDisplayValue () {
      return this.leftLabelValue !== void 0
        ? this.leftLabelValue
        : this.value.min
    },
    rightDisplayValue () {
      return this.rightLabelValue !== void 0
        ? this.rightLabelValue
        : this.value.max
    }
  },
  watch: {
    'value.min' (value) {
      if (this.dragging) {
        return
      }
      if (value > this.value.max) {
        value = this.value.max
      }
      this.currentMinPercentage = (value - this.min) / (this.max - this.min)
    },
    'value.max' (value) {
      if (this.dragging) {
        return
      }
      if (value < this.value.min) {
        value = this.value.min
      }
      this.currentMaxPercentage = (value - this.min) / (this.max - this.min)
    },
    min (value) {
      if (this.value.min < value) {
        this.__update({min: value})
      }
      if (this.value.max < value) {
        this.__update({max: value})
      }
      this.$nextTick(this.__validateProps)
    },
    max (value) {
      if (this.value.min > value) {
        this.__update({min: value})
      }
      if (this.value.max > value) {
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
        valueMin: this.value.min,
        valueMax: this.value.max,
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
      this.currentMinPercentage = (this.value.min - this.min) / (this.max - this.min)
      this.currentMaxPercentage = (this.value.max - this.min) / (this.max - this.min)
    },
    __updateInput ({min = this.value.min, max = this.value.max}) {
      const val = {min, max}
      if (this.value.min !== min || this.value.max !== max) {
        this.$emit('input', val)
        this.$emit('change', val)
      }
    },
    __validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max)
      }
      else if (notDivides((this.max - this.min) / this.step, this.decimals)) {
        console.error('Range error: step must be a divisor of max - min', this.min, this.max, this.step)
      }
      else if (notDivides((this.value.min - this.min) / this.step, this.decimals)) {
        console.error('Range error: step must be a divisor of initial value.min - min', this.value.min, this.min, this.step)
      }
      else if (notDivides((this.value.max - this.min) / this.step, this.decimals)) {
        console.error('Range error: step must be a divisor of initial value.max - min', this.value.max, this.max, this.step)
      }
    }
  }
}
</script>
