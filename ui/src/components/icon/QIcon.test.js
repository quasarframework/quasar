import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QIcon from './QIcon.js'

describe('[QIcon API]', () => {
  describe('[Props]', () => {
    describe('[(prop)size]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QIcon, {
          props: { size: '16px' }
        })

        expect(wrapper.attributes('style')).toContain('font-size: 16px')
      })
    })

    describe('[(prop)tag]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QIcon, {
          props: { tag: 'span' }
        })

        expect(wrapper.element.tagName).toBe('SPAN')
      })
    })

    describe('[(prop)name]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QIcon, {
          props: { name: 'map' }
        })

        expect(wrapper.classes()).toContain('material-icons')
        expect(wrapper.text()).toBe('map')
        expect(wrapper.attributes('aria-hidden')).toBe('true')
      })
    })

    describe('[(prop)color]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QIcon, {
          props: { color: 'primary' }
        })

        expect(wrapper.classes()).toContain('text-primary')
      })
    })

    describe('[(prop)left]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QIcon, {
          props: { left: true }
        })

        expect(wrapper.classes()).toContain('on-left')
      })
    })

    describe('[(prop)right]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QIcon, {
          props: { right: true }
        })

        expect(wrapper.classes()).toContain('on-right')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Custom icon content'
        const wrapper = mount(QIcon, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.text()).toContain(slotContent)
      })

      test('renders the content alongside the icon', () => {
        const slotContent = 'Custom icon content'
        const wrapper = mount(QIcon, {
          props: { name: 'map' },
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.classes()).toContain('material-icons')
        expect(wrapper.text()).toContain('map')
        expect(wrapper.text()).toContain(slotContent)
      })
    })
  })
})
