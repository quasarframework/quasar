<template>
  <div class="q-progress">
    <div class="q-progress-track" :style="trackStyle">&nbsp;</div>
    <div v-if="buffer" class="q-progress-buffer" :style="bufferStyle">&nbsp;</div>
    <div class="q-progress-model" :style="modelStyle">&nbsp;</div>
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
