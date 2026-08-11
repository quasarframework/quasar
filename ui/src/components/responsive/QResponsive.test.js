import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QResponsive from './QResponsive.js'

function getRatioPadding(wrapper) {
  return wrapper
    .get('.q-responsive__filler')
    .get('div')
    .$style('padding-bottom')
}

describe('[QResponsive API]', () => {
  describe('[Props]', () => {
    describe('[(prop)ratio]', () => {
      test('type String has effect', async () => {
        const wrapper = mount(QResponsive)

        expect(getRatioPadding(wrapper)).toBe('')

        await wrapper.setProps({ ratio: '1.7778' })

        expect(Number.parseFloat(getRatioPadding(wrapper))).toBeCloseTo(56.25)
      })

      test('type Number has effect', async () => {
        const wrapper = mount(QResponsive)

        expect(getRatioPadding(wrapper)).toBe('')

        await wrapper.setProps({ ratio: 2 })

        expect(getRatioPadding(wrapper)).toBe('50%')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QResponsive, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.get('.q-responsive__content').text()).toContain(
          slotContent
        )
      })
    })
  })
})
