import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QBanner from './QBanner.js'

describe('[QBanner API]', () => {
  describe('[Props]', () => {
    describe('[(prop)inline-actions]', () => {
      test('is defined correctly', () => {
        expect(QBanner.props.inlineActions).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBanner, {
          props: {
            inlineActions: true
          },
          slots: {
            action: () => 'Banner action'
          }
        })

        expect(
          wrapper.get('.q-banner')
            .get('.q-banner__actions')
            .classes()
        ).toContain('col-auto')
      })
    })

    describe('[(prop)dense]', () => {
      test('is defined correctly', () => {
        expect(QBanner.props.dense).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBanner, {
          props: {
            dense: true
          }
        })

        expect(
          wrapper.get('.q-banner')
            .classes()
        ).toContain('q-banner--dense')
      })
    })

    describe('[(prop)rounded]', () => {
      test('is defined correctly', () => {
        expect(QBanner.props.rounded).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const propVal = true
        const wrapper = mount(QBanner, {
          props: {
            rounded: propVal
          }
        })

        expect(
          wrapper.get('.q-banner')
            .$computedStyle('border-radius')
        ).toBe('4px')
      })
    })

    describe('[(prop)dark]', () => {
      test('is defined correctly', () => {
        expect(QBanner.props.dark).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBanner, {
          props: {
            dark: true
          }
        })

        expect(
          wrapper.get('.q-banner')
            .classes()
        ).toContain('q-banner--dark')
      })

      test('type null has effect', () => {
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
