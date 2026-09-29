import { onBeforeUnmount, onDeactivated, ref } from 'vue'

import debounce from '../../utils/debounce/debounce.js'
import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const debounceFn = useDebounce(fn[, wait[, options]])
 *
 * debounceFn           - the debounce() util applied to fn, dropping its
 *                        waiting call when the component gets destroyed or
 *                        deactivated
 * debounceFn.cancel    - drops the waiting call
 * debounceFn.flush     - runs the waiting call right away
 * debounceFn.isPending - reactive (Boolean); true while a call to fn is
 *                        waiting; computed(() => debounceFn.isPending) when
 *                        a Ref is needed (toRef() would treat the function
 *                        as a getter)
 *
 * wait    - ms to wait after the last call (default: 250)
 * options - the debounce() util's: true, or { leading, trailing, maxWait }
 *           (default: { leading: false, trailing: true })
 */

function ssrDebounceFn() {}
ssrDebounceFn.cancel = noop
ssrDebounceFn.flush = noop
ssrDebounceFn.isPending = false

// oxlint-disable-next-line default-param-last
export default function useDebounce(fn, wait = 250, options) {
  if (__QUASAR_SSR_SERVER__) return ssrDebounceFn

  const debounced = debounce(fn, wait, options)
  const isPending = ref(false)

  // the util assigns isPending at each transition; route it through a Ref
  Object.defineProperty(debounced, 'isPending', {
    get: () => isPending.value,
    set: value => {
      isPending.value = value
    }
  })

  onDeactivated(debounced.cancel)
  onBeforeUnmount(debounced.cancel)

  return debounced
}
