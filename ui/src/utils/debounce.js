export default function (fn, wait = 250, immediate) {
  let timeout

  function debounced (/* ...args */) {
    const args = arguments

    const later = () => {
      timeout = void 0
      if (immediate !== true) {
        fn.apply(this, args)
      }
    }

    clearTimeout(timeout)
    if (immediate === true && timeout === void 0) {
      fn.apply(this, args)
    }
    timeout = setTimeout(later, wait)
  }

  debounced.cancel = () => {
    clearTimeout(timeout)
  }

  return debounced
}
