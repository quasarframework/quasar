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
  props: {
    detect: {
      type: String,
      validator: v => ['both', 'width', 'height'].includes(v),
      default: 'both'
    }
  },
  data () {
    return {
      size: {}
    }
  },
  computed: {
    detectWidth () {
      return ['both', 'width'].includes(this.detect)
    },
    detectHeight () {
      return ['both', 'height'].includes(this.detect)
    }
  },
  methods: {
    onScroll () {
      const
        size = getSize(this.$el.parentNode),
        w = size.width !== this.size.width,
        h = size.height !== this.size.height

      if (!this.timer && ((this.detectWidth && w) || (this.detectHeight && h))) {
        this.timer = window.requestAnimationFrame(this.__trigger)
      }

      if (w || h) {
        this.size = size
        this.__reset()
      }
    },
    __trigger () {
      this.timer = null
      alert('resize')
      this.$emit('resize', this.size)
    },
    __reset () {
      const ref = this.$refs
      ref.expand.scrollLeft = 100000
      ref.expand.scrollTop = 100000
      ref.shrink.scrollLeft = 100000
      ref.shrink.scrollTop = 100000
    }
  },
  mounted () {
    this.size = getSize(this.$el.parentNode)
    this.__reset()
  }
}
</script>
