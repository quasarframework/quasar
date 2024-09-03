import { describe, test, expect } from 'vitest'

import useRenderCache from './use-render-cache.js'

describe('[useRenderCache API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const result = useRenderCache()
        expect(result).toStrictEqual({
          getCache: expect.any(Function),
          setCache: expect.any(Function),
          hasCache: expect.any(Function),
          clearCache: expect.any(Function)
        })
      })

      test('getCache() returns undefined', () => {
        const { getCache } = useRenderCache()
        expect(getCache('key')).toBeUndefined()
      })

      test('setCache() sets cache', () => {
        const { setCache, getCache } = useRenderCache()
        setCache('key', 'value')
        expect(getCache('key')).toBe('value')

        setCache('key', 'second-value')
        expect(getCache('key')).toBe('second-value')

        setCache('another-key', 'another-value')
        expect(getCache('another-key')).toBe('another-value')
        expect(getCache('key')).toBe('second-value')
      })

      test('hasCache() returns true', () => {
        const { hasCache, setCache } = useRenderCache()
        setCache('key', 0)
        setCache('key2', 10)
        expect(hasCache('key')).toBe(true)
        expect(hasCache('key2')).toBe(true)
      })

      test('clearCache() clears cache', () => {
        const { clearCache, setCache, getCache, hasCache } = useRenderCache()
        setCache('key', 0)
        setCache('key2', 0)

        clearCache()

        expect(hasCache('key')).toBe(false)
        expect(getCache('key')).toBeUndefined()

        expect(hasCache('key2')).toBe(false)
        expect(getCache('key2')).toBeUndefined()
      })

      test('clearCache(key) clears only the key', () => {
        const { clearCache, setCache, getCache, hasCache } = useRenderCache()
        setCache('key', 0)
        setCache('key2', 0)

        clearCache('key')

        expect(hasCache('key')).toBe(false)
        expect(getCache('key')).toBeUndefined()

        expect(hasCache('key2')).toBe(true)
        expect(getCache('key2')).toBe(0)
      })
    })
  })
})
