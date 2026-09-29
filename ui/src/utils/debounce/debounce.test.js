import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import debounce from './debounce.js'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.restoreAllMocks()
})

describe('[debounce API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const fn = debounce(() => {}, 1)

        expect(fn).toBeTypeOf('function')

        expect(fn.cancel).toBeTypeOf('function')
        expect(fn.flush).toBeTypeOf('function')
        expect(fn.isPending).toBe(false)
      })

      test('isPending is true while a call waits', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100)

        fn()
        expect(fn.isPending).toBe(true)
        vi.advanceTimersByTime(100)
        expect(fn.isPending).toBe(false)

        fn()
        fn.cancel()
        expect(fn.isPending).toBe(false)

        fn()
        fn.flush()
        expect(fn.isPending).toBe(false)
      })

      test('isPending is false when the leading edge served the call', () => {
        const callback = vi.fn()
        const both = debounce(callback, 100, { leading: true })

        both()
        expect(both.isPending).toBe(false)
        both()
        expect(both.isPending).toBe(true)

        const immediate = debounce(callback, 100, true)
        immediate()
        immediate()
        expect(immediate.isPending).toBe(false)
      })

      test('should debounce with fast timeout', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100)

        setTimeout(fn, 100)
        setTimeout(fn, 150)
        setTimeout(fn, 200)
        setTimeout(fn, 250)

        vi.advanceTimersByTime(350)

        expect(callback).toHaveBeenCalledTimes(1)
      })

      test('should not execute prior to timeout', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100)

        setTimeout(fn, 100)
        setTimeout(fn, 150)

        vi.advanceTimersByTime(175)

        expect(callback).not.toHaveBeenCalled()
      })

      test('should execute immediately', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100, true)

        fn()
        fn()

        vi.advanceTimersByTime(150)

        expect(callback).toHaveBeenCalledTimes(1)
      })

      test('should cancel debounced function', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100)

        fn()
        fn.cancel()
        vi.advanceTimersByTime(150)

        expect(callback).not.toHaveBeenCalled()
      })

      test('debounces calls made from the immediate callback', () => {
        const callback = vi.fn(() => {
          if (callback.mock.calls.length === 1) fn()
        })
        const fn = debounce(callback, 100, true)

        fn()
        expect(callback).toHaveBeenCalledTimes(1)
        vi.advanceTimersByTime(100)
        fn()
        expect(callback).toHaveBeenCalledTimes(2)
      })

      test('should execute with correct args when called again from within timeout', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100)

        fn(1)
        fn(2)
        fn(3)

        vi.advanceTimersByTime(150)

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(3)
      })

      test('zero wait time', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 0)

        fn()
        fn()
        fn()

        vi.advanceTimersByTime(1)

        expect(callback).toHaveBeenCalledTimes(1)
      })

      test('repeated rapid calls', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100)

        fn()
        fn()
        fn()
        fn()
        fn()

        vi.advanceTimersByTime(150)

        expect(callback).toHaveBeenCalledTimes(1)
      })

      test('single call', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100)

        fn()

        vi.advanceTimersByTime(150)

        expect(callback).toHaveBeenCalledTimes(1)
      })

      test('long wait time', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 10_000)

        fn()
        fn()

        vi.advanceTimersByTime(10_000)

        expect(callback).toHaveBeenCalledTimes(1)
      })

      test('function arguments preservation', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100)

        fn(1, 2, '3')

        vi.advanceTimersByTime(150)

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(1, 2, '3')
      })

      test('multiple independent instances', () => {
        const callback1 = vi.fn()
        const fn1 = debounce(callback1, 100)

        const callback2 = vi.fn()
        const fn2 = debounce(callback2, 200)

        fn1()
        fn2()

        vi.advanceTimersByTime(150)

        expect(callback1).toHaveBeenCalledTimes(1)
        expect(callback2).toHaveBeenCalledTimes(0)

        vi.advanceTimersByTime(100)
        expect(callback1).toHaveBeenCalledTimes(1)
        expect(callback2).toHaveBeenCalledTimes(1)
      })

      test('no calls made', () => {
        const callback = vi.fn()
        debounce(callback, 100)

        vi.runAllTimers()

        expect(callback).not.toHaveBeenCalled()
      })
      test('preserves "this"', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100)
        const context = { fn }

        context.fn()
        vi.advanceTimersByTime(100)

        expect(callback.mock.contexts[0]).toBe(context)
      })

      test('flush() runs the waiting call right away', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100)

        fn(1)
        fn(2)
        fn.flush()

        expect(callback).toHaveBeenCalledExactlyOnceWith(2)
        expect(vi.getTimerCount()).toBe(0)

        vi.runAllTimers()
        expect(callback).toHaveBeenCalledOnce()
      })

      test('flush() does nothing without a waiting call', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100)

        fn.flush()
        expect(callback).not.toHaveBeenCalled()

        fn()
        vi.advanceTimersByTime(100)
        fn.flush()
        expect(callback).toHaveBeenCalledOnce()
      })

      test('flush() does nothing in immediate mode', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100, true)

        fn()
        fn()
        fn.flush()
        expect(callback).toHaveBeenCalledOnce()

        // the wait period keeps running
        fn()
        expect(callback).toHaveBeenCalledOnce()

        vi.advanceTimersByTime(100)
        fn()
        expect(callback).toHaveBeenCalledTimes(2)
      })

      test('a call made from within the callback waits anew', () => {
        const callback = vi.fn(() => {
          if (callback.mock.calls.length < 3) fn()
        })
        const fn = debounce(callback, 100)

        fn()
        vi.advanceTimersByTime(100)
        expect(callback).toHaveBeenCalledOnce()

        vi.advanceTimersByTime(99)
        expect(callback).toHaveBeenCalledOnce()

        vi.advanceTimersByTime(1)
        expect(callback).toHaveBeenCalledTimes(2)

        vi.runAllTimers()
        expect(callback).toHaveBeenCalledTimes(3)
      })

      test('cancel() re-arms the leading edge in immediate mode', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100, true)

        fn()
        expect(callback).toHaveBeenCalledTimes(1)

        fn.cancel()
        fn()
        expect(callback).toHaveBeenCalledTimes(2)
      })

      test('true is shorthand for { leading: true, trailing: false }', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100, { leading: true, trailing: false })

        fn(1)
        fn(2)
        expect(callback).toHaveBeenCalledExactlyOnceWith(1)

        fn.flush()
        vi.runAllTimers()
        expect(callback).toHaveBeenCalledOnce()

        fn(3)
        expect(callback).toHaveBeenCalledTimes(2)
      })

      test('an empty options object is the default (trailing only)', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100, {})

        fn(1)
        fn(2)
        expect(callback).not.toHaveBeenCalled()

        vi.advanceTimersByTime(100)
        expect(callback).toHaveBeenCalledExactlyOnceWith(2)
      })

      test('{ leading: true } runs on both edges when calls follow the first one', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100, { leading: true })
        const context = { fn }

        context.fn(1)
        expect(callback).toHaveBeenCalledExactlyOnceWith(1)
        expect(callback.mock.contexts[0]).toBe(context)

        fn(2)
        fn(3)
        vi.advanceTimersByTime(99)
        expect(callback).toHaveBeenCalledOnce()

        vi.advanceTimersByTime(1)
        expect(callback).toHaveBeenCalledTimes(2)
        expect(callback).toHaveBeenLastCalledWith(3)

        // a fresh burst
        fn(4)
        expect(callback).toHaveBeenCalledTimes(3)
        expect(callback).toHaveBeenLastCalledWith(4)
      })

      test('{ leading: true } runs a lone call once only', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100, { leading: true })

        fn(1)
        vi.runAllTimers()
        expect(callback).toHaveBeenCalledExactlyOnceWith(1)

        // the calls made during the wait are the ones that wait
        fn(2)
        fn.flush()
        expect(callback).toHaveBeenCalledTimes(2)
        fn(3)
        fn.flush()
        expect(callback).toHaveBeenCalledTimes(3)
        expect(callback).toHaveBeenLastCalledWith(3)

        fn(4)
        fn(5)
        fn.cancel()
        vi.runAllTimers()
        expect(callback).toHaveBeenCalledTimes(4)
        expect(callback).toHaveBeenLastCalledWith(4)
      })

      test('{ leading: false, trailing: false } never runs fn', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100, { trailing: false })

        fn()
        fn()
        fn.flush()
        vi.runAllTimers()
        expect(callback).not.toHaveBeenCalled()
      })

      test('maxWait runs fn while the calls keep coming', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100, { maxWait: 250 })

        // a call every 50ms keeps the wait from ending
        for (let i = 1; i <= 5; i++) {
          fn(i)
          vi.advanceTimersByTime(50)
        }
        // t=250: the maxWait run, with the latest arguments
        expect(callback).toHaveBeenCalledExactlyOnceWith(5)

        // the calls stop: the trailing run of the next burst
        fn(6)
        vi.advanceTimersByTime(99)
        expect(callback).toHaveBeenCalledOnce()
        vi.advanceTimersByTime(1)
        expect(callback).toHaveBeenCalledTimes(2)
        expect(callback).toHaveBeenLastCalledWith(6)
        expect(vi.getTimerCount()).toBe(0)
      })

      test('maxWait counts from the first call of a burst', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100, { maxWait: 250 })

        fn(1)
        vi.advanceTimersByTime(90)
        fn(2)
        vi.advanceTimersByTime(90)
        fn(3)
        vi.advanceTimersByTime(69)
        expect(callback).not.toHaveBeenCalled()

        vi.advanceTimersByTime(1)
        expect(callback).toHaveBeenCalledExactlyOnceWith(3)

        // a new burst counts anew
        fn(4)
        vi.advanceTimersByTime(90)
        fn(5)
        vi.advanceTimersByTime(90)
        fn(6)
        vi.advanceTimersByTime(69)
        expect(callback).toHaveBeenCalledOnce()
        vi.advanceTimersByTime(1)
        expect(callback).toHaveBeenCalledTimes(2)
        expect(callback).toHaveBeenLastCalledWith(6)
      })

      test('a maxWait run ends the wait period', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100, { leading: true, maxWait: 150 })

        fn(1)
        expect(callback).toHaveBeenCalledExactlyOnceWith(1)
        vi.advanceTimersByTime(90)
        fn(2)
        vi.advanceTimersByTime(60)
        expect(callback).toHaveBeenCalledTimes(2)
        expect(callback).toHaveBeenLastCalledWith(2)
        expect(vi.getTimerCount()).toBe(0)

        // the next call opens a burst and runs on its leading edge
        fn(3)
        expect(callback).toHaveBeenCalledTimes(3)
        expect(callback).toHaveBeenLastCalledWith(3)
      })

      test('a call made from within the maxWait run waits anew', () => {
        const callback = vi.fn(() => {
          if (callback.mock.calls.length === 1) fn('again')
        })
        const fn = debounce(callback, 100, { maxWait: 150 })

        fn()
        vi.advanceTimersByTime(90)
        fn()
        vi.advanceTimersByTime(60)
        expect(callback).toHaveBeenCalledOnce()

        vi.advanceTimersByTime(99)
        expect(callback).toHaveBeenCalledOnce()
        vi.advanceTimersByTime(1)
        expect(callback).toHaveBeenCalledTimes(2)
        expect(callback).toHaveBeenLastCalledWith('again')
      })

      test('the wait ending, cancel() and flush() drop the maxWait timer', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100, { maxWait: 1000 })

        fn()
        expect(vi.getTimerCount()).toBe(2)
        vi.advanceTimersByTime(100)
        expect(callback).toHaveBeenCalledOnce()
        expect(vi.getTimerCount()).toBe(0)

        fn()
        fn.cancel()
        expect(vi.getTimerCount()).toBe(0)

        fn()
        fn.flush()
        expect(callback).toHaveBeenCalledTimes(2)
        expect(vi.getTimerCount()).toBe(0)
      })

      test('maxWait is ignored without trailing', () => {
        const callback = vi.fn()
        const fn = debounce(callback, 100, {
          leading: true,
          trailing: false,
          maxWait: 150
        })

        fn(1)
        expect(vi.getTimerCount()).toBe(1)

        for (let i = 2; i <= 5; i++) {
          vi.advanceTimersByTime(50)
          fn(i)
        }
        expect(callback).toHaveBeenCalledExactlyOnceWith(1)
      })
    })
  })
})
