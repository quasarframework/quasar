export default {
  name: 'QSlideTransition',
  props: {
    appear: Boolean
  },
  methods: {
    __begin (el, height) {
      el.style.overflowY = 'hidden'
      if (height !== void 0) {
        el.style.height = `${height}px`
      }
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
          let pos = 0
          this.el = el

          if (this.animating === true) {
            this.__cleanup()
            pos = el.offsetHeight === el.scrollHeight ? 0 : void 0
          }
          else {
            this.lastEvent = 'hide'
          }

          this.__begin(el, pos)

          this.timer = setTimeout(() => {
            el.style.height = `${el.scrollHeight}px`
            this.animListener = () => {
              this.__end(el, 'show')
              done()
            }
            el.addEventListener('transitionend', this.animListener)
          }, 100)
        },
        leave: (el, done) => {
          let pos
          this.el = el

          if (this.animating === true) {
            this.__cleanup()
          }
          else {
            this.lastEvent = 'show'
            pos = el.scrollHeight
          }

          this.__begin(el, pos)

          this.timer = setTimeout(() => {
            el.style.height = 0
            this.animListener = () => {
              this.__end(el, 'hide')
              done()
            }
            el.addEventListener('transitionend', this.animListener)
          }, 100)
        }
      }
    }, this.$slots.default)
  }
}
