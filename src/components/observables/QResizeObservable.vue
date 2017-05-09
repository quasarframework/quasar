<template>
  <div class="absolute-full overflow-hidden invisible" style="z-index: -1">
    <div
      ref="expand"
      class="absolute-full overflow-hidden invisible"
      @scroll="onScroll"
    >
      <div ref="expandChild" class="absolute-top-left transition-0" style="width: 100000px; height: 100000px;"></div>
    </div>
    <div
      ref="shrink"
      class="absolute-full overflow-hidden invisible"
      @scroll="onScroll"
    >
      <div class="absolute-top-left transition-0" style="width: 200%; height: 200%;"></div>
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
  methods: {
    onScroll () {
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
      this.onScroll()
    })
  },
  beforeDestroy () {
    window.cancelAnimationFrame(this.timer)
    this.$emit('resize', {width: 0, height: 0})
  }
}
</script>
