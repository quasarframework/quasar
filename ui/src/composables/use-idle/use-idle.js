import {
  ReactiveEffect,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  toValue
} from 'vue'

import useEventListener from '../use-event-listener/use-event-listener.js'
import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const { isIdle, lastActive, resetIdle, stopIdle } = useIdle(options)
 *
 * isIdle     - Ref<boolean>; true once no activity happened for `timeout` ms
 * lastActive - Ref<number>; timestamp (Date.now()) of the last activity
 * resetIdle  - counts as an activity (no-op while disabled or stopped)
 * stopIdle   - ends the tracking for good
 *
 * options - plain object, ref or getter of:
 *    timeout  - ms of inactivity before isIdle becomes true (default: 60000)
 *    events   - Array of event names (listened on document) that count as
 *               an activity (default: mousemove, mousedown, keydown,
 *               touchstart, wheel)
 *    disabled - pause tracking; while paused the user is never idle
 *    onIdle   - called with the new isIdle value on every transition
 */

const defaultTimeout = 60_000
const defaultEvents = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'wheel'
]

// capture: an activity counts even when a handler stops its propagation
const listenerOptions = { capture: true, passive: true }

export default function useIdle(options) {
  const isIdle = ref(false)
  const lastActive = ref(0)

  if (__QUASAR_SSR_SERVER__) {
    return { isIdle, lastActive, resetIdle: noop, stopIdle: noop }
  }

  const vm = getCurrentInstance()

  let timer = null,
    timeout = defaultTimeout,
    // plain mirror of lastActive: check() runs inside the effect too, so
    // it must not read the ref it (indirectly) writes
    lastTs = 0,
    // plain mirror of isIdle, for the same reason
    idle = false,
    tracking = false,
    onIdle

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  function setIdle(value) {
    if (idle !== value) {
      idle = value
      isIdle.value = value
      onIdle?.(value)
    }
  }

  function release() {
    clearTimer()
    tracking = false
    setIdle(false)
  }

  // settles the state from the elapsed time; while active, at most one
  // timer is pending and it is never re-armed by the activity events
  // themselves (a mousemove storm costs a timestamp write only)
  function check() {
    clearTimer()

    const remaining = timeout - (Date.now() - lastTs)

    if (remaining <= 0) {
      setIdle(true)
      return
    }

    setIdle(false)
    timer = setTimeout(() => {
      timer = null
      check()
    }, remaining)
  }

  function onActivity() {
    const now = Date.now()

    lastTs = now
    lastActive.value = now

    if (idle) {
      check()
    }
  }

  const getListenerOptions = () => {
    const opts = toValue(options) ?? {}
    return opts.disabled === true ? { disabled: true } : listenerOptions
  }

  const activityListener = useEventListener(
    () => document,
    () => toValue(options)?.events ?? defaultEvents,
    onActivity,
    getListenerOptions
  )

  // timers get throttled in a hidden page; settle as soon as it shows
  const visibilityListener = useEventListener(
    () => document,
    'visibilitychange',
    () => {
      if (!document.hidden && tracking) {
        check()
      }
    },
    getListenerOptions
  )

  // a raw effect with a sync scheduler costs a fraction of watch();
  // it tracks whatever the options read
  const effect = new ReactiveEffect(() => {
    const opts = toValue(options) ?? {}

    onIdle = opts.onIdle

    if (opts.disabled === true) {
      release()
      return
    }

    const newTimeout = Number(opts.timeout)
    timeout = Number.isNaN(newTimeout) ? defaultTimeout : newTimeout

    // (re)starting counts as an activity
    if (!tracking) {
      tracking = true
      lastTs = Date.now()
      lastActive.value = lastTs
    }

    check()
  })

  effect.scheduler = () => {
    effect.run()
  }

  if (vm !== null) {
    onMounted(() => {
      effect.run()
    })
    onBeforeUnmount(clearTimer)
  } else {
    effect.run()
  }

  return {
    isIdle,
    lastActive,

    resetIdle() {
      if (tracking) {
        onActivity()
      }
    },

    stopIdle() {
      release()
      effect.stop()
      activityListener.stopEventListener()
      visibilityListener.stopEventListener()
    }
  }
}
