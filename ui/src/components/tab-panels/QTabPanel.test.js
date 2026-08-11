import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, test } from 'vitest'

import QTabPanel from './QTabPanel.js'
import QTabPanels from './QTabPanels.js'

describe('[QTabPanel API]', () => {
  describe('[Props]', () => {
    describe('[(prop)name]', () => {
      test('type Any has effect', () => {
        const propVal = 1
        const wrapper = mount(QTabPanels, {
          props: { modelValue: propVal },
          slots: {
            default: () =>
              h(QTabPanel, { name: propVal }, () => 'selected panel')
          }
        })

        expect(wrapper.get('.q-panel').text()).toBe('selected panel')
      })
    })

    describe('[(prop)disable]', () => {
      test('type Boolean has effect', () => {
        const wrapper = mount(QTabPanels, {
          props: { modelValue: 'disabled' },
          slots: {
            default: () =>
              h(
                QTabPanel,
                {
                  name: 'disabled',
                  disable: true
                },
                () => 'disabled panel'
              )
          }
        })

        expect(wrapper.get('.q-panel').text()).toBe('')
      })
    })
  })

  describe('[Slots]', () => {
    describe('[(slot)default]', () => {
      test('renders the content', () => {
        const slotContent = 'some-slot-content'
        const wrapper = mount(QTabPanel, {
          props: {
            name: 1
          },
          slots: {
            default: () => slotContent
          }
        })

        expect(wrapper.html()).toContain(slotContent)
      })
    })
  })

  describe('[Accessibility]', () => {
    test('renders as a focusable tabpanel', () => {
      const wrapper = mount(QTabPanel, {
        props: { name: 'panel' },
        slots: { default: () => 'content' }
      })

      expect(wrapper.attributes('role')).toBe('tabpanel')
      expect(wrapper.attributes('tabindex')).toBe('0')
    })

    test('the ARIA attributes can be overridden and extended', () => {
      const wrapper = mount(QTabPanel, {
        props: { name: 'panel' },
        attrs: { tabindex: '-1', 'aria-labelledby': 'my-tab' }
      })

      expect(wrapper.attributes('tabindex')).toBe('-1')
      expect(wrapper.attributes('aria-labelledby')).toBe('my-tab')
    })
  })
})
