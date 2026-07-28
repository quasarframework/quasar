import { describe, expect, test } from 'vitest'

import { useCircularCommonProps } from './circular-progress.js'

describe('[circularProgress API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)useCircularCommonProps]', () => {
      test('is defined correctly', () => {
        expect(useCircularCommonProps).$props()
      })
    })
  })
})
