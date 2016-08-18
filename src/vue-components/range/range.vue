<template>
  <div
    class="quasar-range non-selectable"
    @mousedown="setActive"
    @mouseup="active = false"
    @mousemove="update"
    @touchstart="setActive"
    @touchend="active = false"
    @touchmove="update"
  >
    <div v-el:handle class="quasar-range-handle-container">
      <div class="quasar-range-track"></div>
      <div
        v-if="snap"
        class="quasar-range-mark"
        v-for="n in ((this.max - this.min) / this.step + 1)"
        :style="{left: n * 100 * this.step / (this.max - this.min) + '%'}"
      ></div>
      <div
        class="quasar-range-track active-track"
        :style="{width: percentage}"
        :class="{'no-transition': active, 'handle-at-minimum': model === min}"
      ></div>
      <div
        class="quasar-range-handle"
        :style="{left: percentage}"
        :class="{active: active, 'handle-at-minimum': model === min}"
      >
        <div
          class="quasar-range-label"
          v-if="label"
        >{{ model }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Number,
      twoWay: true,
      required: true,
      coerce: (value) => parseInt(value, 10)
    },
    min: {
      type: Number,
      default: 1,
      coerce: (value) => parseInt(value, 10)
    },
    max: {
      type: Number,
      default: 5,
      coerce: (value) => parseInt(value, 10)
    },
    step: {
      type: Number,
      default: 1,
      coerce: (value) => parseInt(value, 10)
    },
    snap: {
      type: Boolean,
      default: false,
      coerce: Boolean
    },
    label: {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  },
  data () {
    return {
      active: false,
      currentPercentage: (this.model - this.min) / (this.max - this.min)
    }
  },
  computed: {
    percentage () {
      if (this.snap) {
        return (this.model - this.min) / (this.max - this.min) * 100 + '%'
      }
      return 100 * this.currentPercentage + '%'
    }
  },
  watch: {
    model (value) {
      if (this.active) {
        return
      }
      this.currentPercentage = (value - this.min) / (this.max - this.min)
    },
    min (value) {
      if (this.model < value) {
        this.model = value
        return
      }
      this.$nextTick(this.validateProps)
    },
    max (value) {
      if (this.model > value) {
        this.model = value
        return
      }
      this.$nextTick(this.validateProps)
    },
    step () {
      this.$nextTick(this.validateProps)
    }
  },
  methods: {
    setActive (event) {
      this.active = true
      this.update(event)
    },
    update (event) {
      if (!this.active) {
        return
      }

      event.preventDefault()

      let
        clientX = typeof event.clientX !== 'undefined' ? event.clientX : event.changedTouches[0].clientX,
        container = this.$els.handle,
        offset = clientX - container.getBoundingClientRect().left,
        width = container.offsetWidth,
        percentage = Math.min(1, Math.max(0, offset / width)),
        model = this.min + percentage * (this.max - this.min),
        modulo = model % this.step

      this.currentPercentage = percentage
      this.model = Math.min(this.max, Math.max(this.min, model - modulo + (modulo >= this.step / 2 ? this.step : 0)))
    },
    validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max)
      }
      else if ((this.max - this.min) % this.step !== 0) {
        console.error('Range error: step must be a divisor of max - min', this.$el, this.min, this.max, this.step)
      }
    }
  },
  beforeCompile () {
    this.validateProps()
  }
}
</script>
