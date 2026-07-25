import { describe, expect, test } from 'vitest'

import { merge } from './create-dialog.js'

describe('[create-dialog API]', () => {
  describe('[Functions]', () => {
    describe('[(function)merge]', () => {
      test('replaces an array-valued prop instead of spreading it into an object', () => {
        const target = { options: { items: ['a', 'b', 'c'] } }

        merge(target, { options: { items: ['x'] } })

        expect(Array.isArray(target.options.items)).toBe(true)
        expect(target.options.items).toEqual(['x'])
      })
    })
  })
})
