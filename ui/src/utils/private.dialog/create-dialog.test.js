import { describe, expect, test } from 'vitest'

import { merge } from './create-dialog.js'

describe('[create-dialog API]', () => {
  describe('[Functions]', () => {
    describe('[(function)merge]', () => {
      test('merges array-valued props by index and keeps them arrays', () => {
        const target = { options: { items: ['a', 'b', 'c'] } }

        merge(target, { options: { items: ['x'] } })

        expect(Array.isArray(target.options.items)).toBe(true)
        expect(target.options.items).toEqual(['x', 'b', 'c'])
      })
    })
  })
})
