import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QBar from './QBar.js'

describe('[QBar API]', () => {
  describe('[Props]', () => {
    describe('[(prop)dense]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBar)
        const target = wrapper.get('.q-bar')

        expect(
          target.classes()
        ).not.toContain('q-bar--dense')

        await wrapper.setProps({ dense: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-bar--dense')
      })
    })

    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QBar)
        const target = wrapper.get('.q-bar')

        expect(
          target.classes()
        ).not.toContain('q-bar--dark')

        await wrapper.setProps({ dark: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-bar--dark')
      })

      test('type null has effect', async () => {
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
