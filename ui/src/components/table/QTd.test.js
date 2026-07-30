import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QTd from './QTd.js'

describe('[QTd API]', () => {
  describe('[Props]', () => {
    describe('[(prop)props]', () => {
      test('type Object has effect', () => {
        const row = { status: 'active' }
        const wrapper = mount(QTd, {
          props: {
            props: {
              row,
              col: {
                __tdClass: value => `status-${value.status}`,
                __tdStyle: value => ({
                  opacity: value.status === 'active' ? 1 : 0
                })
              }
            }
          }
        })

        expect(wrapper.classes()).toContain('status-active')
        expect(wrapper.attributes('style')).toContain('opacity: 1')
      })
    })

    describe('[(prop)auto-width]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QTd, {
          props: { autoWidth: true }
        })

        expect(wrapper.classes()).toContain('q-table--col-auto-width')
      })
    })

    describe('[(prop)no-hover]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QTd, {
          props: { noHover: true }
        })

        expect(wrapper.classes()).toContain('q-td--no-hover')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Table cell content'
        const wrapper = mount(QTd, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.text()).toBe(slotContent)
      })
    })
  })
})
