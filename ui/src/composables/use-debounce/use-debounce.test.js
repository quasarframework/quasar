import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, isRef } from 'vue'

import useDebounce from './use-debounce.js'

enableAutoUnmount(afterEach)

const wait = 100

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

function mountDebounce(...args) {
  let api
  const wrapper = mount(
    defineComponent({
      setup() {
        api = useDebounce(...args)
        return () => h('div')
      }
    })
  )

  return { wrapper, ...api }
}

describe('[useDebounce API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const { debounceFn, isDebouncePending } = mountDebounce(vi.fn())

        expect(debounceFn).toBeTypeOf('function')
        expect(debounceFn.cancel).toBeTypeOf('function')
        expect(debounceFn.flush).toBeTypeOf('function')
        expect(isRef(isDebouncePending)).toBe(true)
        expect(isDebouncePending.value).toBe(false)
      })

      test('runs fn once the wait elapses after the last call', () => {
        const fn = vi.fn()
        const { debounceFn } = mountDebounce(fn, wait)

        debounceFn()
        vi.advanceTimersByTime(wait - 1)
        expect(fn).not.toHaveBeenCalled()

        debounceFn()
        vi.advanceTimersByTime(wait - 1)
        expect(fn).not.toHaveBeenCalled()

        vi.advanceTimersByTime(1)
        expect(fn).toHaveBeenCalledOnce()

        vi.runAllTimers()
        expect(fn).toHaveBeenCalledOnce()
      })

      test('defaults to a 250ms wait', () => {
        const fn = vi.fn()
        const { debounceFn } = mountDebounce(fn)

        debounceFn()
        vi.advanceTimersByTime(249)
        expect(fn).not.toHaveBeenCalled()

        vi.advanceTimersByTime(1)
        expect(fn).toHaveBeenCalledOnce()
      })

      test('passes the last call arguments and "this" to fn', () => {
        const fn = vi.fn()
        const { debounceFn } = mountDebounce(fn, wait)
        const context = { debounceFn }

        debounceFn('first', 1)
        context.debounceFn('last', 2)
        vi.advanceTimersByTime(wait)

        expect(fn).toHaveBeenCalledExactlyOnceWith('last', 2)
        expect(fn.mock.contexts[0]).toBe(context)
      })

      test('debounceFn.cancel() drops the waiting call', () => {
        const fn = vi.fn()
        const { debounceFn } = mountDebounce(fn, wait)

        debounceFn()
        debounceFn.cancel()
        vi.runAllTimers()

        expect(fn).not.toHaveBeenCalled()
        expect(vi.getTimerCount()).toBe(0)
      })

      test('debounceFn.flush() runs the waiting call right away', () => {
        const fn = vi.fn()
        const { debounceFn } = mountDebounce(fn, wait)

        debounceFn('a')
        debounceFn.flush()

        expect(fn).toHaveBeenCalledExactlyOnceWith('a')
        expect(vi.getTimerCount()).toBe(0)

        debounceFn.flush()
        vi.runAllTimers()
        expect(fn).toHaveBeenCalledOnce()
      })

      test('isDebouncePending is true while a call to fn is waiting', () => {
        let pendingWhenRun = null
        const fn = vi.fn(() => {
          pendingWhenRun = isDebouncePending.value
        })
        const { debounceFn, isDebouncePending } = mountDebounce(fn, wait)

        debounceFn()
        expect(isDebouncePending.value).toBe(true)

        vi.advanceTimersByTime(wait - 1)
        expect(isDebouncePending.value).toBe(true)

        vi.advanceTimersByTime(1)
        expect(pendingWhenRun).toBe(false)
        expect(isDebouncePending.value).toBe(false)

        debounceFn()
        debounceFn.cancel()
        expect(isDebouncePending.value).toBe(false)

        debounceFn()
        debounceFn.flush()
        expect(isDebouncePending.value).toBe(false)
      })

      test('isDebouncePending stays true when fn calls debounceFn again', () => {
        let runs = 0
        const { debounceFn, isDebouncePending } = mountDebounce(() => {
          if (runs++ < 2) {
            debounceFn()
          }
        }, wait)

        debounceFn()
        vi.advanceTimersByTime(wait)
        expect(runs).toBe(1)
        expect(isDebouncePending.value).toBe(true)

        vi.advanceTimersByTime(wait)
        expect(runs).toBe(2)
        expect(isDebouncePending.value).toBe(true)

        vi.advanceTimersByTime(wait)
        expect(runs).toBe(3)
        expect(isDebouncePending.value).toBe(false)
      })

      test('"immediate" runs fn on the first call and swallows the rest', () => {
        const fn = vi.fn()
        const { debounceFn } = mountDebounce(fn, wait, true)
        const context = { debounceFn }

        context.debounceFn('a')
        expect(fn).toHaveBeenCalledExactlyOnceWith('a')
        expect(fn.mock.contexts[0]).toBe(context)

        debounceFn('b')
        vi.advanceTimersByTime(wait - 1)
        debounceFn('c')
        vi.advanceTimersByTime(wait - 1)
        expect(fn).toHaveBeenCalledOnce()

        vi.advanceTimersByTime(1)
        expect(fn).toHaveBeenCalledOnce()

        debounceFn('d')
        expect(fn).toHaveBeenCalledTimes(2)
        expect(fn).toHaveBeenLastCalledWith('d')
      })

      test('"immediate" never has a call waiting', () => {
        const fn = vi.fn()
        const { debounceFn, isDebouncePending } = mountDebounce(fn, wait, true)

        debounceFn()
        debounceFn()
        expect(isDebouncePending.value).toBe(false)

        // nothing to flush, the wait period keeps running
        debounceFn.flush()
        debounceFn()
        expect(fn).toHaveBeenCalledOnce()

        // debounceFn.cancel() ends the wait period
        debounceFn.cancel()
        debounceFn()
        expect(fn).toHaveBeenCalledTimes(2)
      })

      test('drops the waiting call when the component gets destroyed', () => {
        const fn = vi.fn()
        const { wrapper, debounceFn, isDebouncePending } = mountDebounce(
          fn,
          wait
        )

        debounceFn()
        expect(isDebouncePending.value).toBe(true)

        wrapper.unmount()
        expect(isDebouncePending.value).toBe(false)
        expect(vi.getTimerCount()).toBe(0)

        debounceFn()
        expect(isDebouncePending.value).toBe(false)

        vi.runAllTimers()
        expect(fn).not.toHaveBeenCalled()
      })

      test('warns outside of a component instance', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

        const { debounceFn } = useDebounce(vi.fn(), wait)

        // the lifecycle hooks are the Vue ones; use the debounce() util
        // outside of a component instead
        expect(warn).toHaveBeenCalled()
        expect(warn.mock.calls[0][0]).toMatch(/no active component instance/)
        expect(debounceFn).toBeTypeOf('function')
      })
    })
  })
})
