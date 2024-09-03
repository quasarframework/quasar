export default function (fn, wait = 250, immediate) {
  let timer = null

  function debounced (/* ...args */) {
    const args = arguments

    const later = () => {
      timer = null
      if (immediate !== true) {
        fn.apply(this, args)
      }
    }

    if (timer !== null) {
      clearTimeout(timer)
    }
    else if (immediate === true) {
      fn.apply(this, args)
    }

    timer = setTimeout(later, wait)
  }

  debounced.cancel = () => {
    timer !== null && clearTimeout(timer)
  }

  return debounced
}
