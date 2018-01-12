
export function debounce (fn, wait = 250, immediate) {
  let timeout

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

  debounced.cancel = () => {
    clearTimeout(timeout)
  }

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
