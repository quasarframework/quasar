export default function (fn) {
  let wait = false, frame, callArgs

  function debounced (...args) {
    callArgs = args
    if (wait === true) { return }

    wait = true
    frame = requestAnimationFrame(() => {
      fn.apply(this, callArgs)
      wait = false
    })
  }

  debounced.cancel = () => {
    window.cancelAnimationFrame(frame)
    wait = false
  }

  return debounced
}
