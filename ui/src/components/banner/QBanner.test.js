import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QBanner from './QBanner.js'

describe('[QBanner API]', () => {
  describe('[Props]', () => {
    describe('[(prop)inline-actions]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBanner, {
          slots: {
            action: () => 'Banner action'
          }
        })

        const target = wrapper
          .get('.q-banner')
          .get('.q-banner__actions')

        expect(
          target.classes()
        ).not.toContain('col-auto')

        await wrapper.setProps({ inlineActions: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('col-auto')
      })
    })

    describe('[(prop)dense]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBanner)
        const target = wrapper.get('.q-banner')

        expect(
          target.classes()
        ).not.toContain('q-banner--dense')

        await wrapper.setProps({ dense: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-banner--dense')
      })
    })

    describe('[(prop)rounded]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBanner)
        const target = wrapper.get('.q-banner')

        expect(
          target.classes()
        ).not.toContain('rounded-borders')

        await wrapper.setProps({ rounded: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('rounded-borders')

        expect(
          target.$computedStyle('border-radius')
        ).toBe('4px')
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBanner)
        const target = wrapper.get('.q-banner')

        expect(
          target.classes()
        ).not.toContain('q-banner--dark')

        await wrapper.setProps({ dark: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-banner--dark')
      })

      test('type null has effect', async () => {
        const wrapper = mount(QBanner, {
          props: {
            dark: null
          }
        })

        expect(
          wrapper.get('.q-banner')
            .classes()
        ).not.toContain('q-banner--dark')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QBanner, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })

    describe('[(slot)avatar]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QBanner, {
          slots: {
            avatar: () => slotContent
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })

    describe('[(slot)action]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QBanner, {
          slots: {
            action: () => slotContent
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })
  })
})
