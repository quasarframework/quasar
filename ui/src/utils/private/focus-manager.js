let queue = []
let waitFlags = []

function clearFlag (flag) {
  waitFlags = waitFlags.filter(entry => entry !== flag)
}

export function addFocusWaitFlag (flag) {
  clearFlag(flag)
  waitFlags.push(flag)
}

export function removeFocusWaitFlag (flag) {
  clearFlag(flag)

  if (waitFlags.length === 0 && queue.length > 0) {
    // only call last focus handler (can't focus multiple things at once)
    queue[ queue.length - 1 ]()
    queue = []
  }
}

export function addFocusFn (fn) {
  if (waitFlags.length === 0) {
    fn()
  }
  else {
    queue.push(fn)
  }
}

export function removeFocusFn (fn) {
  queue = queue.filter(entry => entry !== fn)
}
