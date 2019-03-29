import Platform from '../plugins/Platform.js'

let handlers = []

export default {
  __install () {
    this.__installed = true
    const trigger = evt => {
      if (
        handlers.length !== 0 &&
        evt.defaultPrevented !== true &&
        (evt.type === 'click-outside' || evt.which === 27 || evt.keyCode === 27)
      ) {
        handlers[handlers.length - 1].fn(evt)
      }
    }
    window.addEventListener('keyup', trigger)
    window.addEventListener('click-outside', trigger)
  },

  register (comp, fn) {
    if (Platform.is.desktop === true) {
      this.__installed !== true && this.__install()
      handlers.push({ comp, fn })
    }
  },

  pop (comp) {
    if (Platform.is.desktop === true) {
      const index = handlers.findIndex(h => h.comp === comp)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }
}
