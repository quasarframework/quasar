let queue = []
let waitFlags = []

let refocusing = false

// Focus events fire synchronously inside focus(), so the flag is up
// exactly while the restored element's focusin runs; QTooltip uses it to
// tell a portal's focus return apart from keyboard navigation (the
// browser may classify the return as :focus-visible)
export function refocus(el) {
  refocusing = true
  el.focus({ preventScroll: true })
  refocusing = false
}

export function isRefocusing() {
  return refocusing
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
