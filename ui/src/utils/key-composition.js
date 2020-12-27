let lastKeyCompositionStatus = false

export function onKeyDownComposition (evt) {
  lastKeyCompositionStatus = evt.isComposing === true
}

export function shouldIgnoreKey (evt) {
  return lastKeyCompositionStatus === true ||
    evt !== Object(evt) ||
    evt.isComposing === true ||
    evt.qKeyEvent === true
}

export function isKeyCode (evt, keyCodes) {
  return shouldIgnoreKey(evt) === true
    ? false
    : [].concat(keyCodes).includes(evt.keyCode)
}
