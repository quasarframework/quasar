import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QCarouselControl from './QCarouselControl.js'

function expectPosition(position) {
  const wrapper = mount(QCarouselControl, {
    props: { position }
  })

  expect(wrapper.get('.q-carousel__control').classes()).toContain(
    `absolute-${position}`
  )
}

describe('[QCarouselControl API]', () => {
  describe('[Props]', () => {
    describe('[(prop)position]', () => {
      test('value "top-right" has effect', () => {
        expectPosition('top-right')
      })

      test('value "top-left" has effect', () => {
        expectPosition('top-left')
      })

      test('value "bottom-right" has effect', () => {
        expectPosition('bottom-right')
      })

      test('value "bottom-left" has effect', () => {
        expectPosition('bottom-left')
      })

      test('value "top" has effect', () => {
        expectPosition('top')
      })

      test('value "right" has effect', () => {
        expectPosition('right')
      })

      test('value "bottom" has effect', () => {
        expectPosition('bottom')
      })

      test('value "left" has effect', () => {
        expectPosition('left')
      })
    })

    describe('[(prop)offset]', () => {
      test('type Array has effect', async () => {
        const wrapper = mount(QCarouselControl)
        const target = wrapper.get('.q-carousel__control')

        expect(target.$style('margin')).toBe('18px')

        await wrapper.setProps({ offset: [5, 10] })

        expect(target.$style('margin')).toBe('10px 5px')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QCarouselControl, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.get('.q-carousel__control').text()).toContain(
          slotContent
        )
      })
    })
  })
})
