
const now = Date.now

export function debounce (fn, wait = 250, immediate) {
  let
    timeout, params, context, timestamp, result,
    later = () => {
      let last = now() - timestamp

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last)
      }
      else {
        timeout = null
        if (!immediate) {
          result = fn.apply(context, params)
          if (!timeout) {
            context = params = null
          }
        }
      }
    }

  return function (...args) {
    context = this
    timestamp = now()
    params = args

    if (!timeout) {
      timeout = setTimeout(later, wait)
    }
    if (immediate && !timeout) {
      result = fn.apply(context, args)
      context = params = null
    }

    return result
  }
}

export function frameDebounce (fn) {
  let
    wait = false,
    param

  return function (...args) {
    param = args
    if (wait) {
      return
    }

    wait = true
    window.requestAnimationFrame(() => {
      fn.apply(this, param)
      wait = false
    })
  }
}
