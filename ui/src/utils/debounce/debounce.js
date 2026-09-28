// oxlint-disable-next-line default-param-last
export default function debounce(fn, wait = 250, immediate) {
  let timer = null,
    lastThis,
    lastArgs = null

  function run() {
    const context = lastThis
    const args = lastArgs

    lastThis = void 0
    lastArgs = null

    fn.apply(context, args)
  }

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  function onTimeout() {
    timer = null

    if (lastArgs !== null) {
      run()
    }
  }

  function debounced(...args) {
    const callNow = immediate && timer === null

    clearTimer()

    // armed before fn runs so a call made from within fn
    // lands in the wait period
    timer = setTimeout(onTimeout, wait)

    if (callNow) {
      fn.apply(this, args)
    } else if (!immediate) {
      // oxlint-disable-next-line unicorn/no-this-assignment
      lastThis = this
      lastArgs = args
    }
  }

  debounced.cancel = () => {
    clearTimer()
    lastThis = void 0
    lastArgs = null
  }

  debounced.flush = () => {
    if (lastArgs !== null) {
      clearTimer()
      run()
    }
  }

  return debounced
}
