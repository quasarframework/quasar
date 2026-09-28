import { getCurrentInstance, onBeforeUnmount, onDeactivated } from 'vue'

import throttle from '../../utils/throttle/throttle.js'
import { vmIsDestroyed } from '../../utils/private.vm/vm.js'
import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const throttleFn = useThrottle(fn[, limit[, trailing]])
 *
 * throttleFn         - the throttle() util applied to fn, dropping its
 *                      waiting call when the component gets destroyed or
 *                      deactivated
 * throttleFn.cancel  - drops the waiting call and closes the window
 * throttleFn.flush   - runs the waiting call right away, as if the window
 *                      had just ended (a fresh one opens)
 *
 * limit    - ms between two runs (default: 250)
 * trailing - fn runs once more at the end of the window when calls were
 *            made during it, with the last call's arguments
 *            (default: false, those calls are dropped)
 */

function ssrThrottleFn() {}
ssrThrottleFn.cancel = noop
ssrThrottleFn.flush = noop

// oxlint-disable-next-line default-param-last
export default function useThrottle(fn, limit = 250, trailing) {
  if (__QUASAR_SSR_SERVER__) return ssrThrottleFn

  const vm = getCurrentInstance()
  const throttled = throttle(fn, limit, trailing)

  function throttleFn(...args) {
    if (!vmIsDestroyed(vm)) {
      return throttled.apply(this, args)
    }
  }

  throttleFn.cancel = throttled.cancel
  throttleFn.flush = throttled.flush

  onDeactivated(throttled.cancel)
  onBeforeUnmount(throttled.cancel)

  return throttleFn
}
