let lastKeyCompositionStatus = false

export function onKeyDownComposition (evt) {
  lastKeyCompositionStatus = evt.isComposing === true
}

export function ignoreKey (evt) {
  return lastKeyCompositionStatus === true ||
    evt !== Object(evt) ||
    evt.isComposing === true ||
    evt.qKeyEvent === true
}

export function testKeyCodes (evt, keyCodes) {
  if (
    lastKeyCompositionStatus === true ||
    evt !== Object(evt) ||
    evt.isComposing === true ||
    evt.qKeyEvent === true
  ) {
    return false
  }

  return [].concat(keyCodes).indexOf(evt.keyCode) > -1
}
