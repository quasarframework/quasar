// oxlint-disable-next-line default-param-last
export default function throttle(fn, limit = 250, trailing) {
  let timer = null,
    lastThis,
    lastArgs = null,
    result

  function run() {
    const context = lastThis
    const args = lastArgs

    lastThis = void 0
    lastArgs = null

    result = fn.apply(context, args)
  }

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  // the trailing run counts as a run of its own: a new window opens
  // (before fn runs, so a call made from within fn lands in it)
  function runTrailing() {
    timer = setTimeout(onTimeout, limit)
    run()
  }

  function onTimeout() {
    timer = null

    if (lastArgs !== null) {
      runTrailing()
    }
  }

  function throttled(...args) {
    if (timer === null) {
      timer = setTimeout(onTimeout, limit)
      result = fn.apply(this, args)
    } else if (trailing) {
      // oxlint-disable-next-line unicorn/no-this-assignment
      lastThis = this
      lastArgs = args
    }

    return result
  }

  throttled.cancel = () => {
    clearTimer()
    lastThis = void 0
    lastArgs = null
  }

  throttled.flush = () => {
    if (lastArgs !== null) {
      clearTimer()
      runTrailing()
    }
  }

  return throttled
}
