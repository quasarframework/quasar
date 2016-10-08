
let now = Date.now

export default function (fn, wait = 250, immediate) {
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
    var callNow = immediate && !timeout

    context = this
    timestamp = now()
    params = args

    if (!timeout) {
      timeout = setTimeout(later, wait)
    }
    if (callNow) {
      result = fn.apply(context, args)
      context = params = null
    }

    return result
  }
}
