import { getCurrentInstance, onBeforeUnmount, onDeactivated, ref } from 'vue'

import debounce from '../../utils/debounce/debounce.js'
import { vmIsDestroyed } from '../../utils/private.vm/vm.js'
import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const { debounceFn, isDebouncePending } = useDebounce(fn[, wait[, immediate]])
 *
 * debounceFn         - the debounce() util applied to fn, dropping its
 *                      waiting call when the component gets destroyed or
 *                      deactivated
 * debounceFn.cancel  - drops the waiting call
 * debounceFn.flush   - runs the waiting call right away
 * isDebouncePending  - Ref<boolean>; true while a call to fn is waiting
 *
 * wait      - ms to wait after the last call (default: 250)
 * immediate - fn runs on the first call instead of the last one; the
 *             calls made during the wait period are swallowed
 *             (default: false)
 */

function ssrDebounceFn() {}
ssrDebounceFn.cancel = noop
ssrDebounceFn.flush = noop

// oxlint-disable-next-line default-param-last
export default function useDebounce(fn, wait = 250, immediate) {
  const isDebouncePending = ref(false)

  if (__QUASAR_SSR_SERVER__) {
    return { debounceFn: ssrDebounceFn, isDebouncePending }
  }

  const vm = getCurrentInstance()

  const debounced = debounce(
    function wrapped(...args) {
      // settled before fn runs: a call made from within fn waits anew
      isDebouncePending.value = false
      fn.apply(this, args)
    },
    wait,
    immediate
  )

  function debounceFn(...args) {
    if (!vmIsDestroyed(vm)) {
      debounced.apply(this, args)

      if (immediate !== true) {
        isDebouncePending.value = true
      }
    }
  }

  debounceFn.cancel = () => {
    debounced.cancel()
    isDebouncePending.value = false
  }

  debounceFn.flush = debounced.flush

  onDeactivated(debounceFn.cancel)
  onBeforeUnmount(debounceFn.cancel)

  return { debounceFn, isDebouncePending }
}
