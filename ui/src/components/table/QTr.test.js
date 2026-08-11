import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import QTr from './QTr.js'

describe('[QTr API]', () => {
  describe('[Props]', () => {
    describe('[(prop)props]', () => {
      test('type Object has effect', () => {
        const wrapper = mount(QTr, {
          props: {
            props: {
              header: false,
              __trClass: 'selected-row',
              __trStyle: { height: '40px' }
            }
          }
        })

        expect(wrapper.classes()).toContain('selected-row')
        expect(wrapper.attributes('style')).toContain('height: 40px')
      })
    })

    describe('[(prop)no-hover]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QTr, {
          props: { noHover: true }
        })

        expect(wrapper.classes()).toContain('q-tr--no-hover')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'Table row content'
        const wrapper = mount(QTr, {
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.text()).toBe(slotContent)
      })
    })
  })
})
