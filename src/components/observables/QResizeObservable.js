function getSize (el) {
  return {
    width: el.offsetWidth,
    height: el.offsetHeight
  }
}

export default {
  name: 'q-resize-observable',
  methods: {
    onResize () {
      const size = getSize(this.$el.parentNode)

      if (size.width === this.size.width && size.height === this.size.height) {
        return
      }

      if (!this.timer) {
        this.timer = setTimeout(this.emit, 32)
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
  render (h) {
    return h('div', {
      staticClass: 'absolute-full overflow-hidden invisible',
      style: 'z-index: -1;'
    }, [
      h('div', {
        ref: 'expand',
        staticClass: 'absolute-full overflow-hidden invisible',
        on: { scroll: this.onResize }
      }, [
        h('div', {
          ref: 'expandChild',
          staticClass: 'absolute-top-left transition-0',
          style: 'width: 100000px; height: 100000px;'
        })
      ]),
      h('div', {
        ref: 'shrink',
        staticClass: 'absolute-full overflow-hidden invisible',
        on: { scroll: this.onResize }
      }, [
        h('div', {
          staticClass: 'absolute-top-left transition-0',
          style: 'width: 200%; height: 200%;'
        })
      ])
    ])
  },
  mounted () {
    this.$nextTick(() => {
      this.size = {}
      this.onResize()
    })
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    this.$emit('resize', {width: 0, height: 0})
  }
}
