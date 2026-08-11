import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'

import {
  layoutKey,
  pageContainerKey
} from '../../utils/private.symbols/symbols.js'

import QPage from './QPage.js'

function mountPage(props = {}, slots = {}) {
  const layout = {
    isContainer: ref(true),
    containerHeight: ref(720),
    header: { space: true, size: 64 },
    footer: { space: true, size: 48 }
  }

  return {
    layout,
    wrapper: mount(QPage, {
      props,
      slots,
      global: {
        provide: {
          [layoutKey]: layout,
          [pageContainerKey]: true
        }
      }
    })
  }
}

describe('[QPage API]', () => {
  describe('[Props]', () => {
    describe('[(prop)padding]', () => {
      test('type Boolean has effect', () => {
        const { wrapper } = mountPage({ padding: true })

        expect(wrapper.classes()).toContain('q-layout-padding')
      })
    })

    describe('[(prop)style-fn]', () => {
      test('type Function has effect', () => {
        const styleFn = vi.fn((offset, height) => ({
          minHeight: `${height - offset}px`
        }))
        const { wrapper } = mountPage({ styleFn })

        expect(styleFn).toHaveBeenCalledWith(112, 720)
        expect(wrapper.attributes('style')).toContain('min-height: 608px')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Page content'
        const { wrapper } = mountPage({}, { default: () => slotContent })

        expect(wrapper.text()).toBe(slotContent)
      })
    })
  })
})
