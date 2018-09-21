export default {
  name: 'QSlideTransition',
  props: {
    appear: Boolean,
    duration: {
      type: Number,
      default: 300
    }
  },
  methods: {
    __begin (el, height) {
      el.style.overflowY = 'hidden'
      if (height !== void 0) {
        el.style.height = `${height}px`
      }
      el.style.transition = `height ${this.duration}ms cubic-bezier(.25, .8, .50, 1)`
    },
    __end (el, event) {
      el.style.overflowY = null
      el.style.height = null
      el.style.transition = null
      this.__cleanup()
      event !== this.lastEvent && this.$emit(event)
    },
    __cleanup () {
      clearTimeout(this.timer)
      this.el.removeEventListener('transitionend', this.animListener)
      delete this.animListener
    }
  },
  beforeDestroy () {
    this.animListener && this.animListener()
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

          if (this.animListener) {
            pos = el.offsetHeight
            this.animListener()
          }
          else {
            this.lastEvent = 'hide'
          }

          this.__begin(el, pos)

          this.animListener = () => {
            this.__end(el, 'show')
            done()
          }
          this.timer = setTimeout(() => {
            el.style.height = `${el.scrollHeight}px`
            el.addEventListener('transitionend', this.animListener)
          }, 100)
        },
        leave: (el, done) => {
          let pos
          this.el = el

          if (this.animListener) {
            pos = el.offsetHeight
            this.animListener()
          }
          else {
            this.lastEvent = 'show'
            pos = el.scrollHeight
          }

          this.__begin(el, pos)

          this.animListener = () => {
            this.__end(el, 'hide')
            done()
          }
          this.timer = setTimeout(() => {
            el.style.height = 0
            el.addEventListener('transitionend', this.animListener)
          }, 100)
        }
      }
    }, this.$slots.default)
  }
}
