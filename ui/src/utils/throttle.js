export default function (fn, limit = 250) {
  let wait = false, result

  return function (/* ...args */) {
    if (wait === false) {
      wait = true
      setTimeout(() => { wait = false }, limit)
      result = fn.apply(this, arguments)
    }

    return result
  }
}
