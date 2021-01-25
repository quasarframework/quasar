import { client } from '../../plugins/Platform.js'

const handlers = []

function trigger (e) {
  handlers[ handlers.length - 1 ](e)
}

export function addFocusout (fn) {
  if (client.is.desktop === true) {
    handlers.push(fn)

    if (handlers.length === 1) {
      document.body.addEventListener('focusin', trigger)
    }
  }
}

export function removeFocusout (fn) {
  const index = handlers.indexOf(fn)
  if (index > -1) {
    handlers.splice(index, 1)

    if (handlers.length === 0) {
      document.body.removeEventListener('focusin', trigger)
    }
  }
}
