let queue = []
const waitFlags = []

export function addFocusWaitFlag (flag) {
  waitFlags.push(flag)
}

export function removeFocusWaitFlag (flag) {
  const index = waitFlags.indexOf(flag)
  if (index !== -1) {
    waitFlags.splice(index, 1)
  }

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
    return fn
  }
}

export function removeFocusFn (fn) {
  const index = queue.indexOf(fn)
  if (index !== -1) {
    queue.splice(index, 1)
  }
}
