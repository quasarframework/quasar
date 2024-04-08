import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QBar from './QBar.js'

describe('[QBar API]', () => {
  describe('[Props]', () => {
    describe('[(prop)dense]', () => {
      test('is defined correctly', () => {
        expect(QBar.props.dense).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBar, {
          props: {
            dense: true
          }
        })

        expect(
          wrapper.get('.q-bar')
            .classes()
        ).toContain('q-bar--dense')
      })
    })

    describe('[(prop)dark]', () => {
      test('is defined correctly', () => {
        expect(QBar.props.dark).toBeDefined()
      })

      test('type Boolean has effect', () => {
        const wrapper = mount(QBar, {
          props: {
            dark: true
          }
        })

        expect(
          wrapper.get('.q-bar')
            .classes()
        ).toContain('q-bar--dark')
      })

      test('type null has effect', () => {
        const wrapper = mount(QBar, {
          props: {
            dark: null
          }
        })

        expect(
          wrapper.get('.q-bar')
            .classes()
        ).not.toContain('q-bar--dark')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QBar, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })
  })
})
