<template>
  <div
    class="q-slider non-selectable"
    :class="classes"
    @click="__click"
    v-touch-pan.horizontal="__pan"
  >
    <div ref="handle" class="q-slider-handle-container">
      <div class="q-slider-track"></div>
      <template v-if="markers">
        <div
          class="q-slider-mark"
          v-for="n in ((max - min) / step + 1)"
          :key="n"
          :style="{left: (n - 1) * 100 * step / (max - min) + '%'}"
        ></div>
      </template>
      <div
        class="q-slider-track active-track"
        :style="{width: percentage}"
        :class="{'no-transition': dragging, 'handle-at-minimum': model === min}"
      ></div>
      <div
        class="q-slider-handle"
        :style="{left: percentage, borderRadius: square ? '0' : '50%'}"
        :class="{dragging: dragging, 'handle-at-minimum': !fillHandleAlways && model === min}"
      >
        <q-chip
          pointing="down"
          square
          :color="labelColor"
          class="q-slider-label no-pointer-events"
          :class="{'label-always': labelAlways}"
          v-if="label || labelAlways"
        >
          {{ displayValue }}
        </q-chip>

        <div v-if="$q.theme !== 'ios'" class="q-slider-ring"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getModel,
  getPercentage,
  notDivides,
  mixin
} from './slider-utils'
import TouchPan from '../../directives/touch-pan'

export default {
  name: 'q-slider',
  directives: {
    TouchPan
  },
  mixins: [mixin],
  props: {
    value: {
      type: Number,
      required: true
    },
    labelValue: String
  },
  data () {
    return {
      model: this.value,
      dragging: false,
      currentPercentage: (this.value - this.min) / (this.max - this.min)
    }
  },
  computed: {
    percentage () {
      if (this.snap) {
        return (this.model - this.min) / (this.max - this.min) * 100 + '%'
      }
      return 100 * this.currentPercentage + '%'
    },
    displayValue () {
      return this.labelValue !== void 0
        ? this.labelValue
        : this.model
    }
  },
  watch: {
    value (value) {
      if (this.dragging) {
        return
      }
      if (value < this.min) {
        this.model = this.min
      }
      else if (value > this.max) {
        this.model = this.max
      }
      else {
        this.model = value
      }
      this.currentPercentage = (this.model - this.min) / (this.max - this.min)
    },
    min (value) {
      if (this.model < value) {
        this.model = value
        return
      }
      this.$nextTick(this.__validateProps)
    },
    max (value) {
      if (this.model > value) {
        this.model = value
        return
      }
      this.$nextTick(this.__validateProps)
    },
    step () {
      this.$nextTick(this.__validateProps)
    }
  },
  methods: {
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
        percentage = getPercentage(event, this.dragging),
        model = getModel(percentage, this.min, this.max, this.step, this.decimals)

      this.currentPercentage = percentage
      if (model !== this.model) {
        this.$emit('input', model)
        this.model = model
      }
    },
    __end () {
      this.dragging = false
      this.currentPercentage = (this.model - this.min) / (this.max - this.min)
      if (this.value !== this.model) {
        this.$emit('change', this.model)
      }
    },
    __validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max)
      }
      else if (notDivides((this.max - this.min) / this.step, this.decimals)) {
        console.error('Range error: step must be a divisor of max - min', this.min, this.max, this.step, this.decimals)
      }
    }
  }
}
</script>
