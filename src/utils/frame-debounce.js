export default function (fn) {
  let wait = false, frame

  function debounced (...args) {
    if (wait) { return }

    wait = true
    frame = requestAnimationFrame(() => {
      fn.apply(this, args)
      wait = false
    })
  }

  debounced.cancel = () => {
    window.cancelAnimationFrame(frame)
    wait = false
  }

  return debounced
}
