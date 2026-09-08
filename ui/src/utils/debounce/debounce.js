// oxlint-disable-next-line default-param-last
export default function debounce(fn, wait = 250, immediate) {
  let timer = null

  function debounced(...args) {
    const callNow = immediate && timer === null
    const later = () => {
      timer = null
      if (!immediate) fn.apply(this, args)
    }

    if (timer !== null) {
      clearTimeout(timer)
    }

    timer = setTimeout(later, wait)
    if (callNow) fn.apply(this, args)
  }

  debounced.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  return debounced
}
