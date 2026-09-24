import {
  ReactiveEffect,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  toValue
} from 'vue'

import { getTargetElement } from '../../utils/private.vm/vm.js'
import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const { width, height, refresh, stop } = useElementResize(options)
 *
 * options - plain object, ref or getter of:
 *    target   - ref (or getter) of an Element or a component instance;
 *               defaults to the root element of the current component
 *    debounce - ms between two measurements (0 - measure on every change)
 *    disabled - pause observing
 *    onResize - called with { width, height } whenever the size changes
 */

export default function useElementResize(options) {
  const width = ref(0)
  const height = ref(0)

  if (__QUASAR_SSR_SERVER__) {
    return { width, height, refresh: noop, stop: noop }
  }

  const vm = getCurrentInstance()

  let el = null,
    observer = null,
    timer = null,
    debounce = 0,
    onResize,
    // -1 so that the first measurement always reports, even a 0x0 box
    size = { width: -1, height: -1 }

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  function measure() {
    clearTimer()

    if (observer === null) return

    const { offsetWidth, offsetHeight } = el

    if (offsetWidth !== size.width || offsetHeight !== size.height) {
      size = { width: offsetWidth, height: offsetHeight }
      width.value = offsetWidth
      height.value = offsetHeight
      onResize?.(size)
    }
  }

  // at most one measurement per debounce window; the observer reports
  // per frame anyway, so a 0 debounce is not a hot path
  function schedule() {
    if (debounce > 0) {
      if (timer === null) {
        timer = setTimeout(measure, debounce)
      }
    } else {
      measure()
    }
  }

  function release() {
    clearTimer()

    if (observer !== null) {
      observer.disconnect()
      observer = null
    }
  }

  // a raw effect with a sync scheduler costs a fraction of watch();
  // it tracks whatever the options (and a target ref) read
  const effect = new ReactiveEffect(() => {
    const opts = toValue(options) ?? {}
    const newEl = getTargetElement(opts.target, vm)

    debounce = Number(opts.debounce) || 0
    onResize = opts.onResize

    if (newEl !== el) {
      release()
      el = newEl
      // another element gets reported even if its box matches
      size = { width: -1, height: -1 }
    }

    if (opts.disabled === true || el === null) {
      release()
      return
    }

    if (observer === null) {
      observer = new ResizeObserver(schedule)
      // the measured size is offsetWidth/offsetHeight (the border box), so
      // observe that box too: a padding or border change on the target
      // itself leaves the default content box untouched and would go
      // unnoticed until an unrelated resize
      observer.observe(el, { box: 'border-box' })
      measure()
    }
  })

  effect.scheduler = () => {
    effect.run()
  }

  if (vm !== null) {
    // first run once the template refs and the root element exist
    onMounted(() => {
      effect.run()
    })
    onBeforeUnmount(release)
  } else {
    effect.run()
  }

  return {
    width,
    height,

    // measures right away, skipping the debounce
    refresh: measure,

    stop() {
      release()
      el = null
      effect.stop()
    }
  }
}
