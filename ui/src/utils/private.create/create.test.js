import { describe, test, expect } from 'vitest'
import { isReactive } from 'vue'

import { createComponent, createDirective, createReactivePlugin } from './create.js'

describe('[create API]', () => {
  describe('[Functions]', () => {
    describe('[(function)createComponent]', () => {
      test('has correct return value', () => {
        const Component = { name: 'MyComp' }
        const result = createComponent(Component)

        expect(result).toStrictEqual(Component)
        expect(isReactive(result)).toBe(false)
      })
    })

    describe('[(function)createDirective]', () => {
      test('has correct return value', () => {
        const Directive = { name: 'MyDirective' }
        const result = createDirective(Directive)

        expect(result).toStrictEqual(Directive)
        expect(isReactive(result)).toBe(false)
      })
    })

    describe('[(function)createReactivePlugin]', () => {
      test('has correct return value', () => {
        const plugin = {}
        const state = {
          some: 'value',
          other: 'val'
        }

        const result = createReactivePlugin(state, plugin)

        expect(result).toBe(plugin)
        expect(result).toStrictEqual(state)

        Object.keys(state).forEach(key => {
          const descriptor = Object.getOwnPropertyDescriptor(result, key)

          expect(descriptor.get).toBeTypeOf('function')
          expect(descriptor.set).toBeTypeOf('function')

          plugin[ key ] = 'new-value'
          expect(plugin[ key ]).toBe('new-value')
          expect(state[ key ]).toBe('new-value')

          state[ key ] = 'quasar'
          expect(plugin[ key ]).toBe('quasar')
          expect(state[ key ]).toBe('quasar')
        })
      })
    })
  })
})
