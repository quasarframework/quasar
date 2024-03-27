import { describe, test, expect } from 'vitest'

import useSize, { useSizeDefaults } from './use-size.js'

describe('[useSize API]', () => {
  describe('(prop): size', () => {
    test('should set the size', () => {
      const { value } = useSize({ size: '24px' })
      expect(value.fontSize).toBe('24px')
    })

    test('should set the size with standard size names', () => {
      const { value } = useSize({ size: 'sm' })
      expect(value.fontSize).toBe(`${ useSizeDefaults.sm }px`)
    })

    test('should set the size with custom size names', () => {
      const { value } = useSize({ size: 'xs' }, { xs: 55 })
      expect(value.fontSize).toBe('55px')
    })
  })
})
