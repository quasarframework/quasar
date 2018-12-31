import Platform from '../plugins/Platform.js'

let handlers = []

export default {
  __install () {
    this.__installed = true
    window.addEventListener('keyup', evt => {
      if (handlers.length === 0) {
        return
      }

      if (evt.which === 27 || evt.keyCode === 27) {
        handlers[handlers.length - 1]()
      }
    })
  },

  register (handler) {
    if (Platform.is.desktop) {
      !this.__installed && this.__install()
      handlers.push(handler)
    }
  },

  pop () {
    if (Platform.is.desktop) {
      handlers.pop()
    }
  }
}
