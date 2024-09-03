import { describe, test, expect } from 'vitest'

import getEmitsObject from './get-emits-object.js'

describe('[getEmitsObject API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const emitsArray = [ 'foo', 'bar' ]
        const result = getEmitsObject(emitsArray)

        expect(
          result
        ).toStrictEqual({
          foo: expect.any(Function),
          bar: expect.any(Function)
        })

        expect(
          result.foo()
        ).toBe(true)

        expect(
          result.bar()
        ).toBe(true)
      })
    })
  })
})
