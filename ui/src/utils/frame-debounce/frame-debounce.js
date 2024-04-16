export default function (fn) {
  let wait = false, frame, callArgs

  function debounced (/* ...args */) {
    callArgs = arguments
    if (wait === true) return

    wait = true
    frame = window.requestAnimationFrame(() => {
      fn.apply(this, callArgs)
      callArgs = void 0
      wait = false
    })
  }

  debounced.cancel = () => {
    window.cancelAnimationFrame(frame)
    wait = false
  }

  return debounced
}
