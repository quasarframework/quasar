<template>
  <div class="q-progress">
    <div class="q-progress-track" :style="trackStyle">&nbsp;</div>
    <div v-if="hasBuffer" class="q-progress-buffer" :style="bufferStyle">&nbsp;</div>
    <div class="q-progress-model" :style="modelStyle">&nbsp;</div>
  </div>
</template>

<script>
import Utils from '../../utils'

function width (model) {
  return {width: Utils.format.between(model, 0, 100) + '%'}
}

export default {
  props: {
    percentage: {
      type: Number,
      default: 0
    },
    buffer: {
      type: Number,
      default: -1
    }
  },
  computed: {
    modelStyle () {
      return width(this.percentage)
    },
    bufferStyle () {
      if (this.hasBuffer) {
        return width(this.buffer)
      }
    },
    trackStyle () {
      return width(this.hasBuffer ? 100 - this.buffer : 100)
    },
    hasBuffer () {
      return this.buffer !== -1
    }
  }
}
</script>
