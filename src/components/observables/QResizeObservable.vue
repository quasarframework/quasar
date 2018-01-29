<template>
  <div :style="absoluteFull" style="z-index: -1">
    <div
      ref="expand"
      :style="absoluteFull"
      @scroll="onResize"
    >
      <div ref="expandChild" :style="absoluteTop" style="width: 100000px; height: 100000px;"></div>
    </div>
    <div
      ref="shrink"
      :style="absoluteFull"
      @scroll="onResize"
    >
      <div :style="absoluteTop" style="width: 200%; height: 200%;"></div>
    </div>
  </div>
</template>

<script>
function getSize (el) {
  return {
    width: el.offsetWidth,
    height: el.offsetHeight
  }
}

export default {
  name: 'q-resize-observable',
  data: () => ({
    absoluteFull: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      visibility: 'hidden'
    },
    absoluteTop: {
      position: 'absolute',
      top: 0,
      left: 0,
      transition: '0s'
    }
  }),
  methods: {
    onResize () {
      const size = getSize(this.$el.parentNode)

      if (size.width === this.size.width && size.height === this.size.height) {
        return
      }

      if (!this.timer) {
        this.timer = window.requestAnimationFrame(this.emit)
      }

      this.size = size
    },
    emit () {
      this.timer = null
      this.reset()
      this.$emit('resize', this.size)
    },
    reset () {
      const ref = this.$refs
      if (ref.expand) {
        ref.expand.scrollLeft = 100000
        ref.expand.scrollTop = 100000
      }
      if (ref.shrink) {
        ref.shrink.scrollLeft = 100000
        ref.shrink.scrollTop = 100000
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.size = {}
      this.onResize()
    })
  },
  beforeDestroy () {
    window.cancelAnimationFrame(this.timer)
    this.$emit('resize', {width: 0, height: 0})
  }
}
</script>
