<template>
  <div
    class="quasar-knob non-selectable cursor-pointer"
    :class="{disabled: disable}"
    :style="{width: size, height: size}"
    @mousedown="__dragStart"
    @mousemove="__dragMove"
    @mouseup="__dragStop"
    @touchstart="__dragStart"
    @touchmove="__dragMove"
    @touchend="__dragStop"
  >
    <svg viewBox="0 0 100 100">
      <path
        d="M 50,50 m 0,-47
           a 47,47 0 1 1 0,94
           a 47,47 0 1 1 0,-94"
        :stroke="trackColor"
        :stroke-width="lineWidth"
        fill-opacity="0"
      ></path>
      <path
        stroke-linecap="round"
        fill-opacity="0"
        d="M 50,50 m 0,-47
           a 47,47 0 1 1 0,94
           a 47,47 0 1 1 0,-94"
        :stroke="color"
        :stroke-width="lineWidth"
        :style="svgStyle"
      ></path>
    </svg>

    <div
      class="quasar-knob-label row items-center justify-center content-center"
      :style="{color: color}"
      v-html="placeholder || model"
    ></div>
  </div>
</template>

<script>
import Utils from '../../utils'

export default {
  props: {
    model: {
      type: Number,
      required: true,
      twoWay: true
    },
    disable: {
      type: Boolean,
      default: false,
      coerce: Boolean
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    color: {
      type: String,
      default: '#027be3'
    },
    trackColor: {
      type: String,
      default: '#ececec'
    },
    lineWidth: {
      type: String,
      default: '6px'
    },
    size: {
      type: String,
      default: '100px'
    },
    step: {
      type: Number,
      default: 1
    },
    placeholder: String
  },
  computed: {
    svgStyle () {
      return {
        'stroke-dasharray': '295.31px, 295.31px',
        'stroke-dashoffset': (295.31 * (1.0 - (this.model - this.min) / (this.max - this.min))) + 'px',
        'transition': this.dragging ? '' : 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
      }
    }
  },
  data () {
    return {
      dragging: false
    }
  },
  watch: {
    model (value) {
      if (value < this.min) {
        this.model = this.min
      }
      else if (value > this.max) {
        this.model = this.max
      }
    }
  },
  methods: {
    __dragStart (ev) {
      if (this.disable) {
        return
      }
      ev.stopPropagation()
      ev.preventDefault()

      let knobOffset = Utils.dom.offset(this.$el)

      this.centerPosition = {
        top: knobOffset.top + Utils.dom.height(this.$el) / 2,
        left: knobOffset.left + Utils.dom.width(this.$el) / 2
      }

      this.dragging = true
      this.__updateModel(ev)
    },
    __dragMove (ev) {
      if (!this.dragging || this.disable) {
        return
      }
      ev.stopPropagation()
      ev.preventDefault()
      this.__updateModel(ev)
    },
    __dragStop (ev) {
      if (this.disable) {
        return
      }
      ev.stopPropagation()
      ev.preventDefault()
      this.dragging = false
    },
    __updateModel (ev) {
      let
        position = Utils.event.position(ev),
        height = Math.abs(position.top - this.centerPosition.top),
        distance = Math.sqrt(
          Math.pow(Math.abs(position.top - this.centerPosition.top), 2) +
          Math.pow(Math.abs(position.left - this.centerPosition.left), 2)
        ),
        angle = Math.asin(height / distance) * (180 / Math.PI)

      if (position.top < this.centerPosition.top) {
        angle = this.centerPosition.left < position.left ? 90 - angle : 270 + angle
      }
      else {
        angle = this.centerPosition.left < position.left ? angle + 90 : 270 - angle
      }

      let
        model = this.min + (angle / 360) * (this.max - this.min),
        modulo = model % this.step

      this.model = Math.min(this.max, Math.max(this.min, model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0)))
    }
  }
}
</script>
