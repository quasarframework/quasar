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
        class="quasar-range-track active-track"
        :style="{width: percentage}"
        :class="{'no-transition': dragging, 'handle-at-minimum': model === min}"
      ></div>
      <div
        class="quasar-range-handle"
        :style="{left: percentage}"
        :class="{dragging: dragging, 'handle-at-minimum': model === min}"
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
import Utils from '../../utils'
import Platform from '../../platform'

export default {
  props: {
    model: {
      type: Number,
      twoWay: true,
      required: true,
      coerce: value => parseInt(value, 10)
    },
    min: {
      type: Number,
      default: 1,
      coerce: value => parseInt(value, 10)
    },
    max: {
      type: Number,
      default: 5,
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
      if (this.dragging) {
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
      if (this.disable) {
        return
      }

      let container = this.$els.handle

      this.dragging = {
        left: container.getBoundingClientRect().left,
        width: container.offsetWidth
      }
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

      this.currentPercentage = percentage
      this.model = Math.min(this.max, Math.max(this.min, model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0)))
    },
    end () {
      this.dragging = false
      this.currentPercentage = (this.model - this.min) / (this.max - this.min)
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
