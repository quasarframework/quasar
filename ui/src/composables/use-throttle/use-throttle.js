import { getCurrentInstance, onBeforeUnmount, onDeactivated, ref } from 'vue'

import throttle from '../../utils/throttle/throttle.js'
import { vmIsDestroyed } from '../../utils/private.vm/vm.js'
import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const {
 *      throttleFn, cancelThrottle, flushThrottle, isThrottlePending
 *    } = useThrottle(fn[, limit[, options]])
 *
 * throttleFn        - the throttle() util applied to fn, dropping its
 *                     waiting call when the component gets destroyed or
 *                     deactivated
 * cancelThrottle    - drops the waiting call and closes the window
 * flushThrottle     - runs the waiting call right away, as if the window
 *                     had just ended (a fresh one opens)
 * isThrottlePending - Ref<boolean>; true while a call to fn is waiting
 *                     (a trailing run)
 *
 * limit   - ms between two runs (default: 250)
 * options - plain object of:
 *    trailing - fn runs once more at the end of the window when calls
 *               were made during it, with the last call's arguments
 *               (default: false, those calls are dropped)
 */

// oxlint-disable-next-line default-param-last
export default function useThrottle(fn, limit = 250, options) {
  const isThrottlePending = ref(false)

  if (__QUASAR_SSR_SERVER__) {
    return {
      throttleFn: noop,
      cancelThrottle: noop,
      flushThrottle: noop,
      isThrottlePending
    }
  }

  const trailing = options?.trailing === true
  const vm = getCurrentInstance()

  let ranNow = false

  const throttled = throttle(
    function throttled(...args) {
      ranNow = true
      // settled before fn runs: a call made from within fn waits anew
      isThrottlePending.value = false
      return fn.apply(this, args)
    },
    limit,
    options
  )

  function cancelThrottle() {
    throttled.cancel()
    isThrottlePending.value = false
  }

  onDeactivated(cancelThrottle)
  onBeforeUnmount(cancelThrottle)

  return {
    throttleFn(...args) {
      if (vm !== null && vmIsDestroyed(vm)) return

      ranNow = false
      const result = throttled.apply(this, args)

      if (trailing && !ranNow) {
        isThrottlePending.value = true
      }

      return result
    },

    cancelThrottle,
    flushThrottle: throttled.flush,
    isThrottlePending
  }
}
