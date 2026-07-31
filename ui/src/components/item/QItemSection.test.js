import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QItemSection from './QItemSection.js'

describe('[QItemSection API]', () => {
  describe('[Props]', () => {
    describe('[(prop)avatar]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QItemSection, {
          props: { avatar: true }
        })

        expect(wrapper.classes()).toContain('q-item__section--side')
        expect(wrapper.classes()).toContain('q-item__section--avatar')
      })
    })

    describe('[(prop)thumbnail]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QItemSection, {
          props: { thumbnail: true }
        })

        expect(wrapper.classes()).toContain('q-item__section--side')
        expect(wrapper.classes()).toContain('q-item__section--thumbnail')
      })
    })

    describe('[(prop)side]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QItemSection, {
          props: { side: true }
        })

        expect(wrapper.classes()).toContain('q-item__section--side')
        expect(wrapper.classes()).not.toContain('q-item__section--main')
      })
    })

    describe('[(prop)top]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QItemSection, {
          props: { top: true }
        })

        expect(wrapper.classes()).toContain('q-item__section--top')
        expect(wrapper.classes()).toContain('justify-start')
        expect(wrapper.classes()).not.toContain('justify-center')
      })
    })

    describe('[(prop)no-wrap]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QItemSection, {
          props: { noWrap: true }
        })

        expect(wrapper.classes()).toContain('q-item__section--nowrap')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Item section content'
        const wrapper = mount(QItemSection, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.text()).toBe(slotContent)
      })
    })
  })
})
