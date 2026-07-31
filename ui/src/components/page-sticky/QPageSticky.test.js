import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import { layoutKey } from '../../utils/private.symbols/symbols.js'

import QPageSticky from './QPageSticky.js'

function mountSticky(props = {}, slots = {}) {
  const layout = {
    header: { offset: 60 },
    right: { offset: 24 },
    footer: { offset: 40 },
    left: { offset: 16 }
  }

  return mount(QPageSticky, {
    props,
    slots,
    global: {
      provide: {
        [layoutKey]: layout
      }
    }
  })
}

function expectPosition(position) {
  const wrapper = mountSticky({ position })

  expect(wrapper.classes()).toContain(`fixed-${position}`)
}

describe('[QPageSticky API]', () => {
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
      test('type Array has effect', () => {
        const wrapper = mountSticky({ offset: [12, 8] })

        expect(wrapper.attributes('style')).toContain('margin: 8px 12px')
      })
    })

    describe('[(prop)expand]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mountSticky({ expand: true })

        expect(wrapper.classes()).toContain('q-page-sticky--expand')
        expect(wrapper.classes()).not.toContain('q-page-sticky--shrink')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Sticky page content'
        const wrapper = mountSticky({}, { default: () => slotContent })

        expect(wrapper.text()).toBe(slotContent)
      })
    })
  })
})
