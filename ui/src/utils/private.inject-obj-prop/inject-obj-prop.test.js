import { describe, test, expect } from 'vitest'

import { injectProp, injectMultipleProps } from './inject-obj-prop.js'

describe('[injectObjProp API]', () => {
  describe('[Functions]', () => {
    describe('[(function)injectProp]', () => {
      test('attaches getter correctly', () => {
        const source = { a: 5 }
        const target = {}

        const result = injectProp(
          target,
          'prop',
          () => source.a
        )

        expect(
          result
        ).toBe(target)

        expect(
          result.prop
        ).toBe(source.a)

        source.a = 'str'

        expect(
          result.prop
        ).toBe(source.a)
      })

      test('attaches getter + setter correctly', () => {
        const source = { a: 5 }
        const target = {}

        const result = injectProp(
          target,
          'prop',
          () => source.a,
          val => { source.a = val }
        )

        expect(
          result
        ).toBe(target)

        expect(
          result.prop
        ).toBe(source.a)

        source.a = 'str'

        expect(
          result.prop
        ).toBe(source.a)

        result.prop = 10

        expect(
          result.prop
        ).toBe(source.a)
      })
    })

    describe('[(function)injectMultipleProps]', () => {
      test('attaches multiple props with getters', () => {
        const source = { a: 5, b: 'str' }
        const target = {}

        const result = injectMultipleProps(
          target,
          {
            propA: () => source.a,
            propB: () => source.b
          }
        )

        expect(
          result
        ).toBe(target)

        expect(
          result.propA
        ).toBe(source.a)

        expect(
          result.propB
        ).toBe(source.b)

        source.a = 'str'
        source.b = 10

        expect(
          result.propA
        ).toBe(source.a)

        expect(
          result.propB
        ).toBe(source.b)
      })
    })
  })
})
