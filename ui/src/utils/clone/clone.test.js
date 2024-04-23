import { describe, test, expect } from 'vitest'

import clone from './clone.js'

describe('[clone API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test.each([
        [ 'Number', 5 ],
        [ 'String', 'a' ],
        [ 'Boolean', true ],
        [ 'Null', null ],
        [ 'Undefined', undefined ],
        [ 'NaN', NaN ],
        [ 'Infinity', Infinity ]
      ])('clone(%s)', (_, value) => {
        const result = clone(value)

        expect(
          result
        ).toBe(value)
      })

      test('clone(Date)', () => {
        const date = new Date(150)
        const result = clone(date)

        expect(
          result.getTime()
        ).toBe(date.getTime())

        expect(
          result
        ).not.toBe(date)
      })

      test('clone(RegExp)', () => {
        const regex = /./
        const result = clone(regex)

        expect(
          result.source
        ).toBe(regex.source)

        expect(
          result.flags
        ).toBe(regex.flags)

        expect(
          result
        ).not.toBe(regex)
      })

      test('clone(Array)', () => {
        const array = [ 1, 2, 3 ]
        const result = clone(array)

        expect(
          result
        ).toStrictEqual(array)

        expect(
          result
        ).not.toBe(array)
      })

      test('clone(Object)', () => {
        const object = { a: true, b: false }
        const result = clone(object)

        expect(
          result
        ).toStrictEqual(object)

        expect(
          result
        ).not.toBe(object)
      })

      test('clone(Set)', () => {
        const set = new Set([ 1, 2, 3 ])
        const result = clone(set)

        expect(
          Array.from(result.values())
        ).toStrictEqual(
          Array.from(set.values())
        )

        expect(
          result
        ).not.toBe(set)
      })

      test('clone(Map)', () => {
        const map = new Map([ [ 1, 'one' ], [ 2, 'two' ] ])
        const result = clone(map)

        expect(
          Array.from(result.entries())
        ).toStrictEqual(
          Array.from(map.entries())
        )

        expect(
          result
        ).not.toBe(map)
      })
    })
  })
})
