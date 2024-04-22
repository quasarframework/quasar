import { describe, test, expect } from 'vitest'

import setCssVar from './set-css-var.js'

describe('[setCssVar API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('setCss(prop)', () => {
        expect(
          setCssVar('prop', 'awesome')
        ).toBeUndefined()

        expect(
          getComputedStyle(document.body)
            .getPropertyValue('--q-prop')
        ).toBe('awesome')
      })

      test('setCss(prop, el)', () => {
        const el = document.createElement('div')
        document.body.appendChild(el)

        expect.soft(
          setCssVar('my-prop', 'cool', el)
        ).toBeUndefined()

        expect.soft(
          getComputedStyle(el)
            .getPropertyValue('--q-my-prop')
        ).toBe('cool')

        el.remove()
      })

      test('should throw if propName is not a string', () => {
        expect(() => {
          setCssVar(5, 'awesome')
        }).toThrow(TypeError)
      })

      test('should throw if value is not a string', () => {
        expect(() => {
          setCssVar('prop', 5)
        }).toThrow(TypeError)
      })

      test('should throw if element is not a DOM element', () => {
        expect(() => {
          setCssVar('prop', 'awesome', {})
        }).toThrow(TypeError)
      })
    })
  })
})
