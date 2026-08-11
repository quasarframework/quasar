import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'

import QTh from './QTh.js'

describe('[QTh API]', () => {
  describe('[Props]', () => {
    describe('[(prop)props]', () => {
      test('type Object has effect', async () => {
        const col = {
          sortable: true,
          align: 'right',
          __iconClass: 'sort-icon',
          __thClass: 'sortable-header',
          __ariaSort: 'ascending',
          headerStyle: { width: '120px' }
        }
        const sort = vi.fn()
        const wrapper = mount(QTh, {
          props: {
            props: { col, sort }
          }
        })

        expect(wrapper.classes()).toContain('sortable-header')
        expect(wrapper.attributes('style')).toContain('width: 120px')
        expect(wrapper.attributes('tabindex')).toBe('0')
        expect(wrapper.attributes('aria-sort')).toBe('ascending')
        expect(wrapper.get('.q-icon').classes()).toContain('sort-icon')

        await wrapper.trigger('click')
        expect(sort).toHaveBeenCalledWith(col)

        sort.mockClear()
        await wrapper.trigger('keyup', { key: 'Enter' })
        expect(sort).toHaveBeenCalledOnce()
        expect(sort).toHaveBeenCalledWith(col)

        sort.mockClear()
        await wrapper.trigger('keydown', { key: ' ' })
        await wrapper.trigger('keyup', { key: ' ' })
        expect(sort).toHaveBeenCalledOnce()
        expect(sort).toHaveBeenCalledWith(col)
      })
    })

    describe('[(prop)auto-width]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QTh, {
          props: { autoWidth: true }
        })

        expect(wrapper.classes()).toContain('q-table--col-auto-width')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Table heading content'
        const wrapper = mount(QTh, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.text()).toBe(slotContent)
      })
    })
  })
})
