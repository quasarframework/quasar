import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QBanner from './QBanner.js'

describe('[QBanner API]', () => {
  describe('[Props]', () => {
    describe('[(prop)inline-actions]', () => {
      test('should render the actions in the same row as the content', () => {
        const wrapper = mount(QBanner, {
          slots: {
            default: 'Banner content',
            action: 'Banner action'
          },
          props: {
            inlineActions: true
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
      test('should have a dense style when "dense" prop is true', () => {
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
      test('should have a rounded style when "rounded" prop is true', () => {
        const wrapper = mount(QBanner, {
          props: {
            rounded: true
          }
        })

        expect(
          wrapper.get('.q-banner')
            .classes()
        ).toContain('rounded-borders')
      })
    })

    describe('[(prop)dark]', () => {
      test('should have a dark style when "dark" prop is true', () => {
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
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('should render the default content', () => {
        const wrapper = mount(QBanner, {
          slots: {
            default: 'Banner content'
          }
        })

        expect(
          wrapper.get('.q-banner')
            .get('.q-banner__content')
            .text()
        ).toBe('Banner content')
      })
    })

    describe('[(slot)avatar]', () => {
      test('should render the avatar content', () => {
        const wrapper = mount(QBanner, {
          slots: {
            avatar: 'Banner avatar'
          }
        })

        expect(
          wrapper.get('.q-banner')
            .get('.q-banner__avatar')
            .text()
        ).toBe('Banner avatar')
      })
    })

    describe('[(slot)action]', () => {
      test('should render the action content', () => {
        const wrapper = mount(QBanner, {
          slots: {
            action: 'Banner action'
          }
        })

        expect(
          wrapper.get('.q-banner')
            .get('.q-banner__actions')
            .text()
        ).toBe('Banner action')
      })
    })
  })
})
