import Vue from 'vue'

import { slot } from '../../utils/private/slot.js'
import cache from '../../utils/private/cache.js'

export default Vue.extend({
  name: 'QSlideTransition',

  props: {
    appear: Boolean,
    duration: {
      type: Number,
      default: 300
    }
  },

  methods: {
    __begin (el, height, done) {
      // here overflowY is 'hidden'
      if (height !== void 0) {
        el.style.height = `${height}px`
      }
      el.style.transition = `height ${this.duration}ms cubic-bezier(.25, .8, .50, 1)`

      this.animating = true
      this.done = done
    },

    __end (el, event) {
      el.style.overflowY = null
      el.style.height = null
      el.style.transition = null
      this.__cleanup()
      event !== this.lastEvent && this.$emit(event)
    },

    __cleanup () {
      this.done && this.done()
      this.done = null
      this.animating = false

      clearTimeout(this.timer)
      clearTimeout(this.timerFallback)
      this.el !== void 0 && this.el.removeEventListener('transitionend', this.animListener)
      this.animListener = null
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
      on: cache(this, 'tr', {
        enter: (el, done) => {
          let pos = 0
          this.el = el

          // if animationg overflowY is already 'hidden'
          if (this.animating === true) {
            this.__cleanup()
            pos = el.offsetHeight === el.scrollHeight ? 0 : void 0
          }
          else {
            this.lastEvent = 'hide'
            el.style.overflowY = 'hidden'
          }

          this.__begin(el, pos, done)

          this.timer = setTimeout(() => {
            el.style.height = `${el.scrollHeight}px`
            this.animListener = evt => {
              if (Object(evt) !== evt || evt.target === el) {
                this.__end(el, 'show')
              }
            }
            el.addEventListener('transitionend', this.animListener)
            this.timerFallback = setTimeout(this.animListener, this.duration * 1.1)
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
            // we need to set overflowY 'hidden' before calculating the height
            // or else we get small differences
            el.style.overflowY = 'hidden'
            pos = el.scrollHeight
          }

          this.__begin(el, pos, done)

          this.timer = setTimeout(() => {
            el.style.height = 0
            this.animListener = evt => {
              if (Object(evt) !== evt || evt.target === el) {
                this.__end(el, 'hide')
              }
            }
            el.addEventListener('transitionend', this.animListener)
            this.timerFallback = setTimeout(this.animListener, this.duration * 1.1)
          }, 100)
        }
      })
    }, slot(this, 'default'))
  }
})
