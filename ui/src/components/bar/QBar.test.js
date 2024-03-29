import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QBar from './QBar.js'

describe('[QBar API]', () => {
  describe('[Props]', () => {
    describe('[(prop)dense]', () => {
      test('should have a dense style when "dense" prop is true', () => {
        const wrapper = mount(QBar, {
          propsData: {
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
      test('should have a dark style when "dark" prop is true', () => {
        const wrapper = mount(QBar, {
          propsData: {
            dark: true
          }
        })

        expect(
          wrapper.get('.q-bar')
            .classes()
        ).toContain('q-bar--dark')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('should render the default slot', () => {
        const wrapper = mount(QBar, {
          slots: {
            default: 'default bar slot'
          }
        })

        expect(
          wrapper.get('.q-bar')
            .text()
        ).toContain('default bar slot')
      })
    })
  })
})
