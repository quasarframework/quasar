<template>
  <div
    class="q-knob non-selectable"
    :class="{disabled: disable, 'cursor-pointer': !readonly}"
    @mousedown="__dragStart"
    @mousemove="__dragMove"
    @mouseup="__dragStop"
    @touchstart="__dragStart"
    @touchmove="__dragMove"
    @touchend="__dragStop"
  >
    <div :style="{width: size, height: size}">
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
        class="q-knob-label row items-center justify-center content-center"
        :style="{color: color}"
        v-html="placeholder || value"
      ></div>
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
    disable: Boolean,
    readonly: Boolean,
    placeholder: String
  },
  computed: {
    svgStyle () {
      return {
        'stroke-dasharray': '295.31px, 295.31px',
        'stroke-dashoffset': (295.31 * (1.0 - (this.value - this.min) / (this.max - this.min))) + 'px',
        'transition': this.dragging ? '' : 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
      }
    },
    disabled () {
      return this.disable || this.readonly
    }
  },
  data () {
    return {
      dragging: false
    }
  },
  watch: {
    value (value) {
      if (value < this.min) {
        this.$emit('input', this.min)
      }
      else if (value > this.max) {
        this.$emit('input', this.max)
      }
    }
  },
  methods: {
    __dragStart (ev) {
      if (this.disabled) {
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
      this.__onInput(ev)
    },
    __dragMove (ev) {
      if (!this.dragging || this.disabled) {
        return
      }
      ev.stopPropagation()
      ev.preventDefault()
      this.__onInput(ev)
    },
    __dragStop (ev) {
      if (this.disabled) {
        return
      }
      ev.stopPropagation()
      ev.preventDefault()
      this.dragging = false
    },
    __onInput (ev) {
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

      this.$emit('input', Utils.format.between(model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0), this.min, this.max))
    }
  }
}
</script>
