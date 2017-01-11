<template>
  <div
    class="q-range non-selectable"
    :class="{disabled: disable}"
    @mousedown.prevent="__setActive"
    @touchstart.prevent="__setActive"
    @touchend.prevent="__end"
    @touchmove.prevent="__update"
  >
    <div ref="handle" class="q-range-handle-container">
      <div class="q-range-track" ></div>
      <div
        v-if="markers"
        class="q-range-mark"
        v-for="n in ((max - min) / step + 1)"
        :style="{left: (n - 1) * 100 * step / (max - min) + '%'}"
      ></div>
      <div
        class="q-range-track active-track"
        :class="{dragging: dragging, 'track-draggable': dragRange}"
        :style="{left: percentageMin * 100 + '%', width: activeTrackWidth}"
      ></div>
      <div
        class="q-range-handle q-range-handle-min"
        :style="{left: percentageMin * 100 + '%'}"
        :class="{dragging: dragging, 'handle-at-minimum': value.min === min, undraggable: disableMin}"
      >
        <div
          class="q-range-label"
          :class="{'label-always': labelAlways}"
          v-if="label || labelAlways"
        >{{ value.min }}</div>
      </div>
      <div
        class="q-range-handle q-range-handle-max"
        :style="{left: percentageMax * 100 + '%'}"
        :class="{dragging: dragging, 'handle-at-maximum': value.max === max, undraggable: disableMax}"
      >
        <div
          class="q-range-label"
          :class="{'label-always': labelAlways}"
          v-if="label || labelAlways"
        >{{ value.max }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Utils from '../../utils'
import Platform from '../../features/platform'

export default {
  props: {
    value: {
      type: Object,
      required: true,
      validator (value) {
        return typeof value.min !== 'undefined' && typeof value.max !== 'undefined'
      }
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    snap: Boolean,
    markers: Boolean,
    label: Boolean,
    labelAlways: Boolean,
    disable: Boolean,
    disableMin: Boolean,
    disableMax: Boolean,
    dragRange: Boolean
  },
  data () {
    return {
      dragging: false,
      currentMinPercentage: (this.value.min - this.min) / (this.max - this.min),
      currentMaxPercentage: (this.value.max - this.min) / (this.max - this.min),
      sensitivity: 0.02
    }
  },
  computed: {
    percentageMin () {
      return (!this.snap || this.disableMin) ? this.currentMinPercentage : (this.value.min - this.min) / (this.max - this.min)
    },
    percentageMax () {
      return (!this.snap || this.disableMax) ? this.currentMaxPercentage : (this.value.max - this.min) / (this.max - this.min)
    },
    activeTrackWidth () {
      return 100 * (this.percentageMax - this.percentageMin) + '%'
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
        this.____update({min: value})
      }
      if (this.value.max < value) {
        this.____update({max: value})
      }
      this.$nextTick(this.__validateProps)
    },
    max (value) {
      if (this.value.min > value) {
        this.____update({min: value})
      }
      if (this.value.max > value) {
        this.____update({max: value})
      }
      this.$nextTick(this.__validateProps)
    },
    step () {
      this.$nextTick(this.__validateProps)
    }
  },
  methods: {
    __setActive (event) {
      if (this.disable) {
        return
      }
      let container = this.$refs.handle
      this.dragging = {
        left: container.getBoundingClientRect().left,
        width: container.offsetWidth,
        valueMin: this.value.min,
        percentageMin: this.currentMinPercentage,
        percentageMinLimit: this.disableMin ? -1 : 0,
        minPercentageOffset: 0,
        valueMax: this.value.max,
        percentageMax: this.currentMaxPercentage,
        maxPercentageOffset: 0,
        percentageMaxLimit: this.disableMax ? 2 : 1
      }
      let
        offset = Utils.event.position(event).left - this.dragging.left,
        percentage = Math.min(1, Math.max(0, offset / this.dragging.width))

      if (percentage < this.currentMinPercentage + this.sensitivity) {
        if (this.disableMin) {
          this.__cancelDrag()
          return
        }
        this.dragging.byPosition = -1 // Drag min
      }
      else if (percentage > this.currentMaxPercentage - this.sensitivity) {
        if (this.disableMax) {
          this.__cancelDrag()
          return
        }
        this.dragging.byPosition = 1  // Drag max
      }
      else {
        if (!this.dragRange) {
          this.__cancelDrag()
          return
        }
        this.dragging.byPosition = 0  // Drag range
        this.dragging.valueRange = this.dragging.valueMax - this.dragging.valueMin
        this.dragging.minPercentageOffset = this.currentMinPercentage - percentage
        this.dragging.maxPercentageOffset = this.currentMaxPercentage - percentage
      }
      this.__update(event)
    },
    __update (event) {
      if (!this.dragging) {
        return
      }

      let percentage = (Utils.event.position(event).left - this.dragging.left) / this.dragging.width
      percentage = (percentage + this.dragging.minPercentageOffset < this.dragging.percentageMinLimit) ? this.dragging.percentageMinLimit - this.dragging.minPercentageOffset : (percentage + this.dragging.maxPercentageOffset > this.dragging.percentageMaxLimit) ? this.dragging.percentageMaxLimit - this.dragging.maxPercentageOffset : percentage
      let
        model = this.min + (percentage + this.dragging.minPercentageOffset) * (this.max - this.min),
        modulo = (model - this.min) % this.step
      model = Math.min(this.max, Math.max(this.min, model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0)))

      if (!this.disableMin && this.dragging.byPosition === -1) {
        if (percentage <= this.dragging.percentageMax) {
          this.currentMinPercentage = percentage
          this.currentMaxPercentage = this.dragging.percentageMax
          this.__updateInput({
            min: model,
            max: this.dragging.valueMax
          })
        }
        else {
          this.currentMinPercentage = this.dragging.percentageMax
          this.currentMaxPercentage = this.disableMax ? this.dragging.percentageMax : percentage
          this.__updateInput({
            min: this.dragging.valueMax,
            max: this.disableMax ? this.dragging.valueMax : model
          })
        }
      }
      else if (!this.disableMax && this.dragging.byPosition === 1) {
        if (percentage >= this.dragging.percentageMin) {
          this.currentMinPercentage = this.dragging.percentageMin
          this.currentMaxPercentage = percentage
          this.__updateInput({
            min: this.dragging.valueMin,
            max: model
          })
        }
        else {
          this.currentMinPercentage = this.disableMin ? this.dragging.percentageMin : percentage
          this.currentMaxPercentage = this.dragging.percentageMin
          this.__updateInput({
            min: this.disableMin ? this.dragging.valueMin : model,
            max: this.dragging.valueMin
          })
        }
      }
      else if (this.dragging.byPosition === 0) {
        this.currentMinPercentage =
          this.disableMin ? this.currentMinPercentage : this.disableMax && percentage + this.dragging.minPercentageOffset > this.currentMaxPercentage ? this.currentMaxPercentage : percentage + this.dragging.minPercentageOffset
        this.currentMaxPercentage = this.disableMax ? this.currentMaxPercentage : this.disableMin && percentage + this.dragging.maxPercentageOffset < this.currentMinPercentage ? this.currentMinPercentage : percentage + this.dragging.maxPercentageOffset
        this.__updateInput({
          min: this.disableMin ? this.dragging.valueMin : model,
          max: this.disableMax ? this.dragging.valueMax : model + this.dragging.valueRange
        })
      }
    },
    __updateInput ({min = this.value.min, max = this.value.max}) {
      this.$emit('input', {min, max})
    },
    __cancelDrag () {
      this.dragging = false
    },
    __end () {
      this.__cancelDrag()
      this.currentMinPercentage = (this.value.min - this.min) / (this.max - this.min)
      this.currentMaxPercentage = (this.value.max - this.min) / (this.max - this.min)
    },
    __validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max)
      }
      else if ((this.max - this.min) % this.step !== 0) {
        console.error('Range error: step must be a divisor of max - min', this.$el, this.min, this.max, this.step)
      }
      else if ((this.value.min - this.min) % this.step !== 0) {
        console.error('Range error: step must be a divisor of initial value.min - min', this.$el, this.value.min, this.min, this.step)
      }
      else if ((this.value.max - this.min) % this.step !== 0) {
        console.error('Range error: step must be a divisor of initial value.max - min', this.$el, this.value.max, this.max, this.step)
      }
    }
  },
  created () {
    this.__validateProps()
    if (Platform.is.desktop) {
      document.body.addEventListener('mousemove', this.__update)
      document.body.addEventListener('mouseup', this.__end)
    }
  },
  beforeDestroy () {
    if (Platform.is.dekstop) {
      document.body.removeEventListener('mousemove', this.__update)
      document.body.removeEventListener('mouseup', this.__end)
    }
  }
}
</script>
