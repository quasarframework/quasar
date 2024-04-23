import { describe, test, expect } from 'vitest'

import getCssVar from './get-css-var.js'

describe('[getCssVar API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('getCssVar(prop)', () => {
        document.body.style.setProperty(
          '--q-prop',
          'my-value'
        )

        expect(
          getCssVar('prop')
        ).toBe('my-value')
      })

      test('getCssVar(prop, el)', () => {
        const el = document.createElement('div')
        document.body.appendChild(el)
        el.style.setProperty('--q-my-prop', 'some-value')

        expect.soft(
          getCssVar('my-prop', el)
        ).toBe('some-value')

        el.remove()
      })

      test('should throw if propName is not a string', () => {
        expect(() => {
          getCssVar(5)
        }).toThrow(TypeError)
      })

      test('should throw if element is not a DOM element', () => {
        expect(() => {
          getCssVar('prop', {})
        }).toThrow(TypeError)
      })
    })
  })
})
