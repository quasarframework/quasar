import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QCardActions from './QCardActions.js'

function expectAlignment(align, className) {
  const wrapper = mount(QCardActions, {
    props: { align }
  })

  expect(wrapper.get('.q-card__actions').classes()).toContain(className)
}

describe('[QCardActions API]', () => {
  describe('[Props]', () => {
    describe('[(prop)align]', () => {
      test('value "left" has effect', () => {
        expectAlignment('left', 'justify-start')
      })

      test('value "center" has effect', () => {
        expectAlignment('center', 'justify-center')
      })

      test('value "right" has effect', () => {
        expectAlignment('right', 'justify-end')
      })

      test('value "between" has effect', () => {
        expectAlignment('between', 'justify-between')
      })

      test('value "around" has effect', () => {
        expectAlignment('around', 'justify-around')
      })

      test('value "evenly" has effect', () => {
        expectAlignment('evenly', 'justify-evenly')
      })

      test('value "stretch" has effect', () => {
        expectAlignment('stretch', 'justify-stretch')
      })
    })

    describe('[(prop)vertical]', () => {
      test('type Boolean has effect', async () => {
        const wrapper = mount(QCardActions)
        const target = wrapper.get('.q-card__actions')

        expect(target.classes()).toEqual(
          expect.arrayContaining([
            'q-card__actions--horiz',
            'row',
            'justify-start'
          ])
        )

        await wrapper.setProps({ vertical: true })

        expect(target.classes()).toEqual(
          expect.arrayContaining([
            'q-card__actions--vert',
            'column',
            'items-stretch'
          ])
        )
        expect(target.classes()).not.toContain('q-card__actions--horiz')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QCardActions, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.get('.q-card__actions').text()).toContain(slotContent)
      })
    })
  })
})
