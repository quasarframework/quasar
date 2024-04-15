import {
  describe, test, expect, vi,
  beforeEach, afterEach
} from 'vitest'

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
        expect(
          throttle(() => {})
        ).toBeTypeOf('function')
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

      test('no calls made', () => {
        const callback = vi.fn()
        throttle(callback, 100)

        vi.runAllTimers()

        expect(callback).not.toHaveBeenCalled()
      })
    })
  })
})
