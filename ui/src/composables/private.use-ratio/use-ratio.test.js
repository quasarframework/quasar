import { describe, expect, test } from 'vitest'

import useRatio, { useRatioProps } from './use-ratio.js'

describe('[useRatio API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useRatioProps]', () => {
      test('is defined correctly', () => {
        expect(useRatioProps).$props()
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('returns the aspect ratio when ratio is supplied', () => {
        const { value } = useRatio({ ratio: 2 })
        expect(value).toStrictEqual({ aspectRatio: 2 })
      })

      test('returns the aspect ratio when naturalRatio is supplied', () => {
        const { value } = useRatio({}, { value: 2 })
        expect(value).toStrictEqual({ aspectRatio: 2 })
      })

      test('returns null on invalid params', () => {
        const { value } = useRatio({ ratio: 'a' })
        expect(value).toBeNull()
      })

      test('returns null when no params are supplied', () => {
        const { value } = useRatio({})
        expect(value).toBeNull()
      })
    })
  })
})
