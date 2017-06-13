<template>
  <div
    class="q-knob non-selectable"
    :class="classes"
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
          :class="`text-${trackColor}`"
          stroke="currentColor"
          :stroke-width="lineWidth"
          fill-opacity="0"
        ></path>
        <path
          stroke-linecap="round"
          fill-opacity="0"
          d="M 50,50 m 0,-47
             a 47,47 0 1 1 0,94
             a 47,47 0 1 1 0,-94"
          stroke="currentColor"
          :stroke-width="lineWidth"
          :style="svgStyle"
        ></path>
      </svg>

      <div
        class="q-knob-label row items-center justify-center content-center"
      >
        <span v-if="!$slots.default">{{ value }}</span>
        <slot v-else></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { position } from '../../utils/event'
import { between } from '../../utils/format'
import { offset, height, width } from '../../utils/dom'
import TouchPan from '../../directives/touch-pan'

export default {
  name: 'q-knob',
  directives: {
    TouchPan
  },
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
    color: String,
    trackColor: {
      type: String,
      default: 'grey-3'
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
    readonly: Boolean
  },
  computed: {
    classes () {
      const cls = []
      if (this.disable) {
        cls.push('disabled')
      }
      if (!this.readonly) {
        cls.push('cursor-pointer')
      }
      if (this.color) {
        cls.push(`text-${this.color}`)
      }
      return cls
    },
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

      this.centerPosition = this.__getCenter()

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
    __onInput (ev, center = this.__getCenter()) {
      if (!this.editable) {
        return
      }
      let
        pos = position(ev),
        height = Math.abs(pos.top - center.top),
        distance = Math.sqrt(
          Math.pow(Math.abs(pos.top - center.top), 2) +
          Math.pow(Math.abs(pos.left - center.left), 2)
        ),
        angle = Math.asin(height / distance) * (180 / Math.PI)

      if (pos.top < center.top) {
        angle = center.left < pos.left ? 90 - angle : 270 + angle
      }
      else {
        angle = center.left < pos.left ? angle + 90 : 270 - angle
      }

      let
        model = this.min + (angle / 360) * (this.max - this.min),
        modulo = model % this.step

      const val = between(
        model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0),
        this.min,
        this.max
      )

      if (this.value !== val) {
        this.$emit('input', val)
        this.$emit('change', val)
      }
    },
    __getCenter () {
      let knobOffset = offset(this.$el)
      return {
        top: knobOffset.top + height(this.$el) / 2,
        left: knobOffset.left + width(this.$el) / 2
      }
    }
  }
}
</script>
