/*
 * options - true is shorthand for { leading: true, trailing: false }
 *   leading  - fn runs on the first call of a burst (default: false)
 *   trailing - fn runs once the calls stop for `wait` ms, with the last
 *              call's arguments; with `leading` on, only when calls were
 *              made after the leading one (default: true)
 *   maxWait  - fn runs at least once every maxWait ms while the calls
 *              keep coming; needs `trailing` (default: none)
 */
function parseOptions(options) {
  if (Object(options) === options) {
    const trailing = options.trailing ?? true
    return {
      leading: options.leading,
      trailing,
      maxWait:
        trailing && typeof options.maxWait === 'number'
          ? options.maxWait
          : void 0
    }
  }

  return options
    ? { leading: true, trailing: false }
    : { leading: false, trailing: true }
}

// oxlint-disable-next-line default-param-last
export default function debounce(fn, wait = 250, options) {
  const { leading, trailing, maxWait } = parseOptions(options)

  let timer = null,
    maxTimer = null,
    lastThis,
    lastArgs = null

  function run() {
    const context = lastThis
    const args = lastArgs

    lastThis = void 0
    lastArgs = null
    debounced.isPending = false

    fn.apply(context, args)
  }

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  function clearMaxTimer() {
    if (maxTimer !== null) {
      clearTimeout(maxTimer)
      maxTimer = null
    }
  }

  function onTimeout() {
    timer = null
    clearMaxTimer()

    if (lastArgs !== null) {
      run()
    }
  }

  // the wait period ends here, as if the calls had stopped
  function onMaxTimeout() {
    maxTimer = null
    clearTimer()

    if (lastArgs !== null) {
      run()
    }
  }

  function debounced(...args) {
    const isFirstCall = timer === null

    clearTimer()

    // armed before fn runs so a call made from within fn
    // lands in the wait period
    timer = setTimeout(onTimeout, wait)

    if (isFirstCall) {
      if (maxWait !== void 0) {
        maxTimer = setTimeout(onMaxTimeout, maxWait)
      }

      if (leading) {
        fn.apply(this, args)
        return
      }
    }

    if (trailing) {
      // oxlint-disable-next-line unicorn/no-this-assignment
      lastThis = this
      lastArgs = args
      debounced.isPending = true
    }
  }

  // assigned (never computed) at each transition: useDebounce() installs
  // an accessor on it to make it reactive
  debounced.isPending = false

  debounced.cancel = () => {
    clearTimer()
    clearMaxTimer()
    lastThis = void 0
    lastArgs = null
    debounced.isPending = false
  }

  debounced.flush = () => {
    if (lastArgs !== null) {
      clearTimer()
      clearMaxTimer()
      run()
    }
  }

  return debounced
}
