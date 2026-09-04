import {
  ReactiveEffect,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  toValue
} from 'vue'

import {
  observe,
  unobserve
} from '../../utils/private.intersection/intersection.js'
import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const { isIntersecting, stop } = useIntersection(options)
 *
 * options - plain object, ref or getter of:
 *    target      - ref (or getter) of an Element or a component instance;
 *                  defaults to the root element of the current component
 *    root, rootMargin, threshold - IntersectionObserver options
 *    once        - stop observing after the first intersecting entry
 *    disabled    - pause observing (a `once` that already fired stays off)
 *    onIntersect - called with every entry; return false to stop
 */

function getElement(target, vm) {
  const value =
    target === void 0 ? (vm === null ? null : vm.proxy.$el) : toValue(target)

  if (value === null || value === void 0) return null

  // a component ref resolves to its root element; a fragment root
  // (text/comment node) cannot be observed
  const el = value.$el ?? value
  return el.nodeType === 1 ? el : null
}

export default function useIntersection(options) {
  const isIntersecting = ref(false)

  if (__QUASAR_SSR_SERVER__) {
    return { isIntersecting, stop: noop }
  }

  const vm = getCurrentInstance()

  const sub = {
    handler(entry) {
      const value = entry.isIntersecting
      if (isIntersecting.value !== value) {
        isIntersecting.value = value
      }

      return sub.onIntersect?.(entry)
    },
    once: false,
    onIntersect: void 0,
    pool: void 0,
    done: false
  }

  let el = null

  function release() {
    if (el !== null) {
      unobserve(el)
      el = null
    }
  }

  // a raw effect with a sync scheduler costs a fraction of watch();
  // it tracks whatever the options (and a target ref) read
  const effect = new ReactiveEffect(() => {
    const opts = toValue(options) ?? {}
    const newEl = getElement(opts.target, vm)

    sub.once = opts.once === true
    sub.onIntersect = opts.onIntersect

    if (newEl !== el) release()

    if (opts.disabled === true || newEl === null) {
      release()
      return
    }

    el = newEl
    observe(
      el,
      sub,
      opts.root ?? null,
      opts.rootMargin ?? '0px',
      opts.threshold ?? 0
    )
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
    isIntersecting,

    stop() {
      sub.done = true
      release()
      effect.stop()
    }
  }
}
