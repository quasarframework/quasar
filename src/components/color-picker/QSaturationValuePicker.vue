<template>
<div
  class="q-saturation-value-picker non-selectable"
  v-touch-pan="__pan"
  @click="__onClick"
  :style="{background: bgColor}"
  ref="container"
>
  <div class="q-saturation-value-picker--white"></div>
  <div class="q-saturation-value-picker--black"></div>
  <div class="q-saturation-value-picker-pointer" :style="{top: pointerTop, left: pointerLeft}">
    <div class="q-saturation-value-picker-circle"></div>
  </div>
</div>
</template>

<script>
import throttle from '../../utils/throttle'
import TouchPan from '../../directives/touch-pan'

export default {
  name: 'q-saturation-value-picker',
  directives: {
    TouchPan
  },
  mixins: [],
  props: {
    value: {
      type: Object,
      default: { s: 0, v: 0 },
      required: true
    },
    hue: {
      type: Number,
      required: true
    },
    disable: Boolean,
    readonly: Boolean
  },
  data () {
    return {
      dragging: false
    }
  },
  computed: {
    bgColor () {
      return `hsl(${this.hue}, 100%, 50%)`
    },
    pointerTop () {
      return (-(this.value.v * 100) + 1) + 100 + '%'
    },
    pointerLeft () {
      return this.value.s * 100 + '%'
    },
    editable () {
      return !this.disable && !this.readonly
    }
  },
  watch: {
  },
  methods: {
    __throttle: throttle((fn, data) => { fn(data) }, 20),
    __pan (event) {
      if (!this.editable) {
        return
      }

      if (event.isFinal) {
        this.__dragStop(event)
      }
      else if (event.isFirst) {
        this.__dragStart(event)
      }
      else {
        this.__dragMove(event)
      }
    },
    __dragStart (event) {
      if (!this.editable) {
        return
      }
      event.evt.stopPropagation()
      event.evt.preventDefault()

      this.dragging = true
      this.__input(event)
    },
    __dragMove (event) {
      if (!this.dragging || !this.editable) {
        return
      }
      event.evt.stopPropagation()
      event.evt.preventDefault()

      this.__input(event)
    },
    __dragStop (event) {
      if (!this.editable) {
        return
      }
      event.evt.stopPropagation()
      event.evt.preventDefault()
      this.dragging = false
    },
    __calcSaturationAndValueFromPositionInContainer ({ x, y }) {
      let container = this.$refs.container,
        containerWidth = container.clientWidth,
        containerHeight = container.clientHeight,
        xOffset = container.getBoundingClientRect().left,
        yOffset = container.getBoundingClientRect().top,
        left = x - xOffset,
        top = y - yOffset

      left = Math.min(containerWidth, Math.max(0, left))
      top = Math.min(containerHeight, Math.max(0, top))

      var saturation = left / containerWidth
      var bright = -(top / containerHeight) + 1
      bright = bright > 0 ? bright : 0
      bright = bright > 1 ? 1 : bright

      return {
        s: saturation,
        v: bright
      }
    },
    __input (event) {
      this.__throttle(
        this.__onChange,
        this.__calcSaturationAndValueFromPositionInContainer(
          { x: event.position.left, y: event.position.top }
        )
      )
    },
    __onClick (event) {
      this.__onChange(
        this.__calcSaturationAndValueFromPositionInContainer({
          x: event.pageX - window.pageXOffset,
          y: event.pageY - window.pageYOffset
        })
      )
    },
    __onChange ({s, v}) {
      let newValue = {
        s: s,
        v: v
      }
      this.$emit('input', newValue)
      this.$emit('change', newValue)
    }
  }
}
</script>
