import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QSeparator from './QSeparator.js'

function expectInsetClass(inset, className) {
  const wrapper = mount(QSeparator, {
    props: { inset }
  })

  expect(wrapper.get('.q-separator').classes()).toContain(className)
}

describe('[QSeparator API]', () => {
  describe('[Props]', () => {
    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QSeparator)
        const target = wrapper.get('.q-separator')

        expect(target.classes()).not.toContain('q-separator--dark')

        await wrapper.setProps({ dark: true })

        expect(target.classes()).toContain('q-separator--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mount(QSeparator, {
          props: {
            dark: true
          }
        })
        const target = wrapper.get('.q-separator')

        expect(target.classes()).toContain('q-separator--dark')

        await wrapper.setProps({ dark: null })

        expect(target.classes()).not.toContain('q-separator--dark')
      })
    })

    describe('[(prop)spaced]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QSeparator)
        const target = wrapper.get('.q-separator')

        expect(target.$style('margin-top')).toBe('')
        expect(target.$style('margin-bottom')).toBe('')

        await wrapper.setProps({ spaced: true })

        expect(target.$style('margin-top')).toBe('8px')
        expect(target.$style('margin-bottom')).toBe('8px')
      })

      test('type String has effect', async () => {
        const wrapper = mount(QSeparator)
        const target = wrapper.get('.q-separator')

        await wrapper.setProps({ spaced: '12px' })

        expect(target.$style('margin-top')).toBe('12px')
        expect(target.$style('margin-bottom')).toBe('12px')
      })
    })

    describe('[(prop)inset]', () => {
      test('value true has effect', () => {
        expectInsetClass(true, 'q-separator--horizontal-inset')
      })

      test('value false has effect', () => {
        const wrapper = mount(QSeparator, {
          props: {
            inset: false
          }
        })

        expect(wrapper.get('.q-separator').classes()).not.toContain(
          'q-separator--horizontal-inset'
        )
      })

      test('value "item" has effect', () => {
        expectInsetClass('item', 'q-separator--horizontal-item-inset')
      })

      test('value "item-thumbnail" has effect', () => {
        expectInsetClass(
          'item-thumbnail',
          'q-separator--horizontal-item-thumbnail-inset'
        )
      })
    })

    describe('[(prop)vertical]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QSeparator)
        const target = wrapper.get('.q-separator')

        expect(target.attributes('aria-orientation')).toBe('horizontal')
        expect(target.classes()).toContain('q-separator--horizontal')

        await wrapper.setProps({ vertical: true })

        expect(target.attributes('aria-orientation')).toBe('vertical')
        expect(target.classes()).toContain('q-separator--vertical')
        expect(target.classes()).not.toContain('q-separator--horizontal')
      })
    })

    describe('[(prop)size]', () => {
      test('type String has effect', async () => {
        const wrapper = mount(QSeparator)
        const target = wrapper.get('.q-separator')

        expect(target.$style('height')).toBe('')

        await wrapper.setProps({ size: '16px' })

        expect(target.$style('height')).toBe('16px')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', async () => {
        const wrapper = mount(QSeparator)
        const target = wrapper.get('.q-separator')

        expect(target.classes()).not.toContain('bg-primary')

        await wrapper.setProps({ color: 'primary' })

        expect(target.classes()).toContain('bg-primary')
      })
    })
  })
})
