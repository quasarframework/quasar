import { describe, test, expect } from 'vitest'
import { isReactive } from 'vue'

import { createComponent, createDirective } from './create.js'

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
  })
})
