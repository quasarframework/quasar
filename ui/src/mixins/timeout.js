export default {
  created () {
    this.__tickFnList = []
    this.__timeoutFnList = []
  },

  deactivated () {
    this.__tickFnList.forEach(tick => { tick.removeTick() })
    this.__timeoutFnList.forEach(tick => { tick.removeTimeout() })
  },

  beforeDestroy () {
    this.__tickFnList.forEach(tick => { tick.removeTick() })
    this.__tickFnList = void 0

    this.__timeoutFnList.forEach(tick => { tick.removeTimeout() })
    this.__timeoutFnList = void 0
  },

  methods: {
    __useTick (registerFnName, removeFnName) {
      const tick = {
        removeTick () {
          tick.fn = void 0
        },

        registerTick: fn => {
          tick.fn = fn

          this.$nextTick(() => {
            if (tick.fn === fn) {
              // we also check if VM is destroyed, since if it
              // got to trigger one nextTick() we cannot stop it
              this._isDestroyed === false && tick.fn()
              tick.fn = void 0
            }
          })
        }
      }

      this.__tickFnList.push(tick)

      this[registerFnName] = tick.registerTick
      removeFnName !== void 0 && (this[removeFnName] = tick.removeTick)
    },

    __useTimeout (registerFnName, removeFnName) {
      const timeout = {
        removeTimeout () {
          clearTimeout(timeout.timer)
        },

        registerTimeout: (fn, delay) => {
          clearTimeout(timeout.timer)

          if (this._isDestroyed === false) {
            timeout.timer = setTimeout(fn, delay)
          }
        }
      }

      this.__timeoutFnList.push(timeout)

      this[registerFnName] = timeout.registerTimeout
      removeFnName !== void 0 && (this[removeFnName] = timeout.removeTimeout)
    }
  }
}
