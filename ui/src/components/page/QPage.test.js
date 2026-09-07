import { h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'

import {
  layoutKey,
  pageContainerKey
} from '../../utils/private.symbols/symbols.js'

import QPage from './QPage.js'

function mountPage({ attachTo, ...props } = {}, slots = {}) {
  const layout = {
    isContainer: ref(true),
    containerHeight: ref(720),
    header: { space: true, size: 64 },
    footer: { space: true, size: 48 }
  }

  return {
    layout,
    wrapper: mount(QPage, {
      attachTo,
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

  describe('[Generic]', () => {
    test('keeps the vertical margins of its children inside the page (#9536)', () => {
      const margin = 16
      // no min-height, so the page is exactly as tall as its content
      const { wrapper } = mountPage(
        { attachTo: document.body, styleFn: () => ({}) },
        {
          default: () => [
            h('div', { style: `margin-top: ${margin}px` }, 'first'),
            h('div', { style: `margin-bottom: ${margin}px` }, 'last')
          ]
        }
      )

      const page = wrapper.element
      const [first, last] = page.children
      const pageRect = page.getBoundingClientRect()

      expect(first.getBoundingClientRect().top).toBe(pageRect.top + margin)
      expect(last.getBoundingClientRect().bottom).toBe(pageRect.bottom - margin)

      wrapper.unmount()
    })
  })
})
