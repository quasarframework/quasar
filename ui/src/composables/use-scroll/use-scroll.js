import {
  ReactiveEffect,
  getCurrentInstance,
  hasInjectionContext,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  toValue
} from 'vue'

import useQuasar from '../use-quasar/use-quasar.js'

import { getTargetElement } from '../../utils/private.vm/vm.js'
import {
  getHorizontalScrollPosition,
  getScrollTarget,
  getVerticalScrollPosition
} from '../../utils/scroll/scroll.js'
import { listenOpts, noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const {
 *      position, direction, directionChanged, delta, inflectionPoint,
 *      refresh, stop
 *    } = useScroll(options)
 *
 * options - plain object, ref or getter of:
 *    target       - ref (or getter) of an Element or a component instance
 *                   whose scroll container gets auto detected (the closest
 *                   `.scroll`, `.scroll-y` or `.overflow-auto` ancestor,
 *                   else the window); defaults to the root element of the
 *                   current component
 *    scrollTarget - the scroll container itself (Element, window, CSS
 *                   selector or component instance); wins over `target`
 *    axis         - 'vertical' (default), 'horizontal' or 'both'
 *    debounce     - ms between two reports; omit it for at most one report
 *                   per animation frame, 0 for one on every scroll event
 *    disabled     - pause listening
 *    onScroll     - called with the scroll details on every change
 */

const { passive } = listenOpts

export default function useScroll(options) {
  const position = shallowRef({ top: 0, left: 0 })
  const direction = ref('down')
  const directionChanged = ref(false)
  const delta = shallowRef({ top: 0, left: 0 })
  const inflectionPoint = shallowRef({ top: 0, left: 0 })

  const state = {
    position,
    direction,
    directionChanged,
    delta,
    inflectionPoint
  }

  if (__QUASAR_SSR_SERVER__) {
    return { ...state, refresh: noop, stop: noop }
  }

  const vm = getCurrentInstance()
  const $q = vm !== null || hasInjectionContext() ? useQuasar() : void 0

  let container = null,
    listening = false,
    cancel = null,
    axis = 'vertical',
    debounce,
    rtl,
    onScroll,
    // plain mirrors of the refs: measure() runs inside the effect on
    // (re)attach, and reading the refs there would make the effect track
    // its own output
    top = 0,
    left = 0,
    dir = 'down',
    inflection = { top: 0, left: 0 }

  function clearPending() {
    if (cancel !== null) {
      cancel()
      cancel = null
    }
  }

  function measure() {
    clearPending()

    if (container === null) return

    const newTop = Math.max(0, getVerticalScrollPosition(container))
    const newLeft = getHorizontalScrollPosition(container)
    const deltaTop = newTop - top
    const deltaLeft = newLeft - left

    if (
      (axis === 'vertical' && deltaTop === 0) ||
      (axis === 'horizontal' && deltaLeft === 0) ||
      (deltaTop === 0 && deltaLeft === 0)
    ) {
      return
    }

    const newDirection =
      Math.abs(deltaTop) >= Math.abs(deltaLeft)
        ? deltaTop < 0
          ? 'up'
          : 'down'
        : deltaLeft < 0
          ? 'left'
          : 'right'
    const changed = dir !== newDirection
    const newPosition = { top: newTop, left: newLeft }
    const newDelta = { top: deltaTop, left: deltaLeft }

    top = newTop
    left = newLeft

    position.value = newPosition
    delta.value = newDelta
    directionChanged.value = changed

    if (changed) {
      dir = newDirection
      inflection = newPosition
      direction.value = newDirection
      inflectionPoint.value = newPosition
    }

    onScroll?.({
      position: newPosition,
      direction: newDirection,
      directionChanged: changed,
      delta: newDelta,
      inflectionPoint: inflection
    })
  }

  // at most one measurement per debounce window (or per frame)
  function schedule() {
    if (debounce === 0) {
      measure()
    } else if (cancel === null) {
      if (debounce === void 0) {
        const id = requestAnimationFrame(measure)
        cancel = () => {
          cancelAnimationFrame(id)
        }
      } else {
        const id = setTimeout(measure, debounce)
        cancel = () => {
          clearTimeout(id)
        }
      }
    }
  }

  function release() {
    clearPending()

    if (listening) {
      container.removeEventListener('scroll', schedule, passive)
      listening = false
    }
  }

  // a raw effect with a sync scheduler costs a fraction of watch();
  // it tracks whatever the options (and the target refs) read
  const effect = new ReactiveEffect(() => {
    const opts = toValue(options) ?? {}
    const explicit = toValue(opts.scrollTarget)
    const anchor = getTargetElement(opts.target, vm)
    const newContainer =
      explicit !== void 0 && explicit !== null
        ? getScrollTarget(anchor, explicit)
        : anchor !== null
          ? getScrollTarget(anchor)
          : null

    axis = opts.axis ?? 'vertical'
    debounce =
      opts.debounce === void 0 || opts.debounce === null
        ? void 0
        : Number(opts.debounce) || 0
    onScroll = opts.onScroll

    if (newContainer !== container) {
      release()
      container = newContainer

      // another container starts from scratch
      if (top !== 0 || left !== 0) {
        top = left = 0
        position.value = { top, left }
      }
    }

    // the horizontal position is mirrored in RTL
    const newRtl = $q?.lang.rtl === true
    const rtlChanged = rtl !== void 0 && rtl !== newRtl
    rtl = newRtl

    if (opts.disabled === true || container === null) {
      release()
      return
    }

    if (!listening) {
      container.addEventListener('scroll', schedule, passive)
      listening = true
      measure()
    } else if (rtlChanged) {
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
    ...state,

    // measures right away, skipping the debounce
    refresh: measure,

    stop() {
      release()
      container = null
      effect.stop()
    }
  }
}
