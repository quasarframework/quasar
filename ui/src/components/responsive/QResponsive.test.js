import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QResponsive from './QResponsive.js'

function getRatio(wrapper) {
  return wrapper.get('.q-responsive').$style('aspect-ratio')
}

describe('[QResponsive API]', () => {
  describe('[Props]', () => {
    describe('[(prop)ratio]', () => {
      test('type String has effect', async () => {
        const wrapper = mount(QResponsive)

        expect(getRatio(wrapper)).toBe('')

        await wrapper.setProps({ ratio: '1.7778' })

        expect(Number.parseFloat(getRatio(wrapper))).toBeCloseTo(1.7778)
      })

      test('type Number has effect', async () => {
        const wrapper = mount(QResponsive)

        expect(getRatio(wrapper)).toBe('')

        await wrapper.setProps({ ratio: 2 })

        expect(Number.parseFloat(getRatio(wrapper))).toBe(2)
      })

      test('sizes the box height from its width', () => {
        const wrapper = mount(QResponsive, {
          props: { ratio: 2 },
          attrs: { style: 'width: 200px' }
        })

        expect(wrapper.element.offsetHeight).toBe(100)
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
