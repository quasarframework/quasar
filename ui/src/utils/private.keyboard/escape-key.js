import { client } from '../../plugins/platform/Platform.js'
import { isKeyCode } from '../private.keyboard/key-composition.js'

const handlers = []
let escDown

function onKeydown(evt) {
  if (evt.keyCode === 27) {
    escDown = true
  }
}

function onBlur() {
  if (escDown) {
    escDown = false
  }
}

function onKeyup(evt) {
  if (escDown && isKeyCode(evt, 27)) {
    escDown = false
    handlers.at(-1)(evt)
  }
}

function update(action) {
  window[action]('keydown', onKeydown)
  window[action]('blur', onBlur)
  window[action]('keyup', onKeyup)
  escDown = false
}

export function addEscapeKey(fn) {
  if (client.is.desktop) {
    handlers.push(fn)

    if (handlers.length === 1) {
      update('addEventListener')
    }
  }
}

export function removeEscapeKey(fn) {
  const index = handlers.indexOf(fn)
  if (index !== -1) {
    handlers.splice(index, 1)

    if (handlers.length === 0) {
      update('removeEventListener')
    }
  }
}
