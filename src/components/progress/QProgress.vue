<template>
  <div class="q-progress" :class="color ? `text-${color}` : ''">
    <div
      v-if="buffer && !indeterminate"
      class="q-progress-buffer"
      :style="bufferStyle"
    >&nbsp;</div>
    <div class="q-progress-track" :style="trackStyle">&nbsp;</div>
    <div
      class="q-progress-model"
      :style="modelStyle"
      :class="{
        animate: animate,
        stripe: stripe,
        indeterminate: indeterminate
      }"
    >&nbsp;</div>
  </div>
</template>

<script>
import { between } from '../../utils/format'

function width (val) {
  return {width: `${val}%`}
}

export default {
  name: 'q-progress',
  props: {
    percentage: {
      type: Number,
      default: 0
    },
    color: String,
    stripe: Boolean,
    animate: Boolean,
    indeterminate: Boolean,
    buffer: Number
  },
  computed: {
    model () {
      return between(this.percentage, 0, 100)
    },
    bufferModel () {
      return between(this.buffer || 0, 0, 100 - this.model)
    },
    modelStyle () {
      return width(this.model)
    },
    bufferStyle () {
      return width(this.bufferModel)
    },
    trackStyle () {
      return width(this.buffer ? 100 - this.buffer : 100)
    }
  }
}
</script>
