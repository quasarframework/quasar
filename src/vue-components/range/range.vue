<template>
  <div
    class="quasar-range non-selectable"
    :class="{active: active}"
    v-touch:pan="pan"
    v-touch-options:pan="{ direction: 'horizontal' }"
  >
    <div class="quasar-range-container">
      <div class="quasar-range-thumb" :style="{left: position}"></div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import debounce from '../../utils/debounce'
import Environment from '../../environment'

function modelToPosition (model, min, max, size) {
  return (model - min) / (max - min) * 100 + '%'
}

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
      required: true,
      coerce: (value) => parseInt(value, 10)
    },
    max: {
      type: Number,
      required: true,
      coerce: (value) => parseInt(value, 10)
    },
    precision: {
      type: Number,
      coerce: (value) => parseInt(value, 10)
    }
  },
  data () {
    return {
      position: 0,
      active: false
    }
  },
  methods: {
    pan (event) {
      let
        size = this.el.width(),
        range = this.max - this.min,
        value = (this.model - this.min) / range,
        percentage = Math.min(1, Math.max(0, value + event.deltaX / size)),
        newValue = (this.min + percentage * range).toFixed(this.precision)

      if (event.isFinal) {
        this.model = parseFloat(newValue, 10)
        this.active = false
        return
      }

      this.position = modelToPosition(newValue, this.min, this.max, size)
      this.active = true
    },
    update () {
      this.position = modelToPosition(this.model, this.min, this.max, this.el.width())
    }
  },
  watch: {
    model (value) {
      this.$nextTick(this.update)
    },
    min (value) {
      if (this.model < value) {
        this.model = value
        return
      }
      this.$nextTick(this.update)
    },
    max (value) {
      if (this.model > value) {
        this.model = value
        return
      }
      this.$nextTick(this.update)
    }
  },
  ready () {
    this.el = $(this.$el)

    this.update = debounce(this.update, 50)
    this.update()

    this.clickHandler = (event) => {
      if (Environment.runs.with.touch && event.eventPhase === Event.BUBBLING_PHASE) {
        // panning already dealt with this
        return
      }

      let
        range = this.max - this.min,
        percentage = Math.min(1, Math.max(0, event.offsetX / this.el.width()))

      this.model = parseFloat((this.min + percentage * range).toFixed(this.precision), 10)
    }

    this.el.click(this.clickHandler)
  },
  destroy () {
    this.el.off('click', this.clickHandler)
  }
}
</script>
