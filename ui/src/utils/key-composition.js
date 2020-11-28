import Interaction from '../plugins/Interaction.js'

export function shouldIgnoreKey (evt) {
  return Interaction.isComposing === true ||
    Interaction.isKeyboard !== true ||
    evt !== Object(evt) ||
    evt.isComposing === true ||
    evt.target !== document.activeElement
}

export function isKeyCode (evt, keyCodes) {
  return shouldIgnoreKey(evt) === true
    ? false
    : [].concat(keyCodes).includes(evt.keyCode)
}
