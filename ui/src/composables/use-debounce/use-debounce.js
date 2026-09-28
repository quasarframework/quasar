import { getCurrentInstance, onBeforeUnmount, onDeactivated, ref } from 'vue'

import debounce from '../../utils/debounce/debounce.js'
import { vmIsDestroyed } from '../../utils/private.vm/vm.js'
import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const {
 *      debounceFn, cancelDebounce, flushDebounce, isDebouncePending
 *    } = useDebounce(fn[, wait[, options]])
 *
 * debounceFn        - the debounce() util applied to fn, dropping its
 *                     waiting call when the component gets destroyed or
 *                     deactivated
 * cancelDebounce    - drops the waiting call
 * flushDebounce     - runs the waiting call right away
 * isDebouncePending - Ref<boolean>; true while a call to fn is waiting
 *
 * wait    - ms to wait after the last call (default: 250)
 * options - plain object of:
 *    immediate - fn runs on the first call instead of the last one; the
 *                calls made during the wait period are swallowed
 *                (default: false)
 */

// oxlint-disable-next-line default-param-last
export default function useDebounce(fn, wait = 250, options) {
  const isDebouncePending = ref(false)

  if (__QUASAR_SSR_SERVER__) {
    return {
      debounceFn: noop,
      cancelDebounce: noop,
      flushDebounce: noop,
      isDebouncePending
    }
  }

  const immediate = options?.immediate === true
  const vm = getCurrentInstance()

  const debounced = debounce(
    function debounced(...args) {
      // settled before fn runs: a call made from within fn waits anew
      isDebouncePending.value = false
      fn.apply(this, args)
    },
    wait,
    immediate
  )

  function cancelDebounce() {
    debounced.cancel()
    isDebouncePending.value = false
  }

  onDeactivated(cancelDebounce)
  onBeforeUnmount(cancelDebounce)

  return {
    debounceFn(...args) {
      if (vm !== null && vmIsDestroyed(vm)) return

      debounced.apply(this, args)

      if (!immediate) {
        isDebouncePending.value = true
      }
    },

    cancelDebounce,
    flushDebounce: debounced.flush,
    isDebouncePending
  }
}
