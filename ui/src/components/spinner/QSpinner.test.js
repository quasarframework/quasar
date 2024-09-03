import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QSpinner from './QSpinner.js'

describe('[QSpinner API]', () => {
  describe('[Props]', () => {
    describe('[(prop)size]', () => {
      test.each([
        [ 'String', '100px' ],
        [ 'Number', 100 ]
      ])('type %s has effect', async (_, propVal) => {
        const expectedValue = '' + propVal
        const wrapper = mount(QSpinner)

        const target = wrapper.get('.q-spinner')

        expect(
          target.attributes('width')
        ).not.toBe(expectedValue)

        expect(
          target.attributes('height')
        ).not.toBe(expectedValue)

        await wrapper.setProps({ size: propVal })
        await flushPromises()

        expect(
          target.attributes('width')
        ).toBe(expectedValue)

        expect(
          target.attributes('height')
        ).toBe(expectedValue)
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', async () => {
        const propVal = 'red'
        const wrapper = mount(QSpinner)

        const target = wrapper.get('.q-spinner')

        expect(
          target.classes()
        ).not.toContain('text-red')

        await wrapper.setProps({ color: propVal })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('text-red')
      })
    })

    describe('[(prop)thickness]', () => {
      test('type Number has effect', async () => {
        const propVal = 50
        const wrapper = mount(QSpinner)

        const target = wrapper.get('.q-spinner circle')

        expect(
          target.attributes('stroke-width')
        ).not.toBe('' + propVal)

        await wrapper.setProps({ thickness: propVal })
        await flushPromises()

        expect(
          target.attributes('stroke-width')
        ).toBe('' + propVal)
      })
    })
  })
})
