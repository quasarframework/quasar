import { describe, expect, test } from 'vitest'

import { merge } from './create-dialog.js'

describe('[create-dialog API]', () => {
  describe('[Functions]', () => {
    describe('[(function)merge]', () => {
      test('replaces an array-valued prop instead of spreading it into an object', () => {
        const target = { options: { items: ['x'] } }

        merge(target, { options: { items: ['a', 'b'] } })

        expect(Array.isArray(target.options.items)).toBe(true)
        expect(target.options.items).toEqual(['a', 'b'])
      })
    })
  })
})
