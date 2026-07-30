import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QCardSection from './QCardSection.js'

describe('[QCardSection API]', () => {
  describe('[Props]', () => {
    describe('[(prop)horizontal]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QCardSection)
        const target = wrapper.get('.q-card__section')

        expect(target.classes()).toContain('q-card__section--vert')
        expect(target.classes()).not.toContain('row')

        await wrapper.setProps({ horizontal: true })

        expect(target.classes()).not.toContain('q-card__section--vert')
        expect(target.classes()).toEqual(
          expect.arrayContaining(['q-card__section--horiz', 'row', 'no-wrap'])
        )
      })
    })

    describe('[(prop)tag]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QCardSection, {
          props: {
            tag: 'section'
          }
        })

        expect(wrapper.element.tagName).toBe('SECTION')
        expect(wrapper.classes()).toContain('q-card__section')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QCardSection, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.get('.q-card__section').text()).toContain(slotContent)
      })
    })
  })
})
