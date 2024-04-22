import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Body from './Body.js'

const mountPlugin = () => mount({ template: '<div />' })

describe('[Body API]', () => {
  describe('[Functions]', () => {
    describe('[(function)install]', () => {
      test('should be defined correctly', () => {
        expect(Body).toBeTypeOf('object')

        expect(
          Body.install
        ).toBeTypeOf('function')
      })

      test('sets body classes', () => {
        mountPlugin()

        expect(
          document.body.getAttribute('class')
        ).toBe('desktop touch body--light')
      })
    })
  })
})
