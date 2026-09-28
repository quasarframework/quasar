import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import throttle from './throttle.js'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.restoreAllMocks()
})

describe('[throttle API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const fn = throttle(() => {})

        expect(fn).toBeTypeOf('function')
        expect(fn.cancel).toBeTypeOf('function')
        expect(fn.flush).toBeTypeOf('function')
      })

      test('returns the last result', () => {
        let n = 0
        const fn = throttle(() => ++n, 100)

        expect(fn()).toBe(1)
        expect(fn()).toBe(1)

        vi.advanceTimersByTime(100)
        expect(fn()).toBe(2)
      })

      test('preserves "this"', () => {
        const callback = vi.fn()
        const fn = throttle(callback, 100)
        const context = { fn }

        context.fn()

        expect(callback.mock.contexts[0]).toBe(context)
      })

      test('repeated rapid calls', () => {
        const callback = vi.fn()
        const fn = throttle(callback, 100)

        fn()
        fn()
        fn()
        fn()

        vi.advanceTimersByTime(350)

        expect(callback).toHaveBeenCalledTimes(1)
      })

      test('zero timeout', () => {
        const callback = vi.fn()
        const fn = throttle(callback, 0)

        fn()
        fn()

        vi.advanceTimersByTime(1)

        expect(callback).toHaveBeenCalledTimes(1)

        fn()

        expect(callback).toHaveBeenCalledTimes(2)
      })

      test('should execute with correct args when called again from within timeout', () => {
        const callback = vi.fn()
        const fn = throttle(callback, 100)

        fn(1)
        fn(2)
        fn(3)

        vi.advanceTimersByTime(50)

        fn(4)

        vi.advanceTimersByTime(50)

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(1)
      })

      test('single call', () => {
        const callback = vi.fn()
        const fn = throttle(callback, 100)

        fn()

        vi.advanceTimersByTime(150)

        expect(callback).toHaveBeenCalledTimes(1)
      })

      test('long wait time', () => {
        const callback = vi.fn()
        const fn = throttle(callback, 10_000)

        fn()
        fn()

        vi.advanceTimersByTime(10_000)

        expect(callback).toHaveBeenCalledTimes(1)
      })

      test('function arguments preservation', () => {
        const callback = vi.fn()
        const fn = throttle(callback, 100)

        fn(1, 2, '3')

        vi.advanceTimersByTime(50)

        fn(4, 5, 6)

        vi.advanceTimersByTime(50)

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(1, 2, '3')
      })

      test('multiple independent instances', () => {
        const callback1 = vi.fn()
        const callback2 = vi.fn()
        const fn1 = throttle(callback1, 100)
        const fn2 = throttle(callback2, 200)

        fn1()
        fn2()

        vi.advanceTimersByTime(150)

        expect(callback1).toHaveBeenCalledTimes(1)
        expect(callback2).toHaveBeenCalledTimes(1)

        fn1()
        fn2()

        vi.advanceTimersByTime(100)

        expect(callback1).toHaveBeenCalledTimes(2)
        expect(callback2).toHaveBeenCalledTimes(1)
      })

      test('"trailing" runs the last call made during the window at its end', () => {
        const callback = vi.fn()
        const fn = throttle(callback, 100, { trailing: true })
        const context = { fn }

        fn(1)
        expect(callback).toHaveBeenCalledExactlyOnceWith(1)

        fn(2)
        context.fn(3)
        vi.advanceTimersByTime(99)
        expect(callback).toHaveBeenCalledOnce()

        vi.advanceTimersByTime(1)
        expect(callback).toHaveBeenCalledTimes(2)
        expect(callback).toHaveBeenLastCalledWith(3)
        expect(callback.mock.contexts[1]).toBe(context)

        // the trailing run opens a window of its own
        fn(4)
        expect(callback).toHaveBeenCalledTimes(2)

        vi.advanceTimersByTime(100)
        expect(callback).toHaveBeenCalledTimes(3)
        expect(callback).toHaveBeenLastCalledWith(4)

        vi.runAllTimers()
        expect(callback).toHaveBeenCalledTimes(3)
        expect(vi.getTimerCount()).toBe(0)
      })

      test('"trailing" skips the run when no call was made during the window', () => {
        const callback = vi.fn()
        const fn = throttle(callback, 100, { trailing: true })

        fn()
        vi.runAllTimers()

        expect(callback).toHaveBeenCalledOnce()
      })

      test('"trailing" call made from within the callback lands in the new window', () => {
        const callback = vi.fn(() => {
          if (callback.mock.calls.length < 3) fn()
        })
        const fn = throttle(callback, 100, { trailing: true })

        fn()
        expect(callback).toHaveBeenCalledOnce()

        vi.advanceTimersByTime(100)
        expect(callback).toHaveBeenCalledTimes(2)

        vi.advanceTimersByTime(100)
        expect(callback).toHaveBeenCalledTimes(3)

        vi.runAllTimers()
        expect(callback).toHaveBeenCalledTimes(3)
      })

      test('cancel() drops the waiting call and closes the window', () => {
        const callback = vi.fn()
        const fn = throttle(callback, 100, { trailing: true })

        fn()
        fn()
        fn.cancel()
        expect(vi.getTimerCount()).toBe(0)

        vi.runAllTimers()
        expect(callback).toHaveBeenCalledOnce()

        fn()
        expect(callback).toHaveBeenCalledTimes(2)
      })

      test('flush() runs the waiting call right away and opens a fresh window', () => {
        const callback = vi.fn()
        const fn = throttle(callback, 100, { trailing: true })

        fn(1)
        vi.advanceTimersByTime(50)
        fn(2)
        fn.flush()
        expect(callback).toHaveBeenCalledTimes(2)
        expect(callback).toHaveBeenLastCalledWith(2)

        // the rate limit holds: the next call waits for the fresh window
        fn(3)
        expect(callback).toHaveBeenCalledTimes(2)

        vi.advanceTimersByTime(99)
        expect(callback).toHaveBeenCalledTimes(2)

        vi.advanceTimersByTime(1)
        expect(callback).toHaveBeenCalledTimes(3)
        expect(callback).toHaveBeenLastCalledWith(3)
      })

      test('flush() does nothing without a waiting call', () => {
        const callback = vi.fn()
        const fn = throttle(callback, 100)

        fn.flush()
        expect(callback).not.toHaveBeenCalled()
        expect(vi.getTimerCount()).toBe(0)

        // the window keeps running
        fn()
        fn()
        fn.flush()
        fn()
        expect(callback).toHaveBeenCalledOnce()

        vi.advanceTimersByTime(100)
        fn()
        expect(callback).toHaveBeenCalledTimes(2)
      })

      test('no calls made', () => {
        const callback = vi.fn()
        throttle(callback, 100)

        vi.runAllTimers()

        expect(callback).not.toHaveBeenCalled()
      })
    })
  })
})
