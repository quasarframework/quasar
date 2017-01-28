<template>
  <div
    class="q-range non-selectable"
    :class="{disabled: disable}"
    @click="__click"
    v-touch-pan.horizontal="__pan"
  >
    <div ref="handle" class="q-range-handle-container">
      <div class="q-range-track"></div>
      <div
        v-if="markers"
        class="q-range-mark"
        v-for="n in ((max - min) / step + 1)"
        :style="{left: (n - 1) * 100 * step / (max - min) + '%'}"
      ></div>
      <div
        class="q-range-track active-track"
        :style="{width: percentage}"
        :class="{'no-transition': dragging, 'handle-at-minimum': value === min}"
      ></div>
      <div
        class="q-range-handle"
        :style="{left: percentage}"
        :class="{dragging: dragging, 'handle-at-minimum': value === min}"
      >
        <div
          class="q-range-label"
          :class="{'label-always': labelAlways}"
          v-if="label || labelAlways"
        >{{ value }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Utils from '../../utils'

export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 5
    },
    step: {
      type: Number,
      default: 1
    },
    snap: Boolean,
    markers: Boolean,
    label: Boolean,
    labelAlways: Boolean,
    disable: Boolean
  },
  data () {
    return {
      dragging: false,
      currentPercentage: (this.value - this.min) / (this.max - this.min)
    }
  },
  computed: {
    percentage () {
      if (this.snap) {
        return (this.value - this.min) / (this.max - this.min) * 100 + '%'
      }
      return 100 * this.currentPercentage + '%'
    }
  },
  watch: {
    value (value) {
      if (this.dragging) {
        return
      }
      this.currentPercentage = (value - this.min) / (this.max - this.min)
    },
    min (value) {
      if (this.value < value) {
        this.value = value
        return
      }
      this.$nextTick(this.__validateProps)
    },
    max (value) {
      if (this.value > value) {
        this.value = value
        return
      }
      this.$nextTick(this.__validateProps)
    },
    step () {
      this.$nextTick(this.__validateProps)
    }
  },
  methods: {
    __pan (event) {
      if (this.disable) {
        return
      }
      if (event.isFinal) {
        this.__end(event.evt)
      }
      else if (event.isFirst) {
        this.__setActive(event.evt)
      }
      else {
        this.__update(event.evt)
      }
    },
    __click (event) {
      if (this.disable) {
        return
      }
      this.__setActive(event)
      this.__end(event)
    },
    __setActive (event) {
      let container = this.$refs.handle

      this.dragging = {
        left: container.getBoundingClientRect().left,
        width: container.offsetWidth
      }
      this.__update(event)
    },
    __update (event) {
      let
        percentage = Utils.format.between((Utils.event.position(event).left - this.dragging.left) / this.dragging.width, 0, 1),
        model = this.min + percentage * (this.max - this.min),
        modulo = (model - this.min) % this.step

      this.currentPercentage = percentage
      this.$emit('input', Utils.format.between(model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0), this.min, this.max))
    },
    __end () {
      this.dragging = false
      this.currentPercentage = (this.value - this.min) / (this.max - this.min)
    },
    __validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max)
      }
      else if ((this.max - this.min) % this.step !== 0) {
        console.error('Range error: step must be a divisor of max - min', this.$el, this.min, this.max, this.step)
      }
    }
  },
  created () {
    this.__validateProps()
  }
}
</script>
