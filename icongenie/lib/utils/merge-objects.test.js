import { describe, expect, test } from 'vitest'

import { mergeObjects } from './merge-objects.js'

describe('mergeObjects', () => {
  test('later objects win', () => {
    expect(mergeObjects({ a: 1, b: 1 }, { b: 2 }, { b: 3, c: 3 })).toEqual({
      a: 1,
      b: 3,
      c: 3
    })
  })

  test('an undefined value does not override', () => {
    expect(mergeObjects({ a: 1 }, { a: void 0, b: void 0 })).toEqual({ a: 1 })
    // but null and falsy values do
    expect(mergeObjects({ a: 1, b: 1 }, { a: null, b: 0 })).toEqual({
      a: null,
      b: 0
    })
  })

  test('returns a new object', () => {
    const base = { a: 1 }
    const result = mergeObjects(base, {})

    expect(result).toEqual(base)
    expect(result).not.toBe(base)
    expect(mergeObjects()).toEqual({})
  })
})
