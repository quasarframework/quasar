import { describe, expect, test } from 'vitest'

import {
  injectMultipleProps,
  injectProp,
  injectScopeProps,
  scopeOwnerKey
} from './inject-obj-prop.js'

describe('[injectObjProp API]', () => {
  describe('[Functions]', () => {
    describe('[(function)injectProp]', () => {
      test('attaches getter correctly', () => {
        const source = { a: 5 }
        const target = {}

        const result = injectProp(target, 'prop', () => source.a)

        expect(result).toBe(target)

        expect(result.prop).toBe(source.a)

        source.a = 'str'

        expect(result.prop).toBe(source.a)
      })

      test('attaches getter + setter correctly', () => {
        const source = { a: 5 }
        const target = {}

        const result = injectProp(
          target,
          'prop',
          () => source.a,
          val => {
            source.a = val
          }
        )

        expect(result).toBe(target)

        expect(result.prop).toBe(source.a)

        source.a = 'str'

        expect(result.prop).toBe(source.a)

        result.prop = 10

        expect(result.prop).toBe(source.a)
      })
    })

    describe('[(function)injectMultipleProps]', () => {
      test('attaches multiple props with getters', () => {
        const source = { a: 5, b: 'str' }
        const target = {}

        const result = injectMultipleProps(target, {
          propA: () => source.a,
          propB: () => source.b
        })

        expect(result).toBe(target)

        expect(result.propA).toBe(source.a)

        expect(result.propB).toBe(source.b)

        source.a = 'str'
        source.b = 10

        expect(result.propA).toBe(source.a)

        expect(result.propB).toBe(source.b)
      })
    })

    describe('[(function)injectScopeProps]', () => {
      const descriptors = {
        prop: {
          enumerable: true,
          get() {
            return this[scopeOwnerKey].a
          },
          set(val) {
            this[scopeOwnerKey].a = val
          }
        }
      }

      test('has correct return value', () => {
        const owner = { a: 5 }
        const target = { b: 1 }

        const result = injectScopeProps(target, owner, descriptors)

        expect(result).toBe(target)
        expect(result.prop).toBe(5)

        owner.a = 'str'
        expect(result.prop).toBe('str')

        result.prop = 10
        expect(owner.a).toBe(10)
      })

      test('only exposes the injected props', () => {
        const result = injectScopeProps({ b: 1 }, { a: 5 }, descriptors)

        expect(Reflect.ownKeys({ ...result })).toStrictEqual(['b', 'prop'])
        expect(result).toStrictEqual({ b: 1, prop: 5 })
      })

      test('shares the accessors between targets', () => {
        const ownerA = { a: 1 }
        const ownerB = { a: 2 }

        const targetA = injectScopeProps({ b: 1 }, ownerA, descriptors)
        const targetB = injectScopeProps({ b: 1 }, ownerB, descriptors)

        expect(targetA).$sharedAccessors(targetB, ['prop'])

        expect(targetA.prop).toBe(1)
        expect(targetB.prop).toBe(2)

        targetB.prop = 3
        expect(ownerA.a).toBe(1)
        expect(ownerB.a).toBe(3)
      })
    })
  })

  describe('[Variables]', () => {
    describe('[(variable)scopeOwnerKey]', () => {
      test('is defined correctly', () => {
        expect(scopeOwnerKey).toBeTypeOf('symbol')
      })
    })
  })
})
