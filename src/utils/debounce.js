
export function debounce (fn, wait = 250, immediate) {
  let timeout

  // Prevents execution of debounced function, or noop if
  // never invoked/already executed
  function cancel () {
    if (timeout) {
      clearTimeout(timeout)
    }
  }

  function debounced (...args) {
    const later = () => {
      timeout = null
      if (!immediate) {
        fn.apply(this, args)
      }
    }

    clearTimeout(timeout)
    if (immediate && !timeout) {
      fn.apply(this, args)
    }
    timeout = setTimeout(later, wait)
  }

  debounced.cancel = cancel
  return debounced
}

export function frameDebounce (fn) {
  let wait = false

  return function (...args) {
    if (wait) { return }

    wait = true
    window.requestAnimationFrame(() => {
      fn.apply(this, args)
      wait = false
    })
  }
}
