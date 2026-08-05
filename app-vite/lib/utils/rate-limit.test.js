import { afterEach, describe, expect, test, vi } from 'vitest'

import throttle, { debounce } from './rate-limit.js'

describe('[rate-limit.js]', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('debounce()', () => {
    test('runs only the last call after the wait', () => {
      vi.useFakeTimers()
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced('one')
      debounced('two')
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledExactlyOnceWith('two')
    })

    test('runs on the leading edge when immediate is set', () => {
      vi.useFakeTimers()
      const fn = vi.fn()
      const debounced = debounce(fn, 100, true)

      debounced('one')
      expect(fn).toHaveBeenCalledExactlyOnceWith('one')

      debounced('two')
      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    test('can be cancelled', () => {
      vi.useFakeTimers()
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced()
      debounced.cancel()
      vi.advanceTimersByTime(200)
      expect(fn).not.toHaveBeenCalled()
    })
  })

  describe('throttle()', () => {
    test('runs at most once per interval and caches the result', () => {
      vi.useFakeTimers()
      const fn = vi.fn(value => value)
      const throttled = throttle(fn, 100)

      expect(throttled('one')).toBe('one')
      expect(throttled('two')).toBe('one') // cached, fn not called again
      expect(fn).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(100)
      expect(throttled('three')).toBe('three')
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })
})
