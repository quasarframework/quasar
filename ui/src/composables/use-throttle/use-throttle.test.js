import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, isRef } from 'vue'

import useThrottle from './use-throttle.js'

enableAutoUnmount(afterEach)

const limit = 100

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

function mountThrottle(...args) {
  let api
  const wrapper = mount(
    defineComponent({
      setup() {
        api = useThrottle(...args)
        return () => h('div')
      }
    })
  )

  return { wrapper, ...api }
}

describe('[useThrottle API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const { throttleFn, cancelThrottle, flushThrottle, isThrottlePending } =
          mountThrottle(vi.fn())

        expect(throttleFn).toBeTypeOf('function')
        expect(cancelThrottle).toBeTypeOf('function')
        expect(flushThrottle).toBeTypeOf('function')
        expect(isRef(isThrottlePending)).toBe(true)
        expect(isThrottlePending.value).toBe(false)
      })

      test('runs fn right away, then drops the calls made during the window', () => {
        const fn = vi.fn()
        const { throttleFn } = mountThrottle(fn, limit)
        const context = { throttleFn }

        context.throttleFn('a')
        expect(fn).toHaveBeenCalledExactlyOnceWith('a')
        expect(fn.mock.contexts[0]).toBe(context)

        throttleFn('b')
        vi.advanceTimersByTime(limit - 1)
        throttleFn('c')
        vi.runAllTimers()
        expect(fn).toHaveBeenCalledOnce()

        throttleFn('d')
        expect(fn).toHaveBeenCalledTimes(2)
        expect(fn).toHaveBeenLastCalledWith('d')
      })

      test('returns the last result', () => {
        let n = 0
        const { throttleFn } = mountThrottle(() => ++n, limit)

        expect(throttleFn()).toBe(1)
        expect(throttleFn()).toBe(1)

        vi.advanceTimersByTime(limit)
        expect(throttleFn()).toBe(2)
      })

      test('defaults to a 250ms limit', () => {
        const fn = vi.fn()
        const { throttleFn } = mountThrottle(fn)

        throttleFn()
        vi.advanceTimersByTime(249)
        throttleFn()
        expect(fn).toHaveBeenCalledOnce()

        vi.advanceTimersByTime(1)
        throttleFn()
        expect(fn).toHaveBeenCalledTimes(2)
      })

      test('"trailing" runs the last call made during the window at its end', () => {
        const fn = vi.fn()
        const { throttleFn } = mountThrottle(fn, limit, { trailing: true })
        const context = { throttleFn }

        throttleFn('a')
        throttleFn('b')
        context.throttleFn('c')
        vi.advanceTimersByTime(limit - 1)
        expect(fn).toHaveBeenCalledOnce()

        vi.advanceTimersByTime(1)
        expect(fn).toHaveBeenCalledTimes(2)
        expect(fn).toHaveBeenLastCalledWith('c')
        expect(fn.mock.contexts[1]).toBe(context)

        // the trailing run opens a window of its own
        throttleFn('d')
        expect(fn).toHaveBeenCalledTimes(2)

        vi.advanceTimersByTime(limit)
        expect(fn).toHaveBeenCalledTimes(3)
        expect(fn).toHaveBeenLastCalledWith('d')
      })

      test('cancelThrottle() drops the waiting call and closes the window', () => {
        const fn = vi.fn()
        const { throttleFn, cancelThrottle } = mountThrottle(fn, limit, {
          trailing: true
        })

        throttleFn()
        throttleFn()
        cancelThrottle()
        expect(vi.getTimerCount()).toBe(0)

        vi.runAllTimers()
        expect(fn).toHaveBeenCalledOnce()

        throttleFn()
        expect(fn).toHaveBeenCalledTimes(2)
      })

      test('flushThrottle() runs the waiting call right away and opens a fresh window', () => {
        const fn = vi.fn()
        const { throttleFn, flushThrottle, isThrottlePending } = mountThrottle(
          fn,
          limit,
          { trailing: true }
        )

        throttleFn('a')
        throttleFn('b')
        flushThrottle()
        expect(fn).toHaveBeenCalledTimes(2)
        expect(fn).toHaveBeenLastCalledWith('b')

        throttleFn('c')
        expect(fn).toHaveBeenCalledTimes(2)
        expect(isThrottlePending.value).toBe(true)

        vi.advanceTimersByTime(limit)
        expect(fn).toHaveBeenCalledTimes(3)
        expect(fn).toHaveBeenLastCalledWith('c')
        expect(isThrottlePending.value).toBe(false)
      })

      test('isThrottlePending is true while a trailing call is waiting', () => {
        let pendingWhenRun = null
        const fn = vi.fn(() => {
          pendingWhenRun = isThrottlePending.value
        })
        const { throttleFn, cancelThrottle, flushThrottle, isThrottlePending } =
          mountThrottle(fn, limit, { trailing: true })

        throttleFn()
        expect(isThrottlePending.value).toBe(false)

        throttleFn()
        expect(isThrottlePending.value).toBe(true)

        vi.advanceTimersByTime(limit - 1)
        expect(isThrottlePending.value).toBe(true)

        vi.advanceTimersByTime(1)
        expect(fn).toHaveBeenCalledTimes(2)
        expect(pendingWhenRun).toBe(false)
        expect(isThrottlePending.value).toBe(false)

        throttleFn()
        cancelThrottle()
        expect(isThrottlePending.value).toBe(false)

        throttleFn()
        throttleFn()
        flushThrottle()
        expect(isThrottlePending.value).toBe(false)
      })

      test('isThrottlePending stays true when fn calls throttleFn again', () => {
        let runs = 0
        const { throttleFn, isThrottlePending } = mountThrottle(
          () => {
            if (runs++ < 2) {
              throttleFn()
            }
          },
          limit,
          { trailing: true }
        )

        throttleFn()
        expect(runs).toBe(1)
        expect(isThrottlePending.value).toBe(true)

        vi.advanceTimersByTime(limit)
        expect(runs).toBe(2)
        expect(isThrottlePending.value).toBe(true)

        vi.advanceTimersByTime(limit)
        expect(runs).toBe(3)
        expect(isThrottlePending.value).toBe(false)
      })

      test('isThrottlePending never turns true without "trailing"', () => {
        const { throttleFn, isThrottlePending } = mountThrottle(vi.fn(), limit)

        throttleFn()
        throttleFn()
        expect(isThrottlePending.value).toBe(false)
      })

      test('drops the waiting call when the component gets destroyed', () => {
        const fn = vi.fn()
        const { wrapper, throttleFn, isThrottlePending } = mountThrottle(
          fn,
          limit,
          { trailing: true }
        )

        throttleFn()
        throttleFn()
        expect(isThrottlePending.value).toBe(true)

        wrapper.unmount()
        expect(isThrottlePending.value).toBe(false)
        expect(vi.getTimerCount()).toBe(0)

        throttleFn()
        expect(fn).toHaveBeenCalledOnce()

        vi.runAllTimers()
        expect(fn).toHaveBeenCalledOnce()
      })

      test('warns outside of a component instance', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

        const { throttleFn } = useThrottle(vi.fn(), limit)

        // the lifecycle hooks are the Vue ones; use the throttle() util
        // outside of a component instead
        expect(warn).toHaveBeenCalled()
        expect(warn.mock.calls[0][0]).toMatch(/no active component instance/)
        expect(throttleFn).toBeTypeOf('function')
      })
    })
  })
})
