import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QToolbar from './QToolbar.js'

describe('[QToolbar API]', () => {
  describe('[Props]', () => {
    describe('[(prop)inset]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QToolbar)
        const target = wrapper.get('.q-toolbar')

        expect(
          target.classes()
        ).not.toContain('q-toolbar--inset')

        await wrapper.setProps({ inset: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('q-toolbar--inset')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QToolbar, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })
  })
})
