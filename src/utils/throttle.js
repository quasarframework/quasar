export default function (fn, limit = 250) {
  let wait = false
  let result

  return function (...args) {
    if (wait) {
      return result
    }

    wait = true
    result = fn.apply(this, args)
    setTimeout(() => {
      wait = false
    }, limit)
    return result
  }
}
