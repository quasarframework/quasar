// this file will eventually be removed
// and superseeded by use-tick.js / use-timeout.js
// after all components use composition api

/*
 * Usage of nextTick:
 *    this.__nextTick(fn)
 *    this.__nextTick(fn)
 *    ....
 *    this.__prepareTick()
 */

export default {
  methods: {
    __nextTick (fn) {
      this.__tickFn = fn
    },

    __prepareTick () {
      if (this.__tickFn !== void 0) {
        const fn = this.__tickFn
        this.$nextTick(() => {
          if (this.__tickFn === fn) {
            this.__tickFn()
            this.__tickFn = void 0
          }
        })
      }
    },

    __clearTick () {
      this.__tickFn = void 0
    },

    __setTimeout (fn, delay) {
      clearTimeout(this.__timer)
      this.__timer = setTimeout(fn, delay)
    },

    __clearTimeout () {
      clearTimeout(this.__timer)
    }
  },

  beforeUnmount () {
    this.__tickFn = void 0
    clearTimeout(this.__timer)
  }
}
