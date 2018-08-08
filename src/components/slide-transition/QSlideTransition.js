export default {
  name: 'QSlideTransition',
  props: {
    appear: Boolean
  },
  methods: {
    __begin (el, height) {
      el.style.overflowY = 'hidden'
      el.style.height = `${height}px`
      el.classList.add('q-slide-transition')
      this.animating = true
    },
    __end (el, event) {
      el.style.overflowY = null
      el.style.height = null
      el.classList.remove('q-slide-transition')
      this.__cleanup()
      event !== this.lastEvent && this.$emit(event)
      this.animating = false
    },
    __cleanup () {
      clearTimeout(this.timer)
      this.el.removeEventListener('transitionend', this.animListener)
    }
  },
  beforeDestroy () {
    this.animating && this.__cleanup()
  },
  render (h) {
    return h('transition', {
      props: {
        css: false,
        appear: this.appear
      },
      on: {
        enter: (el, done) => {
          this.el = el

          if (this.animating !== true) {
            this.lastEvent = 'hide'
            this.__begin(el, 0)
          }

          this.timer = setTimeout(() => {
            el.style.height = `${el.scrollHeight}px`
            this.animListener = () => {
              this.__end(el, 'show')
              done()
            }
            el.addEventListener('transitionend', this.animListener)
          }, 100)
        },
        enterCancelled: this.__cleanup,
        leave: (el, done) => {
          this.el = el

          if (this.animating !== true) {
            this.lastEvent = 'show'
            this.__begin(el, el.scrollHeight)
          }

          this.timer = setTimeout(() => {
            el.style.height = 0
            this.animListener = () => {
              this.__end(el, 'hide')
              done()
            }
            el.addEventListener('transitionend', this.animListener)
          }, 100)
        },
        leaveCancelled: this.__cleanup
      }
    }, this.$slots.default)
  }
}
