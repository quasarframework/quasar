import {
  describe, test, expect, vi,
  beforeEach, afterEach
} from 'vitest'

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

        expect(
          fn
        ).toBeTypeOf('function')

        expect(
          fn.cancel
        ).toBeTypeOf('function')
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
    })
  })
})
