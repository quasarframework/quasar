import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QCard from './QCard.js'

async function expectBooleanClass(prop, className) {
  const wrapper = mount(QCard)
  const target = wrapper.get('.q-card')

  expect(target.classes()).not.toContain(className)

  await wrapper.setProps({ [prop]: true })

  expect(target.classes()).toContain(className)
}

describe('[QCard API]', () => {
  describe('[Props]', () => {
    describe('[(prop)dark]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QCard)
        const target = wrapper.get('.q-card')

        expect(target.classes()).not.toContain('q-card--dark')
        expect(target.classes()).not.toContain('q-dark')

        await wrapper.setProps({ dark: true })

        expect(target.classes()).toContain('q-card--dark')
        expect(target.classes()).toContain('q-dark')
      })

      test('type null has effect', async () => {
        const wrapper = mount(QCard, {
          props: {
            dark: true
          }
        })
        const target = wrapper.get('.q-card')

        expect(target.classes()).toContain('q-card--dark')

        await wrapper.setProps({ dark: null })

        expect(target.classes()).not.toContain('q-card--dark')
        expect(target.classes()).not.toContain('q-dark')
      })
    })

    describe('[(prop)square]', () => {
      test('type Boolean has effect', async () => {
        await expectBooleanClass('square', 'q-card--square')
      })
    })

    describe('[(prop)flat]', () => {
      test('type Boolean has effect', async () => {
        await expectBooleanClass('flat', 'q-card--flat')
      })
    })

    describe('[(prop)bordered]', () => {
      test('type Boolean has effect', async () => {
        await expectBooleanClass('bordered', 'q-card--bordered')
      })
    })

    describe('[(prop)tag]', () => {
      test('type String has effect', () => {
        const wrapper = mount(QCard, {
          props: {
            tag: 'section'
          }
        })

        expect(wrapper.element.tagName).toBe('SECTION')
        expect(wrapper.classes()).toContain('q-card')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QCard, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.get('.q-card').text()).toContain(slotContent)
      })
    })
  })
})
