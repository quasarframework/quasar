import { client } from '../../plugins/Platform.js'
import { isKeyCode } from './key-composition.js'

const handlers = []
let escDown

function onKeydown (evt) {
  escDown = evt.keyCode === 27
}

function onBlur () {
  if (escDown === true) {
    escDown = false
  }
}

function onKeyup (evt) {
  if (escDown === true) {
    escDown = false

    if (isKeyCode(evt, 27) === true) {
      handlers[ handlers.length - 1 ](evt)
    }
  }
}

function update (action) {
  window[ action ]('keydown', onKeydown)
  window[ action ]('blur', onBlur)
  window[ action ]('keyup', onKeyup)
  escDown = false
}

export function addEscapeKey (fn) {
  if (client.is.desktop === true) {
    handlers.push(fn)

    if (handlers.length === 1) {
      update('addEventListener')
    }
  }
}

export function removeEscapeKey (fn) {
  const index = handlers.indexOf(fn)
  if (index > -1) {
    handlers.splice(index, 1)

    if (handlers.length === 0) {
      update('removeEventListener')
    }
  }
}
