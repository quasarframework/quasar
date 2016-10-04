<template>
  <div
    class="quasar-range non-selectable"
    :class="{disabled: disable}"
    @mousedown.prevent="setActive"
    @touchstart.prevent="setActive"
    @touchend.prevent="end"
    @touchmove.prevent="update"
  >
    <div v-el:handle class="quasar-range-handle-container">
      <div class="quasar-range-track"></div>
      <div
        v-if="markers"
        class="quasar-range-mark"
        v-for="n in ((this.max - this.min) / this.step + 1)"
        :style="{left: n * 100 * this.step / (this.max - this.min) + '%'}"
      ></div>
      <div
        class="quasar-range-track active-track no-transition"
        :style="{left: percentageMin * 100 + '%', width: activeTrackWidth}"
      ></div>
      <div
        class="quasar-range-handle no-transition"
        :style="{left: percentageMin * 100 + '%'}"
        :class="{dragging: dragging, 'handle-at-minimum': modelMin === min}"
      >
        <div
          class="quasar-range-label"
          v-if="label"
        >{{ modelMin }}</div>
      </div>
      <div
        class="quasar-range-handle no-transition"
        :style="{left: percentageMax * 100 + '%'}"
        :class="{dragging: dragging}"
      >
        <div
          class="quasar-range-label"
          v-if="label"
        >{{ modelMax }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Utils from '../../utils'
import Platform from '../../platform'

export default {
  props: {
    modelMin: {
      type: Number,
      twoWay: true,
      required: true,
      coerce: value => parseInt(value, 10)
    },
    modelMax: {
      type: Number,
      twoWay: true,
      required: true,
      coerce: value => parseInt(value, 10)
    },
    min: {
      type: Number,
      default: 0,
      coerce: value => parseInt(value, 10)
    },
    max: {
      type: Number,
      default: 100,
      coerce: value => parseInt(value, 10)
    },
    step: {
      type: Number,
      default: 1,
      coerce: value => parseInt(value, 10)
    },
    snap: {
      type: Boolean,
      default: false,
      coerce: Boolean
    },
    markers: {
      type: Boolean,
      default: false,
      coerce: Boolean
    },
    label: {
      type: Boolean,
      default: false,
      coerce: Boolean
    },
    disable: {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  },
  data () {
    return {
      dragging: false,
      currentMinPercentage: (this.modelMin - this.min) / (this.max - this.min),
      currentMaxPercentage: (this.modelMax - this.min) / (this.max - this.min)
    }
  },
  computed: {
    percentageMin () {
      if (this.snap) {
        return (this.modelMin - this.min) / (this.max - this.min)
      }
      return this.currentMinPercentage
    },
    percentageMax () {
      if (this.snap) {
        return (this.modelMax - this.min) / (this.max - this.min)
      }
      return this.currentMaxPercentage
    },
    activeTrackWidth () {
      return 100 * (this.percentageMax - this.percentageMin) + '%'
    }
  },
  watch: {
    modelMin (value) {
      if (this.dragging) {
        return
      }
      if (value > this.modelMax) {
        value = this.modelMax
      }
      this.currentMinPercentage = (value - this.min) / (this.max - this.min)
    },
    modelMax (value) {
      if (this.dragging) {
        return
      }
      if (value < this.modelMin) {
        value = this.modelMin
      }
      this.currentMaxPercentage = (value - this.min) / (this.max - this.min)
    },
    min (value) {
      if (this.modelMin < value) {
        this.modelMin = value
      }
      if (this.modelMax < value) {
        this.modelMax = value
      }
      this.$nextTick(this.validateProps)
    },
    max (value) {
      if (this.modelMin > value) {
        this.modelMin = value
      }
      if (this.modelMax > value) {
        this.modelMax = value
      }
      this.$nextTick(this.validateProps)
    },
    step () {
      this.$nextTick(this.validateProps)
    }
  },
  methods: {
    setActive (event) {
      if (this.disable) {
        return
      }

      let container = this.$els.handle

      this.dragging = {
        left: container.getBoundingClientRect().left,
        width: container.offsetWidth,
        modelMin: this.modelMin,
        percentageMin: this.currentMinPercentage,
        modelMax: this.modelMax,
        percentageMax: this.currentMaxPercentage
      }

      let
        offset = Utils.event.position(event).left - this.dragging.left,
        percentage = Math.min(1, Math.max(0, offset / this.dragging.width))

      this.dragging.onLeft = Math.abs(percentage - this.currentMinPercentage) <= Math.abs(percentage - this.currentMaxPercentage)
      this.update(event)
    },
    update (event) {
      if (!this.dragging) {
        return
      }

      let
        percentage = Math.min(1, Math.max(0, (Utils.event.position(event).left - this.dragging.left) / this.dragging.width)),
        model = this.min + percentage * (this.max - this.min),
        modulo = model % this.step

      model = Math.min(this.max, Math.max(this.min, model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0)))

      if (this.dragging.onLeft) {
        if (percentage <= this.dragging.percentageMax) {
          this.currentMinPercentage = percentage
          this.modelMin = model

          this.currentMaxPercentage = this.dragging.percentageMax
          this.modelMax = this.dragging.modelMax
        }
        else {
          this.currentMinPercentage = this.dragging.percentageMax
          this.modelMin = this.dragging.modelMax

          this.currentMaxPercentage = percentage
          this.modelMax = model
        }
      }
      else {
        if (percentage >= this.dragging.percentageMin) {
          this.currentMaxPercentage = percentage
          this.modelMax = model

          this.currentMinPercentage = this.dragging.percentageMin
          this.modelMin = this.dragging.modelMin
        }
        else {
          this.currentMaxPercentage = this.dragging.percentageMin
          this.modelMax = this.dragging.modelMin

          this.currentMinPercentage = percentage
          this.modelMin = model
        }
      }
    },
    end () {
      this.dragging = false
      this.currentMinPercentage = (this.modelMin - this.min) / (this.max - this.min)
      this.currentMaxPercentage = (this.modelMax - this.min) / (this.max - this.min)
    },
    validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max)
      }
      else if ((this.max - this.min) % this.step !== 0) {
        console.error('Range error: step must be a divisor of max - min', this.$el, this.min, this.max, this.step)
      }
      else if ((this.modelMin - this.min) % this.step !== 0) {
        console.error('Range error: step must be a divisor of initial modelMin - min', this.$el, this.modelMin, this.min, this.step)
      }
      else if ((this.modelMax - this.min) % this.step !== 0) {
        console.error('Range error: step must be a divisor of initial modelMax - min', this.$el, this.modelMax, this.max, this.step)
      }
    }
  },
  created () {
    this.validateProps()
    if (Platform.is.desktop) {
      document.body.addEventListener('mousemove', this.update)
      document.body.addEventListener('mouseup', this.end)
    }
  },
  beforeDestroy () {
    if (Platform.is.dekstop) {
      document.body.removeEventListener('mousemove', this.update)
      document.body.removeEventListener('mouseup', this.end)
    }
  }
}
</script>
