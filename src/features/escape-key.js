import Platform from './platform'

let handlers = []

if (Platform.is.desktop) {
  window.addEventListener('keyup', evt => {
    if (handlers.length === 0) {
      return
    }

    if (evt.which === 27 || evt.keyCode === 27) {
      handlers[handlers.length - 1]()
    }
  })
}

export default {
  register (handler) {
    if (Platform.is.desktop) {
      handlers.push(handler)
    }
  },
  pop () {
    if (Platform.is.desktop) {
      handlers.pop()
    }
  }
}
