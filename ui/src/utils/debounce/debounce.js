// oxlint-disable-next-line default-param-last
export default function debounce(fn, wait = 250, immediate) {
  let timer = null

  function debounced(...args) {
    const later = () => {
      timer = null
      if (!immediate) fn.apply(this, args)
    }

    if (timer !== null) {
      clearTimeout(timer)
    } else if (immediate) {
      fn.apply(this, args)
    }

    timer = setTimeout(later, wait)
  }

  debounced.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  return debounced
}
