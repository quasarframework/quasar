let queue = []
let waitFlags = []

let refocusTarget = null

export function isRefocusing(target) {
  return refocusTarget !== null && target === refocusTarget
}

// Native focus events run during focus(). Mark only the restored target
// so a tooltip can distinguish a portal's focus return from navigation.
export function refocus(target) {
  const previousTarget = refocusTarget
  refocusTarget = target

  try {
    target.focus({ preventScroll: true })
  } finally {
    refocusTarget = previousTarget
  }
}

function clearFlag(flag) {
  waitFlags = waitFlags.filter(entry => entry !== flag)
}

export function addFocusWaitFlag(flag) {
  clearFlag(flag)
  waitFlags.push(flag)
}

export function removeFocusWaitFlag(flag) {
  clearFlag(flag)

  if (waitFlags.length === 0 && queue.length !== 0) {
    // only call last focus handler (can't focus multiple things at once)
    queue.at(-1)()
    queue = []
  }
}

export function addFocusFn(fn) {
  if (waitFlags.length === 0) {
    fn()
  } else {
    queue.push(fn)
  }
}

export function removeFocusFn(fn) {
  queue = queue.filter(entry => entry !== fn)
}
