import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'

import QToolbarTitle from './QToolbarTitle.js'

describe('[QToolbarTitle API]', () => {
  describe('[Props]', () => {
    describe('[(prop)shrink]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QToolbarTitle)
        const target = wrapper.get('.q-toolbar__title')

        expect(
          target.classes()
        ).not.toContain('col-shrink')

        await wrapper.setProps({ shrink: true })
        await flushPromises()

        expect(
          target.classes()
        ).toContain('col-shrink')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QToolbarTitle, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })
  })
})
