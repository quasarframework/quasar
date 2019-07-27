export function initHook () {
  let listeners = {}

  if (window.hasOwnProperty('__Q_BEX_HOOK__')) return

  const hook = {
    Vue: null,

    _buffer: [],

    _replayBuffer (event) {
      let buffer = this._buffer
      this._buffer = []

      for (let i = 0, l = buffer.length; i < l; i++) {
        let allArgs = buffer[i]
        allArgs[0] === event
          ? this.emit.apply(this, allArgs)
          : this._buffer.push(allArgs)
      }
    },

    on (event, fn) {
      const $event = '$' + event
      if (listeners[$event]) {
        listeners[$event].push(fn)
      } else {
        listeners[$event] = [fn]
        this._replayBuffer(event)
      }
    },

    once (event, fn) {
      function on () {
        this.off(event, on)
        fn.apply(this, arguments)
      }
      this.on(event, on)
    },

    off (event, fn) {
      event = '$' + event
      if (!arguments.length) {
        listeners = {}
      } else {
        const cbs = listeners[event]
        if (cbs) {
          if (!fn) {
            listeners[event] = null
          } else {
            for (let i = 0, l = cbs.length; i < l; i++) {
              const cb = cbs[i]
              if (cb === fn || cb.fn === fn) {
                cbs.splice(i, 1)
                break
              }
            }
          }
        }
      }
    },

    emit (event) {
      const $event = '$' + event
      let cbs = listeners[$event]
      if (cbs) {
        const eventArgs = [].slice.call(arguments, 1)
        cbs = cbs.slice()
        for (let i = 0, l = cbs.length; i < l; i++) {
          cbs[i].apply(this, eventArgs)
        }
      } else {
        const allArgs = [].slice.call(arguments)
        this._buffer.push(allArgs)
      }
    }
  }

  hook.once('init', Vue => {
    hook.Vue = Vue
  })

  Object.defineProperty(window, '__Q_BEX_HOOK__', {
    get () {
      return hook
    }
  })
}
