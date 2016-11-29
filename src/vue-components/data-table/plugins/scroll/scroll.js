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
        this.$refs.head.scrollLeft = left
        if (this.$refs.stickyLeft) {
          this.$refs.stickyLeft.scrollTop = top
        }
        if (this.$refs.stickyRight) {
          this.$refs.stickyRight.scrollTop = top
        }
      })
    },
    mouseWheel (e) {
      this.$refs.body.scrollTop -= Utils.event.getMouseWheelDirection(e) * wheelOffset
    },
    resize () {
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
    }
  },
  watch: {
    $data: {
      deep: true,
      handler () {
        this.resize()
      }
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
