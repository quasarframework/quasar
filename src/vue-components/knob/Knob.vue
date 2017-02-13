<template>
  <div
    class="q-knob non-selectable"
    :class="{disabled: disable, 'cursor-pointer': !readonly}"
    :style="{width: size, height: size}"
  >
    <div
      @click="__onInput"
      v-touch-pan="__pan"
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
    editable () {
      return !this.disable && !this.readonly
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
    __pan (event) {
      if (!this.editable) {
        return
      }
      if (event.isFinal) {
        this.__dragStop(event.evt)
      }
      else if (event.isFirst) {
        this.__dragStart(event.evt)
      }
      else {
        this.__dragMove(event.evt)
      }
    },
    __dragStart (ev) {
      if (!this.editable) {
        return
      }
      ev.stopPropagation()
      ev.preventDefault()

      this.centerPosition = this.__getCenterPosition()

      this.dragging = true
      this.__onInput(ev)
    },
    __dragMove (ev) {
      if (!this.dragging || !this.editable) {
        return
      }
      ev.stopPropagation()
      ev.preventDefault()
      this.__onInput(ev, this.centerPosition)
    },
    __dragStop (ev) {
      if (!this.editable) {
        return
      }
      ev.stopPropagation()
      ev.preventDefault()
      this.dragging = false
    },
    __onInput (ev, centerPosition = this.__getCenterPosition()) {
      if (!this.editable) {
        return
      }
      let
        position = Utils.event.position(ev),
        height = Math.abs(position.top - centerPosition.top),
        distance = Math.sqrt(
          Math.pow(Math.abs(position.top - centerPosition.top), 2) +
          Math.pow(Math.abs(position.left - centerPosition.left), 2)
        ),
        angle = Math.asin(height / distance) * (180 / Math.PI)

      if (position.top < centerPosition.top) {
        angle = centerPosition.left < position.left ? 90 - angle : 270 + angle
      }
      else {
        angle = centerPosition.left < position.left ? angle + 90 : 270 - angle
      }

      let
        model = this.min + (angle / 360) * (this.max - this.min),
        modulo = model % this.step

      this.$emit('input', Utils.format.between(model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0), this.min, this.max))
    },
    __getCenterPosition () {
      let knobOffset = Utils.dom.offset(this.$el)
      return {
        top: knobOffset.top + Utils.dom.height(this.$el) / 2,
        left: knobOffset.left + Utils.dom.width(this.$el) / 2
      }
    }
  }
}
</script>
