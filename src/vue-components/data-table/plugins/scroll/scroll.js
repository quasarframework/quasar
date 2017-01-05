import Utils from '../../../../utils'
const wheelOffset = 40

export default {
  data () {
    return {
      scroll: {
        horiz: 0,
        vert: 0
      }
    }
  },
  methods: {
    scrollHandler (e) {
      const
        left = e.currentTarget.scrollLeft,
        top = e.currentTarget.scrollTop

      requestAnimationFrame(() => {
        if (this.$refs.head) {
          this.$refs.head.scrollLeft = left
        }
        this.updateStickyScroll(top)
      })
    },
    mouseWheel (e) {
      if (!this.scroll.vert) {
        return
      }

      let body = this.$refs.body
      body.scrollTop -= Utils.event.getMouseWheelDirection(e) * wheelOffset
      if (body.scrollTop > 0 && body.scrollTop + body.clientHeight < body.scrollHeight) {
        e.preventDefault()
      }
    },
    resize () {
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          if (this.responsive) {
            return
          }
          const
            body = this.$refs.body,
            size = Utils.scrollbar.width()

          this.scroll.horiz = size && body.clientWidth < body.scrollWidth ? size + 'px' : 0
          this.scroll.vert = size && body.scrollHeight > body.clientHeight ? size + 'px' : 0
        })
      })
    },
    updateStickyScroll (top) {
      if (this.$refs.stickyLeft) {
        this.$refs.stickyLeft.scrollTop = top
      }
      if (this.$refs.stickyRight) {
        this.$refs.stickyRight.scrollTop = top
      }
    }
  },
  watch: {
    $data: {
      deep: true,
      handler () {
        this.resize()
      }
    },
    bodyStyle: {
      deep: true,
      handler () {
        this.$nextTick(() => {
          this.resize()
        })
      }
    },
    rowStyle: {
      deep: true,
      handler () {
        this.$nextTick(() => {
          this.resize()
        })
      }
    },
    rightStickyColumns () {
      this.$nextTick(() => {
        this.updateStickyScroll(this.$refs.body.scrollTop)
      })
    },
    leftStickyColumns () {
      this.$nextTick(() => {
        this.updateStickyScroll(this.$refs.body.scrollTop)
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.resize()
      window.addEventListener('resize', this.resize)
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  }
}
