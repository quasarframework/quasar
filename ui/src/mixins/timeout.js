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

  beforeDestroy () {
    this.__tickFn = void 0
    clearTimeout(this.__timer)
  }
}
