import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { KeepAlive, defineComponent, h, ref } from 'vue'

import useTransitionEnd from './use-transition-end.js'

let wrapper

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()

  if (wrapper !== null) {
    wrapper.unmount()
    wrapper = null
  }
})

// mounts the composable inside a <keep-alive> so tests can drive
// activation/deactivation; "target" gets the composable's return value
function mountHarness(transitionDuration = 100) {
  const props = { transitionDuration }
  const active = ref(true)
  const target = {}

  const Inner = defineComponent({
    name: 'Inner',
    setup() {
      Object.assign(target, useTransitionEnd(props))
      return () => h('div')
    }
  })

  const Host = defineComponent({
    name: 'Host',
    setup() {
      return () =>
        h(KeepAlive, null, {
          default: () => (active.value ? h(Inner) : null)
        })
    }
  })

  wrapper = mount(Host)

  return {
    target,
    async setActive(val) {
      active.value = val
      await flushPromises()
    }
  }
}

describe('[useTransitionEnd API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('runs the finisher once, after props.transitionDuration', () => {
        const fn = vi.fn()
        const { target } = mountHarness(100)

        target.registerTransitionEnd(fn)

        expect(fn).not.toHaveBeenCalled()
        vi.advanceTimersByTime(99)
        expect(fn).not.toHaveBeenCalled()
        vi.advanceTimersByTime(1)
        expect(fn).toHaveBeenCalledTimes(1)

        vi.runAllTimers()
        expect(fn).toHaveBeenCalledTimes(1)
      })

      test('a new registration replaces the pending one', () => {
        const fn1 = vi.fn()
        const fn2 = vi.fn()
        const { target } = mountHarness()

        target.registerTransitionEnd(fn1)
        target.registerTransitionEnd(fn2)
        vi.runAllTimers()

        expect(fn1).not.toHaveBeenCalled()
        expect(fn2).toHaveBeenCalledTimes(1)
      })

      test('deactivation runs a pending finisher right away, once', async () => {
        const fn = vi.fn()
        const { target, setActive } = mountHarness()

        target.registerTransitionEnd(fn)
        expect(fn).not.toHaveBeenCalled()

        await setActive(false)
        expect(fn).toHaveBeenCalledTimes(1)

        // the timer was cancelled by deactivation; nothing left to fire
        vi.runAllTimers()
        expect(fn).toHaveBeenCalledTimes(1)

        // a later deactivation must not re-run an already-run finisher
        await setActive(true)
        await setActive(false)
        expect(fn).toHaveBeenCalledTimes(1)
      })

      test('deactivation does not re-run a finisher that already fired', async () => {
        const fn = vi.fn()
        const { target, setActive } = mountHarness()

        target.registerTransitionEnd(fn)
        vi.runAllTimers()
        expect(fn).toHaveBeenCalledTimes(1)

        await setActive(false)
        expect(fn).toHaveBeenCalledTimes(1)
      })

      test('registerTimeout shares the timer slot but keeps the finisher for deactivation', async () => {
        const finisher = vi.fn()
        const other = vi.fn()
        const { target, setActive } = mountHarness()

        target.registerTransitionEnd(finisher)
        // supersedes the pending transition timer (single useTimeout slot)
        target.registerTimeout(other, 50)

        vi.runAllTimers()
        expect(other).toHaveBeenCalledTimes(1)
        expect(finisher).not.toHaveBeenCalled()

        // the interrupted transition tail still completes on deactivation
        await setActive(false)
        expect(finisher).toHaveBeenCalledTimes(1)
      })

      test('unmount does not run a pending finisher', () => {
        const fn = vi.fn()
        const target = {}

        wrapper = mount(
          defineComponent({
            name: 'Plain',
            setup() {
              Object.assign(
                target,
                useTransitionEnd({ transitionDuration: 100 })
              )
              return () => h('div')
            }
          })
        )

        target.registerTransitionEnd(fn)

        wrapper.unmount()
        wrapper = null
        vi.runAllTimers()

        expect(fn).not.toHaveBeenCalled()
      })

      test('unmounting the keep-alive completes a pending finisher', () => {
        const fn = vi.fn()
        const { target } = mountHarness()

        target.registerTransitionEnd(fn)

        // Vue deactivates the active kept-alive child while tearing it
        // down, so the pending transition tail completes here too
        wrapper.unmount()
        wrapper = null
        vi.runAllTimers()

        expect(fn).toHaveBeenCalledTimes(1)
      })
    })
  })
})
