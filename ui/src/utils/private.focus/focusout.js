const handlers = []

function trigger(e) {
  handlers.at(-1)(e)
}

// registered on every platform: a hardware keyboard can Tab focus out
// of a modal on mobile devices too, and the handlers only run while a
// popup that owns the focus is open
export function addFocusout(fn) {
  handlers.push(fn)

  if (handlers.length === 1) {
    document.body.addEventListener('focusin', trigger)
  }
}

export function removeFocusout(fn) {
  const index = handlers.indexOf(fn)
  if (index !== -1) {
    handlers.splice(index, 1)

    if (handlers.length === 0) {
      document.body.removeEventListener('focusin', trigger)
    }
  }
}
