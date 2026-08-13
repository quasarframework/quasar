let lastKeyCompositionStatus = false

export function onKeyDownComposition(evt) {
  lastKeyCompositionStatus = evt.isComposing === true
}

export function shouldIgnoreKey(evt) {
  return (
    lastKeyCompositionStatus ||
    evt !== Object(evt) ||
    evt.isComposing ||
    evt.qKeyEvent
  )
}

// keyCodes: a number or a flat array of numbers
export function isKeyCode(evt, keyCodes) {
  return (
    !shouldIgnoreKey(evt) &&
    (Array.isArray(keyCodes)
      ? keyCodes.includes(evt.keyCode)
      : keyCodes === evt.keyCode)
  )
}
