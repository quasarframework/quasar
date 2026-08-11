import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QItemLabel from './QItemLabel.js'

describe('[QItemLabel API]', () => {
  describe('[Props]', () => {
    describe('[(prop)overline]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QItemLabel, {
          props: { overline: true }
        })

        expect(wrapper.classes()).toContain('q-item__label--overline')
        expect(wrapper.classes()).toContain('text-overline')
      })
    })

    describe('[(prop)caption]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QItemLabel, {
          props: { caption: true }
        })

        expect(wrapper.classes()).toContain('q-item__label--caption')
        expect(wrapper.classes()).toContain('text-caption')
      })
    })

    describe('[(prop)header]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QItemLabel, {
          props: { header: true }
        })

        expect(wrapper.classes()).toContain('q-item__label--header')
      })
    })

    describe('[(prop)lines]', () => {
      test('type Number has effect', () => {
        const wrapper = mount(QItemLabel, {
          props: { lines: 3 }
        })

        expect(wrapper.attributes('style')).toContain('overflow: hidden')
        expect(wrapper.attributes('style')).toContain('display: -webkit-box')
        expect(wrapper.attributes('style')).toContain(
          '-webkit-box-orient: vertical'
        )
        expect(wrapper.attributes('style')).toContain('-webkit-line-clamp: 3')
      })

      test('type String has effect', () => {
        const wrapper = mount(QItemLabel, {
          props: { lines: '1' }
        })

        expect(wrapper.classes()).toContain('ellipsis')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Item label content'
        const wrapper = mount(QItemLabel, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.text()).toBe(slotContent)
      })
    })
  })
})
