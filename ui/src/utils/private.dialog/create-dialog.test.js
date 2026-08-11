import { describe, expect, test } from 'vitest'

import { createDialog, merge } from './create-dialog.js'

describe('[createDialog API]', () => {
  describe('[Functions]', () => {
    describe('[(function)merge]', () => {
      test('replaces an array-valued prop instead of spreading it into an object', () => {
        const target = { options: { items: ['a', 'b', 'c'] } }

        merge(target, { options: { items: ['x'] } })

        expect(Array.isArray(target.options.items)).toBe(true)
        expect(target.options.items).toEqual(['x'])
      })
    })

    describe('[(function)createDialog]', () => {
      test('returns a dialog factory', () => {
        const result = createDialog({}, false, {})

        expect(result).toBeTypeOf('function')
      })
    })
  })
})
