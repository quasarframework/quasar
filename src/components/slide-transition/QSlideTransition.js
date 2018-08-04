export default {
  name: 'QSlideTransition',
  props: {
    appear: Boolean
  },
  methods: {
    __cleanup () {
      if (this.animListener) {
        this.el.removeEventListener('transitionend', this.animListener)
      }
      clearTimeout(this.timer)
      this.timer = null
    },
    __finalize (el) {
      el.style.overflowY = null
      el.style.height = null
      el.classList.remove('q-slide-transition')
      this.__cleanup()
    }
  },
  beforeDestroy () {
    this.__cleanup()
  },
  render (h) {
    return h('transition', {
      props: {
        mode: 'out-in',
        css: false,
        appear: this.appear
      },
      on: {
        enter: (el, done) => {
          this.animListener = () => {
            this.$emit('show')
            this.__finalize(el)
            done()
          }
          el.addEventListener('transitionend', this.animListener)
          this.el = el

          if (!this.timer) {
            // Get height that is to be scrolled
            el.style.overflowY = 'hidden'
            el.style.height = 0
            el.classList.add('q-slide-transition')
          }

          this.timer = setTimeout(() => {
            el.style.height = !el.scrollHeight
              ? 'auto'
              : `${el.scrollHeight}px`
          }, 1)
        },
        enterCancelled: () => {
          this.__cleanup()
        },
        leave: (el, done) => {
          this.animListener = () => {
            this.$emit('hide')
            this.__finalize(el)
            done()
          }
          el.addEventListener('transitionend', this.animListener)
          this.el = el

          if (!this.timer) {
            // Set height before we transition to 0
            el.style.overflowY = 'hidden'
            el.style.height = `${el.scrollHeight}px`
            el.classList.add('q-slide-transition')
          }

          this.timer = setTimeout(() => { el.style.height = 0 }, 1)
        },
        leaveCancelled: () => {
          this.__cleanup()
        }
      }
    }, this.$slots.default)
  }
}
