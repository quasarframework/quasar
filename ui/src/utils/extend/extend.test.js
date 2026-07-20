import { describe, expect, test } from 'vitest'

import extend from './extend.js'

describe('[extend API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('simple object', () => {
        expect(extend({}, { a: true, b: 2, c: 'str' })).toStrictEqual({
          a: true,
          b: 2,
          c: 'str'
        })
      })

      test('has correct return value', () => {
        const target = {}
        const result = extend(target, { a: true, b: 2, c: 'str' })
        expect(result).toBe(target)
      })

      test('extend object (deep)', () => {
        expect(extend(true, { a: { b: 2 } }, { a: { c: 3 } })).toStrictEqual({
          a: { b: 2, c: 3 }
        })
      })

      test('extend object (not deep)', () => {
        expect(extend(false, { a: { b: 2 } }, { a: { c: 3 } })).toStrictEqual({
          a: { c: 3 }
        })
      })

      test('extend array (deep)', () => {
        expect(
          extend(true, { a: [1, 2, [3, 4]] }, { a: [[5, 6]] })
        ).toStrictEqual({
          a: [[5, 6], 2, [3, 4]]
        })
      })

      test('extend array (not deep)', () => {
        expect(extend(false, { a: [1, 2] }, { a: [3] })).toStrictEqual({
          a: [3]
        })
      })

      test('extend array with object', () => {
        expect(extend(true, { a: [1, { b: 2 }] }, { a: [3] })).toStrictEqual({
          a: [3, { b: 2 }]
        })
      })

      test.each([
        ['boolean', true, false],
        ['number', 5, 6],
        ['string', 'a', 'b'],
        ['undefined', void 0, null],
        ['NaN', Number.NaN, Infinity],
        ['Infinity', Infinity, 5],
        ['Date', new Date(150), new Date(200)],
        ['RegExp', /./, /.aaa/],
        ['Array', [1, 2, 3], [1, 2, 3, 4]],
        ['Object', { a: true }, { a: false }]
      ])('extend %s', (_, a, b) => {
        expect(extend({ a }, { a: b })).toStrictEqual({ a: b })
      })

      test('extend Date with object', () => {
        const date = new Date(150)
        const result = extend({}, { a: date }, { a: true })

        expect(result).toStrictEqual({ a: true })
      })

      test('extend Fn', () => {
        const fn1 = () => 5
        const fn2 = () => 6
        const result = extend({}, { a: fn1 }, { a: fn2 })

        expect(result).toStrictEqual({ a: fn2 })

        expect(result.a()).toBe(6)
      })

      test.each([true, false])('does not merge __proto__ (deep: %s)', deep => {
        const target = {}
        const source = JSON.parse(
          '{"__proto__":{"polluted":"prototype pollution"}}'
        )

        extend(deep, target, source)

        expect(Object.getPrototypeOf(target)).toBe(Object.prototype)
        expect(Object.hasOwn(target, '__proto__')).toBe(false)
        expect(Object.prototype.polluted).toBeUndefined()
      })

      test('preserves constructor and prototype data properties', () => {
        const result = extend(
          true,
          {},
          {
            constructor: { name: 'custom' },
            prototype: { type: 'custom' }
          }
        )

        expect(Object.hasOwn(result, 'constructor')).toBe(true)
        expect(Object.hasOwn(result, 'prototype')).toBe(true)
        expect(result.constructor).toStrictEqual({ name: 'custom' })
        expect(result.prototype).toStrictEqual({ type: 'custom' })
      })
    })
  })
})
