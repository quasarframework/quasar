import {
  ReactiveEffect,
  getCurrentInstance,
  onBeforeUnmount,
  ref,
  toValue
} from 'vue'

import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const { url, stop } = useObjectUrl(source)
 *
 * source - Blob (File included) or MediaSource, as a plain value, a ref
 *          or a getter; null/undefined yields no URL
 *
 * url    - Ref<string | null>; the object URL of the current source
 * stop   - revokes the current URL and ends the tracking for good
 *
 * The previous URL is revoked whenever the source changes and when the
 * component gets destroyed.
 */

export default function useObjectUrl(source) {
  const url = ref(null)

  if (__QUASAR_SSR_SERVER__) {
    return { url, stop: noop }
  }

  let current = null,
    // the object behind `current`; the effect must not read the ref it
    // writes, and the same object keeps its URL across re-runs
    currentSource = null

  function release() {
    if (current !== null) {
      URL.revokeObjectURL(current)
      current = null
      currentSource = null
      url.value = null
    }
  }

  // a raw effect with a sync scheduler costs a fraction of watch();
  // it tracks whatever the source getter reads
  const effect = new ReactiveEffect(() => {
    const obj = toValue(source) ?? null

    if (obj === currentSource) return

    release()

    if (obj !== null) {
      current = URL.createObjectURL(obj)
      currentSource = obj
      url.value = current
    }
  })

  effect.scheduler = () => {
    effect.run()
  }

  effect.run()

  if (getCurrentInstance() !== null) {
    onBeforeUnmount(release)
  }

  return {
    url,

    stop() {
      release()
      effect.stop()
    }
  }
}
