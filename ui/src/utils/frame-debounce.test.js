import {
  describe, test, expect, vi,
  beforeEach, afterEach
} from 'vitest'

import frameDebounce from './frame-debounce.js'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.clearAllTimers()
  vi.restoreAllMocks()
})

describe('[frameDebounce API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const fn = frameDebounce(() => {})

        expect(
          fn
        ).toBeTypeOf('function')

        expect(
          fn.cancel
        ).toBeTypeOf('function')
      })

      test('should debounce with fast timeout', () => {
        const callback = vi.fn()
        const fn = frameDebounce(callback)

        setTimeout(fn, 1)
        setTimeout(fn, 5)
        setTimeout(fn, 10)
        setTimeout(fn, 11)

        vi.advanceTimersByTime(17)

        expect(callback).toHaveBeenCalledTimes(1)
      })

      test('should not execute prior to timeout', () => {
        const callback = vi.fn()
        const fn = frameDebounce(callback)

        setTimeout(fn, 1)
        setTimeout(fn, 5)

        vi.advanceTimersByTime(7)
        expect(callback).not.toHaveBeenCalled()

        vi.advanceTimersByTime(100)
        expect(callback).toHaveBeenCalledTimes(1)
      })

      test('should cancel frame debounced function', () => {
        const callback = vi.fn()
        const fn = frameDebounce(callback)

        fn()
        fn()
        fn.cancel()
        vi.advanceTimersByTime(100)

        expect(callback).not.toHaveBeenCalled()
      })

      test('should execute with correct args when called again from within timeout', () => {
        const callback = vi.fn()
        const fn = frameDebounce(callback)

        fn(1)
        setTimeout(() => fn(1, 2, '3'), 1)
        vi.advanceTimersByTime(170)

        expect(callback).toHaveBeenCalledWith(1, 2, '3')
      })

      test('repeated rapid calls', () => {
        const callback = vi.fn()
        const fn = frameDebounce(callback)

        fn()
        fn()
        fn()
        fn()
        fn()

        vi.advanceTimersByTime(100)

        expect(callback).toHaveBeenCalledTimes(1)
      })

      test('multiple independent instances', () => {
        const callback1 = vi.fn()
        const callback2 = vi.fn()
        const fn1 = frameDebounce(callback1)
        const fn2 = frameDebounce(callback2)

        fn1()
        fn1()

        fn2()
        fn2()
        fn2()

        vi.advanceTimersByTime(100)

        expect(callback1).toHaveBeenCalledTimes(1)
        expect(callback2).toHaveBeenCalledTimes(1)
      })

      test('no calls made', () => {
        const callback = vi.fn()
        frameDebounce(callback)

        vi.runAllTimers()

        expect(callback).not.toHaveBeenCalled()
      })
    })
  })
})
