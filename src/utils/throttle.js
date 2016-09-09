export default function (fn, limit = 250) {
  let wait = false

  return function (...args) {
    if (wait) {
      return
    }

    wait = true
    fn.apply(this, args)
    setTimeout(() => {
      wait = false
    }, limit)
  }
}
